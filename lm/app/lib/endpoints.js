import { API_BASE_URL } from "./api.js";

export const ENDPOINTS = {
  // AUTH
  ADMIN_LOGIN: `${API_BASE_URL}/api/admin/login`,
  ADMIN_UNLOCK: `${API_BASE_URL}/api/admin/unlock`,

  CUSTOMER_LOGIN: `${API_BASE_URL}/api/customer/login`,
  CUSTOMER_LOGOUT: `${API_BASE_URL}/api/customer/logout`,

  // DASHBOARD
  DASHBOARD: `${API_BASE_URL}/api/dashboard`,

  // SETTINGS
  SETTINGS: `${API_BASE_URL}/api/settings`,

  // CUSTOMERS
  CUSTOMERS: `${API_BASE_URL}/api/customers`,
  CUSTOMER_BY_ID: (id) => `${API_BASE_URL}/api/customers/${id}`,
  CUSTOMER_POINTS_BY_MOBILE: (mobile) =>
    `${API_BASE_URL}/api/customers/points-by-mobile?mobile=${mobile}`,

  // SHOPS
  SHOPS: `${API_BASE_URL}/api/shops`,
  SHOP_BY_ID: (id) => `${API_BASE_URL}/api/shops/${id}`,

  // PURCHASES
  PURCHASES: `${API_BASE_URL}/api/purchases`,
  PURCHASE_BY_CUSTOMER: (id) =>
    `${API_BASE_URL}/api/purchases/customer/${id}`,

  // REDEEMS
  REDEEMS: `${API_BASE_URL}/api/redeems`,
  REDEEMS_BY_CUSTOMER: (id) =>
    `${API_BASE_URL}/api/redeems/customer/${id}`,


  // CONTESTS
CONTESTS: `${API_BASE_URL}/api/admin/contests`,
CONTEST_BY_ID: (id) => `${API_BASE_URL}/api/admin/contests/${id}`,

CONTEST_ENTRIES: (id) =>
  `${API_BASE_URL}/api/admin/contests/entries/${id}`,

CONTEST_WINNERS: (id) =>
  `${API_BASE_URL}/api/admin/contests/winners/${id}`,

CONTEST_CREATE_WINNER: `${API_BASE_URL}/api/admin/contests/winner`,

REPORTS: `${API_BASE_URL}/admin/reports`,

};