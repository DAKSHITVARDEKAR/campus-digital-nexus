import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import mockElectionApi from '../services/mockElectionApi';
import { Election, Candidate } from '../models/election';
import { useAuth } from '../contexts/AuthContext';

// Custom error class
class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiError";
  }
}

// Enhanced hook for handling API calls with auth integration
export const useElectionApi = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user, hasPermission } = useAuth();

  // Generic API call wrapper to handle loading, errors, and success messages
  const apiCall = async <T>(
    fn: () => Promise<T>,
    {
      loadingMessage = 'Loading...',
      successMessage,
      errorMessage = 'An error occurred',
      permissionCheck = { action: '', resource: '' }
    }: {
      loadingMessage?: string;
      successMessage?: string;
      errorMessage?: string;
      permissionCheck?: { action: string; resource: string; resourceId?: string };
    } = {}
  ): Promise<T | null> => {
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
  const showErrorToast = (message: string) => {
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

  const getElection = async (id: string) => {
    return apiCall(() => mockElectionApi.getElection(id));
  };

  const createElection = async (electionData: Omit<Election, 'id' | 'createdBy' | 'createdAt' | 'updatedAt'>) => {
    return apiCall(
      () => mockElectionApi.createElection(electionData),
      { 
        successMessage: 'Election created successfully',
        permissionCheck: { action: 'create', resource: 'election' }
      }
    );
  };

  const updateElection = async (id: string, electionData: Partial<Omit<Election, 'id' | 'createdBy' | 'createdAt'>>) => {
    return apiCall(
      () => mockElectionApi.updateElection(id, electionData),
      { 
        successMessage: 'Election updated successfully',
        permissionCheck: { action: 'update', resource: 'election', resourceId: id }
      }
    );
  };

  const deleteElection = async (id: string) => {
    return apiCall(
      () => mockElectionApi.deleteElection(id),
      { 
        successMessage: 'Election deleted successfully',
        permissionCheck: { action: 'delete', resource: 'election', resourceId: id }
      }
    );
  };

  const getElectionResults = async (id: string) => {
    return apiCall(() => mockElectionApi.getElectionResults(id));
  };

  // Candidates API methods - fixed to match mockElectionApi's function signatures
  const getCandidates = async (electionId: string) => {
    return apiCall(() => mockElectionApi.getCandidates(electionId));
  };

  // Fixed getCandidate to use getCandidates from mockElectionApi with filtering
  const getCandidate = async (id: string) => {
    return apiCall(async () => {
      // Extract election ID from candidate ID (assuming format: "election-id-candidate-id")
      const electionId = id.split('-')[0];
      const allCandidates = await mockElectionApi.getCandidates(electionId);
      return Array.isArray(allCandidates) ? 
        allCandidates.find(candidate => candidate.id === id) : 
        null;
    });
  };

  const createCandidate = async (candidateData: Omit<Candidate, 'id' | 'voteCount' | 'status' | 'submittedAt'>) => {
    return apiCall(
      () => mockElectionApi.createCandidate(candidateData),
      { 
        successMessage: 'Candidate application submitted successfully',
        permissionCheck: { action: 'create', resource: 'candidate' }
      }
    );
  };

  // Fixed updateCandidate to match available methods in mockElectionApi
  const updateCandidate = async (id: string, candidateData: Partial<Omit<Candidate, 'id' | 'electionId' | 'studentId' | 'voteCount' | 'status' | 'submittedAt'>>) => {
    return apiCall(
      // Fix: Properly pass id and candidateData to the method
      () => mockElectionApi.updateCandidate(id, candidateData),
      { 
        successMessage: 'Candidate application updated successfully',
        permissionCheck: { action: 'update', resource: 'candidate', resourceId: id }
      }
    );
  };

  // Fixed deleteCandidate to match available methods in mockElectionApi
  const deleteCandidate = async (id: string) => {
    return apiCall(
      () => mockElectionApi.deleteCandidate(id),
      { 
        successMessage: 'Candidate application deleted successfully',
        permissionCheck: { action: 'delete', resource: 'candidate', resourceId: id }
      }
    );
  };

  const approveCandidate = async (id: string) => {
    return apiCall(
      () => mockElectionApi.approveCandidate(id),
      { 
        successMessage: 'Candidate application approved',
        permissionCheck: { action: 'approve', resource: 'candidate', resourceId: id }
      }
    );
  };

  const rejectCandidate = async (id: string) => {
    return apiCall(
      () => mockElectionApi.rejectCandidate(id),
      { 
        successMessage: 'Candidate application rejected',
        permissionCheck: { action: 'reject', resource: 'candidate', resourceId: id }
      }
    );
  };

  // Votes API methods - fixed to match mockElectionApi's function signatures
  const castVote = async (electionId: string, candidateId: string) => {
    return apiCall(
      () => mockElectionApi.castVote(electionId, candidateId),
      { 
        successMessage: 'Your vote has been recorded successfully',
        permissionCheck: { action: 'create', resource: 'vote' }
      }
    );
  };

  // Fixed to match mockElectionApi's hasVoted function signature
  const hasVoted = async (electionId: string) => {
    return apiCall(() => mockElectionApi.hasVoted(electionId));
  };

  // Fixed to match mockElectionApi's getUserVote function signature - this is a workaround since the function doesn't exist in mockElectionApi
  const getUserVote = async (electionId: string) => {
    return apiCall(async () => {
      // Mock implementation since getUserVote doesn't exist directly
      const hasVotedResult = await mockElectionApi.hasVoted(electionId);
      if (hasVotedResult) {
        // Return a mock candidate ID if the user has voted
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
