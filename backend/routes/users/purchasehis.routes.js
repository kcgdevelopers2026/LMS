import express from "express";
import { customerAuth } from "../../middleware/users/auth/auth.middleware.js";
import { getCustomerPurchases } from "../../controllers/users/purchasehis.controller.js";

const router = express.Router();

router.get("/purchases", customerAuth, getCustomerPurchases);
export default router;