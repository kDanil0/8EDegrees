import axios from 'axios';
import { API_BASE_URL } from '../../config/api';

// Log the API base URL configuration
console.log('API Base URL:', API_BASE_URL);

// Create axios instance with base URL
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`, // Add the '/api' prefix here
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false
});

// Request interceptor for adding auth token and logging
api.interceptors.request.use(
  (config) => {
    // Add auth token from localStorage if available
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    
    console.log('API Request to:', config.url);
    console.log('Request headers:', JSON.stringify(config.headers));
    
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => {
    console.log('Response from:', response.config.url, 'Status:', response.status);
    return response;
  },
  (error) => {
    // For debugging issues
    console.error('API Error:', error);
    
    // Handle auth errors
    if (error.response && error.response.status === 401) {
      console.log('Unauthorized request. Redirecting to login...');
      // Could redirect to login or dispatch an event
    }
    
    return Promise.reject(error);
  }
);

export default api; 