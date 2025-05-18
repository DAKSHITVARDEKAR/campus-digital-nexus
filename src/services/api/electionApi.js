
import mockElectionApi from '../mockElectionApi';

// Elections API
export const getElections = async () => {
  try {
    return await mockElectionApi.getElections();
  } catch (error) {
    console.error('Error fetching elections:', error);
    throw error;
  }
};

export const getElection = async (id) => {
  try {
    return await mockElectionApi.getElection(id);
  } catch (error) {
    console.error(`Error fetching election ${id}:`, error);
    throw error;
  }
};

export const createElection = async (electionData) => {
  try {
    return await mockElectionApi.createElection(electionData);
  } catch (error) {
    console.error('Error creating election:', error);
    throw error;
  }
};

export const updateElection = async (id, electionData) => {
  try {
    return await mockElectionApi.updateElection(id, electionData);
  } catch (error) {
    console.error(`Error updating election ${id}:`, error);
    throw error;
  }
};

export const deleteElection = async (id) => {
  try {
    return await mockElectionApi.deleteElection(id);
  } catch (error) {
    console.error(`Error deleting election ${id}:`, error);
    throw error;
  }
};

export const getElectionResults = async (id) => {
  try {
    return await mockElectionApi.getElectionResults(id);
  } catch (error) {
    console.error(`Error fetching election results for ${id}:`, error);
    throw error;
  }
};

// Candidates API
export const getCandidates = async (electionId) => {
  try {
    return await mockElectionApi.getCandidates(electionId);
  } catch (error) {
    console.error(`Error fetching candidates for election ${electionId}:`, error);
    throw error;
  }
};

export const createCandidate = async (candidateData) => {
  try {
    return await mockElectionApi.createCandidate(candidateData);
  } catch (error) {
    console.error('Error creating candidate:', error);
    throw error;
  }
};

export const updateCandidate = async (id, candidateData) => {
  try {
    if (typeof mockElectionApi.updateCandidate === 'function') {
      return await mockElectionApi.updateCandidate(id, candidateData);
    }
    throw new Error("updateCandidate method not implemented in mockElectionApi");
  } catch (error) {
    console.error(`Error updating candidate ${id}:`, error);
    throw error;
  }
};

export const deleteCandidate = async (id) => {
  try {
    if (typeof mockElectionApi.deleteCandidate === 'function') {
      return await mockElectionApi.deleteCandidate(id);
    }
    throw new Error("deleteCandidate method not implemented in mockElectionApi");
  } catch (error) {
    console.error(`Error deleting candidate ${id}:`, error);
    throw error;
  }
};

export const approveCandidate = async (id) => {
  try {
    return await mockElectionApi.approveCandidate(id);
  } catch (error) {
    console.error(`Error approving candidate ${id}:`, error);
    throw error;
  }
};

export const rejectCandidate = async (id) => {
  try {
    return await mockElectionApi.rejectCandidate(id);
  } catch (error) {
    console.error(`Error rejecting candidate ${id}:`, error);
    throw error;
  }
};

// Votes API
export const castVote = async (electionId, candidateId) => {
  try {
    return await mockElectionApi.castVote(electionId, candidateId);
  } catch (error) {
    // If two-argument version fails, try with just electionId
    try {
      return await mockElectionApi.castVote(electionId);
    } catch (innerError) {
      console.error(`Error casting vote for election ${electionId}, candidate ${candidateId}:`, error);
      throw innerError;
    }
  }
};

export const hasVoted = async (electionId) => {
  try {
    return await mockElectionApi.hasVoted(electionId);
  } catch (error) {
    console.error(`Error checking if user has voted in election ${electionId}:`, error);
    throw error;
  }
};

export const getUserVote = async (electionId) => {
  try {
    // Check if the function exists
    if (typeof mockElectionApi.getUserVote === 'function') {
      return await mockElectionApi.getUserVote(electionId);
    }
    
    // If not, provide fallback implementation
    const hasVotedResult = await mockElectionApi.hasVoted(electionId);
    if (hasVotedResult) {
      return "candidate-mock-id";
    }
    return null;
  } catch (error) {
    console.error(`Error getting user vote for election ${electionId}:`, error);
    throw error;
  }
};
