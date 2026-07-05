import express from "express";
import {
  createRedeem,
  getRedeems,
  getRedeemsByCustomer,
} from "../../controllers/admin/redeem.controller.js";

import {
  authMiddleware,
  onlyAdmin,
} from "../../middleware/admin/auth/auth.middleware.js";

const router = express.Router();

/* =========================
   MIDDLEWARE
========================= */
router.use(authMiddleware);
router.use(onlyAdmin);

/* =========================
   REDEEM ROUTES
========================= */

// CREATE REDEEM
router.post("/", createRedeem);

// GET ALL REDEEMS
router.get("/", getRedeems);

// GET BY CUSTOMER
router.get("/customer/:customer_id", getRedeemsByCustomer);

export default router;