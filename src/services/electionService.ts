
import { databases, DB_ID, ELECTIONS_COLLECTION, CANDIDATES_COLLECTION, VOTES_COLLECTION, mapElectionFromDocument, mapCandidateFromDocument } from './appwriteService';
import { Election, Candidate } from '@/models/election';
import { ID, Query } from 'appwrite';

export const getElections = async (): Promise<Election[]> => {
  try {
    // Get all public elections
    const response = await databases.listDocuments(
      DB_ID,
      ELECTIONS_COLLECTION,
      [
        Query.equal('isPublic', true),
        Query.orderDesc('$createdAt')
      ]
    );
    
    // Map to our Election type
    return response.documents.map(mapElectionFromDocument);
  } catch (error) {
    console.error('Error fetching elections:', error);
    throw error;
  }
};

export const getElection = async (electionId: string): Promise<Election> => {
  try {
    const response = await databases.getDocument(
      DB_ID,
      ELECTIONS_COLLECTION,
      electionId
    );
    
    return mapElectionFromDocument(response);
  } catch (error) {
    console.error(`Error fetching election ${electionId}:`, error);
    throw error;
  }
};

export const createElection = async (election: Omit<Election, 'id' | 'createdAt' | 'updatedAt'>): Promise<Election> => {
  try {
    const response = await databases.createDocument(
      DB_ID,
      ELECTIONS_COLLECTION,
      ID.unique(),
      election
    );
    
    return mapElectionFromDocument(response);
  } catch (error) {
    console.error('Error creating election:', error);
    throw error;
  }
};

export const updateElection = async (electionId: string, election: Partial<Election>): Promise<Election> => {
  try {
    const response = await databases.updateDocument(
      DB_ID,
      ELECTIONS_COLLECTION,
      electionId,
      election
    );
    
    return mapElectionFromDocument(response);
  } catch (error) {
    console.error(`Error updating election ${electionId}:`, error);
    throw error;
  }
};

export const deleteElection = async (electionId: string): Promise<boolean> => {
  try {
    await databases.deleteDocument(
      DB_ID,
      ELECTIONS_COLLECTION,
      electionId
    );
    
    return true;
  } catch (error) {
    console.error(`Error deleting election ${electionId}:`, error);
    throw error;
  }
};

export const getCandidates = async (electionId: string): Promise<Candidate[]> => {
  try {
    const response = await databases.listDocuments(
      DB_ID,
      CANDIDATES_COLLECTION,
      [
        Query.equal('electionId', electionId),
        Query.equal('status', 'approved') // Only get approved candidates
      ]
    );
    
    return response.documents.map(mapCandidateFromDocument);
  } catch (error) {
    console.error(`Error fetching candidates for election ${electionId}:`, error);
    throw error;
  }
};

export const castVote = async (electionId: string, candidateId: string, userId: string): Promise<void> => {
  try {
    // First check if the user has already voted
    const hasVoted = await hasUserVoted(electionId, userId);
    
    if (hasVoted) {
      throw new Error('You have already voted in this election');
    }
    
    // Create a vote record
    await databases.createDocument(
      DB_ID,
      VOTES_COLLECTION,
      ID.unique(),
      {
        electionId,
        candidateId,
        userId,
        timestamp: new Date().toISOString()
      }
    );
    
    // Increment the candidate's vote count
    await incrementVoteCount(candidateId);
  } catch (error) {
    console.error(`Error casting vote for candidate ${candidateId}:`, error);
    throw error;
  }
};

export const hasUserVoted = async (electionId: string, userId: string): Promise<boolean> => {
  try {
    const response = await databases.listDocuments(
      DB_ID,
      VOTES_COLLECTION,
      [
        Query.equal('electionId', electionId),
        Query.equal('userId', userId)
      ]
    );
    
    return response.total > 0;
  } catch (error) {
    console.error(`Error checking if user ${userId} has voted in election ${electionId}:`, error);
    throw error;
  }
};

const incrementVoteCount = async (candidateId: string): Promise<void> => {
  try {
    // Get current candidate
    const candidate = await databases.getDocument(
      DB_ID,
      CANDIDATES_COLLECTION,
      candidateId
    );
    
    // Increment vote count
    const currentVoteCount = candidate.voteCount || 0;
    
    await databases.updateDocument(
      DB_ID,
      CANDIDATES_COLLECTION,
      candidateId,
      {
        voteCount: currentVoteCount + 1
      }
    );
  } catch (error) {
    console.error(`Error incrementing vote count for candidate ${candidateId}:`, error);
    throw error;
  }
};

export const getUserVote = async (electionId: string, userId: string): Promise<string | null> => {
  try {
    const response = await databases.listDocuments(
      DB_ID,
      VOTES_COLLECTION,
      [
        Query.equal('electionId', electionId),
        Query.equal('userId', userId)
      ]
    );
    
    if (response.total === 0) {
      return null;
    }
    
    return response.documents[0].candidateId;
  } catch (error) {
    console.error(`Error getting user ${userId} vote for election ${electionId}:`, error);
    throw error;
  }
};
