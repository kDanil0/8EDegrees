import api from './api';

export const posService = {
  // Transactions
  getTransactions: async () => {
    try {
      const response = await api.get('/pos/transactions');
      return response.data;
    } catch (error) {
      console.error('Get transactions error:', error.response?.data || error.message);
      throw error;
    }
  },

  getTransaction: async (id) => {
    try {
      const response = await api.get(`/pos/transactions/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Get transaction ${id} error:`, error.response?.data || error.message);
      throw error;
    }
  },

  processTransaction: async (transaction) => {
    try {
      const response = await api.post('/pos/transactions/process', transaction);
      return response.data;
    } catch (error) {
      console.error('Process transaction error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Customer management for POS
  findOrCreateCustomer: async (customerData) => {
    try {
      const response = await api.post('/customer/customers/find-or-create', customerData);
      return response.data;
    } catch (error) {
      console.error('Find or create customer error:', error.response?.data || error.message);
      throw error;
    }
  },

  getCustomerByPhone: async (phoneNumber) => {
    try {
      const response = await api.get(`/customer/customers/search?phone=${phoneNumber}`);
      return response.data;
    } catch (error) {
      // If it's a 404, don't treat it as an error, just return null
      if (error.response && error.response.status === 404) {
        console.log(`Customer with phone ${phoneNumber} not found`);
        return null;
      }
      console.error(`Get customer by phone ${phoneNumber} error:`, error.response?.data || error.message);
      throw error;
    }
  },

  // Products by category for POS
  getProductsByCategory: async (categoryId) => {
    try {
      const response = await api.get(`/inventory/categories/${categoryId}/products`);
      return response.data;
    } catch (error) {
      console.error(`Get products by category ${categoryId} error:`, error.response?.data || error.message);
      throw error;
    }
  },

  // Reward management
  getAvailableRewards: async (customerId) => {
    try {
      const response = await api.get(`/customer/customers/${customerId}/available-rewards`);
      return response.data;
    } catch (error) {
      console.error(`Get available rewards for customer ${customerId} error:`, error.response?.data || error.message);
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
};

export default posService; 