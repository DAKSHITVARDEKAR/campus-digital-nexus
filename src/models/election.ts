
// Export all interfaces and types
export interface Election {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: ElectionStatus;
  positions: string[];
  isPublic: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type ElectionStatus = 'upcoming' | 'active' | 'closed' | 'cancelled' | 'completed';

export interface Candidate {
  id: string;
  electionId: string;
  studentName: string;
  studentId: string;
  position: string;
  manifesto: string;
  imageUrl: string | null;
  department: string;
  year: string;
  status: string;
  voteCount: number;
  submittedAt: string;
}

export interface Vote {
  id: string;
  electionId: string;
  candidateId: string;
  userId: string;
  timestamp: string;
}

export interface ElectionResult {
  electionId: string;
  position: string;
  candidates: { id: string; name: string; voteCount: number }[];
  totalVotes: number;
}

// Functions for permission checking that mockElectionApi.js is trying to import
export const getElectionPermissions = (role: string, election?: Election, isCreator = false) => {
  return {
    canCreate: role === 'Admin' || role === 'Faculty',
    canRead: true,
    canUpdate: role === 'Admin' || (role === 'Faculty' && isCreator),
    canDelete: role === 'Admin' || (role === 'Faculty' && isCreator),
    canVote: (role === 'Student' || role === 'Faculty') && election?.status === 'active',
    canApproveRejectCandidates: role === 'Admin' || role === 'Faculty'
  };
};

export const getCandidatePermissions = (role: string, candidate?: Candidate, userId?: string) => {
  const isOwner = candidate && candidate.studentId === userId;
  
  return {
    canCreate: role === 'Student',
    canRead: true,
    canUpdate: role === 'Admin' || isOwner,
    canDelete: role === 'Admin' || isOwner,
    canApprove: role === 'Admin' || role === 'Faculty',
    canReject: role === 'Admin' || role === 'Faculty'
  };
};
