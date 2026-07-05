import express from "express";

import {
  customerLogin,
  customerLogout,
} from "../../../controllers/users/auth/auth.controller.js";

import { customerAuth } from "../../../middleware/users/auth/auth.middleware.js";

const router = express.Router();

/* Public */
router.post("/login", customerLogin);

/* Protected */
router.post("/logout", customerAuth, customerLogout);

export default router;