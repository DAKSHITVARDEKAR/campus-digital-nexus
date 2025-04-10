
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import mockElectionApi, { ApiError } from '../services/mockElectionApi';
import { Election, Candidate } from '../models/election';
import { getCurrentUser } from '../services/mockAuth';

// Generic hook for handling API calls
export const useElectionApi = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Generic API call wrapper to handle loading, errors, and success messages
  const apiCall = async <T>(
    fn: () => Promise<T>,
    {
      loadingMessage = 'Loading...',
      successMessage,
      errorMessage = 'An error occurred'
    }: {
      loadingMessage?: string;
      successMessage?: string;
      errorMessage?: string;
    } = {}
  ): Promise<T | null> => {
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
      toast({
        title: "Error",
        description: message,
        variant: "destructive"
      });
      
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Get current user
  const getCurrentUserApi = async () => {
    return apiCall(() => getCurrentUser());
  };

  // Elections
  const getElections = async () => {
    return apiCall(() => mockElectionApi.elections.getElections());
  };

  const getElection = async (id: string) => {
    return apiCall(() => mockElectionApi.elections.getElection(id));
  };

  const createElection = async (electionData: Omit<Election, 'id' | 'createdBy' | 'createdAt' | 'updatedAt'>) => {
    return apiCall(
      () => mockElectionApi.elections.createElection(electionData),
      { successMessage: 'Election created successfully' }
    );
  };

  const updateElection = async (id: string, electionData: Partial<Omit<Election, 'id' | 'createdBy' | 'createdAt'>>) => {
    return apiCall(
      () => mockElectionApi.elections.updateElection(id, electionData),
      { successMessage: 'Election updated successfully' }
    );
  };

  const deleteElection = async (id: string) => {
    return apiCall(
      () => mockElectionApi.elections.deleteElection(id),
      { successMessage: 'Election deleted successfully' }
    );
  };

  const getElectionResults = async (id: string) => {
    return apiCall(() => mockElectionApi.elections.getElectionResults(id));
  };

  // Candidates
  const getCandidates = async (electionId: string) => {
    return apiCall(() => mockElectionApi.candidates.getCandidates(electionId));
  };

  const getCandidate = async (id: string) => {
    return apiCall(() => mockElectionApi.candidates.getCandidate(id));
  };

  const createCandidate = async (candidateData: Omit<Candidate, 'id' | 'voteCount' | 'status' | 'submittedAt'>) => {
    return apiCall(
      () => mockElectionApi.candidates.createCandidate(candidateData),
      { successMessage: 'Candidate application submitted successfully' }
    );
  };

  const updateCandidate = async (id: string, candidateData: Partial<Omit<Candidate, 'id' | 'electionId' | 'studentId' | 'voteCount' | 'status' | 'submittedAt'>>) => {
    return apiCall(
      () => mockElectionApi.candidates.updateCandidate(id, candidateData),
      { successMessage: 'Candidate application updated successfully' }
    );
  };

  const deleteCandidate = async (id: string) => {
    return apiCall(
      () => mockElectionApi.candidates.deleteCandidate(id),
      { successMessage: 'Candidate application deleted successfully' }
    );
  };

  const approveCandidate = async (id: string) => {
    return apiCall(
      () => mockElectionApi.candidates.approveCandidate(id),
      { successMessage: 'Candidate application approved' }
    );
  };

  const rejectCandidate = async (id: string) => {
    return apiCall(
      () => mockElectionApi.candidates.rejectCandidate(id),
      { successMessage: 'Candidate application rejected' }
    );
  };

  // Votes
  const castVote = async (electionId: string, candidateId: string) => {
    return apiCall(
      () => mockElectionApi.votes.castVote(electionId, candidateId),
      { successMessage: 'Your vote has been recorded successfully' }
    );
  };

  const hasVoted = async (electionId: string) => {
    return apiCall(() => mockElectionApi.votes.hasVoted(electionId));
  };

  const getUserVote = async (electionId: string) => {
    return apiCall(() => mockElectionApi.votes.getUserVote(electionId));
  };

  return {
    loading,
    error,
    // Authentication
    getCurrentUser: getCurrentUserApi,
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
