import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create an API instance with a base URL
const api = axios.create({
  baseURL: API_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle 401 errors (e.g., redirect to login)
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication service
const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/users/login', { email, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  signup: async (name, email, password) => {
    try {
      const response = await api.post('/users/signup', { name, email, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

// Mood tracking service
const moodService = {
  submitMood: async (mood, notes) => {
    try {
      const response = await api.post('/moods', { mood, notes });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getMoodHistory: async () => {
    try {
      const response = await api.get('/moods');
      return response.data.data.moods;
    } catch (error) {
      throw error;
    }
  },

  getMoodStats: async () => {
    try {
      const response = await api.get('/moods/stats');
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  getMoodTrends: async () => {
    try {
      const response = await api.get('/moods/trends');
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
};

export { authService, moodService };
export default api;