import api from './api';
import { ENDPOINTS, getDiscountEndpoint } from '../../config/api';

export const customerService = {
  // Customers
  getCustomers: async () => {
    try {
      const response = await api.get('/customer/customers');
      return response.data;
    } catch (error) {
      console.error('Get customers error:', error.response?.data || error.message);
      throw error;
    }
  },

  getCustomer: async (id) => {
    try {
      const response = await api.get(`/customer/customers/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Get customer ${id} error:`, error.response?.data || error.message);
      throw error;
    }
  },

  createCustomer: async (customer) => {
    try {
      const response = await api.post('/customer/customers', customer);
      return response.data;
    } catch (error) {
      console.error('Create customer error:', error.response?.data || error.message);
      throw error;
    }
  },

  updateCustomer: async (id, customer) => {
    try {
      const response = await api.put(`/customer/customers/${id}`, customer);
      return response.data;
    } catch (error) {
      console.error(`Update customer ${id} error:`, error.response?.data || error.message);
      throw error;
    }
  },

  // Rewards
  getRewardsHistory: async (customerId) => {
    try {
      const response = await api.get(`/customer/customers/${customerId}/rewards-history`);
      return response.data;
    } catch (error) {
      console.error(`Get rewards history for customer ${customerId} error:`, error.response?.data || error.message);
      throw error;
    }
  },

  addPoints: async (customerId, points) => {
    try {
      const response = await api.post(`/customer/customers/${customerId}/add-points`, { points });
      return response.data;
    } catch (error) {
      console.error(`Add points for customer ${customerId} error:`, error.response?.data || error.message);
      throw error;
    }
  },

  redeemReward: async (customerId, rewardId) => {
    try {
      const response = await api.post(`/customer/customers/${customerId}/redeem-reward`, { reward_id: rewardId });
      return response.data;
    } catch (error) {
      console.error(`Redeem reward for customer ${customerId} error:`, error.response?.data || error.message);
      throw error;
    }
  },

  // Feedback
  submitFeedback: async (feedbackData) => {
    try {
      const response = await api.post('/customer/feedback', feedbackData);
      return response.data;
    } catch (error) {
      console.error('Submit feedback error:', error.response?.data || error.message);
      throw error;
    }
  },

  getFeedbacks: async () => {
    try {
      const response = await api.get('/customer/feedback');
      return response.data;
    } catch (error) {
      console.error('Get feedback error:', error.response?.data || error.message);
      throw error;
    }
  },
  
  // System Configuration
  getPointsExchangeRate: async () => {
    try {
      const response = await api.get('/customer/config/points-exchange-rate');
      return response.data;
    } catch (error) {
      console.error('Get points exchange rate error:', error.response?.data || error.message);
      throw error;
    }
  },
  
  updatePointsExchangeRate: async ({ php_amount, points }) => {
    try {
      const response = await api.put('/customer/config/points-exchange-rate', { 
        php_amount, 
        points 
      });
      return response.data;
    } catch (error) {
      console.error('Update points exchange rate error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Discount Methods
  getDiscounts: async () => {
    try {
      const response = await api.get(ENDPOINTS.DISCOUNTS);
      return response.data;
    } catch (error) {
      console.error('Error fetching discounts:', error.response?.data || error.message);
      throw error;
    }
  },

  getActiveDiscounts: async () => {
    try {
      const response = await api.get(ENDPOINTS.ACTIVE_DISCOUNTS);
      return response.data;
    } catch (error) {
      console.error('Error fetching active discounts:', error.response?.data || error.message);
      throw error;
    }
  },

  createDiscount: async (discountData) => {
    try {
      const response = await api.post(ENDPOINTS.DISCOUNTS, discountData);
      return response.data;
    } catch (error) {
      console.error('Error creating discount:', error.response?.data || error.message);
      throw error;
    }
  },

  updateDiscount: async (id, discountData) => {
    try {
      const response = await api.put(getDiscountEndpoint(id), discountData);
      return response.data;
    } catch (error) {
      console.error(`Error updating discount ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  deleteDiscount: async (id) => {
    try {
      const response = await api.delete(getDiscountEndpoint(id));
      return response.data;
    } catch (error) {
      console.error(`Error deleting discount ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },
};

export default customerService; 