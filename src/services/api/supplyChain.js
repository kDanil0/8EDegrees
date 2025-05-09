import api from './api';
import { ENDPOINTS, getSupplierEndpoint, getPurchaseOrderEndpoint } from '../../config/api';

export const supplyChainService = {
  // Suppliers
  getSuppliers: async () => {
    try {
      const response = await api.get(ENDPOINTS.SUPPLIERS);
      return response.data;
    } catch (error) {
      console.error('Get suppliers error:', error.response?.data || error.message);
      throw error;
    }
  },

  getSupplier: async (id) => {
    try {
      const response = await api.get(getSupplierEndpoint(id));
      return response.data;
    } catch (error) {
      console.error(`Get supplier ${id} error:`, error.response?.data || error.message);
      throw error;
    }
  },

  createSupplier: async (supplierData) => {
    try {
      const response = await api.post(ENDPOINTS.SUPPLIERS, supplierData);
      return response.data;
    } catch (error) {
      console.error('Create supplier error:', error.response?.data || error.message);
      throw error;
    }
  },

  updateSupplier: async (id, supplierData) => {
    try {
      const response = await api.put(getSupplierEndpoint(id), supplierData);
      return response.data;
    } catch (error) {
      console.error(`Update supplier ${id} error:`, error.response?.data || error.message);
      throw error;
    }
  },

  deleteSupplier: async (id) => {
    try {
      const response = await api.delete(getSupplierEndpoint(id));
      return response.data;
    } catch (error) {
      console.error(`Delete supplier ${id} error:`, error.response?.data || error.message);
      throw error;
    }
  },

  // Purchase Orders
  getPurchaseOrders: async () => {
    try {
      const response = await api.get(ENDPOINTS.PURCHASE_ORDERS);
      return response.data;
    } catch (error) {
      console.error('Get purchase orders error:', error.response?.data || error.message);
      throw error;
    }
  },

  getPurchaseOrder: async (id) => {
    try {
      const response = await api.get(getPurchaseOrderEndpoint(id));
      return response.data;
    } catch (error) {
      console.error(`Get purchase order ${id} error:`, error.response?.data || error.message);
      throw error;
    }
  },

  createPurchaseOrder: async (purchaseOrder) => {
    try {
      const response = await api.post(ENDPOINTS.PURCHASE_ORDERS, purchaseOrder);
      return response.data;
    } catch (error) {
      console.error('Create purchase order error:', error.response?.data || error.message);
      throw error;
    }
  },

  updatePurchaseOrder: async (id, data) => {
    try {
      const response = await api.put(getPurchaseOrderEndpoint(id), data);
      return response.data;
    } catch (error) {
      console.error(`Update purchase order ${id} error:`, error.response?.data || error.message);
      throw error;
    }
  },

  receivePurchaseOrder: async (id, receivedItems) => {
    try {
      const response = await api.post(`${getPurchaseOrderEndpoint(id)}/receive`, { items: receivedItems });
      return response.data;
    } catch (error) {
      console.error(`Receive purchase order ${id} error:`, error.response?.data || error.message);
      throw error;
    }
  },

  recordDiscrepancies: async (id, discrepancyItems) => {
    try {
      const response = await api.post(`${getPurchaseOrderEndpoint(id)}/discrepancies`, { items: discrepancyItems });
      return response.data;
    } catch (error) {
      console.error(`Record discrepancies for purchase order ${id} error:`, error.response?.data || error.message);
      throw error;
    }
  },

  getDeliveryHistory: async () => {
    try {
      const response = await api.get(ENDPOINTS.DELIVERY_HISTORY);
      return response.data;
    } catch (error) {
      console.error('Get delivery history error:', error.response?.data || error.message);
      throw error;
    }
  }
};

export default supplyChainService; 