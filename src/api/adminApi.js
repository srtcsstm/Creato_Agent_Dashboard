// src/api/adminApi.js
import { fetchNocoDBData, createNocoDBData, updateNocoDBData, deleteNocoDBData } from './nocodb';
import { mockFetch, mockCreate, mockUpdate, mockDelete } from './adminMockData';

// Set this to true to force mock data usage, false to try NocoDB first
const FORCE_MOCK_DATA = false; // Changed to FALSE to use live data

const handleApiCall = async (apiCall, mockCall, tableName, ...args) => {
  if (FORCE_MOCK_DATA) {
    console.warn(`[Admin API] Using mock data for ${tableName} (forced).`);
    return mockCall(tableName, ...args);
  }
  try {
    const result = await apiCall(tableName, ...args);
    console.log(`[Admin API] Successfully fetched/modified ${tableName} from NocoDB.`);
    return result;
  } catch (error) {
    // Log the specific error from NocoDB before falling back
    console.error(`[Admin API] NocoDB call failed for ${tableName}:`, error.message, 'Falling back to mock data.');
    // If NocoDB call fails, fall back to mock data
    return mockCall(tableName, ...args);
  }
};

export const fetchAdminData = async (tableName, ...args) => {
  return handleApiCall(fetchNocoDBData, mockFetch, tableName, ...args);
};

export const createAdminData = async (tableName, data) => {
  return handleApiCall(createNocoDBData, mockCreate, tableName, data);
};

export const updateAdminData = async (tableName, id, data) => {
  return handleApiCall(updateNocoDBData, mockUpdate, tableName, id, data);
};

export const deleteAdminData = async (tableName, id) => {
  return handleApiCall(deleteNocoDBData, mockDelete, tableName, id);
};
