import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import electionService from '../api/electionService'; // Import the real service
import { Election, Candidate } from '../models/election';

// Define a type for API errors (can be refined based on actual backend responses)
class ApiError extends Error {
  status: number;
  constructor(message: string, status: number = 500) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// Enhanced hook for handling API calls with auth integration
export const useElectionApi = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Generic API call wrapper to handle loading, errors, and success messages
  const apiCall = async <T>(
    fn: () => Promise<any>, // Expecting functions from electionService which might return { success, data, message }
    {
      loadingMessage = 'Loading...',
      successMessage,
      errorMessage = 'An error occurred',
    }: {
      loadingMessage?: string;
      successMessage?: string;
      errorMessage?: string;
    } = {}
  ): Promise<T | null> => {
    setLoading(true);
    setError(null);

    try {
      // Execute the actual API call from electionService
      const response = await fn();

      // Check backend response structure (assuming { success: boolean, data?: T, message?: string })
      if (response && response.success) {
        if (successMessage) {
          toast({
            title: "Success",
            description: successMessage,
          });
        }
        // Return the actual data from the response
        return response.data as T;
      } else {
        // Handle backend-reported errors
        const message = response?.message || errorMessage;
        setError(message);
        showErrorToast(message);
        return null;
      }
    } catch (err) {
      console.error('API Error:', err);

      let message = errorMessage;
      // Attempt to parse Axios error structure if available
      if (err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data) {
         message = (err.response.data as { message: string }).message || message;
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

  // --- Elections API methods ---
  const getElections = async () => {
    // Pass the actual service function to apiCall
    return apiCall<Election[]>(() => electionService.elections.getElections());
  };

  const getElection = async (id: string) => {
    return apiCall<Election>(() => electionService.elections.getElection(id));
  };

  const createElection = async (electionData: Omit<Election, 'id' | 'createdBy' | 'createdAt' | 'updatedAt'>) => {
    return apiCall<Election>(
      () => electionService.elections.createElection(electionData),
      { successMessage: 'Election created successfully' }
    );
  };

  const updateElection = async (id: string, electionData: Partial<Omit<Election, 'id' | 'createdBy' | 'createdAt'>>) => {
    return apiCall<Election>(
      () => electionService.elections.updateElection(id, electionData),
      { successMessage: 'Election updated successfully' }
    );
  };

  const deleteElection = async (id: string) => {
    return apiCall<void>(
      () => electionService.elections.deleteElection(id),
      { successMessage: 'Election deleted successfully' }
    );
  };

  const getElectionResults = async (id: string) => {
    // Assuming backend returns { candidates: Candidate[], totalVotes: number } within the 'data' field
    return apiCall<{ candidates: Candidate[], totalVotes: number }>(() => electionService.elections.getElectionResults(id));
  };

  // --- Candidates API methods ---
  const getCandidates = async (electionId: string) => {
    return apiCall<Candidate[]>(() => electionService.elections.getCandidates(electionId));
  };

  // submitCandidateApplication expects FormData
  const submitCandidateApplication = async (applicationData: FormData) => {
    return apiCall<Candidate>(
      () => electionService.elections.submitCandidateApplication(applicationData),
      { successMessage: 'Candidate application submitted successfully' }
    );
  };

  const approveCandidate = async (id: string) => {
    return apiCall<void>(
      () => electionService.elections.approveCandidate(id),
      { successMessage: 'Candidate application approved' }
    );
  };

  const rejectCandidate = async (id: string) => {
    return apiCall<void>(
      () => electionService.elections.rejectCandidate(id),
      { successMessage: 'Candidate application rejected' }
    );
  };

  // --- Votes API methods ---
  const castVote = async (electionId: string, candidateId: string) => {
    return apiCall<void>(
      () => electionService.elections.castVote(electionId, candidateId),
      { successMessage: 'Your vote has been recorded successfully' }
    );
  };

  const hasVoted = async (electionId: string) => {
    const result = await apiCall<{ hasVoted: boolean }>(() => electionService.elections.hasVoted(electionId));
    return result?.hasVoted ?? false;
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
    submitCandidateApplication,
    approveCandidate,
    rejectCandidate,
    // Votes
    castVote,
    hasVoted,
  };
};

export default useElectionApi;
