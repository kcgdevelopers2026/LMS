import express from "express";
import {
  createShop,
  getShops,
  updateShop,
  deleteShop,
} from "../../controllers/admin/partner.controleer.js";

import {
  authMiddleware,
  onlyAdmin,
} from "../../middleware/admin/auth/auth.middleware.js";

const router = express.Router();

/* =========================
   ROUTES
========================= */

/* =========================
   PROTECTED ROUTES
========================= */
router.use(authMiddleware);
router.use(onlyAdmin);

// Create shop
router.post("/", createShop);

// Get all shops
router.get("/", getShops);

// Update shop
router.put("/:id", updateShop);

// Delete shop
router.delete("/:id", deleteShop);

export default router;