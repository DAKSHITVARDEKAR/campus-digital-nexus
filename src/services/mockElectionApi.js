import { 
  Election, 
  Candidate, 
  Vote,
  getElectionPermissions,
  getCandidatePermissions
} from '../models/election';
import { getCurrentUser } from './mockAuth';

// Mock database for elections, candidates, and votes
let elections = [
  {
    id: 'election-2025',
    title: 'Student Council Election 2025',
    description: 'Vote for your student representatives for the academic year 2025-2026. The elected council will represent student interests in administrative decisions and organize campus events.',
    startDate: '2025-04-10T00:00:00Z',
    endDate: '2025-04-15T23:59:59Z',
    status: 'active',
    positions: ['President', 'Vice President', 'Secretary', 'Treasurer'],
    isPublic: true,
    createdBy: 'admin789',
    createdAt: '2025-03-01T00:00:00Z',
    updatedAt: '2025-03-01T00:00:00Z'
  },
  {
    id: 'election-past',
    title: 'Student Council Election 2024',
    description: 'Student Council election for the academic year 2024-2025.',
    startDate: '2024-04-10T00:00:00Z',
    endDate: '2024-04-15T23:59:59Z',
    status: 'completed',
    positions: ['President', 'Vice President'],
    isPublic: true,
    createdBy: 'admin789',
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-03-01T00:00:00Z'
  },
  {
    id: 'election-upcoming',
    title: 'Department Representatives Election 2025',
    description: 'Election for department representatives for the academic year 2025-2026.',
    startDate: '2025-05-01T00:00:00Z',
    endDate: '2025-05-07T23:59:59Z',
    status: 'upcoming',
    positions: ['Department Representative'],
    isPublic: true,
    createdBy: 'admin789',
    createdAt: '2025-03-15T00:00:00Z',
    updatedAt: '2025-03-15T00:00:00Z'
  }
];

let candidates = [
  {
    id: 'candidate-1',
    electionId: 'election-2025',
    studentName: 'Alex Johnson',
    studentId: 'student123',
    position: 'President',
    department: 'Computer Science',
    year: '3rd Year',
    manifesto: 'Committed to improving campus technology infrastructure and creating more internship opportunities.',
    imageUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    voteCount: 145,
    status: 'approved',
    submittedAt: '2025-03-05T10:30:00Z'
  },
  {
    id: 'candidate-2',
    electionId: 'election-2025',
    studentName: 'Samantha Wilson',
    studentId: 'ST65432',
    position: 'President',
    department: 'Business Administration',
    year: '3rd Year',
    manifesto: 'Focused on enhancing student welfare services and creating a more inclusive campus environment.',
    imageUrl: 'https://randomuser.me/api/portraits/women/65.jpg',
    voteCount: 132,
    status: 'approved',
    submittedAt: '2025-03-06T14:15:00Z'
  },
  {
    id: 'candidate-3',
    electionId: 'election-2025',
    studentName: 'Miguel Hernandez',
    studentId: 'ST78901',
    position: 'Vice President',
    department: 'Engineering',
    year: '2nd Year',
    manifesto: 'Will work to improve academic resources and establish stronger industry connections.',
    imageUrl: 'https://randomuser.me/api/portraits/men/45.jpg',
    voteCount: 98,
    status: 'approved',
    submittedAt: '2025-03-07T09:45:00Z'
  },
  {
    id: 'candidate-4',
    electionId: 'election-2025',
    studentName: 'Emily Zhang',
    studentId: 'ST24680',
    position: 'Vice President',
    department: 'Life Sciences',
    year: '3rd Year',
    manifesto: 'Dedicated to sustainability initiatives and creating more research opportunities for undergraduates.',
    imageUrl: 'https://randomuser.me/api/portraits/women/32.jpg',
    voteCount: 110,
    status: 'approved',
    submittedAt: '2025-03-08T11:20:00Z'
  },
  {
    id: 'past-candidate-1',
    electionId: 'election-past',
    studentName: 'Taylor Smith',
    studentId: 'ST12345',
    position: 'President',
    department: 'Psychology',
    year: '3rd Year',
    manifesto: 'Focused on mental health resources and academic support services.',
    imageUrl: 'https://randomuser.me/api/portraits/women/22.jpg',
    voteCount: 178,
    status: 'approved',
    submittedAt: '2024-03-05T10:30:00Z'
  },
  {
    id: 'past-candidate-2',
    electionId: 'election-past',
    studentName: 'Omar Khan',
    studentId: 'ST67890',
    position: 'President',
    department: 'Political Science',
    year: '3rd Year',
    manifesto: 'Advocating for more student involvement in university governance.',
    imageUrl: 'https://randomuser.me/api/portraits/men/21.jpg',
    voteCount: 132,
    status: 'approved',
    submittedAt: '2024-03-06T14:15:00Z'
  }
];

