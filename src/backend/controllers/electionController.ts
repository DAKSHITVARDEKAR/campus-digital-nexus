import { Request, Response } from 'express';
import { z } from 'zod';
import multer from 'multer';
import path from 'path';
import { databases, storage, DATABASE_ID, ELECTIONS_COLLECTION_ID, CANDIDATES_COLLECTION_ID, VOTES_COLLECTION_ID, BUCKET_ID } from '../config/appwrite';
import { ID, Query } from 'node-appwrite';
import { InputFile } from 'node-appwrite/file';
import { AuthRequest } from '../middleware/auth';

// Define enum types
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
const upload = multer({
  storage: multer.memoryStorage(), // Use memory storage for Appwrite
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
  electionId: z.string(),
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
    // Get user role from Appwrite
    // You'd typically store user roles in a separate users collection or use Appwrite Teams
    const userDoc = await databases.getDocument(
      DATABASE_ID,
      'users', // Replace with your users collection ID
      userId
    );

    // Admin can manage all elections
    if (userDoc.role === 'ADMIN') return true;

    // If checking a specific election
    if (electionId) {
      // Creator of the election can manage it
      const election = await databases.getDocument(
        DATABASE_ID,
        ELECTIONS_COLLECTION_ID,
        electionId
      );

      return election.createdBy === userId;
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

    // Create query parameters if status filter is provided
    let queries = [];
    if (statusFilter) {
      queries.push(Query.equal('status', statusFilter));
    }

    // Get elections with ordering
    queries.push(Query.orderAsc('startDate'));

    const response = await databases.listDocuments(
      DATABASE_ID,
      ELECTIONS_COLLECTION_ID,
      queries
    );

    const elections = response.documents.map(doc => {
      return {
        id: doc.$id,
        title: doc.title,
        description: doc.description,
        startDate: doc.startDate,
        endDate: doc.endDate,
        status: doc.status,
        candidateCount: doc.candidateCount || 0,
        voteCount: doc.voteCount || 0,
        createdAt: doc.createdAt,
        // Provide human-readable status for screen readers
        statusDescription: getStatusDescription(doc.status),
        // Add date formatting for better accessibility
        formattedStartDate: formatDate(new Date(doc.startDate)),
        formattedEndDate: formatDate(new Date(doc.endDate))
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

    const doc = await databases.getDocument(
      DATABASE_ID,
      ELECTIONS_COLLECTION_ID,
      id
    );

    res.status(200).json({
      success: true,
      data: {
        id: doc.$id,
        title: doc.title,
        description: doc.description,
        startDate: doc.startDate,
        endDate: doc.endDate,
        status: doc.status,
        candidateCount: doc.candidateCount || 0,
        voteCount: doc.voteCount || 0,
        createdAt: doc.createdAt,
        statusDescription: getStatusDescription(doc.status),
        formattedStartDate: formatDate(new Date(doc.startDate)),
        formattedEndDate: formatDate(new Date(doc.endDate))
      }
    });
  } catch (error) {
    console.error('Get election error:', error);

    // Check if document doesn't exist
    if (error.code === 404) {
      res.status(404).json({
        success: false,
        message: 'Election not found',
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving the election. Please try again later.',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Create a new election
export const createElection = async (req: AuthRequest, res: Response) => {
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
    const newElectionData = {
      title,
      description,
      startDate,
      endDate,
      status: ElectionStatus.UPCOMING,
      candidateCount: 0,
      voteCount: 0,
      createdBy: req.user?.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const docResponse = await databases.createDocument(
      DATABASE_ID,
      ELECTIONS_COLLECTION_ID,
      ID.unique(),
      newElectionData
    );

    res.status(201).json({
      success: true,
      message: 'Election created successfully',
      data: {
        id: docResponse.$id,
        ...newElectionData
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
export const updateElection = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Validate user can manage this election
    if (req.user && !(await canManageElection(req.user.id, id))) {
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

    // Create update data
    const updateData = {
      ...result.data,
      updatedAt: new Date().toISOString()
    };

    // Update the election
    const updatedDoc = await databases.updateDocument(
      DATABASE_ID,
      ELECTIONS_COLLECTION_ID,
      id,
      updateData
    );

    res.status(200).json({
      success: true,
      message: 'Election updated successfully',
      data: {
        id: updatedDoc.$id,
        ...updateData
      }
    });
  } catch (error) {
    console.error('Update election error:', error);

    // Check if document doesn't exist
    if (error.code === 404) {
      res.status(404).json({
        success: false,
        message: 'Election not found',
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'An error occurred while updating the election. Please try again later.',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Delete an election
export const deleteElection = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Delete the election
    await databases.deleteDocument(
      DATABASE_ID,
      ELECTIONS_COLLECTION_ID,
      id
    );

    res.status(200).json({
      success: true,
      message: 'Election deleted successfully'
    });
  } catch (error) {
    console.error('Delete election error:', error);

    // Check if document doesn't exist
    if (error.code === 404) {
      res.status(404).json({
        success: false,
        message: 'Election not found',
      });
      return;
    }

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

    const response = await databases.listDocuments(
      DATABASE_ID,
      CANDIDATES_COLLECTION_ID,
      [
        Query.equal('electionId', electionId)
      ]
    );

    const candidates = response.documents.map(doc => {
      return {
        id: doc.$id,
        electionId: doc.electionId,
        name: doc.name,
        description: doc.description,
        platform: doc.platform,
        imageUrl: doc.imageUrl,
        imageAlt: doc.imageAlt,
        status: doc.status,
        voteCount: doc.voteCount || 0,
        submittedAt: doc.submittedAt,
        statusDescription: getCandidateStatusDescription(doc.status)
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
export const createCandidate = async (req: AuthRequest, res: Response) => {
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
    try {
      const election = await databases.getDocument(
        DATABASE_ID,
        ELECTIONS_COLLECTION_ID,
        electionId
      );

      if (election.status !== ElectionStatus.UPCOMING) {
        res.status(400).json({
          success: false,
          message: 'Candidate applications can only be submitted for upcoming elections'
        });
        return;
      }

      // Upload file to Appwrite Storage
      const fileId = ID.unique();
      const fileBuffer = req.file.buffer;
      const fileName = `${fileId}-${req.file.originalname}`;

      const uploadedFile = await storage.createFile(
        BUCKET_ID,
        fileId,
        InputFile.fromBuffer(
          fileBuffer, 
          fileName
        )
      );

      // Get the file URL - properly await the promise
      const fileUrlPromise = storage.getFileView(BUCKET_ID, fileId);
      const fileUrl = await fileUrlPromise;

      // Create new candidate
      const newCandidateData = {
        electionId,
        name,
        description: description || '',
        platform,
        imageUrl: fileUrl.toString(), // Use toString() to ensure we get a string URL
        imageAlt: imageAlt || name, // Use name as fallback for accessibility
        status: CandidateStatus.PENDING,
        voteCount: 0,
        submittedBy: req.user?.id,
        submittedAt: new Date().toISOString()
      };

      const candidateDoc = await databases.createDocument(
        DATABASE_ID,
        CANDIDATES_COLLECTION_ID,
        ID.unique(),
        newCandidateData
      );

      // Update the election's candidate count
      await databases.updateDocument(
        DATABASE_ID,
        ELECTIONS_COLLECTION_ID,
        electionId,
        {
          candidateCount: (election.candidateCount || 0) + 1,
          updatedAt: new Date().toISOString()
        }
      );

      res.status(201).json({
        success: true,
        message: 'Candidate application submitted successfully',
        data: {
          id: candidateDoc.$id,
          ...newCandidateData
        }
      });
    } catch (error) {
      if (error.code === 404) {
        res.status(404).json({
          success: false,
          message: 'Election not found'
        });
        return;
      }
      throw error;
    }
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
export const approveCandidate = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Get candidate document
    const candidate = await databases.getDocument(
      DATABASE_ID,
      CANDIDATES_COLLECTION_ID,
      id
    );

    // Only approve PENDING candidates
    if (candidate.status !== CandidateStatus.PENDING) {
      res.status(400).json({
        success: false,
        message: 'Only pending candidates can be approved'
      });
      return;
    }

    // Update the candidate status
    await databases.updateDocument(
      DATABASE_ID,
      CANDIDATES_COLLECTION_ID,
      id,
      {
        status: CandidateStatus.APPROVED,
        approvedBy: req.user?.id,
        approvedAt: new Date().toISOString()
      }
    );

    res.status(200).json({
      success: true,
      message: 'Candidate application approved successfully'
    });
  } catch (error) {
    console.error('Approve candidate error:', error);

    if (error.code === 404) {
      res.status(404).json({
        success: false,
        message: 'Candidate not found'
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'An error occurred while approving the candidate. Please try again later.',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Reject a candidate application
export const rejectCandidate = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    // Get candidate document
    const candidate = await databases.getDocument(
      DATABASE_ID,
      CANDIDATES_COLLECTION_ID,
      id
    );

    // Only reject PENDING candidates
    if (candidate.status !== CandidateStatus.PENDING) {
      res.status(400).json({
        success: false,
        message: 'Only pending candidates can be rejected'
      });
      return;
    }

    // Update the candidate status
    await databases.updateDocument(
      DATABASE_ID,
      CANDIDATES_COLLECTION_ID,
      id,
      {
        status: CandidateStatus.REJECTED,
        rejectionReason: reason || 'No reason provided',
        rejectedBy: req.user?.id,
        rejectedAt: new Date().toISOString()
      }
    );

    res.status(200).json({
      success: true,
      message: 'Candidate application rejected successfully'
    });
  } catch (error) {
    console.error('Reject candidate error:', error);

    if (error.code === 404) {
      res.status(404).json({
        success: false,
        message: 'Candidate not found'
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'An error occurred while rejecting the candidate. Please try again later.',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Cast a vote for a candidate
export const castVote = async (req: AuthRequest, res: Response) => {
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
    const election = await databases.getDocument(
      DATABASE_ID,
      ELECTIONS_COLLECTION_ID,
      electionId
    );

    if (election.status !== ElectionStatus.ACTIVE) {
      res.status(400).json({
        success: false,
        message: 'Votes can only be cast for active elections'
      });
      return;
    }

    // Check if candidate exists and is APPROVED
    const candidate = await databases.getDocument(
      DATABASE_ID,
      CANDIDATES_COLLECTION_ID,
      candidateId
    );

    if (candidate.status !== CandidateStatus.APPROVED) {
      res.status(400).json({
        success: false,
        message: 'Votes can only be cast for approved candidates'
      });
      return;
    }

    // Check if user has already voted in this election
    const votesResponse = await databases.listDocuments(
      DATABASE_ID,
      VOTES_COLLECTION_ID,
      [
        Query.equal('electionId', electionId),
        Query.equal('userId', req.user?.id)
      ]
    );

    if (votesResponse.total > 0) {
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
      userId: req.user?.id,
      votedAt: new Date().toISOString()
    };

    await databases.createDocument(
      DATABASE_ID,
      VOTES_COLLECTION_ID,
      ID.unique(),
      newVote
    );

    // Update vote count for candidate
    await databases.updateDocument(
      DATABASE_ID,
      CANDIDATES_COLLECTION_ID,
      candidateId,
      {
        voteCount: (candidate.voteCount || 0) + 1
      }
    );

    // Update vote count for election
    await databases.updateDocument(
      DATABASE_ID,
      ELECTIONS_COLLECTION_ID,
      electionId,
      {
        voteCount: (election.voteCount || 0) + 1
      }
    );

    res.status(200).json({
      success: true,
      message: 'Vote cast successfully'
    });
  } catch (error) {
    console.error('Cast vote error:', error);

    if (error.code === 404) {
      if (error.message.includes('elections')) {
        res.status(404).json({
          success: false,
          message: 'Election not found'
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Candidate not found'
        });
      }
      return;
    }

    res.status(500).json({
      success: false,
      message: 'An error occurred while casting your vote. Please try again later.',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Check if user has voted in an election
export const hasVoted = async (req: AuthRequest, res: Response) => {
  try {
    const { electionId } = req.params;

    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    const votesResponse = await databases.listDocuments(
      DATABASE_ID,
      VOTES_COLLECTION_ID,
      [
        Query.equal('electionId', electionId),
        Query.equal('userId', req.user.id)
      ]
    );

    res.status(200).json({
      success: true,
      hasVoted: votesResponse.total > 0
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
    const election = await databases.getDocument(
      DATABASE_ID,
      ELECTIONS_COLLECTION_ID,
      electionId
    );

    // Only completed elections should show results
    if (election.status !== ElectionStatus.COMPLETED) {
      res.status(400).json({
        success: false,
        message: 'Results are only available for completed elections'
      });
      return;
    }

    // Get approved candidates for this election with their vote counts
    const candidatesResponse = await databases.listDocuments(
      DATABASE_ID,
      CANDIDATES_COLLECTION_ID,
      [
        Query.equal('electionId', electionId),
        Query.equal('status', CandidateStatus.APPROVED)
      ]
    );

    const results = candidatesResponse.documents.map(doc => {
      return {
        id: doc.$id,
        name: doc.name,
        voteCount: doc.voteCount || 0,
        percentage: election.voteCount > 0
          ? ((doc.voteCount || 0) / election.voteCount) * 100
          : 0
      };
    });

    // Sort by vote count in descending order
    results.sort((a, b) => b.voteCount - a.voteCount);

    res.status(200).json({
      success: true,
      data: {
        electionId,
        title: election.title,
        totalVotes: election.voteCount || 0,
        results
      }
    });
  } catch (error) {
    console.error('Get election results error:', error);

    if (error.code === 404) {
      res.status(404).json({
        success: false,
        message: 'Election not found'
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving election results. Please try again later.',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export { upload };
