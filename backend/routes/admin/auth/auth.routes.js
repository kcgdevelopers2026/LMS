import express from "express";
import { loginAdmin } from "../../../controllers/admin/auth/auth.controller.js";

const router = express.Router();

/* PUBLIC ROUTE (NO MIDDLEWARE) */
router.post("/login", loginAdmin);

export default router;