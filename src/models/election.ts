
import { UserRole, User } from '../services/mockAuth';

// Election status types
export type ElectionStatus = 'upcoming' | 'active' | 'completed' | 'cancelled';

// Election model
export interface Election {
  id: string;
  title: string;
  description: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  status: ElectionStatus;
  positions: string[]; // e.g. ['President', 'Vice President', 'Treasurer']
  isPublic: boolean;
  createdBy: string; // userId of creator
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

// Candidate model
export interface Candidate {
  id: string;
  electionId: string;
  studentName: string;
  studentId: string;
  position: string;
  department: string;
  year: string;
  manifesto: string;
  imageUrl?: string;
  voteCount: number;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string; // ISO date string
}

// Vote model
export interface Vote {
  id: string;
  electionId: string;
  candidateId: string;
  voterId: string;
  votedAt: string; // ISO date string
}

// Permission scopes
export interface ElectionPermissions {
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  canVote: boolean;
  canManageCandidates: boolean;
  canViewResults: boolean;
  canApproveRejectCandidates: boolean;
}

// Permission logic for elections based on user role
export const getElectionPermissions = (
  userRole: UserRole | undefined, 
  election?: Election, 
  isOwner?: boolean
): ElectionPermissions => {
  // Default permissions (no access)
  const permissions: ElectionPermissions = {
    canCreate: false,
    canRead: false,
    canUpdate: false,
    canDelete: false,
    canVote: false,
    canManageCandidates: false,
    canViewResults: false,
    canApproveRejectCandidates: false,
  };

  if (!userRole) {
    return permissions;
  }

  // Grant permissions based on role
  switch (userRole) {
    case 'Admin':
      // Admins have full access to everything
      permissions.canCreate = true;
      permissions.canRead = true;
      permissions.canUpdate = true;
      permissions.canDelete = true;
      permissions.canVote = true;
      permissions.canManageCandidates = true;
      permissions.canViewResults = true;
      permissions.canApproveRejectCandidates = true;
      break;
    
    case 'Faculty':
      // Faculty can read all elections and vote
      permissions.canRead = true;
      permissions.canVote = true;
      permissions.canViewResults = election?.status === 'completed' || false;
      
      // Faculty can only manage candidates if they created the election
      if (isOwner) {
        permissions.canManageCandidates = true;
        permissions.canUpdate = true;
        permissions.canApproveRejectCandidates = true;
      }
      break;
    
    case 'Student':
      // Students can read active or completed elections and vote in active ones
      permissions.canRead = true;
      permissions.canVote = election?.status === 'active' || false;
      permissions.canViewResults = election?.status === 'completed' || false;
      
      // Students can apply as candidates
      permissions.canManageCandidates = false;
      break;
  }

  return permissions;
};

// Permission logic for candidates based on user role
export const getCandidatePermissions = (
  userRole: UserRole | undefined,
  candidate?: Candidate,
  userId?: string
): { canCreate: boolean; canUpdate: boolean; canDelete: boolean; canApprove: boolean; canReject: boolean } => {
  // Default permissions
  const permissions = {
    canCreate: false,
    canUpdate: false,
    canDelete: false,
    canApprove: false,
    canReject: false
  };

  if (!userRole) {
    return permissions;
  }

  const isOwner = userId === candidate?.studentId;

  switch (userRole) {
    case 'Admin':
      // Admins have full control
      permissions.canCreate = true;
      permissions.canUpdate = true;
      permissions.canDelete = true;
      permissions.canApprove = true;
      permissions.canReject = true;
      break;
    
    case 'Faculty':
      // Faculty can approve/reject candidates but not modify them
      permissions.canApprove = true;
      permissions.canReject = true;
      break;
    
    case 'Student':
      // Students can only create, update, and delete their own applications if pending
      permissions.canCreate = true;
      if (isOwner && candidate?.status === 'pending') {
        permissions.canUpdate = true;
        permissions.canDelete = true;
      }
      break;
  }

  return permissions;
};
