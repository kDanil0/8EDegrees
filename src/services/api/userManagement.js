import api from './api';
import { ENDPOINTS, getUserEndpoint } from '../../config/api';

export const userManagementService = {
  /**
   * Get all users
   * @returns {Promise<Array>} List of users
   */
  getAll: async () => {
    try {
      const response = await api.get(ENDPOINTS.USERS);
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Create a new user
   * @param {Object} userData - User data to create
   * @returns {Promise<Object>} Created user data
   */
  create: async (userData) => {
    try {
      const response = await api.post(ENDPOINTS.USERS, userData);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Delete a user
   * @param {number} id - User ID to delete
   * @returns {Promise<Object>} Response data
   */
  delete: async (id) => {
    try {
      const response = await api.delete(getUserEndpoint(id));
      return response.data;
    } catch (error) {
      console.error(`Error deleting user ${id}:`, error.response?.data || error.message);
      throw error;
    }
  }
};

export default userManagementService; 