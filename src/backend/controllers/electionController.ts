
import { Request, Response } from 'express';
import { z } from 'zod';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { db } from '../config/firebase';
import { DocumentData, Query, QueryDocumentSnapshot } from 'firebase-admin/firestore';

// Define enum types since we're not using Prisma anymore
enum ElectionStatus {
  UPCOMING = 'UPCOMING',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

enum CandidateStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

// Setup file upload for candidate images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/candidates');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `candidate-${uniqueSuffix}${ext}`);
  }
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (ext && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG, GIF) are allowed'));
    }
  }
});

// Validation schemas
const createElectionSchema = z.object({
  title: z.string().min(5).max(100),
  description: z.string().min(10).max(1000),
  startDate: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Start date must be a valid date string"
  }),
  endDate: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "End date must be a valid date string"
  }),
});

const updateElectionSchema = z.object({
  title: z.string().min(5).max(100).optional(),
  description: z.string().min(10).max(1000).optional(),
  startDate: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Start date must be a valid date string"
  }).optional(),
  endDate: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "End date must be a valid date string"
  }).optional(),
  status: z.enum(['UPCOMING', 'ACTIVE', 'COMPLETED', 'CANCELLED']).optional(),
});

const createCandidateSchema = z.object({
  electionId: z.string().uuid(),
  name: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
  platform: z.string().min(10).max(1000),
  imageAlt: z.string().max(200).optional(), // Accessibility: Alt text for image
});

// Helper functions for accessibility
const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const getStatusDescription = (status: string): string => {
  switch (status) {
    case 'UPCOMING':
      return 'This election is scheduled but has not yet started.';
    case 'ACTIVE':
      return 'This election is currently in progress and accepting votes.';
    case 'COMPLETED':
      return 'This election has finished and results are available.';
    case 'CANCELLED':
      return 'This election has been cancelled.';
    default:
      return 'Unknown election status.';
  }
};

const getCandidateStatusDescription = (status: string): string => {
  switch (status) {
    case 'PENDING':
      return 'This application is awaiting review.';
    case 'APPROVED':
      return 'This candidate has been approved and will appear on the ballot.';
    case 'REJECTED':
      return 'This application has been rejected.';
    default:
      return 'Unknown application status.';
  }
};

// Permission helpers
const canManageElection = async (userId: string, electionId?: string) => {
  try {
    // Get user from Firestore
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) return false;
    
    const userData = userDoc.data();
    if (!userData) return false;
    
    // Admin can manage all elections
    if (userData.role === 'ADMIN') return true;
    
    // If checking a specific election
    if (electionId) {
      // Creator of the election can manage it 
      const electionDoc = await db.collection('elections').doc(electionId).get();
      if (!electionDoc.exists) return false;
      
      const electionData = electionDoc.data();
      return electionData?.createdBy === userId;
    }
    
    return false;
  } catch (error) {
    console.error('Error checking election management permission:', error);
    return false;
  }
};

