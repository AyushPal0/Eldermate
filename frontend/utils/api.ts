import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // If token exists, add to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors (token expired or invalid)
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('token');
      
      // Only redirect if we're in the browser
      if (typeof window !== 'undefined') {
        window.location.href = '/signin';
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  signup: async (userData: { name: string; email: string; password: string; role?: string }) => {
    const response = await api.post('/users/signup', userData);
    return response.data;
  },
  
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/users/login', credentials);
    
    // Save token to localStorage
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },
};

// Mood services
export const moodService = {
  createMood: async (moodData: { mood?: string; notes?: string }) => {
    const response = await api.post('/moods', moodData);
    return response.data;
  },
  
  getAllMoods: async () => {
    const response = await api.get('/moods');
    return response.data;
  },
  
  getMood: async (id: string) => {
    const response = await api.get(`/moods/${id}`);
    return response.data;
  },
  
  updateMood: async (id: string, moodData: { mood?: string; notes?: string }) => {
    const response = await api.patch(`/moods/${id}`, moodData);
    return response.data;
  },
  
  deleteMood: async (id: string) => {
    const response = await api.delete(`/moods/${id}`);
    return response.data;
  },
  
  getMoodStats: async () => {
    const response = await api.get('/moods/stats');
    return response.data;
  },
  
  getMoodTrends: async (days?: number) => {
    const response = await api.get('/moods/trends', { params: { days } });
    return response.data;
  },
};

export default api;