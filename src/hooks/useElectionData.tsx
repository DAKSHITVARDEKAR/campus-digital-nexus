
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Election, Candidate } from '@/models/election';
import * as electionService from '@/services/electionService';
import { useAppwriteAuth } from './useAppwriteAuth';

interface UseElectionDataProps {
  electionId?: string;
  fetchCandidates?: boolean;
}

export const useElectionData = ({ electionId, fetchCandidates = false }: UseElectionDataProps = {}) => {
  const [elections, setElections] = useState<Election[]>([]);
  const [election, setElection] = useState<Election | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [votedFor, setVotedFor] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAppwriteAuth();
  
  // Fetch all elections
  const fetchElections = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await electionService.getElections();
      setElections(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch elections');
      toast({
        title: 'Error',
        description: err.message || 'Failed to fetch elections',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch a single election by ID
  const fetchElection = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await electionService.getElection(id);
      setElection(data);
      
      // If fetchCandidates is true, also fetch candidates
      if (fetchCandidates) {
        fetchCandidatesForElection(id);
      }
      
      // If user is logged in, check if they've voted
      if (user) {
        checkUserVote(id, user.$id);
      }
    } catch (err: any) {
      setError(err.message || `Failed to fetch election with ID: ${id}`);
      toast({
        title: 'Error',
        description: err.message || `Failed to fetch election with ID: ${id}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch candidates for an election
  const fetchCandidatesForElection = async (id: string) => {
    try {
      const data = await electionService.getCandidates(id);
      setCandidates(data);
    } catch (err: any) {
      console.error(`Failed to fetch candidates for election ${id}:`, err);
      toast({
        title: 'Error',
        description: err.message || `Failed to fetch candidates for election ${id}`,
        variant: 'destructive',
      });
    }
  };
  
  // Check if a user has voted in an election
  const checkUserVote = async (electionId: string, userId: string) => {
    try {
      const hasVoted = await electionService.hasUserVoted(electionId, userId);
      
      if (hasVoted) {
        const userVote = await electionService.getUserVote(electionId, userId);
        setVotedFor(userVote);
      } else {
        setVotedFor(null);
      }
    } catch (err: any) {
      console.error(`Failed to check voting status for election ${electionId}:`, err);
    }
  };
  
  // Cast a vote for a candidate
  const castVote = async (candidateId: string) => {
    if (!electionId || !user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await electionService.castVote(electionId, candidateId, user.$id);
      setVotedFor(candidateId);
      
      toast({
        title: 'Vote Cast Successfully',
        description: 'Your vote has been recorded.',
        variant: 'default',
      });
      
      // Refresh candidates to update vote counts
      fetchCandidatesForElection(electionId);
    } catch (err: any) {
      setError(err.message || 'Failed to cast vote');
      toast({
        title: 'Error',
        description: err.message || 'Failed to cast vote',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch data on initial render if electionId is provided
  useEffect(() => {
    if (electionId) {
      fetchElection(electionId);
    } else {
      fetchElections();
    }
  }, [electionId]);
  
  return {
    elections,
    election,
    candidates,
    loading,
    error,
    votedFor,
    fetchElections,
    fetchElection,
    fetchCandidatesForElection,
    castVote
  };
};
