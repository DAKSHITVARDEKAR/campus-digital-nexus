
import axios from 'axios';

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
    const response = await apiClient.post('/auth/login', { username, password });
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
    }
    return response.data;
  },
  
  register: async (userData: any) => {
    return (await apiClient.post('/auth/register', userData)).data;
  },
  
  getProfile: async () => {
    return (await apiClient.get('/auth/profile')).data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
  }
};

// Election service
export const electionService = {
  getElections: async () => {
    return (await apiClient.get('/elections')).data;
  },
  
  getElection: async (id: string) => {
    return (await apiClient.get(`/elections/${id}`)).data;
  },
  
  createElection: async (electionData: any) => {
    return (await apiClient.post('/elections', electionData)).data;
  },
  
  updateElection: async (id: string, electionData: any) => {
    return (await apiClient.put(`/elections/${id}`, electionData)).data;
  },
  
  deleteElection: async (id: string) => {
    return (await apiClient.delete(`/elections/${id}`)).data;
  },
  
  getCandidates: async (electionId: string) => {
    return (await apiClient.get(`/elections/${electionId}/candidates`)).data;
  },
  
  submitCandidateApplication: async (applicationData: FormData) => {
    return (await apiClient.post('/candidates', applicationData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })).data;
  },
  
  approveCandidate: async (id: string) => {
    return (await apiClient.patch(`/candidates/${id}/approve`)).data;
  },
  
  rejectCandidate: async (id: string) => {
    return (await apiClient.patch(`/candidates/${id}/reject`)).data;
  },
  
  castVote: async (electionId: string, candidateId: string) => {
    return (await apiClient.post('/votes', { electionId, candidateId })).data;
  },
  
  getElectionResults: async (electionId: string) => {
    return (await apiClient.get(`/elections/${electionId}/results`)).data;
  },
  
  hasVoted: async (electionId: string) => {
    return (await apiClient.get(`/elections/${electionId}/has-voted`)).data;
  }
};

export default {
  auth: authService,
  elections: electionService
};
