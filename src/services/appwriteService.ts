
import { Client, Account, Teams, Databases, Storage, ID } from 'appwrite';
import { Election, Candidate } from '@/models/election';
import { useToast } from '@/hooks/use-toast';

// Initialize Appwrite
const client = new Client();
client
  .setEndpoint('https://fra.cloud.appwrite.io/v1')
  .setProject('68166b45001f2c121a55');

// Initialize Appwrite services
export const account = new Account(client);
export const teams = new Teams(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Database and collection IDs
export const DB_ID = 'campusNexusDB';
export const ELECTIONS_COLLECTION = 'elections';
export const CANDIDATES_COLLECTION = 'candidates';
export const VOTES_COLLECTION = 'votes';
export const COMPLAINTS_COLLECTION = 'complaints';
export const FACILITIES_COLLECTION = 'facilities';
export const BOOKINGS_COLLECTION = 'bookingRequests';
export const APPLICATIONS_COLLECTION = 'applications';
export const INTEGRITY_RECORDS_COLLECTION = 'integrityRecords';
export const BUDGETS_COLLECTION = 'budgets';
export const EXPENSE_RECORDS_COLLECTION = 'expenseRecords';
export const ACHIEVEMENTS_COLLECTION = 'achievements';

// Storage bucket IDs
export const PROFILE_IMAGES_BUCKET = 'profile-images';
export const ATTACHMENTS_BUCKET = 'attachments';
export const PROOFS_BUCKET = 'proofs';

// Helper function to map election document from Appwrite to our Election type
export const mapElectionFromDocument = (doc: any): Election => {
  return {
    id: doc.$id,
    title: doc.title,
    description: doc.description,
    startDate: doc.startDate,
    endDate: doc.endDate,
    status: doc.status,
    positions: doc.positions,
    isPublic: doc.isPublic || false,
    createdBy: doc.createdBy || '',
    createdAt: doc.createdAt || '',
    updatedAt: doc.updatedAt || ''
  };
};

// Helper function to map candidate document from Appwrite to our Candidate type
export const mapCandidateFromDocument = (doc: any): Candidate => {
  return {
    id: doc.$id,
    electionId: doc.electionId,
    studentName: doc.studentName,
    studentId: doc.studentId,
    position: doc.position,
    manifesto: doc.manifesto,
    imageUrl: doc.imageUrl || null,
    department: doc.department || '',
    year: doc.year || '',
    status: doc.status || 'pending',
    voteCount: doc.voteCount || 0,
    submittedAt: doc.submittedAt || new Date().toISOString() // Added missing property
  };
};

// Error handling helper
export const handleError = (error: any, { toast }: { toast?: any } = {}) => {
  console.error('Appwrite service error:', error);
  
  const errorMessage = error?.message || 'An unexpected error occurred';
  
  if (toast) {
    toast({
      title: 'Error',
      description: errorMessage,
      variant: 'destructive',
    });
  }
  
  throw new Error(errorMessage);
};

// Auth services will be implemented in a separate auth.ts file
