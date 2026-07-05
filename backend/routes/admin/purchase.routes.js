import express from "express";
import {
  createPurchase,
  getPurchases,
  getPurchaseByCustomer,
} from "../../controllers/admin/purchase.controller.js";

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
   PURCHASE ROUTES
========================= */

// CREATE PURCHASE
router.post("/", createPurchase);

// GET ALL PURCHASES
router.get("/", getPurchases);

// GET PURCHASES BY CUSTOMER UUID
router.get("/customer/:customer_uuid", getPurchaseByCustomer);

export default router;