
export interface Election {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  positions: string[];
  isPublic: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type ElectionStatus = 'upcoming' | 'active' | 'completed' | 'cancelled';

export interface Candidate {
  id: string;
  electionId: string;
  studentName: string;
  studentId: string;
  position: string;
  manifesto: string;
  imageUrl?: string | null;
  department?: string;
  year?: string;
  status: 'pending' | 'approved' | 'rejected';
  voteCount: number;
  submittedAt: string;
}

export interface Vote {
  id: string;
  electionId: string;
  candidateId: string;
  userId: string;
  timestamp: string;
  voterId?: string;
}

// Helper functions for permission checks
export const getElectionPermissions = (
  userRole: string, 
  election?: Election, 
  isCreator: boolean = false
) => {
  return {
    canCreate: userRole === 'Admin',
    canRead: true, // Everyone can read public elections
    canUpdate: userRole === 'Admin' || isCreator,
    canDelete: userRole === 'Admin',
    canVote: userRole === 'Student' || userRole === 'Faculty',
    canApproveRejectCandidates: userRole === 'Admin' || userRole === 'Faculty'
  };
};

export const getCandidatePermissions = (
  userRole: string, 
  candidate?: Candidate, 
  userId?: string
) => {
  const isOwner = candidate?.studentId === userId;
  
  return {
    canCreate: userRole === 'Student',
    canUpdate: userRole === 'Admin' || (isOwner && candidate?.status === 'pending'),
    canDelete: userRole === 'Admin' || (isOwner && candidate?.status === 'pending'),
    canApprove: userRole === 'Admin' || userRole === 'Faculty',
    canReject: userRole === 'Admin' || userRole === 'Faculty'
  };
};
