
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import mockElectionApi from '../services/mockElectionApi';
import { useAuth } from '../contexts/AuthContext';

// Custom error class
class ApiError extends Error {
  constructor(message) {
    super(message);
    this.name = "ApiError";
  }
}

// Enhanced hook for handling API calls with auth integration
export const useElectionApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();
  const { user, hasPermission } = useAuth();

  // Generic API call wrapper to handle loading, errors, and success messages
  const apiCall = async (fn, {
    loadingMessage = 'Loading...',
    successMessage,
    errorMessage = 'An error occurred',
    permissionCheck = { action: '', resource: '' }
  } = {}) => {
    // Check permissions if specified
    if (permissionCheck.action && permissionCheck.resource) {
      if (!hasPermission(permissionCheck.action, permissionCheck.resource, permissionCheck.resourceId)) {
        const errorMsg = `Permission denied: Cannot ${permissionCheck.action} ${permissionCheck.resource}`;
        showErrorToast(errorMsg);
        setError(errorMsg);
        return null;
      }
    }
    
    setLoading(true);
    setError(null);

    try {
      const result = await fn();
      
      if (successMessage) {
        toast({
          title: "Success",
          description: successMessage,
        });
      }
      
      return result;
    } catch (err) {
      console.error('API Error:', err);
      
      let message = errorMessage;
      if (err instanceof ApiError) {
        message = err.message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      
      setError(message);
      showErrorToast(message);
      
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Helper function to show error toast
  const showErrorToast = (message) => {
    toast({
      title: "Error",
      description: message,
      variant: "destructive"
    });
  };

  // Elections API methods
  const getElections = async () => {
    return apiCall(() => mockElectionApi.getElections());
  };

  const getElection = async (id) => {
    return apiCall(() => mockElectionApi.getElection(id));
  };

  const createElection = async (electionData) => {
    return apiCall(
      () => mockElectionApi.createElection(electionData),
      { 
        successMessage: 'Election created successfully',
        permissionCheck: { action: 'create', resource: 'election' }
      }
    );
  };

  const updateElection = async (id, electionData) => {
    return apiCall(
      () => mockElectionApi.updateElection(id, electionData),
      { 
        successMessage: 'Election updated successfully',
        permissionCheck: { action: 'update', resource: 'election', resourceId: id }
      }
    );
  };

  const deleteElection = async (id) => {
    return apiCall(
      () => mockElectionApi.deleteElection(id),
      { 
        successMessage: 'Election deleted successfully',
        permissionCheck: { action: 'delete', resource: 'election', resourceId: id }
      }
    );
  };

  const getElectionResults = async (id) => {
    return apiCall(() => mockElectionApi.getElectionResults(id));
  };

  // Candidates API methods
  const getCandidates = async (electionId) => {
    return apiCall(() => mockElectionApi.getCandidates(electionId));
  };

  const getCandidate = async (id) => {
    return apiCall(async () => {
      // Extract election ID from candidate ID (assuming format: "election-id-candidate-id")
      const parts = id.split('-');
      const electionId = parts[0];
      const allCandidates = await mockElectionApi.getCandidates(electionId);
      // Make sure we handle the response correctly by accessing the candidates array
      const candidatesArray = Array.isArray(allCandidates) 
        ? allCandidates 
        : allCandidates?.candidates || [];
      return candidatesArray.find(candidate => candidate.id === id);
    });
  };

  const createCandidate = async (candidateData) => {
    return apiCall(
      () => mockElectionApi.createCandidate(candidateData),
      { 
        successMessage: 'Candidate application submitted successfully',
        permissionCheck: { action: 'create', resource: 'candidate' }
      }
    );
  };

  const updateCandidate = async (id, candidateData) => {
    return apiCall(
      () => {
        // Check if the method exists on the mockElectionApi
        if (typeof mockElectionApi.updateCandidate === 'function') {
          return mockElectionApi.updateCandidate(id, candidateData);
        }
        throw new Error("updateCandidate method not implemented");
      },
      { 
        successMessage: 'Candidate application updated successfully',
        permissionCheck: { action: 'update', resource: 'candidate', resourceId: id }
      }
    );
  };

  const deleteCandidate = async (id) => {
    return apiCall(
      () => {
        // Check if the method exists on the mockElectionApi
        if (typeof mockElectionApi.deleteCandidate === 'function') {
          return mockElectionApi.deleteCandidate(id);
        }
        throw new Error("deleteCandidate method not implemented");
      },
      { 
        successMessage: 'Candidate application deleted successfully',
        permissionCheck: { action: 'delete', resource: 'candidate', resourceId: id }
      }
    );
  };

  const approveCandidate = async (id) => {
    return apiCall(
      () => mockElectionApi.approveCandidate(id),
      { 
        successMessage: 'Candidate application approved',
        permissionCheck: { action: 'approve', resource: 'candidate', resourceId: id }
      }
    );
  };

  const rejectCandidate = async (id) => {
    return apiCall(
      () => mockElectionApi.rejectCandidate(id),
      { 
        successMessage: 'Candidate application rejected',
        permissionCheck: { action: 'reject', resource: 'candidate', resourceId: id }
      }
    );
  };

  // Votes API methods
  const castVote = async (electionId, candidateId) => {
    return apiCall(
      () => {
        // Check if castVote accepts two arguments or has proper implementation
        try {
          return mockElectionApi.castVote(electionId, candidateId);
        } catch (error) {
          // Fallback to single argument if that fails
          return mockElectionApi.castVote(electionId);
        }
      },
      { 
        successMessage: 'Your vote has been recorded successfully',
        permissionCheck: { action: 'create', resource: 'vote' }
      }
    );
  };

  const hasVoted = async (electionId) => {
    return apiCall(() => mockElectionApi.hasVoted(electionId));
  };

  const getUserVote = async (electionId) => {
    return apiCall(async () => {
      // Check if getUserVote exists in mockElectionApi
      if (typeof mockElectionApi.getUserVote === 'function') {
        return mockElectionApi.getUserVote(electionId);
      }
      
      // Fallback implementation
      const hasVotedResult = await mockElectionApi.hasVoted(electionId);
      if (hasVotedResult) {
        // This is a simple fallback that returns a mock candidate ID if the user has voted
        return "candidate-mock-id";
      }
      return null;
    });
  };

  return {
    loading,
    error,
    showErrorToast,
    // Elections
    getElections,
    getElection,
    createElection,
    updateElection,
    deleteElection,
    getElectionResults,
    // Candidates
    getCandidates,
    getCandidate,
    createCandidate,
    updateCandidate,
    deleteCandidate,
    approveCandidate,
    rejectCandidate,
    // Votes
    castVote,
    hasVoted,
    getUserVote
  };
};

export default useElectionApi;
