
import { Request, Response } from 'express';
import { z } from 'zod';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { db } from '../config/firebase';

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
    
    // Create a query reference
    let electionsQuery = db.collection('elections');
    
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

export const getElection = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const electionDoc = await db.collection('elections').doc(id).get();
    
    if (!electionDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Election not found. It may have been deleted or the ID is incorrect.'
      });
    }
    
    const electionData = electionDoc.data();
    if (!electionData) {
      return res.status(404).json({
        success: false,
        message: 'Election data not found.'
      });
    }
    
    // Get approved candidates
    const candidatesSnapshot = await db.collection('candidates')
      .where('electionId', '==', id)
      .where('status', '==', 'APPROVED')
      .get();
    
    const candidates = candidatesSnapshot.docs.map(doc => {
      const candidateData = doc.data();
      return {
        id: doc.id,
        name: candidateData.name,
        description: candidateData.description,
        imageUrl: candidateData.imageUrl,
        imageAlt: candidateData.imageAlt || `Profile picture of candidate ${candidateData.name}`,
        platform: candidateData.platform,
        voteCount: candidateData.voteCount || 0
      };
    });
    
    // Format the response for accessibility
    const formattedElection = {
      id: electionDoc.id,
      title: electionData.title,
      description: electionData.description,
      startDate: electionData.startDate.toDate().toISOString(),
      endDate: electionData.endDate.toDate().toISOString(),
      status: electionData.status,
      candidateCount: candidates.length,
      voteCount: electionData.voteCount || 0,
      createdAt: electionData.createdAt.toDate().toISOString(),
      // Provide human-readable status for screen readers
      statusDescription: getStatusDescription(electionData.status),
      // Add date formatting for better accessibility
      formattedStartDate: formatDate(electionData.startDate.toDate()),
      formattedEndDate: formatDate(electionData.endDate.toDate()),
      // Include candidates
      candidates
    };
    
    return res.status(200).json({
      success: true,
      data: formattedElection
    });
  } catch (error) {
    console.error('Get election error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving the election. Please try again later.',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const createElection = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in to create an election.'
      });
    }
    
    // Validate request body
    const validatedData = createElectionSchema.safeParse(req.body);
    
    if (!validatedData.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid election data. Please check your input and try again.',
        errors: validatedData.error.errors
      });
    }
    
    const { title, description, startDate, endDate } = validatedData.data;
    
    // Parse dates
    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);
    
    // Validate date logic
    if (parsedStartDate < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Start date cannot be in the past. Please select a future date.'
      });
    }
    
    if (parsedEndDate <= parsedStartDate) {
      return res.status(400).json({
        success: false,
        message: 'End date must be after start date. Please adjust your dates.'
      });
    }
    
    // Check user permission
    const userDoc = await db.collection('users').doc(req.user.userId).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }
    
    const userData = userDoc.data();
    
    if (!userData || userData.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Only administrators can create elections. If you need to create an election, please contact an administrator.'
      });
    }
    
    // Create election in Firestore
    const electionRef = db.collection('elections').doc();
    await electionRef.set({
      title,
      description,
      startDate: parsedStartDate,
      endDate: parsedEndDate,
      status: 'UPCOMING',
      createdBy: req.user.userId,
      candidateCount: 0,
      voteCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return res.status(201).json({
      success: true,
      message: 'Election created successfully. Candidates can now submit their applications.',
      data: {
        id: electionRef.id,
        title,
        description,
        startDate: parsedStartDate.toISOString(),
        endDate: parsedEndDate.toISOString(),
        status: 'UPCOMING'
      }
    });
  } catch (error) {
    console.error('Create election error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while creating the election. Please try again later.',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const updateElection = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in to update an election.'
      });
    }
    
    const { id } = req.params;
    
    // Check if election exists
    const electionDoc = await db.collection('elections').doc(id).get();
    
    if (!electionDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Election not found. It may have been deleted or the ID is incorrect.'
      });
    }
    
    const existingElection = electionDoc.data();
    if (!existingElection) {
      return res.status(404).json({
        success: false,
        message: 'Election data not found.'
      });
    }
    
    // Check permission
    const hasPermission = await canManageElection(req.user.userId, id);
    
    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this election. Only administrators or the creator of the election can make changes.'
      });
    }
    
    // Validate request body
    const validatedData = updateElectionSchema.safeParse(req.body);
    
    if (!validatedData.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid election data. Please check your input and try again.',
        errors: validatedData.error.errors
      });
    }
    
    const { title, description, startDate, endDate, status } = validatedData.data;
    
    // Build update data
    const updateData: any = {
      updatedAt: new Date()
    };
    
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    
    // Parse and validate dates if provided
    if (startDate) {
      const parsedStartDate = new Date(startDate);
      
      if (existingElection.status !== 'UPCOMING') {
        return res.status(400).json({
          success: false,
          message: 'Start date cannot be changed for elections that have already started or ended.'
        });
      }
      
      updateData.startDate = parsedStartDate;
    }
    
    if (endDate) {
      const parsedEndDate = new Date(endDate);
      
      if (existingElection.status === 'COMPLETED') {
        return res.status(400).json({
          success: false,
          message: 'End date cannot be changed for elections that have already ended.'
        });
      }
      
      updateData.endDate = parsedEndDate;
    }
    
    // Validate date logic if both dates provided
    if (startDate && endDate) {
      if (updateData.startDate >= updateData.endDate) {
        return res.status(400).json({
          success: false,
          message: 'End date must be after start date. Please adjust your dates.'
        });
      }
    }
    
    // Update status if provided
    if (status) {
      // Perform status transition validation
      if (existingElection.status === 'COMPLETED' && status !== 'COMPLETED') {
        return res.status(400).json({
          success: false,
          message: 'Completed elections cannot be changed to another status.'
        });
      }
      
      updateData.status = status;
    }
    
    // Update election in Firestore
    await db.collection('elections').doc(id).update(updateData);
    
    // Get the updated election
    const updatedElectionDoc = await db.collection('elections').doc(id).get();
    const updatedElection = updatedElectionDoc.data();
    
    return res.status(200).json({
      success: true,
      message: 'Election updated successfully.',
      data: {
        id: updatedElectionDoc.id,
        ...updatedElection
      }
    });
  } catch (error) {
    console.error('Update election error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while updating the election. Please try again later.',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const deleteElection = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in to delete an election.'
      });
    }
    
    const { id } = req.params;
    
    // Check if election exists
    const electionDoc = await db.collection('elections').doc(id).get();
    
    if (!electionDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Election not found. It may have been deleted or the ID is incorrect.'
      });
    }
    
    // Check permission
    const hasPermission = await canManageElection(req.user.userId, id);
    
    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this election. Only administrators can delete elections.'
      });
    }
    
    // Check if election has votes
    const votesSnapshot = await db.collection('votes')
      .where('electionId', '==', id)
      .limit(1)
      .get();
    
    if (!votesSnapshot.empty) {
      // Instead of deleting, cancel the election
      await db.collection('elections').doc(id).update({
        status: 'CANCELLED',
        updatedAt: new Date()
      });
      
      return res.status(200).json({
        success: true,
        message: 'This election has votes and cannot be deleted. It has been marked as cancelled instead.'
      });
    }
    
    // Delete related candidates first
    const candidatesSnapshot = await db.collection('candidates')
      .where('electionId', '==', id)
      .get();
    
    // Create a batch for deletion
    const batch = db.batch();
    
    candidatesSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    // Delete election
    batch.delete(db.collection('elections').doc(id));
    
    // Commit the batch
    await batch.commit();
    
    return res.status(200).json({
      success: true,
      message: 'Election deleted successfully'
    });
  } catch (error) {
    console.error('Delete election error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the election. Please try again later.',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Candidate Controllers
export const getCandidates = async (req: Request, res: Response) => {
  try {
    const { electionId } = req.params;
    
    // Get user role for permission check
    const userRole = req.user?.role || 'STUDENT';
    
    // Check if election exists
    const electionDoc = await db.collection('elections').doc(electionId).get();
    
    if (!electionDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Election not found. It may have been deleted or the ID is incorrect.'
      });
    }
    
    // Define filter based on user role
    let query = db.collection('candidates').where('electionId', '==', electionId);
    
    // Students only see approved candidates unless looking at own applications
    if (userRole === 'STUDENT' && req.user) {
      query = db.collection('candidates')
        .where('electionId', '==', electionId)
        .where('status', '==', 'APPROVED');
      
      // Get own applications separately (if any)
      const ownCandidatesSnapshot = await db.collection('candidates')
        .where('electionId', '==', electionId)
        .where('studentId', '==', req.user.userId)
        .get();
      
      const ownCandidates = ownCandidatesSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          description: data.description,
          imageUrl: data.imageUrl,
          imageAlt: data.imageAlt || `Profile picture of candidate ${data.name}`,
          platform: data.platform,
          status: data.status,
          voteCount: data.status === 'APPROVED' ? data.voteCount : undefined,
          submittedAt: data.submittedAt.toDate().toISOString(),
          studentName: data.studentName,
          department: data.department,
          // Provide human-readable status for screen readers
          statusDescription: getCandidateStatusDescription(data.status)
        };
      });
      
      // Get approved candidates from other students
      const approvedCandidatesSnapshot = await query.get();
      
      const approvedCandidates = approvedCandidatesSnapshot.docs
        .filter(doc => doc.data().studentId !== req.user?.userId)
        .map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name,
            description: data.description,
            imageUrl: data.imageUrl,
            imageAlt: data.imageAlt || `Profile picture of candidate ${data.name}`,
            platform: data.platform,
            status: data.status,
            voteCount: data.voteCount,
            submittedAt: data.submittedAt.toDate().toISOString(),
            studentName: data.studentName,
            department: data.department,
            statusDescription: getCandidateStatusDescription(data.status)
          };
        });
      
      const candidates = [...ownCandidates, ...approvedCandidates];
      
      return res.status(200).json({
        success: true,
        count: candidates.length,
        data: candidates
      });
    }
    
    // Faculty and admins see all candidates
    const candidatesSnapshot = await query.get();
    
    const candidates = candidatesSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        description: data.description,
        imageUrl: data.imageUrl,
        imageAlt: data.imageAlt || `Profile picture of candidate ${data.name}`,
        platform: data.platform,
        status: data.status,
        voteCount: data.status === 'APPROVED' ? data.voteCount : undefined,
        submittedAt: data.submittedAt.toDate().toISOString(),
        studentName: data.studentName,
        department: data.department,
        statusDescription: getCandidateStatusDescription(data.status)
      };
    });
    
    return res.status(200).json({
      success: true,
      count: candidates.length,
      data: candidates
    });
  } catch (error) {
    console.error('Get candidates error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving candidates. Please try again later.',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const createCandidate = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in to submit a candidate application.'
      });
    }
    
    // Handle file upload
    const uploadSingle = upload.single('image');
    
    uploadSingle(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message || 'Error uploading image. Please try again with a valid image file (JPG, PNG, GIF) under 5MB.'
        });
      }
      
      try {
        // Validate request body
        const validatedData = createCandidateSchema.safeParse(req.body);
        
        if (!validatedData.success) {
          // Remove uploaded file if validation fails
          if (req.file) {
            fs.unlinkSync(req.file.path);
          }
          
          return res.status(400).json({
            success: false,
            message: 'Invalid candidate data. Please check your input and try again.',
            errors: validatedData.error.errors
          });
        }
        
        const { electionId, name, description, platform, imageAlt } = validatedData.data;
        
        // Check if election exists and is accepting applications
        const electionDoc = await db.collection('elections').doc(electionId).get();
        
        if (!electionDoc.exists) {
          // Remove uploaded file if election doesn't exist
          if (req.file) {
            fs.unlinkSync(req.file.path);
          }
          
          return res.status(404).json({
            success: false,
            message: 'Election not found. It may have been deleted or the ID is incorrect.'
          });
        }
        
        const election = electionDoc.data();
        
        if (!election || election.status !== 'UPCOMING') {
          // Remove uploaded file if election isn't upcoming
          if (req.file) {
            fs.unlinkSync(req.file.path);
          }
          
          return res.status(400).json({
            success: false,
            message: 'Candidate applications are only accepted for upcoming elections. This election has already started or ended.'
          });
        }
        
        // Check if user already has an application for this election
        const existingApplicationSnapshot = await db.collection('candidates')
          .where('electionId', '==', electionId)
          .where('studentId', '==', req.user.userId)
          .limit(1)
          .get();
        
        if (!existingApplicationSnapshot.empty) {
          // Remove uploaded file if application already exists
          if (req.file) {
            fs.unlinkSync(req.file.path);
          }
          
          return res.status(409).json({
            success: false,
            message: 'You have already submitted an application for this election. You can update your existing application instead.'
          });
        }
        
        // Get user details
        const userDoc = await db.collection('users').doc(req.user.userId).get();
        if (!userDoc.exists) {
          // Remove uploaded file if user doesn't exist
          if (req.file) {
            fs.unlinkSync(req.file.path);
          }
          
          return res.status(404).json({
            success: false,
            message: 'User not found. Your account may have been deleted.'
          });
        }
        
        const userData = userDoc.data();
        
        // Create candidate application in Firestore
        const candidateRef = db.collection('candidates').doc();
        
        await candidateRef.set({
          electionId,
          studentId: req.user.userId,
          studentName: userData?.name || 'Unknown',
          department: userData?.department || null,
          name,
          description: description || null,
          platform,
          imageUrl: req.file ? `/uploads/candidates/${req.file.filename}` : null,
          imageAlt: imageAlt || `Profile picture of candidate ${name}`,
          status: 'PENDING',
          voteCount: 0,
          submittedAt: new Date(),
          updatedAt: new Date()
        });
        
        return res.status(201).json({
          success: true,
          message: 'Your candidate application has been submitted successfully. It will be reviewed by administrators.',
          data: {
            id: candidateRef.id,
            name,
            status: 'PENDING',
            submittedAt: new Date().toISOString()
          }
        });
      } catch (error) {
        // Remove uploaded file if an error occurs
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        
        console.error('Create candidate error:', error);
        return res.status(500).json({
          success: false,
          message: 'An error occurred while submitting your application. Please try again later.',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });
  } catch (error) {
    console.error('Create candidate error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while processing your request. Please try again later.',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const approveCandidate = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in to approve a candidate application.'
      });
    }
    
    const { id } = req.params;
    
    // Check if candidate exists
    const candidateDoc = await db.collection('candidates').doc(id).get();
    
    if (!candidateDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Candidate application not found. It may have been deleted or the ID is incorrect.'
      });
    }
    
    const candidate = candidateDoc.data();
    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate data not found.'
      });
    }
    
    // Get election to check status
    const electionDoc = await db.collection('elections').doc(candidate.electionId).get();
    if (!electionDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Election not found. It may have been deleted.'
      });
    }
    
    const election = electionDoc.data();
    if (!election) {
      return res.status(404).json({
        success: false,
        message: 'Election data not found.'
      });
    }
    
    // Check user permission
    const userDoc = await db.collection('users').doc(req.user.userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'User not found. Your account may have been deleted.'
      });
    }
    
    const userData = userDoc.data();
    if (!userData || (userData.role !== 'ADMIN' && userData.role !== 'FACULTY')) {
      return res.status(403).json({
        success: false,
        message: 'Only administrators and faculty members can approve candidate applications.'
      });
    }
    
    // Check if election is still upcoming
    if (election.status !== 'UPCOMING') {
      return res.status(400).json({
        success: false,
        message: 'Candidate applications can only be approved for upcoming elections. This election has already started or ended.'
      });
    }
    
    // Approve candidate
    await db.collection('candidates').doc(id).update({
      status: 'APPROVED',
      updatedAt: new Date()
    });
    
    return res.status(200).json({
      success: true,
      message: 'Candidate application approved successfully. The candidate will be included in the election.',
      data: {
        id,
        status: 'APPROVED'
      }
    });
  } catch (error) {
    console.error('Approve candidate error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while approving the candidate application. Please try again later.',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const rejectCandidate = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in to reject a candidate application.'
      });
    }
    
    const { id } = req.params;
    
    // Check if candidate exists
    const candidateDoc = await db.collection('candidates').doc(id).get();
    
    if (!candidateDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Candidate application not found. It may have been deleted or the ID is incorrect.'
      });
    }
    
    const candidate = candidateDoc.data();
    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate data not found.'
      });
    }
    
    // Get election to check status
    const electionDoc = await db.collection('elections').doc(candidate.electionId).get();
    if (!electionDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Election not found. It may have been deleted.'
      });
    }
    
    const election = electionDoc.data();
    if (!election) {
      return res.status(404).json({
        success: false,
        message: 'Election data not found.'
      });
    }
    
    // Check user permission
    const userDoc = await db.collection('users').doc(req.user.userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'User not found. Your account may have been deleted.'
      });
    }
    
    const userData = userDoc.data();
    if (!userData || (userData.role !== 'ADMIN' && userData.role !== 'FACULTY')) {
      return res.status(403).json({
        success: false,
        message: 'Only administrators and faculty members can reject candidate applications.'
      });
    }
    
    // Check if election is still upcoming
    if (election.status !== 'UPCOMING') {
      return res.status(400).json({
        success: false,
        message: 'Candidate applications can only be modified for upcoming elections. This election has already started or ended.'
      });
    }
    
    // Reject candidate
    await db.collection('candidates').doc(id).update({
      status: 'REJECTED',
      updatedAt: new Date()
    });
    
    return res.status(200).json({
      success: true,
      message: 'Candidate application rejected successfully.',
      data: {
        id,
        status: 'REJECTED'
      }
    });
  } catch (error) {
    console.error('Reject candidate error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while rejecting the candidate application. Please try again later.',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Vote Controllers
export const castVote = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in to cast a vote.'
      });
    }
    
    const { electionId, candidateId } = req.body;
    
    if (!electionId || !candidateId) {
      return res.status(400).json({
        success: false,
        message: 'Both election ID and candidate ID are required to cast a vote.'
      });
    }
    
    // Check if election exists and is active
    const electionDoc = await db.collection('elections').doc(electionId).get();
    
    if (!electionDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Election not found. It may have been deleted or the ID is incorrect.'
      });
    }
    
    const election = electionDoc.data();
    if (!election) {
      return res.status(404).json({
        success: false,
        message: 'Election data not found.'
      });
    }
    
    if (election.status !== 'ACTIVE') {
      return res.status(400).json({
        success: false,
        message: `You cannot vote in this election because it is ${election.status.toLowerCase()}. Voting is only allowed for active elections.`
      });
    }
    
    // Check if candidate exists and is approved
    const candidateDoc = await db.collection('candidates').doc(candidateId).get();
    
    if (!candidateDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found or not approved for this election.'
      });
    }
    
    const candidate = candidateDoc.data();
    if (!candidate || candidate.electionId !== electionId || candidate.status !== 'APPROVED') {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found or not approved for this election.'
      });
    }
    
    // Check if user has already voted in this election
    const votesSnapshot = await db.collection('votes')
      .where('electionId', '==', electionId)
      .where('voterId', '==', req.user.userId)
      .limit(1)
      .get();
    
    if (!votesSnapshot.empty) {
      return res.status(409).json({
        success: false,
        message: 'You have already voted in this election. Each voter may only vote once.'
      });
    }
    
    // Create vote and update candidate vote count using a transaction
    const voteRef = db.collection('votes').doc();
    
    await db.runTransaction(async (transaction) => {
      // Create the vote
      transaction.set(voteRef, {
        electionId,
        candidateId,
        voterId: req.user.userId,
        votedAt: new Date()
      });
      
      // Increment candidate's vote count
      transaction.update(db.collection('candidates').doc(candidateId), {
        voteCount: (candidate.voteCount || 0) + 1
      });
      
      // Increment election's vote count
      transaction.update(db.collection('elections').doc(electionId), {
        voteCount: (election.voteCount || 0) + 1
      });
    });
    
    return res.status(201).json({
      success: true,
      message: 'Your vote has been cast successfully.',
      data: {
        id: voteRef.id,
        electionId,
        candidateId,
        votedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Cast vote error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while casting your vote. Please try again later.',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getElectionResults = async (req: Request, res: Response) => {
  try {
    const { electionId } = req.params;
    
    // Check if election exists
    const electionDoc = await db.collection('elections').doc(electionId).get();
    
    if (!electionDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Election not found. It may have been deleted or the ID is incorrect.'
      });
    }
    
    const election = electionDoc.data();
    if (!election) {
      return res.status(404).json({
        success: false,
        message: 'Election data not found.'
      });
    }
    
    // Check if election is completed or active for results to be available
    if (election.status !== 'COMPLETED' && election.status !== 'ACTIVE') {
      return res.status(400).json({
        success: false,
        message: 'Election results are only available for active or completed elections.'
      });
    }
    
    // Get approved candidates with vote counts
    const candidatesSnapshot = await db.collection('candidates')
      .where('electionId', '==', electionId)
      .where('status', '==', 'APPROVED')
      .get();
    
    const candidates = candidatesSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        voteCount: data.voteCount || 0,
        imageUrl: data.imageUrl,
        imageAlt: data.imageAlt || `Profile picture of candidate ${data.name}`
      };
    });
    
    // Sort by vote count in descending order
    candidates.sort((a, b) => b.voteCount - a.voteCount);
    
    return res.status(200).json({
      success: true,
      data: {
        electionId,
        electionTitle: election.title,
        status: election.status,
        totalVotes: election.voteCount || 0,
        candidates
      }
    });
  } catch (error) {
    console.error('Get election results error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving election results. Please try again later.',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const hasVoted = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in to check voting status.'
      });
    }
    
    const { electionId } = req.params;
    
    // Check if election exists
    const electionDoc = await db.collection('elections').doc(electionId).get();
    
    if (!electionDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Election not found. It may have been deleted or the ID is incorrect.'
      });
    }
    
    // Check if user has voted
    const votesSnapshot = await db.collection('votes')
      .where('electionId', '==', electionId)
      .where('voterId', '==', req.user.userId)
      .limit(1)
      .get();
    
    const hasVoted = !votesSnapshot.empty;
    
    if (hasVoted) {
      const voteData = votesSnapshot.docs[0].data();
      
      // Get the candidate that was voted for
      const candidateDoc = await db.collection('candidates').doc(voteData.candidateId).get();
      const candidateData = candidateDoc.exists ? candidateDoc.data() : null;
      
      return res.status(200).json({
        success: true,
        data: {
          hasVoted: true,
          votedAt: voteData.votedAt.toDate().toISOString(),
          candidateId: voteData.candidateId,
          candidateName: candidateData?.name || 'Unknown candidate'
        }
      });
    } else {
      return res.status(200).json({
        success: true,
        data: {
          hasVoted: false
        }
      });
    }
  } catch (error) {
    console.error('Check voted status error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while checking your voting status. Please try again later.',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
