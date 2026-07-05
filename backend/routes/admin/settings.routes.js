import express from "express";

import {
  getSettings,
  updateSettings,
  
} from "../../controllers/admin/settings.controller.js";

import {
  authMiddleware,
  onlyAdmin,
} from "../../middleware/admin/auth/auth.middleware.js";

const router = express.Router();

/* =========================
   PROTECTED MIDDLEWARE
========================= */
router.use(authMiddleware);
router.use(onlyAdmin);

/* =========================
   SETTINGS ROUTES
========================= */

// 🔓 Unlock page

// Get settings
router.get("/", getSettings);

// Update settings
router.put("/", updateSettings);

export default router;