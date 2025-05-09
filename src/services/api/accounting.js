import api from './api';
import { 
  ENDPOINTS, 
  getTransactionHistoryEndpoint, 
  getTransactionRefundEndpoint, 
  getTransactionCancelEndpoint 
} from '../../config/api';

export const accountingService = {
  // Reports
  getDailySales: async (date = null) => {
    try {
      const params = date ? { date } : {};
      const response = await api.get(ENDPOINTS.DAILY_SALES, { params });
      return response.data;
    } catch (error) {
      console.error('Get daily sales error:', error.response?.data || error.message);
      throw error;
    }
  },

  getMonthlySales: async (year = null, month = null) => {
    try {
      const params = {};
      if (year) params.year = year;
      if (month) params.month = month;
      
      const response = await api.get(ENDPOINTS.MONTHLY_SALES, { params });
      return response.data;
    } catch (error) {
      console.error('Get monthly sales error:', error.response?.data || error.message);
      throw error;
    }
  },

  getYearlySales: async (year = null) => {
    try {
      const params = year ? { year } : {};
      const response = await api.get(ENDPOINTS.YEARLY_SALES, { params });
      return response.data;
    } catch (error) {
      console.error('Get yearly sales error:', error.response?.data || error.message);
      throw error;
    }
  },

  getProductUsageReport: async () => {
    try {
      console.log("Fetching product usage data from:", ENDPOINTS.PRODUCT_USAGE);
      const response = await api.get(ENDPOINTS.PRODUCT_USAGE);
      console.log("Product usage API response:", response.data);
      return response.data;
    } catch (error) {
      console.error('Get product usage report error:', error.response?.data || error.message);
      console.error('Full error object:', error);
      
      // Create demo data for development/testing
      const demoData = {
        start_date: new Date(Date.now() - 30*24*60*60*1000).toISOString().split('T')[0],
        end_date: new Date().toISOString().split('T')[0],
        products: [
          {
            id: 1,
            name: "Beef Steak",
            category_name: "Meat",
            total_quantity: 43,
            total_amount: 1074.57
          },
          {
            id: 2,
            name: "Wagyu A5",
            category_name: "Premium Meat",
            total_quantity: 28,
            total_amount: 2519.72
          },
          {
            id: 3,
            name: "Fresh Salmon",
            category_name: "Seafood",
            total_quantity: 31,
            total_amount: 588.69
          }
        ]
      };
      
      console.log("Using demo product usage data:", demoData);
      return demoData;
    }
  },

  getSalesByProductReport: async () => {
    try {
      const response = await api.get(ENDPOINTS.SALES_BY_PRODUCT);
      return response.data;
    } catch (error) {
      console.error('Get sales by product report error:', error.response?.data || error.message);
      throw error;
    }
  },
  
  getTopSellingProducts: async (limit = 3) => {
    try {
      const response = await api.get(ENDPOINTS.SALES_BY_PRODUCT, { params: { limit } });
      return response.data;
    } catch (error) {
      console.error('Get top selling products error:', error.response?.data || error.message);
      throw error;
    }
  },
  
  getTotalSalesAndUnitsSold: async () => {
    try {
      const response = await api.get(ENDPOINTS.SALES_SUMMARY);
      return response.data;
    } catch (error) {
      console.error('Get sales summary error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Cash Drawer Operations
  getCashDrawerOperations: async (date = null) => {
    try {
      const params = date ? { date } : {};
      const response = await api.get(ENDPOINTS.CASH_DRAWER, { params });
      return response.data;
    } catch (error) {
      console.error('Get cash drawer operations error:', error.response?.data || error.message);
      throw error;
    }
  },

  updateCashDrawerOperations: async (data) => {
    try {
      const response = await api.post(ENDPOINTS.CASH_DRAWER, data);
      return response.data;
    } catch (error) {
      console.error('Update cash drawer operations error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Transaction History Management
  getTransactions: async (filters = {}) => {
    try {
      const response = await api.get(ENDPOINTS.TRANSACTION_HISTORY, { params: filters });
      return response.data;
    } catch (error) {
      console.error('Get transactions error:', error.response?.data || error.message);
      throw error;
    }
  },

  getTransaction: async (id) => {
    try {
      const response = await api.get(getTransactionHistoryEndpoint(id));
      return response.data;
    } catch (error) {
      console.error(`Get transaction ${id} error:`, error.response?.data || error.message);
      throw error;
    }
  },

  refundTransaction: async (id, data) => {
    try {
      const response = await api.post(getTransactionRefundEndpoint(id), data);
      return response.data;
    } catch (error) {
      console.error(`Refund transaction ${id} error:`, error.response?.data || error.message);
      throw error;
    }
  },

  cancelTransaction: async (id, data) => {
    try {
      const response = await api.post(getTransactionCancelEndpoint(id), data);
      return response.data;
    } catch (error) {
      console.error(`Cancel transaction ${id} error:`, error.response?.data || error.message);
      throw error;
    }
  }
};

export default accountingService; 