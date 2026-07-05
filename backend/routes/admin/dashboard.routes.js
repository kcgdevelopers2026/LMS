import express from "express";
import { getDashboard } from "../../controllers/admin/dashboard.controller.js";
import {
  authMiddleware,
  onlyAdmin,
} from "../../middleware/admin/auth/auth.middleware.js";

const router = express.Router();

/* =========================
   DASHBOARD ROUTE
========================= */
router.get("/", authMiddleware, onlyAdmin, getDashboard);

export default router;