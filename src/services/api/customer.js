import api from './api';

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
  }
};

export default customerService; 