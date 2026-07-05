import express from "express";
import { getCustomerRewards } from "../../controllers/users/rewards.controller.js";
import { customerAuth } from "../../middleware/users/auth/auth.middleware.js";

const router = express.Router();

router.get("/", customerAuth, getCustomerRewards);

export default router;