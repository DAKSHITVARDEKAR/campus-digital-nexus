import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
// Import Appwrite services
import { account, databases, storage } from '../appwrite/config';
import { loginWithEmailAndPassword, registerWithEmailAndPassword, logoutUser, getCurrentUser } from '../appwrite/auth';
// Use Vite's way of accessing environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

import axios from 'axios';
import { ID, Query } from 'appwrite'; // Import Appwrite utilities

// Setup axios instance with auth header
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth service
export const authService = {
  login: async (username: string, password: string) => {
    try {
      // Try to login through Appwrite
      const session = await loginWithEmailAndPassword(username, password);
      
      if (session) {
        // Store session info
        localStorage.setItem('token', session.$id);
        
        // Get user data
        const user = await getCurrentUser();
        
        return {
          success: true,
          message: 'Login successful',
          data: {
            token: session.$id,
            user: {
              email: user?.email,
              name: user?.name,
              id: user?.$id
            }
          }
        };
      }
      return {
        success: false,
        message: 'Login failed. Please try again.'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Login failed. Please try again.',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },
  
  register: async (userData: any) => {
    try {
      const user = await registerWithEmailAndPassword(
        userData.email,
        userData.password,
        userData.name || userData.username
      );
      
      if (user) {
        return {
          success: true,
          message: 'Registration successful',
          data: {
            user: {
              email: user.email,
              name: user.name,
              id: user.$id
            }
          }
        };
      }
      
      return {
        success: false,
        message: 'Registration failed. Please try again.'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Registration failed. Please try again.',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },
  
  getProfile: async () => {
    try {
      const user = await getCurrentUser();
      
      if (user) {
        return {
          success: true,
          data: {
            user: {
              email: user.email,
              name: user.name,
              id: user.$id
            }
          }
        };
      }
      
      return {
        success: false,
        message: 'Failed to get profile.'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to get profile.',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },
  
  logout: async () => {
    localStorage.removeItem('token');
    await logoutUser();
  }
};

// Constants for Appwrite - using environment variables
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || 'default';
const ELECTIONS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_ELECTIONS_COLLECTION_ID || 'elections';
const CANDIDATES_COLLECTION_ID = import.meta.env.VITE_APPWRITE_CANDIDATES_COLLECTION_ID || 'candidates';
const VOTES_COLLECTION_ID = import.meta.env.VITE_APPWRITE_VOTES_COLLECTION_ID || 'votes';
const BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID || 'election_assets';

// Election service
export const electionService = {
  getElections: async () => {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        ELECTIONS_COLLECTION_ID
      );
      return {
        success: true,
        data: response.documents
      };
    } catch (error) {
      console.error('Error fetching elections:', error);
      throw error;
    }
  },
  
  getElection: async (id: string) => {
    try {
      const response = await databases.getDocument(
        DATABASE_ID,
        ELECTIONS_COLLECTION_ID,
        id
      );
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('Error fetching election:', error);
      throw error;
    }
  },
  
  createElection: async (electionData: any) => {
    try {
      const response = await databases.createDocument(
        DATABASE_ID,
        ELECTIONS_COLLECTION_ID,
        ID.unique(),
        electionData
      );
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('Error creating election:', error);
      throw error;
    }
  },
  
  updateElection: async (id: string, electionData: any) => {
    try {
      const response = await databases.updateDocument(
        DATABASE_ID,
        ELECTIONS_COLLECTION_ID,
        id,
        electionData
      );
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('Error updating election:', error);
      throw error;
    }
  },
  
  deleteElection: async (id: string) => {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        ELECTIONS_COLLECTION_ID,
        id
      );
      return {
        success: true
      };
    } catch (error) {
      console.error('Error deleting election:', error);
      throw error;
    }
  },
  
  // Candidates
  getCandidates: async (electionId: string) => {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        CANDIDATES_COLLECTION_ID,
        [
          Query.equal('electionId', electionId)
        ]
      );
      return {
        success: true,
        data: response.documents
      };
    } catch (error) {
      console.error('Error fetching candidates:', error);
      throw error;
    }
  },
  
  createCandidate: async (candidateData: any, imageFile: File) => {
    try {
      // Upload image first
      const fileId = ID.unique();
      await storage.createFile(
        BUCKET_ID,
        fileId,
        imageFile
      );
      
      // Get the image URL
      const imageUrl = storage.getFileView(BUCKET_ID, fileId);
      
      // Create candidate with image URL
      const response = await databases.createDocument(
        DATABASE_ID,
        CANDIDATES_COLLECTION_ID,
        ID.unique(),
        {
          ...candidateData,
          imageUrl: imageUrl.href
        }
      );
      
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('Error creating candidate:', error);
      throw error;
    }
  },
  
  // Votes
  vote: async (electionId: string, candidateId: string) => {
    try {
      const response = await databases.createDocument(
        DATABASE_ID,
        VOTES_COLLECTION_ID,
        ID.unique(),
        {
          electionId,
          candidateId,
          userId: account.get().$id, // Current user
          timestamp: new Date().toISOString()
        }
      );
      
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('Error voting:', error);
      throw error;
    }
  },
  
  getResults: async (electionId: string) => {
    try {
      const votes = await databases.listDocuments(
        DATABASE_ID,
        VOTES_COLLECTION_ID,
        [
          Query.equal('electionId', electionId)
        ]
      );
      
      // Get all candidates for this election
      const candidates = await databases.listDocuments(
        DATABASE_ID,
        CANDIDATES_COLLECTION_ID,
        [
          Query.equal('electionId', electionId)
        ]
      );
      
      // Count votes for each candidate
      const results = candidates.documents.map(candidate => {
        const candidateVotes = votes.documents.filter(vote => vote.candidateId === candidate.$id);
        return {
          candidate: candidate,
          voteCount: candidateVotes.length
        };
      });
      
      return {
        success: true,
        data: {
          totalVotes: votes.documents.length,
          results
        }
      };
    } catch (error) {
      console.error('Error getting results:', error);
      throw error;
    }
  }
};

export default {
  auth: authService,
  elections: electionService
};
