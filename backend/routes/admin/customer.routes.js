import express from "express";
import {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  deleteAllCustomers,
  getCustomerByMobile,
  getCustomerPointsByMobile
} from "../../controllers/admin/customer.controller.js";

import {
  authMiddleware,
  onlyAdmin,
} from "../../middleware/admin/auth/auth.middleware.js";

const router = express.Router();

/* =========================
   🔐 AUTH REQUIRED FOR ALL
========================= */
router.use(authMiddleware);

/* =========================
   GET ROUTES
========================= */

// ✅ FIXED ORDER (IMPORTANT)
router.get("/points-by-mobile", getCustomerPointsByMobile);
router.get("/by-mobile", getCustomerByMobile);
router.get("/", getCustomers);
router.get("/:id", getCustomerById);

/* =========================
   ADMIN ONLY ROUTES
========================= */
router.post("/", onlyAdmin, createCustomer);
router.put("/:id", onlyAdmin, updateCustomer);

/* =========================
   DELETE ROUTES
========================= */
router.delete("/all", onlyAdmin, deleteAllCustomers);
router.delete("/:id", onlyAdmin, deleteCustomer);

export default router;