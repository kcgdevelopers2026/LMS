import express from "express";

import { getReport } from "../../controllers/admin/reports.controller.js";

import {
  exportFullReport,
  exportTopCustomers,
} from "../../controllers/admin/reports.exports.controller.js";

import {
  authMiddleware,
  onlyAdmin,
} from "../../middleware/admin/auth/auth.middleware.js";

const router = express.Router();

/* =========================
   AUTH MIDDLEWARE
========================= */
router.use(authMiddleware);
router.use(onlyAdmin);

/* =========================
   MAIN REPORT API
========================= */

/**
 * GET DASHBOARD REPORT
 * Filters:
 * - from
 * - to
 * - category (Gold/Silver/Diamond/all)
 */
router.get("/", getReport);

/* =========================
   EXPORT ROUTES
========================= */

/**
 * EXPORT FULL PURCHASE REPORT (EXCEL)
 */
router.get("/export/full", exportFullReport);

/**
 * EXPORT TOP CUSTOMERS (EXCEL)
 */
router.get("/export/customers", exportTopCustomers);

export default router;