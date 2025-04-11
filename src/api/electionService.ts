
import axios from 'axios';
import { auth, db } from '../firebase/config';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

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
      // First try to login through backend to get username/password match
      const response = await apiClient.post('/auth/login', { username, password });
      
      if (response.data.success) {
        // Store token
        localStorage.setItem('token', response.data.data.token);
        
        // Also authenticate with Firebase Auth for client-side features
        // We use the email from the response instead of username
        const { email } = response.data.data.user;
        await signInWithEmailAndPassword(auth, email, password);
        
        return response.data;
      }
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          message: error.response?.data?.message || 'Login failed. Please try again.',
          error: error.response?.data?.error
        };
      }
      return {
        success: false,
        message: 'Login failed. Please try again.',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },
  
  register: async (userData: any) => {
    try {
      const response = await apiClient.post('/auth/register', userData);
      
      // If registration is successful, also authenticate with Firebase Auth
      if (response.data.success) {
        await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      }
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          message: error.response?.data?.message || 'Registration failed. Please try again.',
          error: error.response?.data?.error
        };
      }
      return {
        success: false,
        message: 'Registration failed. Please try again.',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },
  
  getProfile: async () => {
    try {
      return (await apiClient.get('/auth/profile')).data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          message: error.response?.data?.message || 'Failed to get profile.',
          error: error.response?.data?.error
        };
      }
      return {
        success: false,
        message: 'Failed to get profile.',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },
  
  logout: async () => {
    localStorage.removeItem('token');
    await signOut(auth);
  }
};

// Election service
export const electionService = {
  getElections: async () => {
    try {
      return (await apiClient.get('/elections')).data;
    } catch (error) {
      console.error('Error fetching elections:', error);
      throw error;
    }
  },
  
  getElection: async (id: string) => {
    try {
      return (await apiClient.get(`/elections/${id}`)).data;
    } catch (error) {
      console.error('Error fetching election:', error);
      throw error;
    }
  },
  
  createElection: async (electionData: any) => {
    try {
      return (await apiClient.post('/elections', electionData)).data;
    } catch (error) {
      console.error('Error creating election:', error);
      throw error;
    }
  },
  
  updateElection: async (id: string, electionData: any) => {
    try {
      return (await apiClient.put(`/elections/${id}`, electionData)).data;
    } catch (error) {
      console.error('Error updating election:', error);
      throw error;
    }
  },
  
  deleteElection: async (id: string) => {
    try {
      return (await apiClient.delete(`/elections/${id}`)).data;
    } catch (error) {
      console.error('Error deleting election:', error);
      throw error;
    }
  },
  
  getCandidates: async (electionId: string) => {
    try {
      return (await apiClient.get(`/elections/${electionId}/candidates`)).data;
    } catch (error) {
      console.error('Error fetching candidates:', error);
      throw error;
    }
  },
  
  submitCandidateApplication: async (applicationData: FormData) => {
    try {
      return (await apiClient.post('/candidates', applicationData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })).data;
    } catch (error) {
      console.error('Error submitting candidate application:', error);
      throw error;
    }
  },
  
  approveCandidate: async (id: string) => {
    try {
      return (await apiClient.patch(`/candidates/${id}/approve`)).data;
    } catch (error) {
      console.error('Error approving candidate:', error);
      throw error;
    }
  },
  
  rejectCandidate: async (id: string) => {
    try {
      return (await apiClient.patch(`/candidates/${id}/reject`)).data;
    } catch (error) {
      console.error('Error rejecting candidate:', error);
      throw error;
    }
  },
  
  castVote: async (electionId: string, candidateId: string) => {
    try {
      return (await apiClient.post('/votes', { electionId, candidateId })).data;
    } catch (error) {
      console.error('Error casting vote:', error);
      throw error;
    }
  },
  
  getElectionResults: async (electionId: string) => {
    try {
      return (await apiClient.get(`/elections/${electionId}/results`)).data;
    } catch (error) {
      console.error('Error fetching election results:', error);
      throw error;
    }
  },
  
  hasVoted: async (electionId: string) => {
    try {
      return (await apiClient.get(`/elections/${electionId}/has-voted`)).data;
    } catch (error) {
      console.error('Error checking if user has voted:', error);
      throw error;
    }
  }
};

export default {
  auth: authService,
  elections: electionService
};
