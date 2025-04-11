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

// Permission helpers
const canManageElection = async (userId: string, electionId?: string) => {
  // const user = await prisma.user.findUnique({
  //   where: { id: userId },
  //   select: { role: true }
  // });
  
  // if (!user) return false;
  
  // // Admin can manage all elections
  // if (user.role === 'ADMIN') return true;
  
  // // If checking a specific election
  // if (electionId) {
  //   // Creator of the election can manage it 
  //   const election = await prisma.election.findUnique({
  //     where: { id: electionId }
  //   });
    
  //   return election?.createdBy === userId;
  // }
  
  return false;
};

// Election Controllers
export const getElections = async (req: Request, res: Response) => {
  try {
    // Handle optional status filter
    // const statusFilter = req.query.status as ElectionStatus | undefined;
    
    // const elections = await prisma.election.findMany({
    //   where: statusFilter ? { status: statusFilter } : undefined,
    //   include: {
    //     _count: {
    //       select: { candidates: true, votes: true }
    //     }
    //   },
    //   orderBy: { startDate: 'asc' }
    // });
    
    // // Format the response for accessibility
    // const formattedElections = elections.map(election => ({
    //   id: election.id,
    //   title: election.title,
    //   description: election.description,
    //   startDate: election.startDate.toISOString(),
    //   endDate: election.endDate.toISOString(),
    //   status: election.status,
    //   candidateCount: election._count.candidates,
    //   voteCount: election._count.votes,
    //   createdAt: election.createdAt.toISOString(),
    //   // Provide human-readable status for screen readers
    //   statusDescription: getStatusDescription(election.status),
    //   // Add date formatting for better accessibility
    //   formattedStartDate: formatDate(election.startDate),
    //   formattedEndDate: formatDate(election.endDate)
    // }));
    
    return res.status(200).json({
      success: true,
      count: 0,
      data: []
    });
  } catch (error) {
    console.error('Get elections error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving elections. Please try again later.',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getElection = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // const election = await prisma.election.findUnique({
    //   where: { id },
    //   include: {
    //     _count: {
    //       select: { candidates: true, votes: true }
    //     },
    //     candidates: {
    //       where: { status: 'APPROVED' }, // Only include approved candidates
    //       select: {
    //         id: true,
    //         name: true,
    //         description: true,
    //         imageUrl: true,
    //         imageAlt: true, // Include alt text for images
    //         platform: true,
    //         voteCount: true
    //       }
    //     }
    //   }
    // });
    
    // if (!election) {
    //   return res.status(404).json({
    //     success: false,
    //     message: 'Election not found. It may have been deleted or the ID is incorrect.'
    //   });
    // }
    
    // // Format the response for accessibility
    // const formattedElection = {
    //   id: election.id,
    //   title: election.title,
    //   description: election.description,
    //   startDate: election.startDate.toISOString(),
    //   endDate: election.endDate.toISOString(),
    //   status: election.status,
    //   candidateCount: election._count.candidates,
    //   voteCount: election._count.votes,
    //   createdAt: election.createdAt.toISOString(),
    //   // Provide human-readable status for screen readers
    //   statusDescription: getStatusDescription(election.status),
    //   // Add date formatting for better accessibility
    //   formattedStartDate: formatDate(election.startDate),
    //   formattedEndDate: formatDate(election.endDate),
    //   // Include candidates
    //   candidates: election.candidates.map(candidate => ({
    //     ...candidate,
    //     // If no alt text was provided, generate a basic one
    //     imageAlt: candidate.imageAlt || `Profile picture of candidate ${candidate.name}`
    //   }))
    // };
    
    return res.status(200).json({
      success: true,
      data: null
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
    // const user = await prisma.user.findUnique({
    //   where: { id: req.user.userId },
    //   select: { role: true }
    // });
    
    // if (!user || user.role !== 'ADMIN') {
    //   return res.status(403).json({
    //     success: false,
    //     message: 'Only administrators can create elections. If you need to create an election, please contact an administrator.'
    //   });
    // }
    
    // Create election
    // const election = await prisma.election.create({
    //   data: {
    //     title,
    //     description,
    //     startDate: parsedStartDate,
    //     endDate: parsedEndDate,
    //     status: 'UPCOMING',
    //     createdBy: req.user.userId
    //   }
    // });
    
    return res.status(201).json({
      success: true,
      message: 'Election created successfully. Candidates can now submit their applications.',
      data: null
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
    // const existingElection = await prisma.election.findUnique({
    //   where: { id }
    // });
    
    // if (!existingElection) {
    //   return res.status(404).json({
    //     success: false,
    //     message: 'Election not found. It may have been deleted or the ID is incorrect.'
    //   });
    // }
    
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
    
    // const { title, description, startDate, endDate, status } = validatedData.data;
    
    // // Build update data
    // const updateData: any = {};
    
    // if (title) updateData.title = title;
    // if (description) updateData.description = description;
    
    // // Parse and validate dates if provided
    // if (startDate) {
    //   const parsedStartDate = new Date(startDate);
      
    //   if (existingElection.status !== 'UPCOMING') {
    //     return res.status(400).json({
    //       success: false,
    //       message: 'Start date cannot be changed for elections that have already started or ended.'
    //     });
    //   }
      
    //   updateData.startDate = parsedStartDate;
    // }
    
    // if (endDate) {
    //   const parsedEndDate = new Date(endDate);
      
    //   if (existingElection.status === 'COMPLETED') {
    //     return res.status(400).json({
    //       success: false,
    //       message: 'End date cannot be changed for elections that have already ended.'
    //     });
    //   }
      
    //   updateData.endDate = parsedEndDate;
    // }
    
    // // Validate date logic if both dates provided
    // if (startDate && endDate && updateData.startDate >= updateData.endDate) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'End date must be after start date. Please adjust your dates.'
    //   });
    // }
    
    // // Update status if provided
    // if (status) {
    //   // Perform status transition validation
    //   if (existingElection.status === 'COMPLETED' && status !== 'COMPLETED') {
    //     return res.status(400).json({
    //       success: false,
    //       message: 'Completed elections cannot be changed to another status.'
    //     });
    //   }
      
    //   updateData.status = status;
    // }
    
    // // Update election
    // const updatedElection = await prisma.election.update({
    //   where: { id },
    //   data: updateData
    // });
    
    return res.status(200).json({
      success: true,
      message: 'Election updated successfully.',
      data: null
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
    // const existingElection = await prisma.election.findUnique({
    //   where: { id }
    // });
    
    // if (!existingElection) {
    //   return res.status(404).json({
    //     success: false,
    //     message: 'Election not found. It may have been deleted or the ID is incorrect.'
    //   });
    // }
    
    // Check permission
    const hasPermission = await canManageElection(req.user.userId, id);
    
    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this election. Only administrators can delete elections.'
      });
    }
    
    // Check if election has votes - prevent deletion if votes exist
    // const voteCount = await prisma.vote.count({
    //   where: { electionId: id }
    // });
    
    // if (voteCount > 0) {
    //   // Instead of deleting, cancel the election
    //   await prisma.election.update({
    //     where: { id },
    //     data: { status: 'CANCELLED' }
    //   });
      
    //   return res.status(200).json({
    //     success: true,
    //     message: 'This election has votes and cannot be deleted. It has been marked as cancelled instead.'
    //   });
    // }
    
    // // Delete related candidates first
    // await prisma.candidate.deleteMany({
    //   where: { electionId: id }
    // });
    
    // // Delete election
    // await prisma.election.delete({
    //   where: { id }
    // });
    
    return res.status(200).json({
      success: true,
      message: 'Election deleted'
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
    // const userRole = req.user?.role || 'STUDENT';
    
    // Check if election exists
    // const election = await prisma.election.findUnique({
    //   where: { id: electionId }
    // });
    
    // if (!election) {
    //   return res.status(404).json({
    //     success: false,
    //     message: 'Election not found. It may have been deleted or the ID is incorrect.'
    //   });
    // }
    
    // // Define filter based on user role
    // const filter: any = { electionId };
    
    // // Students only see approved candidates unless looking at own applications
    // if (userRole === 'STUDENT' && req.user) {
    //   filter.OR = [
    //     { status: 'APPROVED' },
    //     { studentId: req.user.userId }
    //   ];
    // }
    // // Faculty and admins see all candidates
    
    // const candidates = await prisma.candidate.findMany({
    //   where: filter,
    //   include: {
    //     student: {
    //       select: {
    //         name: true,
    //         department: true
    //       }
    //     }
    //   }
    // });
    
    // // Format response for accessibility
    // const formattedCandidates = candidates.map(candidate => ({
    //   id: candidate.id,
    //   name: candidate.name,
    //   description: candidate.description,
    //   imageUrl: candidate.imageUrl,
    //   imageAlt: candidate.imageAlt || `Profile picture of candidate ${candidate.name}`,
    //   platform: candidate.platform,
    //   status: candidate.status,
    //   voteCount: candidate.status === 'APPROVED' ? candidate.voteCount : undefined,
    //   submittedAt: candidate.submittedAt.toISOString(),
    //   studentName: candidate.student?.name,
    //   department: candidate.student?.department,
    //   // Provide human-readable status for screen readers
    //   statusDescription: getCandidateStatusDescription(candidate.status)
    // }));
    
    return res.status(200).json({
      success: true,
      count: 0,
      data: []
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
        
        // const { electionId, name, description, platform, imageAlt } = validatedData.data;
        
        // Check if election exists and is accepting applications
        // const election = await prisma.election.findUnique({
        //   where: { id: electionId }
        // });
        
        // if (!election) {
        //   // Remove uploaded file if election doesn't exist
        //   if (req.file) {
        //     fs.unlinkSync(req.file.path);
        //   }
          
        //   return res.status(404).json({
        //     success: false,
        //     message: 'Election not found. It may have been deleted or the ID is incorrect.'
        //   });
        // }
        
        // if (election.status !== 'UPCOMING') {
        //   // Remove uploaded file if election isn't upcoming
        //   if (req.file) {
        //     fs.unlinkSync(req.file.path);
        //   }
          
        //   return res.status(400).json({
        //     success: false,
        //     message: 'Candidate applications are only accepted for upcoming elections. This election has already started or ended.'
        //   });
        // }
        
        // Check if user already has an application for this election
        // const existingApplication = await prisma.candidate.findFirst({
        //   where: {
        //     electionId,
        //     studentId: req.user.userId
        //   }
        // });
        
        // if (existingApplication) {
        //   // Remove uploaded file if application already exists
        //   if (req.file) {
        //     fs.unlinkSync(req.file.path);
        //   }
          
        //   return res.status(409).json({
        //     success: false,
        //     message: 'You have already submitted an application for this election. You can update your existing application instead.'
        //   });
        // }
        
        // Create candidate application
        // const candidate = await prisma.candidate.create({
        //   data: {
        //     electionId,
        //     studentId: req.user.userId,
        //     name,
        //     description,
        //     platform,
        //     imageUrl: req.file ? `/uploads/candidates/${req.file.filename}` : undefined,
        //     imageAlt
        //   }
        // });
        
        return res.status(201).json({
          success: true,
          message: 'Your candidate application has been submitted successfully. It will be reviewed by administrators.',
          data: null
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
    // const candidate = await prisma.candidate.findUnique({
    //   where: { id },
    //   include: {
    //     election: true
    //   }
    // });
    
    // if (!candidate) {
    //   return res.status(404).json({
    //     success: false,
    //     message: 'Candidate application not found. It may have been deleted or the ID is incorrect.'
    //   });
    // }
    
    // Check user permission
    // const user = await prisma.user.findUnique({
    //   where: { id: req.user.userId },
    //   select: { role: true }
    // });
    
    // if (!user || (user.role !== 'ADMIN' && user.role !== 'FACULTY')) {
    //   return res.status(403).json({
    //     success: false,
    //     message: 'Only administrators and faculty members can approve candidate applications.'
    //   });
    // }
    
    // Check if election is still upcoming
    // if (candidate.election.status !== 'UPCOMING') {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Candidate applications can only be approved for upcoming elections. This election has already started or ended.'
    //   });
    // }
    
    // Approve candidate
    // const updatedCandidate = await prisma.candidate.update({
    //   where: { id },
    //   data: { status: 'APPROVED' }
    // });
    
    return res.status(200).json({
      success: true,
      message: 'Candidate application approved successfully. The candidate will be included in the election.',
      data: null
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
    // const candidate = await prisma.candidate.findUnique({
    //   where: { id },
    //   include: {
    //     election: true
    //   }
    // });
    
    // if (!candidate) {
    //   return res.status(404).json({
    //     success: false,
    //     message: 'Candidate application not found. It may have been deleted or the ID is incorrect.'
    //   });
    // }
    
    // Check user permission
    // const user = await prisma.user.findUnique({
    //   where: { id: req.user.userId },
    //   select: { role: true }
    // });
    
    // if (!user || (user.role !== 'ADMIN' && user.role !== 'FACULTY')) {
    //   return res.status(403).json({
    //     success: false,
    //     message: 'Only administrators and faculty members can reject candidate applications.'
    //   });
    // }
    
    // Check if election is still upcoming
    // if (candidate.election.status !== 'UPCOMING') {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Candidate applications can only be modified for upcoming elections. This election has already started or ended.'
    //   });
    // }
    
    // Reject candidate
    // const updatedCandidate = await prisma.candidate.update({
    //   where: { id },
    //   data: { status: 'REJECTED' }
    // });
    
    return res.status(200).json({
      success: true,
      message: 'Candidate application rejected successfully.',
      data: null
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
    
    // const { electionId, candidateId } = req.body;
    
    // if (!electionId || !candidateId) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Both election ID and candidate ID are required to cast a vote.'
    //   });
    // }
    
    // // Check if election exists and is active
    // const election = await prisma.election.findUnique({
    //   where: { id: electionId }
    // });
    
    // if (!election) {
    //   return res.status(404).json({
    //     success: false,
    //     message: 'Election not found. It may have been deleted or the ID is incorrect.'
    //   });
    // }
    
    // if (election.status !== 'ACTIVE') {
    //   return res.status(400).json({
    //     success: false,
    //     message: `You cannot vote in this election because it is ${election.status.toLowerCase()}. Voting is only allowed for active elections.`
    //   });
    // }
    
    // // Check if candidate exists and is approved
    // const candidate = await prisma.candidate.findFirst({
    //   where: {
    //     id: candidateId,
    //     electionId,
    //     status: 'APPROVED'
    //   }
    // });
    
    // if (!candidate) {
    //   return res.status(404).json({
    //     success: false,
    //     message: 'Candidate not found or not approved for this election.'
    //   });
    // }
    
    // // Check if user has already voted in this election
    // const existingVote = await prisma.vote.findFirst({
    //   where: {
    //     electionId,
    //     voterId: req.user.userId
    //   }
    // });
    
    // if (existingVote) {
    //   return res.status(409).json({
    //     success: false,
    //     message: 'You have already voted in this election. Each voter may only vote once.'
    //   });
    // }
    
    // // Create vote and update candidate vote count
    // const [vote, _] = await prisma.$transaction([
    //   prisma.vote.create({
    //     data: {
    //       electionId,
    //       candidateId,
    //       voterId: req.user.userId
    //     }
    //   }),
    //   prisma.candidate.update({
    //     where: { id: candidateId },
    //     data: {
    //
