import express from "express";
import { getCustomerRedeems } from "../../controllers/users/redeem.controller.js";
import { customerAuth } from "../../middleware/users/auth/auth.middleware.js";

const router = express.Router();

/* =========================
   CUSTOMER REDEEMS
========================= */
router.get("/redeems", customerAuth, getCustomerRedeems);

export default router;