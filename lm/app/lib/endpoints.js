import { API_BASE_URL } from "./api.js";

export const ENDPOINTS = {
  // ================= AUTH =================
  ADMIN_LOGIN: `${API_BASE_URL}/api/admin/login`,
  ADMIN_UNLOCK: `${API_BASE_URL}/api/admin/unlock`,
  ADMIN_LOGOUT: `${API_BASE_URL}/api/admin/logout`,

  CUSTOMER_LOGIN: `${API_BASE_URL}/api/customer/login`,
  CUSTOMER_LOGOUT: `${API_BASE_URL}/api/customer/logout`,

  // ================= DASHBOARD =================
  DASHBOARD: `${API_BASE_URL}/api/dashboard`,

  // ================= CUSTOMERS =================
  CUSTOMERS: `${API_BASE_URL}/api/customers`,
  CUSTOMER_BY_ID: (id) =>
    `${API_BASE_URL}/api/customers/${id}`,
  CUSTOMER_POINTS_BY_MOBILE: (mobile) =>
    `${API_BASE_URL}/api/customers/points-by-mobile?mobile=${mobile}`,

  // ================= SETTINGS =================
  SETTINGS: `${API_BASE_URL}/api/settings`,

  // ================= SHOPS =================
  SHOPS: `${API_BASE_URL}/api/shops`,
  SHOP_BY_ID: (id) =>
    `${API_BASE_URL}/api/shops/${id}`,

  // ================= PURCHASES =================
  PURCHASES: `${API_BASE_URL}/api/purchases`,
  PURCHASE_BY_CUSTOMER: (id) =>
    `${API_BASE_URL}/api/purchases/customer/${id}`,

  CUSTOMER_PURCHASES: `${API_BASE_URL}/api/customer/purchases`,

  // ================= REDEEMS =================
  REDEEMS: `${API_BASE_URL}/api/redeems`,
  REDEEM_BY_CUSTOMER: (id) =>
    `${API_BASE_URL}/api/redeems/customer/${id}`,

  USER_REDEEMS: `${API_BASE_URL}/api/user/redeems`,

  // ================= REPORTS =================
  REPORTS: `${API_BASE_URL}/api/admin/reports`,

  // ================= CONTESTS =================
  CONTESTS: `${API_BASE_URL}/api/admin/contests`,
  CONTEST_ENTRIES: (id) =>
    `${API_BASE_URL}/api/admin/contests/entries/${id}`,
  CONTEST_WINNERS: (id) =>
    `${API_BASE_URL}/api/admin/contests/winners/${id}`,
  CONTEST_CREATE_WINNER: `${API_BASE_URL}/api/admin/contests/winner`,

  USER_CONTESTS_ACTIVE: `${API_BASE_URL}/api/user/contests/active`,
  USER_CONTEST_JOIN: `${API_BASE_URL}/api/user/contests/join`,

  // ================= CUSTOMER =================
  CUSTOMER_HOME: `${API_BASE_URL}/api/customer/home`,
  CUSTOMER_PROFILE: `${API_BASE_URL}/api/customer/profile`,
  CUSTOMER_REWARDS: `${API_BASE_URL}/api/customer/rewards`,

  // ================= SHOPS / EXTRA =================
  CUSTOMER_LOGOUT: `${API_BASE_URL}/api/customer/logout`,
};