let votes = [];

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Error class for API errors
export class ApiError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }
}

// Check permissions middleware (simulated)
const checkPermission = async (
  resourceType,
  action,
  resourceId
) => {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new ApiError('Authentication required', 401);
  }

  let hasPermission = false;

  if (resourceType === 'election') {
    const election = resourceId ? elections.find(e => e.id === resourceId) : undefined;
    const permissions = getElectionPermissions(user.role, election, election?.createdBy === user.userId);
    
    switch (action) {
      case 'create':
        hasPermission = permissions.canCreate;
        break;
      case 'read':
        hasPermission = permissions.canRead;
        break;
      case 'update':
        hasPermission = permissions.canUpdate;
        break;
      case 'delete':
        hasPermission = permissions.canDelete;
        break;
      case 'vote':
        hasPermission = permissions.canVote;
        break;
      case 'approve':
      case 'reject':
        hasPermission = permissions.canApproveRejectCandidates;
        break;
    }
  } else if (resourceType === 'candidate') {
    const candidate = resourceId ? candidates.find(c => c.id === resourceId) : undefined;
    const permissions = getCandidatePermissions(user.role, candidate, user.userId);
    
    switch (action) {
      case 'create':
        hasPermission = permissions.canCreate;
        break;
      case 'update':
        hasPermission = permissions.canUpdate;
        break;
      case 'delete':
        hasPermission = permissions.canDelete;
        break;
      case 'approve':
        hasPermission = permissions.canApprove;
        break;
      case 'reject':
        hasPermission = permissions.canReject;
        break;
      default:
        hasPermission = true; // Reading candidates is always allowed
    }
  } else if (resourceType === 'vote') {
    // Everyone can read votes for completed elections
    // Only students and faculty can create votes for active elections
    if (action === 'read') {
      hasPermission = true;
    } else if (action === 'create') {
      hasPermission = user.role === 'Student' || user.role === 'Faculty';
      
      if (resourceId) {
        const election = elections.find(e => e.id === resourceId);
        hasPermission = hasPermission && election?.status === 'active';
      }
    }
  }

  if (!hasPermission) {
    throw new ApiError(`Permission denied: Cannot ${action} ${resourceType}`, 403);
  }

  return user;
};

// Mock API endpoints
// Expose all functions directly at the top level for simpler imports
export const getElections = async () => {
  await delay(500);
  const user = await getCurrentUser();
  
  // Filter elections based on user role
  if (!user) {
    return elections.filter(e => e.isPublic && e.status !== 'cancelled');
  }
  
  if (user.role === 'Admin') {
    return [...elections];
  }
  
  // Students and Faculty can only see public elections that aren't cancelled
  return elections.filter(e => e.isPublic && e.status !== 'cancelled');
};

export const getElection = async (id) => {
  await delay(300);
  await checkPermission('election', 'read', id);
  
  const election = elections.find(e => e.id === id);
  if (!election) {
    throw new ApiError(`Election with ID ${id} not found`, 404);
  }
  
  return election;
};

