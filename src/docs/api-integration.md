# API Integration Guide

This document outlines the standard approach for API integration in this project. Following these patterns will ensure consistency and maintainability as the application grows.

## Architecture Overview

We follow a 3-layer architecture for API integration:

1. **Configuration Layer (`/src/config/api.js`)**: Centralizes all API URLs and endpoints
2. **Service Layer (`/src/services/api/`)**: Provides methods to interact with the API
3. **Component Layer**: Uses the service methods to perform API operations

## Adding a New API Endpoint

### Step 1: Define the endpoint in config/api.js

```javascript
// Add to the ENDPOINTS object
export const ENDPOINTS = {
  // Existing endpoints...
  
  // New endpoints
  NEW_RESOURCE: `${API_BASE_URL}/api/new-resource`,
  
  // For nested resources
  NESTED_RESOURCE: `${API_BASE_URL}/api/parent-resource/{parentId}/children`,
};

// Add helper functions for endpoints that need IDs
export const getNestedResourceEndpoint = (parentId) => 
  ENDPOINTS.NESTED_RESOURCE.replace('{parentId}', parentId);
```

### Step 2: Add the service methods in services/api

Create a new file or add to an existing one:

```javascript
// newResourceService.js
import api from './api';
import { ENDPOINTS, getNestedResourceEndpoint } from '../../config/api';

export const newResourceService = {
  getAll: async () => {
    try {
      const response = await api.get(ENDPOINTS.NEW_RESOURCE);
      return response.data;
    } catch (error) {
      console.error('Error fetching resources:', error.response?.data || error.message);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`${ENDPOINTS.NEW_RESOURCE}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching resource ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  create: async (data) => {
    try {
      const response = await api.post(ENDPOINTS.NEW_RESOURCE, data);
      return response.data;
    } catch (error) {
      console.error('Error creating resource:', error.response?.data || error.message);
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      const response = await api.put(`${ENDPOINTS.NEW_RESOURCE}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating resource ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`${ENDPOINTS.NEW_RESOURCE}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting resource ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },
  
  // For nested resources
  getChildren: async (parentId) => {
    try {
      const response = await api.get(getNestedResourceEndpoint(parentId));
      return response.data;
    } catch (error) {
      console.error(`Error fetching children for parent ${parentId}:`, error.response?.data || error.message);
      throw error;
    }
  }
};

export default newResourceService;
```

### Step 3: Export the service in index.js

```javascript
// Add to services/api/index.js
import newResourceService from './newResourceService';

export {
  // Existing exports...
  newResourceService
};
```

### Step 4: Use in components

```javascript
import React, { useState, useEffect } from 'react';
import { newResourceService } from '../../services/api';

const MyComponent = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchResources = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await newResourceService.getAll();
      setResources(data);
    } catch (error) {
      setError('Failed to fetch resources');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  // Rest of component...
};

export default MyComponent;
```

## Benefits of This Approach

1. **Centralized Endpoint Management**: All API URLs are defined in one place
2. **Consistent Error Handling**: Each service method handles errors in a consistent way
3. **Cleaner Components**: Components don't need to know about API implementation details
4. **Authentication**: The API service automatically handles auth tokens
5. **Code Reuse**: Service methods can be used in multiple components
6. **Testability**: Services can be easily mocked for testing
7. **Maintainability**: Changes to API endpoints only need to be made in one place

## Advanced Topics

- **Caching**: Consider adding a caching layer to services
- **Request Cancellation**: Use axios cancellation tokens for components that unmount
- **Pagination**: Standardize pagination handling in service methods
- **Response Transformation**: Transform API responses to match component needs 