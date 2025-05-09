/**
 * API configuration
 * This file centralizes API configuration to avoid hardcoding URLs in components
 */

// In Vite, environment variables are accessed through import.meta.env
// For Create React App, they're accessed through process.env
// This handles both cases for compatibility
const getEnv = (key, defaultValue = '') => {
  if (import.meta && import.meta.env) {
    return import.meta.env[key] || defaultValue;
  }
  return process.env[key] || defaultValue;
};

// Base API URL from environment variables
export const API_BASE_URL = 'http://127.0.0.1:8000';

// API Endpoints
export const ENDPOINTS = {
  // Inventory
  PRODUCTS: `${API_BASE_URL}/api/inventory/products`,
  CATEGORIES: `${API_BASE_URL}/api/inventory/categories`,
  LOW_STOCK_PRODUCTS: `${API_BASE_URL}/api/inventory/products/low-stock`,
  EXPIRATION_REPORT: `${API_BASE_URL}/api/inventory/products/expiration-report`,
  
  // Supply Chain
  SUPPLIERS: `${API_BASE_URL}/api/supply-chain/suppliers`,
  PURCHASE_ORDERS: `${API_BASE_URL}/api/supply-chain/purchase-orders`,
  DELIVERY_HISTORY: `${API_BASE_URL}/api/supply-chain/purchase-orders/delivery-history`,
  
  // Auth
  LOGIN: `${API_BASE_URL}/api/login`,
  REGISTER: `${API_BASE_URL}/api/register`,
  
  // User
  USER_PROFILE: `${API_BASE_URL}/api/user`,

  // POS
  TRANSACTIONS: `${API_BASE_URL}/api/pos/transactions`,
  PROCESS_TRANSACTION: `${API_BASE_URL}/api/pos/transactions/process`,
  
  // Customer
  CUSTOMERS: `${API_BASE_URL}/api/customer/customers`,
  FIND_OR_CREATE_CUSTOMER: `${API_BASE_URL}/api/customer/customers/find-or-create`,
  SEARCH_CUSTOMER: `${API_BASE_URL}/api/customer/customers/search`,
  REWARDS: `${API_BASE_URL}/api/customer/rewards`,
  REWARDS_ACTIVE: `${API_BASE_URL}/api/customer/rewards-active`,
  DISCOUNTS: `${API_BASE_URL}/api/customer/discounts`,
  ACTIVE_DISCOUNTS: `${API_BASE_URL}/api/customer/discounts-active`,
  
  // Accounting Reports
  DAILY_SALES: `${API_BASE_URL}/api/accounting/reports/sales/daily`,
  MONTHLY_SALES: `${API_BASE_URL}/api/accounting/reports/sales/monthly`,
  YEARLY_SALES: `${API_BASE_URL}/api/accounting/reports/sales/yearly`,
  PRODUCT_USAGE: `${API_BASE_URL}/api/accounting/reports/product-usage`,
  SALES_BY_PRODUCT: `${API_BASE_URL}/api/accounting/reports/sales-by-product`,
  SALES_SUMMARY: `${API_BASE_URL}/api/accounting/reports/sales/summary`,
  CASH_DRAWER: `${API_BASE_URL}/api/accounting/cash-drawer`,
  TRANSACTION_HISTORY: `${API_BASE_URL}/api/accounting/transactions`,
};

// Helper function to get product endpoint with ID
export const getProductEndpoint = (id) => `${ENDPOINTS.PRODUCTS}/${id}`;

// Helper function to get category endpoint with ID
export const getCategoryEndpoint = (id) => `${ENDPOINTS.CATEGORIES}/${id}`;

// Helper function to get supplier endpoint with ID
export const getSupplierEndpoint = (id) => `${ENDPOINTS.SUPPLIERS}/${id}`;

// Helper function to get purchase order endpoint with ID
export const getPurchaseOrderEndpoint = (id) => `${ENDPOINTS.PURCHASE_ORDERS}/${id}`;

// Helper function to get purchase order receive endpoint
export const getPurchaseOrderReceiveEndpoint = (id) => `${getPurchaseOrderEndpoint(id)}/receive`;

// Helper function to get purchase order discrepancies endpoint
export const getPurchaseOrderDiscrepanciesEndpoint = (id) => `${getPurchaseOrderEndpoint(id)}/discrepancies`;

// Helper function to get transaction endpoint with ID
export const getTransactionEndpoint = (id) => `${ENDPOINTS.TRANSACTIONS}/${id}`;

// Helper function to get accounting transaction history endpoint with ID
export const getTransactionHistoryEndpoint = (id) => `${ENDPOINTS.TRANSACTION_HISTORY}/${id}`;

// Helper function to get transaction refund endpoint
export const getTransactionRefundEndpoint = (id) => `${getTransactionHistoryEndpoint(id)}/refund`;

// Helper function to get transaction cancel endpoint
export const getTransactionCancelEndpoint = (id) => `${getTransactionHistoryEndpoint(id)}/cancel`;

// Helper function to get customer endpoint with ID
export const getCustomerEndpoint = (id) => `${ENDPOINTS.CUSTOMERS}/${id}`;

// Helper function to get available rewards endpoint for a customer
export const getAvailableRewardsEndpoint = (customerId) => `${getCustomerEndpoint(customerId)}/available-rewards`;

// Helper function to get reward redemption endpoint for a customer
export const getRedeemRewardEndpoint = (customerId) => `${getCustomerEndpoint(customerId)}/redeem-reward`;

// Helper function to get products by category endpoint
export const getProductsByCategoryEndpoint = (categoryId) => `${getCategoryEndpoint(categoryId)}/products`;

// Helper function to get discount endpoint with ID
export const getDiscountEndpoint = (id) => `${ENDPOINTS.DISCOUNTS}/${id}`;

// Helper function to get reward endpoint with ID
export const getRewardEndpoint = (id) => `${ENDPOINTS.REWARDS}/${id}`;

export default {
  API_BASE_URL,
  ENDPOINTS,
  getProductEndpoint,
  getCategoryEndpoint,
  getSupplierEndpoint,
  getPurchaseOrderEndpoint,
  getPurchaseOrderReceiveEndpoint,
  getPurchaseOrderDiscrepanciesEndpoint,
  getTransactionEndpoint,
  getTransactionHistoryEndpoint,
  getTransactionRefundEndpoint,
  getTransactionCancelEndpoint,
  getCustomerEndpoint,
  getAvailableRewardsEndpoint,
  getRedeemRewardEndpoint,
  getProductsByCategoryEndpoint,
  getDiscountEndpoint,
  getRewardEndpoint
}; 