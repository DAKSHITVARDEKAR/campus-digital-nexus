
import { Client, Account, Databases, Storage, Teams, ID, Models, Query } from 'appwrite';
import { Election, ElectionStatus } from '../models/election';

// Initialize Appwrite Client
const client = new Client();

// Set Appwrite endpoint and project ID
client
  .setEndpoint('https://fra.cloud.appwrite.io/v1')
  .setProject('68166b45001f2c121a55');

// Initialize Appwrite services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const teams = new Teams(client);

// Database constants
const DATABASE_ID = 'campusNexusDB';
const ELECTIONS_COLLECTION_ID = 'elections';
const CANDIDATES_COLLECTION_ID = 'candidates';
const VOTES_COLLECTION_ID = 'votes';

// Helper function to map Appwrite document to our Election type
const mapToElection = (doc: any): Election => ({
  id: doc.$id,
  title: doc.title,
  description: doc.description,
  startDate: doc.startDate,
  endDate: doc.endDate,
  status: doc.status as ElectionStatus,
  isPublic: doc.isPublic || true,
  createdBy: doc.createdBy || '',
  createdAt: doc.createdAt || new Date().toISOString(),
  updatedAt: doc.updatedAt || new Date().toISOString(),
  positions: doc.positions || []
});

// Elections API
export const electionApi = {
  // Get all elections
  async getElections(): Promise<Election[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        ELECTIONS_COLLECTION_ID
      );
      
      return response.documents.map(doc => mapToElection(doc));
    } catch (error) {
      console.error('Error fetching elections:', error);
      throw error;
    }
  },

  // Get a single election by ID
  async getElection(id: string): Promise<Election> {
    try {
      const doc = await databases.getDocument(
        DATABASE_ID,
        ELECTIONS_COLLECTION_ID,
        id
      );
      
      return mapToElection(doc);
    } catch (error) {
      console.error(`Error fetching election with ID ${id}:`, error);
      throw error;
    }
  },

  // Create a new election
  async createElection(electionData: Omit<Election, 'id' | 'createdAt' | 'updatedAt'>): Promise<Election> {
    try {
      const now = new Date().toISOString();
      const newElection = await databases.createDocument(
        DATABASE_ID,
        ELECTIONS_COLLECTION_ID,
        ID.unique(),
        {
          ...electionData,
          createdAt: now,
          updatedAt: now
        }
      );
      
      return mapToElection(newElection);
    } catch (error) {
      console.error('Error creating election:', error);
      throw error;
    }
  },

  // Update an existing election
  async updateElection(id: string, electionData: Partial<Omit<Election, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Election> {
    try {
      const updatedElection = await databases.updateDocument(
        DATABASE_ID,
        ELECTIONS_COLLECTION_ID,
        id,
        {
          ...electionData,
          updatedAt: new Date().toISOString()
        }
      );
      
      return mapToElection(updatedElection);
    } catch (error) {
      console.error(`Error updating election with ID ${id}:`, error);
      throw error;
    }
  },

  // Delete an election
  async deleteElection(id: string): Promise<void> {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        ELECTIONS_COLLECTION_ID,
        id
      );
    } catch (error) {
      console.error(`Error deleting election with ID ${id}:`, error);
      throw error;
    }
  },

  // Get candidates for an election
  async getCandidates(electionId: string): Promise<any[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        CANDIDATES_COLLECTION_ID,
        [
          Query.equal('electionId', electionId)
        ]
      );
      
      return response.documents;
    } catch (error) {
      console.error(`Error fetching candidates for election ${electionId}:`, error);
      throw error;
    }
  },

  // Cast a vote
  async castVote(electionId: string, candidateId: string, voterId: string): Promise<void> {
    try {
      await databases.createDocument(
        DATABASE_ID,
        VOTES_COLLECTION_ID,
        ID.unique(),
        {
          electionId,
          candidateId,
          voterId,
          votedAt: new Date().toISOString()
        }
      );
    } catch (error) {
      console.error('Error casting vote:', error);
      throw error;
    }
  },

  // Check if a user has voted in an election
  async hasVoted(electionId: string, voterId: string): Promise<boolean> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        VOTES_COLLECTION_ID,
        [
          Query.equal('electionId', electionId),
          Query.equal('voterId', voterId),
          Query.limit(1)
        ]
      );
      
      return response.total > 0;
    } catch (error) {
      console.error(`Error checking if user ${voterId} has voted in election ${electionId}:`, error);
      throw error;
    }
  },

  // Get election results
  async getElectionResults(electionId: string): Promise<any> {
    try {
      const candidates = await this.getCandidates(electionId);
      
      // For each candidate, count the votes
      const candidateResults = await Promise.all(
        candidates.map(async (candidate) => {
          const voteResponse = await databases.listDocuments(
            DATABASE_ID,
            VOTES_COLLECTION_ID,
            [
              Query.equal('electionId', electionId),
              Query.equal('candidateId', candidate.$id)
            ]
          );
          
          return {
            candidateId: candidate.$id,
            name: candidate.name,
            profileImageUrl: candidate.profileImageUrl,
            voteCount: voteResponse.total
          };
        })
      );
      
      return {
        electionId,
        results: candidateResults
      };
    } catch (error) {
      console.error(`Error getting results for election ${electionId}:`, error);
      throw error;
    }
  }
};

// Export default
export default {
  account,
  databases,
  storage,
  teams,
  electionApi
};
