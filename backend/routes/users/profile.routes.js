import express from "express";
import { getCustomerProfile } from "../../controllers/users/profile.controller.js";
import { customerAuth } from "../../middleware/users/auth/auth.middleware.js";

const router = express.Router();

/* =========================
   PROFILE
========================= */
router.get("/", customerAuth, getCustomerProfile);

export default router;