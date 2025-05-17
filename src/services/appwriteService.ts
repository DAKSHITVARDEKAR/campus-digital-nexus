
import { Client, Account, Databases, Storage, Teams, Functions, ID, Query } from 'appwrite';
import { Election, ElectionStatus } from '@/models/election';

// Initialize Appwrite client
const client = new Client();
client
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('68166b45001f2c121a55');

// Initialize Appwrite services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const teams = new Teams(client);
export const functions = new Functions(client);

// Database and collection IDs
const DATABASE_ID = 'campusNexusDB'; // Use the one from your Appwrite console
const ELECTIONS_COLLECTION_ID = 'elections';
const CANDIDATES_COLLECTION_ID = 'candidates';
const VOTES_COLLECTION_ID = 'votes';

// Elections service
export const electionService = {
  // Get all elections
  getElections: async (): Promise<Election[]> => {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        ELECTIONS_COLLECTION_ID
      );
      
      return response.documents.map((doc) => ({
        id: doc.$id,
        title: doc.title,
        description: doc.description,
        startDate: doc.startTime,
        endDate: doc.endTime,
        status: doc.status,
        positions: doc.positions || [],
        // Add other fields as needed
      }));
    } catch (error) {
      console.error('Appwrite error: Failed to get elections', error);
      throw new Error('Failed to fetch elections');
    }
  },

  // Get election by ID
  getElection: async (id: string): Promise<Election> => {
    try {
      const election = await databases.getDocument(
        DATABASE_ID,
        ELECTIONS_COLLECTION_ID,
        id
      );
      
      return {
        id: election.$id,
        title: election.title,
        description: election.description,
        startDate: election.startTime,
        endDate: election.endTime,
        status: election.status,
        positions: election.positions || [],
        // Add other fields as needed
      };
    } catch (error) {
      console.error(`Appwrite error: Failed to get election ${id}`, error);
      throw new Error('Failed to fetch election details');
    }
  },

  // Create new election (admin only)
  createElection: async (electionData: Omit<Election, 'id'>): Promise<Election> => {
    try {
      const newElection = await databases.createDocument(
        DATABASE_ID,
        ELECTIONS_COLLECTION_ID,
        ID.unique(),
        {
          title: electionData.title,
          description: electionData.description,
          startTime: electionData.startDate,
          endTime: electionData.endDate,
          status: electionData.status || 'upcoming',
          positions: electionData.positions || [],
          createdAt: new Date().toISOString(),
        }
      );
      
      return {
        id: newElection.$id,
        title: newElection.title,
        description: newElection.description,
        startDate: newElection.startTime,
        endDate: newElection.endTime,
        status: newElection.status,
        positions: newElection.positions || [],
      };
    } catch (error) {
      console.error('Appwrite error: Failed to create election', error);
      throw new Error('Failed to create election');
    }
  },

  // Update election (admin only)
  updateElection: async (id: string, electionData: Partial<Omit<Election, 'id'>>): Promise<Election> => {
    try {
      const updateData: any = {};
      if (electionData.title) updateData.title = electionData.title;
      if (electionData.description) updateData.description = electionData.description;
      if (electionData.startDate) updateData.startTime = electionData.startDate;
      if (electionData.endDate) updateData.endTime = electionData.endDate;
      if (electionData.status) updateData.status = electionData.status;
      if (electionData.positions) updateData.positions = electionData.positions;
      
      const updatedElection = await databases.updateDocument(
        DATABASE_ID,
        ELECTIONS_COLLECTION_ID,
        id,
        updateData
      );
      
      return {
        id: updatedElection.$id,
        title: updatedElection.title,
        description: updatedElection.description,
        startDate: updatedElection.startTime,
        endDate: updatedElection.endTime,
        status: updatedElection.status,
        positions: updatedElection.positions || [],
      };
    } catch (error) {
      console.error(`Appwrite error: Failed to update election ${id}`, error);
      throw new Error('Failed to update election');
    }
  },

  // Delete election (admin only)
  deleteElection: async (id: string): Promise<boolean> => {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        ELECTIONS_COLLECTION_ID,
        id
      );
      return true;
    } catch (error) {
      console.error(`Appwrite error: Failed to delete election ${id}`, error);
      throw new Error('Failed to delete election');
    }
  },

  // Get election results
  getElectionResults: async (id: string) => {
    try {
      // First, get the election details
      const election = await databases.getDocument(
        DATABASE_ID,
        ELECTIONS_COLLECTION_ID,
        id
      );
      
      // Then, get candidates for this election
      const candidates = await databases.listDocuments(
        DATABASE_ID,
        CANDIDATES_COLLECTION_ID,
        [Query.equal('electionId', id)]
      );
      
      // For each candidate, count the votes
      const candidatesWithVotes = await Promise.all(
        candidates.documents.map(async (candidate) => {
          const votes = await databases.listDocuments(
            DATABASE_ID,
            VOTES_COLLECTION_ID,
            [Query.equal('candidateId', candidate.$id)]
          );
          
          return {
            id: candidate.$id,
            name: candidate.name,
            profileImageUrl: candidate.profileImageUrl,
            votes: votes.total,
          };
        })
      );
      
      // Sort candidates by vote count
      const sortedResults = candidatesWithVotes.sort((a, b) => b.votes - a.votes);
      
      return {
        electionTitle: election.title,
        electionDescription: election.description,
        startDate: election.startTime,
        endDate: election.endTime,
        status: election.status,
        results: sortedResults,
        totalVotes: sortedResults.reduce((sum, candidate) => sum + candidate.votes, 0),
      };
    } catch (error) {
      console.error(`Appwrite error: Failed to get election results for ${id}`, error);
      throw new Error('Failed to fetch election results');
    }
  },
  
  // Check if user has voted
  hasVoted: async (electionId: string): Promise<boolean> => {
    try {
      const userId = account.get().then(response => response.$id);
      
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      const votes = await databases.listDocuments(
        DATABASE_ID,
        VOTES_COLLECTION_ID,
        [
          Query.equal('electionId', electionId),
          Query.equal('voterId', await userId)
        ]
      );
      
      return votes.total > 0;
    } catch (error) {
      console.error(`Appwrite error: Failed to check if user has voted in election ${electionId}`, error);
      throw new Error('Failed to check voting status');
    }
  },
  
  // Cast a vote
  castVote: async (electionId: string, candidateId: string): Promise<boolean> => {
    try {
      const user = await account.get();
      
      // Create vote document
      await databases.createDocument(
        DATABASE_ID,
        VOTES_COLLECTION_ID,
        ID.unique(),
        {
          electionId,
          candidateId,
          voterId: user.$id,
          votedAt: new Date().toISOString(),
        }
      );
      
      return true;
    } catch (error) {
      console.error(`Appwrite error: Failed to cast vote in election ${electionId}`, error);
      throw new Error('Failed to cast vote');
    }
  },
  
  // Get user's vote in an election
  getUserVote: async (electionId: string) => {
    try {
      const userId = account.get().then(response => response.$id);
      
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      const votes = await databases.listDocuments(
        DATABASE_ID,
        VOTES_COLLECTION_ID,
        [
          Query.equal('electionId', electionId),
          Query.equal('voterId', await userId)
        ]
      );
      
      if (votes.total === 0) {
        return null;
      }
      
      const vote = votes.documents[0];
      const candidate = await databases.getDocument(
        DATABASE_ID,
        CANDIDATES_COLLECTION_ID,
        vote.candidateId
      );
      
      return {
        voteId: vote.$id,
        candidateId: candidate.$id,
        candidateName: candidate.name,
        votedAt: vote.votedAt,
      };
    } catch (error) {
      console.error(`Appwrite error: Failed to get user's vote in election ${electionId}`, error);
      throw new Error('Failed to retrieve vote information');
    }
  },
};

export default {
  account,
  databases,
  storage,
  functions,
  teams,
  electionService,
};