// Election Controllers
export const getElections = async (req: Request, res: Response) => {
  try {
    // Handle optional status filter
    const statusFilter = req.query.status as ElectionStatus | undefined;
    
    // Create a query reference - fix for TS2740 error
    let electionsQuery: Query<DocumentData> = db.collection('elections');
    
    // Apply status filter if provided
    if (statusFilter) {
      electionsQuery = electionsQuery.where('status', '==', statusFilter);
    }
    
    // Apply ordering
    electionsQuery = electionsQuery.orderBy('startDate', 'asc');
    
    // Execute the query
    const snapshot = await electionsQuery.get();
    
    const elections = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        description: data.description,
        startDate: data.startDate.toDate().toISOString(),
        endDate: data.endDate.toDate().toISOString(),
        status: data.status,
        candidateCount: data.candidateCount || 0,
        voteCount: data.voteCount || 0,
        createdAt: data.createdAt.toDate().toISOString(),
        // Provide human-readable status for screen readers
        statusDescription: getStatusDescription(data.status),
        // Add date formatting for better accessibility
        formattedStartDate: formatDate(data.startDate.toDate()),
        formattedEndDate: formatDate(data.endDate.toDate())
      };
    });
    
    res.status(200).json({
      success: true,
      count: elections.length,
      data: elections
    });
  } catch (error) {
    console.error('Get elections error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving elections. Please try again later.',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get a single election by ID
export const getElection = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const electionDoc = await db.collection('elections').doc(id).get();
    
    if (!electionDoc.exists) {
      res.status(404).json({
        success: false,
        message: 'Election not found',
      });
      return;
    }
    
    const data = electionDoc.data();
    
    res.status(200).json({
      success: true,
      data: {
        id: electionDoc.id,
        title: data?.title,
        description: data?.description,
        startDate: data?.startDate.toDate().toISOString(),
        endDate: data?.endDate.toDate().toISOString(),
        status: data?.status,
        candidateCount: data?.candidateCount || 0,
        voteCount: data?.voteCount || 0,
        createdAt: data?.createdAt.toDate().toISOString(),
        statusDescription: getStatusDescription(data?.status),
        formattedStartDate: formatDate(data?.startDate.toDate()),
        formattedEndDate: formatDate(data?.endDate.toDate())
      }
    });
  } catch (error) {
    console.error('Get election error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving the election. Please try again later.',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Create a new election
export const createElection = async (req: Request, res: Response) => {
  try {
    const result = createElectionSchema.safeParse(req.body);
    
    if (!result.success) {
      res.status(400).json({
        success: false,
        message: 'Invalid election data',
        errors: result.error.format()
      });
      return;
    }
    
    const { title, description, startDate, endDate } = result.data;
    
    // Create new election
    const newElection = {
      title,
      description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      status: ElectionStatus.UPCOMING,
      candidateCount: 0,
      voteCount: 0,
      createdBy: req.user?.userId,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const docRef = await db.collection('elections').add(newElection);
    
    res.status(201).json({
      success: true,
      message: 'Election created successfully',
      data: {
        id: docRef.id,
        ...newElection,
        startDate: newElection.startDate.toISOString(),
        endDate: newElection.endDate.toISOString(),
        createdAt: newElection.createdAt.toISOString(),
        updatedAt: newElection.updatedAt.toISOString(),
      }
    });
  } catch (error) {
    console.error('Create election error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while creating the election. Please try again later.',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Update an existing election
export const updateElection = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Validate user can manage this election
    if (req.user && !(await canManageElection(req.user.userId, id))) {
      res.status(403).json({
        success: false,
        message: 'You do not have permission to update this election'
      });
      return;
    }
    
    const result = updateElectionSchema.safeParse(req.body);
    
    if (!result.success) {
      res.status(400).json({
        success: false,
        message: 'Invalid election data',
        errors: result.error.format()
      });
      return;
    }
    
    // Get the election to update
    const electionDoc = await db.collection('elections').doc(id).get();
    
    if (!electionDoc.exists) {
      res.status(404).json({
        success: false,
        message: 'Election not found'
      });
      return;
    }
    
    // Create update data, parse dates if provided
    const updateData: Record<string, any> = {
      ...result.data,
      updatedAt: new Date()
    };
    
    if (result.data.startDate) {
      updateData.startDate = new Date(result.data.startDate);
    }
    
    if (result.data.endDate) {
      updateData.endDate = new Date(result.data.endDate);
    }
    
    // Update the election
    await db.collection('elections').doc(id).update(updateData);
    
    res.status(200).json({
      success: true,
      message: 'Election updated successfully',
      data: {
        id,
        ...updateData,
        startDate: updateData.startDate ? updateData.startDate.toISOString() : undefined,
        endDate: updateData.endDate ? updateData.endDate.toISOString() : undefined,
        updatedAt: updateData.updatedAt.toISOString()
      }
    });
  } catch (error) {
    console.error('Update election error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating the election. Please try again later.',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Delete an election
export const deleteElection = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Check if the election exists
    const electionDoc = await db.collection('elections').doc(id).get();
    
    if (!electionDoc.exists) {
      res.status(404).json({
        success: false,
        message: 'Election not found'
      });
      return;
    }
    
    // Delete the election
    await db.collection('elections').doc(id).delete();
    
    res.status(200).json({
      success: true,
      message: 'Election deleted successfully'
    });
  } catch (error) {
    console.error('Delete election error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the election. Please try again later.',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get candidates for an election
export const getCandidates = async (req: Request, res: Response) => {
  try {
    const { electionId } = req.params;
    
    // This needs to be a Query type, not a CollectionReference
    const query: Query<DocumentData> = db.collection('candidates')
      .where('electionId', '==', electionId);
      
    const snapshot = await query.get();
    
    const candidates = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        electionId: data.electionId,
        name: data.name,
        description: data.description,
        platform: data.platform,
        imageUrl: data.imageUrl,
        imageAlt: data.imageAlt,
        status: data.status,
        voteCount: data.voteCount || 0,
        submittedAt: data.submittedAt.toDate().toISOString(),
        statusDescription: getCandidateStatusDescription(data.status)
      };
    });
    
    res.status(200).json({
      success: true,
      count: candidates.length,
      data: candidates
    });
  } catch (error) {
    console.error('Get candidates error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving candidates. Please try again later.',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Create a new candidate application
export const createCandidate = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: 'Candidate image is required'
      });
      return;
    }
    
    const result = createCandidateSchema.safeParse(req.body);
    
    if (!result.success) {
      res.status(400).json({
        success: false,
        message: 'Invalid candidate data',
        errors: result.error.format()
      });
      return;
    }
    
    const { electionId, name, description, platform, imageAlt } = result.data;
    
    // Check if election exists and is in UPCOMING status
    const electionDoc = await db.collection('elections').doc(electionId).get();
    
    if (!electionDoc.exists) {
      res.status(404).json({
        success: false,
        message: 'Election not found'
      });
      return;
    }
    
    const electionData = electionDoc.data();
    
    if (electionData?.status !== ElectionStatus.UPCOMING) {
      res.status(400).json({
        success: false,
        message: 'Candidate applications can only be submitted for upcoming elections'
      });
      return;
    }
    
    // Create new candidate
    const newCandidate = {
      electionId,
      name,
      description: description || '',
      platform,
      imageUrl: `/uploads/candidates/${req.file.filename}`,
      imageAlt: imageAlt || name, // Use name as fallback for accessibility
      status: CandidateStatus.PENDING,
      voteCount: 0,
      submittedBy: req.user?.userId,
      submittedAt: new Date()
    };
    
    const docRef = await db.collection('candidates').add(newCandidate);
    
    // Update the election's candidate count
    await electionDoc.ref.update({
      candidateCount: (electionData.candidateCount || 0) + 1,
      updatedAt: new Date()
    });
    
    res.status(201).json({
      success: true,
      message: 'Candidate application submitted successfully',
      data: {
        id: docRef.id,
        ...newCandidate,
        submittedAt: newCandidate.submittedAt.toISOString()
      }
    });
  } catch (error) {
    console.error('Create candidate error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while creating the candidate application. Please try again later.',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Approve a candidate application
export const approveCandidate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const candidateDoc = await db.collection('candidates').doc(id).get();
    
    if (!candidateDoc.exists) {
      res.status(404).json({
        success: false,
        message: 'Candidate not found'
      });
      return;
    }
    
    const candidateData = candidateDoc.data();
    
    // Only approve PENDING candidates
    if (candidateData?.status !== CandidateStatus.PENDING) {
      res.status(400).json({
        success: false,
        message: 'Only pending candidates can be approved'
      });
      return;
    }
    
    // Update the candidate status
    await candidateDoc.ref.update({
      status: CandidateStatus.APPROVED,
      approvedBy: req.user?.userId,
      approvedAt: new Date()
    });
    
    res.status(200).json({
      success: true,
      message: 'Candidate application approved successfully'
    });
  } catch (error) {
    console.error('Approve candidate error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while approving the candidate. Please try again later.',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Reject a candidate application
export const rejectCandidate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    const candidateDoc = await db.collection('candidates').doc(id).get();
    
    if (!candidateDoc.exists) {
      res.status(404).json({
        success: false,
        message: 'Candidate not found'
      });
      return;
    }
    
    const candidateData = candidateDoc.data();
    
    // Only reject PENDING candidates
    if (candidateData?.status !== CandidateStatus.PENDING) {
      res.status(400).json({
        success: false,
        message: 'Only pending candidates can be rejected'
      });
      return;
    }
    
    // Update the candidate status
    await candidateDoc.ref.update({
      status: CandidateStatus.REJECTED,
      rejectionReason: reason || 'No reason provided',
      rejectedBy: req.user?.userId,
      rejectedAt: new Date()
    });
    
    res.status(200).json({
      success: true,
      message: 'Candidate application rejected successfully'
    });
  } catch (error) {
    console.error('Reject candidate error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while rejecting the candidate. Please try again later.',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Cast a vote for a candidate
export const castVote = async (req: Request, res: Response) => {
  try {
    const { electionId, candidateId } = req.body;
    
    if (!electionId || !candidateId) {
      res.status(400).json({
        success: false,
        message: 'Election ID and candidate ID are required'
      });
      return;
    }
    
    // Check if election exists and is ACTIVE
    const electionDoc = await db.collection('elections').doc(electionId).get();
    
    if (!electionDoc.exists) {
      res.status(404).json({
        success: false,
        message: 'Election not found'
      });
      return;
    }
    
    const electionData = electionDoc.data();
    
    if (electionData?.status !== ElectionStatus.ACTIVE) {
      res.status(400).json({
        success: false,
        message: 'Votes can only be cast for active elections'
      });
      return;
    }
    
    // Check if candidate exists and is APPROVED
    const candidateDoc = await db.collection('candidates').doc(candidateId).get();
    
    if (!candidateDoc.exists) {
      res.status(404).json({
        success: false,
        message: 'Candidate not found'
      });
      return;
    }
    
    const candidateData = candidateDoc.data();
    
    if (candidateData?.status !== CandidateStatus.APPROVED) {
      res.status(400).json({
        success: false,
        message: 'Votes can only be cast for approved candidates'
      });
      return;
    }
    
    // Check if user has already voted in this election
    const votesQuery: Query<DocumentData> = db.collection('votes')
      .where('electionId', '==', electionId)
      .where('userId', '==', req.user?.userId);
      
    const votesSnapshot = await votesQuery.get();
    
    if (!votesSnapshot.empty) {
      res.status(400).json({
        success: false,
        message: 'You have already voted in this election'
      });
      return;
    }
    
    // Create the vote document
    const newVote = {
      electionId,
      candidateId,
      userId: req.user?.userId,
      votedAt: new Date()
    };
    
    await db.collection('votes').add(newVote);
    
    // Update vote count for candidate
    await candidateDoc.ref.update({
      voteCount: (candidateData.voteCount || 0) + 1
    });
    
    // Update vote count for election
    await electionDoc.ref.update({
      voteCount: (electionData.voteCount || 0) + 1
    });
    
    res.status(200).json({
      success: true,
      message: 'Vote cast successfully'
    });
  } catch (error) {
    console.error('Cast vote error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while casting your vote. Please try again later.',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Check if user has voted in an election
export const hasVoted = async (req: Request, res: Response) => {
  try {
    const { electionId } = req.params;
    
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }
    
    const votesQuery: Query<DocumentData> = db.collection('votes')
      .where('electionId', '==', electionId)
      .where('userId', '==', req.user.userId);
      
    const votesSnapshot = await votesQuery.get();
    
    res.status(200).json({
      success: true,
      hasVoted: !votesSnapshot.empty
    });
  } catch (error) {
    console.error('Has voted check error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while checking your vote status. Please try again later.',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get election results
export const getElectionResults = async (req: Request, res: Response) => {
  try {
    const { electionId } = req.params;
    
    // Check if election exists
    const electionDoc = await db.collection('elections').doc(electionId).get();
    
    if (!electionDoc.exists) {
      res.status(404).json({
        success: false,
        message: 'Election not found'
      });
      return;
    }
    
    const electionData = electionDoc.data();
    
    // Only completed elections should show results
    if (electionData?.status !== ElectionStatus.COMPLETED) {
      res.status(400).json({
        success: false,
        message: 'Results are only available for completed elections'
      });
      return;
    }
    
    // Get approved candidates for this election with their vote counts
    const candidatesQuery: Query<DocumentData> = db.collection('candidates')
      .where('electionId', '==', electionId)
      .where('status', '==', CandidateStatus.APPROVED);
      
    const candidatesSnapshot = await candidatesQuery.get();
    
    const results = candidatesSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        voteCount: data.voteCount || 0,
        percentage: electionData.voteCount > 0 
          ? ((data.voteCount || 0) / electionData.voteCount) * 100 
          : 0
      };
    });
    
    // Sort by vote count in descending order
    results.sort((a, b) => b.voteCount - a.voteCount);
    
    res.status(200).json({
      success: true,
      data: {
        electionId,
        title: electionData.title,
        totalVotes: electionData.voteCount || 0,
        results
      }
    });
  } catch (error) {
    console.error('Get election results error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving election results. Please try again later.',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
