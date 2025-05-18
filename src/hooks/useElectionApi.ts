
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

  // Candidates API methods
  const getCandidates = async (electionId: string) => {
    return apiCall(() => mockElectionApi.getCandidates(electionId));
  };

  const getCandidate = async (id: string) => {
    return apiCall(async () => {
      // Extract election ID from candidate ID (assuming format: "election-id-candidate-id")
      const parts = id.split('-');
      const electionId = parts[0];
      const allCandidates = await mockElectionApi.getCandidates(electionId);
      // Make sure we handle the response correctly by accessing the candidates array
      // if it returns an object with a candidates property
      const candidatesArray = Array.isArray(allCandidates) 
        ? allCandidates 
        : allCandidates?.candidates || [];
      return candidatesArray.find(candidate => candidate.id === id);
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

  const updateCandidate = async (id: string, candidateData: Partial<Omit<Candidate, 'id' | 'electionId' | 'studentId' | 'voteCount' | 'status' | 'submittedAt'>>) => {
    return apiCall(
      () => mockElectionApi.updateCandidate(id, candidateData),
      { 
        successMessage: 'Candidate application updated successfully',
        permissionCheck: { action: 'update', resource: 'candidate', resourceId: id }
      }
    );
  };

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

  // Votes API methods
  const castVote = async (electionId: string, candidateId: string) => {
    return apiCall(
      () => mockElectionApi.castVote(electionId, candidateId),
      { 
        successMessage: 'Your vote has been recorded successfully',
        permissionCheck: { action: 'create', resource: 'vote' }
      }
    );
  };

  const hasVoted = async (electionId: string) => {
    return apiCall(() => mockElectionApi.hasVoted(electionId));
  };

  const getUserVote = async (electionId: string) => {
    return apiCall(async () => {
      // Since getUserVote may not exist directly in the API, we need a fallback
      // We'll check if the user has voted and if so, return a mock value
      const hasVotedResult = await mockElectionApi.hasVoted(electionId);
      if (hasVotedResult) {
        // We'll use a different approach since getUserVote doesn't exist
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