export const createElection = async (electionData) => {
  await delay(700);
  const user = await checkPermission('election', 'create');
  
  const newElection = {
    ...electionData,
    id: `election-${Date.now()}`,
    createdBy: user.userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  elections.push(newElection);
  return newElection;
};

export const updateElection = async (id, electionData) => {
  await delay(500);
  await checkPermission('election', 'update', id);
  
  const index = elections.findIndex(e => e.id === id);
  if (index === -1) {
    throw new ApiError(`Election with ID ${id} not found`, 404);
  }
  
  const updatedElection = {
    ...elections[index],
    ...electionData,
    updatedAt: new Date().toISOString()
  };
  
  elections[index] = updatedElection;
  return updatedElection;
};

export const deleteElection = async (id) => {
  await delay(500);
  await checkPermission('election', 'delete', id);
  
  const index = elections.findIndex(e => e.id === id);
  if (index === -1) {
    throw new ApiError(`Election with ID ${id} not found`, 404);
  }
  
  // Check if there are votes for this election
  const hasVotes = votes.some(v => v.electionId === id);
  if (hasVotes) {
    throw new ApiError('Cannot delete election with existing votes', 400);
  }
  
  elections.splice(index, 1);
  return { success: true };
};

export const getElectionResults = async (id) => {
  await delay(700);
  const user = await getCurrentUser();
  const election = await getElection(id);
  
  // Only admins can see results for non-completed elections
  if (election.status !== 'completed' && (!user || user.role !== 'Admin')) {
    throw new ApiError('Results are only available for completed elections', 403);
  }
  
  const electionCandidates = candidates.filter(c => c.electionId === id && c.status === 'approved');
  const totalVotes = electionCandidates.reduce((sum, candidate) => sum + candidate.voteCount, 0);
  
  return {
    candidates: electionCandidates,
    totalVotes
  };
};

// Candidate endpoints
export const getCandidates = async (electionId) => {
  await delay(500);
  const user = await getCurrentUser();
  
  let electionCandidates = candidates.filter(c => c.electionId === electionId);
  
  // Filter based on user role
  if (!user) {
    // Public users can only see approved candidates
    return electionCandidates.filter(c => c.status === 'approved');
  }
  
  if (user.role !== 'Admin' && user.role !== 'Faculty') {
    // Students can only see approved candidates or their own applications
    return electionCandidates.filter(c => 
      c.status === 'approved' || c.studentId === user.userId
    );
  }
  
  // Admins and Faculty can see all candidates
  return electionCandidates;
};

export const getCandidate = async (id) => {
  await delay(300);
  const user = await getCurrentUser();
  
  const candidate = candidates.find(c => c.id === id);
  if (!candidate) {
    throw new ApiError(`Candidate with ID ${id} not found`, 404);
  }
  
  // Check permissions based on status and role
  if (candidate.status !== 'approved') {
    if (!user) {
      throw new ApiError('Candidate not found', 404); // Don't reveal that it exists
    }
    
    if (user.role !== 'Admin' && user.role !== 'Faculty' && candidate.studentId !== user.userId) {
      throw new ApiError('Permission denied: Cannot view this candidate', 403);
    }
  }
  
  return candidate;
};

export const createCandidate = async (candidateData) => {
  await delay(700);
  const user = await checkPermission('candidate', 'create');
  
  // Get the election to verify it exists and is accepting candidates
  const election = await getElection(candidateData.electionId);
  if (election.status !== 'upcoming' && election.status !== 'active') {
    throw new ApiError('This election is not accepting candidate applications', 400);
  }
  
  // Check if the position is valid for this election
  if (!election.positions.includes(candidateData.position)) {
    throw new ApiError(`Invalid position. Valid positions are: ${election.positions.join(', ')}`, 400);
  }
  
  // Check if the user has already applied for this position in this election
  const existingApplication = candidates.find(c => 
    c.electionId === candidateData.electionId && 
    c.studentId === user.userId &&
    c.position === candidateData.position
  );
  
  if (existingApplication) {
    throw new ApiError('You have already applied for this position in this election', 400);
  }
  
  const newCandidate = {
    ...candidateData,
    id: `candidate-${Date.now()}`,
    studentId: user.userId,
    voteCount: 0,
    status: 'pending',
    submittedAt: new Date().toISOString()
  };
  
  candidates.push(newCandidate);
  return newCandidate;
};

export const updateCandidate = async (id, candidateData) => {
  await delay(500);
  const user = await getCurrentUser();
  
  const index = candidates.findIndex(c => c.id === id);
  if (index === -1) {
    throw new ApiError(`Candidate with ID ${id} not found`, 404);
  }
  
  // Check permissions
  
  const candidate = candidates[index];
  
  // Check permissions
  if (user?.role !== 'Admin' && candidate.studentId !== user?.userId) {
    throw new ApiError('Permission denied: Cannot update this application', 403);
  }
  
  // Students can only update pending applications
  if (user?.role !== 'Admin' && candidate.status !== 'pending') {
    throw new ApiError('Cannot update application as it has already been processed', 400);
  }
  
  const updatedCandidate = {
    ...candidate,
    ...candidateData
  };
  
  candidates[index] = updatedCandidate;
  return updatedCandidate;
};

export const deleteCandidate = async (id) => {
  await delay(500);
  const user = await getCurrentUser();
  
  const index = candidates.findIndex(c => c.id === id);
  if (index === -1) {
    throw new ApiError(`Candidate with ID ${id} not found`, 404);
  }
  
  // Check permissions
  
  const candidate = candidates[index];
  
  // Check permissions
  if (user?.role !== 'Admin' && candidate.studentId !== user?.userId) {
    throw new ApiError('Permission denied: Cannot delete this application', 403);
  }
  
  // Students can only delete pending applications
  if (user?.role !== 'Admin' && candidate.status !== 'pending') {
    throw new ApiError('Cannot delete application as it has already been processed', 400);
  }
  
  // Check if there are votes for this candidate
  const hasVotes = votes.some(v => v.candidateId === id);
  if (hasVotes && user?.role !== 'Admin') {
    throw new ApiError('Cannot delete candidate with existing votes', 400);
  }
  
  candidates.splice(index, 1);
  return { success: true };
};

export const approveCandidate = async (id) => {
  await delay(500);
  await checkPermission('candidate', 'approve', id);
  
  const index = candidates.findIndex(c => c.id === id);
  if (index === -1) {
    throw new ApiError(`Candidate with ID ${id} not found`, 404);
  }
  
  const candidate = candidates[index];
  
  if (candidate.status !== 'pending') {
    throw new ApiError(`This application has already been ${candidate.status}`, 400);
  }
  
  const updatedCandidate = {
    ...candidate,
    status: 'approved'
  };
  
  candidates[index] = updatedCandidate;
  return updatedCandidate;
};

export const rejectCandidate = async (id) => {
  await delay(500);
  await checkPermission('candidate', 'reject', id);
  
  const index = candidates.findIndex(c => c.id === id);
  if (index === -1) {
    throw new ApiError(`Candidate with ID ${id} not found`, 404);
  }
  
  const candidate = candidates[index];
  
  if (candidate.status !== 'pending') {
    throw new ApiError(`This application has already been ${candidate.status}`, 400);
  }
  
  const updatedCandidate = {
    ...candidate,
    status: 'rejected'
  };
  
  candidates[index] = updatedCandidate;
  return updatedCandidate;
};

// Voting endpoints
export const castVote = async (electionId, candidateId) => {
  await delay(700);
  const user = await checkPermission('election', 'vote', electionId);
  
  // Check if election exists and is active
  const election = await getElection(electionId);
  if (election.status !== 'active') {
    throw new ApiError('Voting is only allowed for active elections', 400);
  }
  
  // Check if candidate exists and is approved
  const candidate = await getCandidate(candidateId);
  if (candidate.electionId !== electionId) {
    throw new ApiError('Candidate does not belong to this election', 400);
  }
  
  if (candidate.status !== 'approved') {
    throw new ApiError('Cannot vote for a candidate that has not been approved', 400);
  }
  
  // Check if user has already voted in this election
  const existingVote = votes.find(v => 
    v.electionId === electionId && 
    v.userId === user.userId
  );
  
  if (existingVote) {
    throw new ApiError('You have already voted in this election', 400);
  }
  
  // Record the vote
  const newVote = {
    id: `vote-${Date.now()}`,
    electionId,
    candidateId,
    userId: user.userId,
    timestamp: new Date().toISOString()
  };
  
  votes.push(newVote);
  
  // Update the candidate's vote count
  const candidateIndex = candidates.findIndex(c => c.id === candidateId);
  candidates[candidateIndex].voteCount += 1;
  
  return { success: true };
};

export const hasVoted = async (electionId) => {
  await delay(300);
  const user = await getCurrentUser();
  
  if (!user) {
    return false;
  }
  
  return votes.some(v => v.electionId === electionId && v.userId === user.userId);
};

export const getUserVote = async (electionId) => {
  await delay(300);
  const user = await getCurrentUser();
  
  if (!user) {
    return null;
  }
  
  const vote = votes.find(v => v.electionId === electionId && v.userId === user.userId);
  return vote ? vote.candidateId : null;
};

// Export everything for backward compatibility
export default {
  getElections,
  getElection,
  createElection,
  updateElection,
  deleteElection,
  getElectionResults,
  getCandidates,
  getCandidate,
  createCandidate,
  updateCandidate,
  deleteCandidate,
  approveCandidate,
  rejectCandidate,
  castVote,
  hasVoted,
  getUserVote
};
