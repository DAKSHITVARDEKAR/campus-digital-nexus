
import { Vote } from '../models/election';

// Mock data for elections
const mockElections = [
  {
    id: '1',
    title: 'Student Council Elections 2023',
    description: 'Annual student council election for the 2023-2024 academic year.',
    startDate: '2023-10-01',
    endDate: '2023-10-07',
    status: 'upcoming',
    positions: ['President', 'Vice President', 'Secretary', 'Treasurer'],
    isPublic: true,
    createdBy: 'admin123',
    createdAt: '2023-09-01',
    updatedAt: '2023-09-01'
  },
  {
    id: '2',
    title: 'Department Representative Elections',
    description: 'Election for departmental representatives for the student council.',
    startDate: '2023-09-15',
    endDate: '2023-09-20',
    status: 'completed',
    positions: ['Computer Science Rep', 'Engineering Rep', 'Business Rep', 'Arts Rep'],
    isPublic: true,
    createdBy: 'admin123',
    createdAt: '2023-08-15',
    updatedAt: '2023-08-15'
  },
  {
    id: '3',
    title: 'Club Leadership Elections',
    description: 'Elections for various club leadership positions.',
    startDate: '2023-11-01',
    endDate: '2023-11-10',
    status: 'active',
    positions: ['Debate Club President', 'Sports Club Captain', 'Arts Club Lead', 'Tech Club Head'],
    isPublic: false,
    createdBy: 'admin456',
    createdAt: '2023-10-15',
    updatedAt: '2023-10-15'
  }
];

// Mock data for candidates
const mockCandidates = [
  {
    id: '101',
    electionId: '1',
    studentName: 'John Doe',
    studentId: 'S12345',
    position: 'President',
    manifesto: 'I promise to bring positive changes to our campus life and improve facilities.',
    imageUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
    department: 'Computer Science',
    year: '3',
    status: 'approved',
    voteCount: 0,
    submittedAt: '2023-09-15T10:30:00Z'
  },
  {
    id: '102',
    electionId: '1',
    studentName: 'Jane Smith',
    studentId: 'S12346',
    position: 'President',
    manifesto: 'I will work to make our college more inclusive and environmentally friendly.',
    imageUrl: 'https://randomuser.me/api/portraits/women/1.jpg',
    department: 'Environmental Science',
    year: '2',
    status: 'approved',
    voteCount: 0,
    submittedAt: '2023-09-16T09:15:00Z'
  },
  {
    id: '103',
    electionId: '1',
    studentName: 'Michael Johnson',
    studentId: 'S12347',
    position: 'Vice President',
    manifesto: 'My focus will be on improving academic resources and student support services.',
    imageUrl: 'https://randomuser.me/api/portraits/men/2.jpg',
    department: 'Business',
    year: '3',
    status: 'approved',
    voteCount: 0,
    submittedAt: '2023-09-14T14:45:00Z'
  },
  {
    id: '104',
    electionId: '1',
    studentName: 'Emily Davis',
    studentId: 'S12348',
    position: 'Vice President',
    manifesto: 'I will advocate for better mental health services and academic support.',
    imageUrl: 'https://randomuser.me/api/portraits/women/2.jpg',
    department: 'Psychology',
    year: '4',
    status: 'approved',
    voteCount: 0,
    submittedAt: '2023-09-13T11:30:00Z'
  },
  {
    id: '105',
    electionId: '1',
    studentName: 'Robert Wilson',
    studentId: 'S12349',
    position: 'Secretary',
    manifesto: 'I promise transparent communication and efficient organization.',
    imageUrl: 'https://randomuser.me/api/portraits/men/3.jpg',
    department: 'Communications',
    year: '2',
    status: 'approved',
    voteCount: 0,
    submittedAt: '2023-09-12T16:20:00Z'
  },
  {
    id: '106',
    electionId: '1',
    studentName: 'Sarah Brown',
    studentId: 'S12350',
    position: 'Treasurer',
    manifesto: 'I will ensure responsible budget allocation and financial transparency.',
    imageUrl: 'https://randomuser.me/api/portraits/women/3.jpg',
    department: 'Finance',
    year: '3',
    status: 'approved',
    voteCount: 0,
    submittedAt: '2023-09-11T10:00:00Z'
  }
];

// Mock votes data
const mockVotes = [
  {
    id: '1001',
    electionId: '1',
    candidateId: '101',
    userId: 'user123',
    timestamp: '2023-10-01T09:15:30Z'
  },
  {
    id: '1002',
    electionId: '1',
    candidateId: '102',
    userId: 'user124',
    timestamp: '2023-10-01T10:20:45Z'
  },
  {
    id: '1003',
    electionId: '1',
    candidateId: '101',
    userId: 'user125',
    timestamp: '2023-10-01T11:05:15Z'
  }
];

