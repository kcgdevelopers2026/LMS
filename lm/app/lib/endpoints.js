import { API_BASE_URL } from "./api.js";

export const ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/api/admin/login`,
  DASHBOARD: `${API_BASE_URL}/api/dashboard`,
  CUSTOMERS: `${API_BASE_URL}/api/customers`,
  CUSTOMER_BY_ID: (id) => `${API_BASE_URL}/api/customers/${id}`,
};