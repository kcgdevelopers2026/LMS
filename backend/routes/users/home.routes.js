import express from "express";

import { getCustomerHome } from "../../controllers/users/home.controller.js";
import { customerAuth } from "../../middleware/users/auth/auth.middleware.js";

const router = express.Router();

/* =========================
   CUSTOMER HOME
========================= */
router.get("/", customerAuth, getCustomerHome);

export default router;