import api from './api';
import { ENDPOINTS, getProductEndpoint, getCategoryEndpoint } from '../../config/api';

export const inventoryService = {
  // Products
  getProducts: async () => {
    try {
      const response = await api.get(ENDPOINTS.PRODUCTS);
      return response.data;
    } catch (error) {
      console.error('Get products error:', error.response?.data || error.message);
      throw error;
    }
  },

  getProduct: async (id) => {
    try {
      const response = await api.get(getProductEndpoint(id));
      return response.data;
    } catch (error) {
      console.error(`Get product ${id} error:`, error.response?.data || error.message);
      throw error;
    }
  },

  createProduct: async (product) => {
    try {
      const response = await api.post(ENDPOINTS.PRODUCTS, product);
      return response.data;
    } catch (error) {
      console.error('Create product error:', error.response?.data || error.message);
      throw error;
    }
  },

  updateProduct: async (id, product) => {
    try {
      const response = await api.put(getProductEndpoint(id), product);
      return response.data;
    } catch (error) {
      console.error(`Update product ${id} error:`, error.response?.data || error.message);
      throw error;
    }
  },

  deleteProduct: async (id) => {
    try {
      const response = await api.delete(getProductEndpoint(id));
      return response.data;
    } catch (error) {
      console.error(`Delete product ${id} error:`, error.response?.data || error.message);
      throw error;
    }
  },

  // Categories
  getCategories: async () => {
    try {
      const response = await api.get(ENDPOINTS.CATEGORIES);
      return response.data;
    } catch (error) {
      console.error('Get categories error:', error.response?.data || error.message);
      throw error;
    }
  },

  getCategory: async (id) => {
    try {
      const response = await api.get(getCategoryEndpoint(id));
      return response.data;
    } catch (error) {
      console.error(`Get category ${id} error:`, error.response?.data || error.message);
      throw error;
    }
  },

  createCategory: async (category) => {
    try {
      const response = await api.post(ENDPOINTS.CATEGORIES, category);
      return response.data;
    } catch (error) {
      console.error('Create category error:', error.response?.data || error.message);
      throw error;
    }
  },

  updateCategory: async (id, category) => {
    try {
      const response = await api.put(getCategoryEndpoint(id), category);
      return response.data;
    } catch (error) {
      console.error(`Update category ${id} error:`, error.response?.data || error.message);
      throw error;
    }
  },

  deleteCategory: async (id) => {
    try {
      const response = await api.delete(getCategoryEndpoint(id));
      return response.data;
    } catch (error) {
      console.error(`Delete category ${id} error:`, error.response?.data || error.message);
      throw error;
    }
  },

  // Additional inventory endpoints
  getLowStockProducts: async () => {
    try {
      const response = await api.get(ENDPOINTS.LOW_STOCK_PRODUCTS);
      return response.data;
    } catch (error) {
      console.error('Get low stock products error:', error.response?.data || error.message);
      throw error;
    }
  },

  getExpirationReport: async () => {
    try {
      const response = await api.get(ENDPOINTS.EXPIRATION_REPORT);
      return response.data;
    } catch (error) {
      console.error('Get expiration report error:', error.response?.data || error.message);
      throw error;
    }
  }
};

export default inventoryService; 