// Mock API functions
export const mockElectionApi = {
  // Get all elections
  getElections: () => {
    return Promise.resolve({
      total: mockElections.length,
      elections: mockElections
    });
  },

  // Get a specific election by ID
  getElection: (id: string) => {
    const election = mockElections.find(e => e.id === id);
    if (!election) {
      return Promise.reject(new Error('Election not found'));
    }
    return Promise.resolve(election);
  },

  // Create a new election
  createElection: (electionData: any) => {
    const newElection = {
      id: `${mockElections.length + 1}`,
      ...electionData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockElections.push(newElection);
    return Promise.resolve(newElection);
  },

  // Update an election
  updateElection: (id: string, electionData: any) => {
    const index = mockElections.findIndex(e => e.id === id);
    if (index === -1) {
      return Promise.reject(new Error('Election not found'));
    }
    mockElections[index] = {
      ...mockElections[index],
      ...electionData,
      updatedAt: new Date().toISOString()
    };
    return Promise.resolve(mockElections[index]);
  },

  // Delete an election
  deleteElection: (id: string) => {
    const index = mockElections.findIndex(e => e.id === id);
    if (index === -1) {
      return Promise.reject(new Error('Election not found'));
    }
    const deletedElection = mockElections.splice(index, 1)[0];
    return Promise.resolve(deletedElection);
  },

  // Get candidates for a specific election
  getCandidates: (electionId: string) => {
    const candidates = mockCandidates.filter(c => c.electionId === electionId);
    return Promise.resolve({
      total: candidates.length,
      candidates
    });
  },

  // Create a new candidate
  createCandidate: (candidateData: any) => {
    const newCandidate = {
      id: `${mockCandidates.length + 1}`,
      ...candidateData,
      status: 'pending',
      voteCount: 0,
      submittedAt: new Date().toISOString()
    };
    mockCandidates.push(newCandidate);
    return Promise.resolve(newCandidate);
  },

  // Approve a candidate
  approveCandidate: (id: string) => {
    const index = mockCandidates.findIndex(c => c.id === id);
    if (index === -1) {
      return Promise.reject(new Error('Candidate not found'));
    }
    mockCandidates[index].status = 'approved';
    return Promise.resolve(mockCandidates[index]);
  },

  // Reject a candidate
  rejectCandidate: (id: string) => {
    const index = mockCandidates.findIndex(c => c.id === id);
    if (index === -1) {
      return Promise.reject(new Error('Candidate not found'));
    }
    mockCandidates[index].status = 'rejected';
    return Promise.resolve(mockCandidates[index]);
  },

  // Cast a vote
  castVote: (voteData: { electionId: string, candidateId: string, userId: string }) => {
    // Check if election exists
    const election = mockElections.find(e => e.id === voteData.electionId);
    if (!election) {
      return Promise.reject(new Error('Election not found'));
    }
    
    // Check if election is active
    if (election.status !== 'active') {
      return Promise.reject(new Error('Election is not currently active'));
    }
    
    // Check if candidate exists and is approved
    const candidate = mockCandidates.find(c => 
      c.id === voteData.candidateId && 
      c.electionId === voteData.electionId &&
      c.status === 'approved'
    );
    if (!candidate) {
      return Promise.reject(new Error('Candidate not found or not approved'));
    }
    
    // Check if user already voted in this election
    const existingVote = mockVotes.find(v => 
      v.electionId === voteData.electionId && 
      v.userId === voteData.userId
    );
    if (existingVote) {
      return Promise.reject(new Error('User already voted in this election'));
    }
    
    // Create new vote
    const newVote: Vote = {
      id: `${mockVotes.length + 1}`,
      electionId: voteData.electionId,
      candidateId: voteData.candidateId,
      userId: voteData.userId,
      timestamp: new Date().toISOString()
    };
    mockVotes.push(newVote);
    
    // Increment candidate vote count
    const candidateIndex = mockCandidates.findIndex(c => c.id === voteData.candidateId);
    mockCandidates[candidateIndex].voteCount += 1;
    
    return Promise.resolve(newVote);
  },

  // Get election results
  getElectionResults: (electionId: string) => {
    // Check if election exists
    const election = mockElections.find(e => e.id === electionId);
    if (!election) {
      return Promise.reject(new Error('Election not found'));
    }
    
    // Get all candidates for this election
    const candidates = mockCandidates.filter(c => 
      c.electionId === electionId && 
      c.status === 'approved'
    );
    
    // Get votes per candidate
    const candidateResults = candidates.map(candidate => {
      const votes = mockVotes.filter(v => v.candidateId === candidate.id);
      return {
        id: candidate.id,
        name: candidate.studentName,
        position: candidate.position,
        voteCount: votes.length,
        imageUrl: candidate.imageUrl
      };
    });
    
    // Group results by position
    const resultsByPosition = {};
    candidateResults.forEach(result => {
      if (!resultsByPosition[result.position]) {
        resultsByPosition[result.position] = [];
      }
      resultsByPosition[result.position].push(result);
    });
    
    // Sort candidates by vote count within each position
    Object.keys(resultsByPosition).forEach(position => {
      resultsByPosition[position].sort((a, b) => b.voteCount - a.voteCount);
    });
    
    return Promise.resolve({
      electionId,
      title: election.title,
      status: election.status,
      positions: Object.keys(resultsByPosition),
      resultsByPosition,
      totalVotes: mockVotes.filter(v => v.electionId === electionId).length
    });
  },

  // Check if user has voted in a specific election
  hasVoted: (electionId: string, userId: string) => {
    const vote = mockVotes.find(v => 
      v.electionId === electionId && 
      v.userId === userId
    );
    return Promise.resolve(!!vote);
  }
};

export default mockElectionApi;
