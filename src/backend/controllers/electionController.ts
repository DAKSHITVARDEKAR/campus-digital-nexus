import { Request, Response } from 'express';
import { z } from 'zod';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { db } from '../config/firebase';
import { DocumentData, Query } from 'firebase-admin/firestore';

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

// ... keep existing code (other controller functions)
