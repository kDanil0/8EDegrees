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

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log('API Request to:', config.url);
    
    // Log request details for debugging
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
    
    return Promise.reject(error);
  }
);

export default api; 