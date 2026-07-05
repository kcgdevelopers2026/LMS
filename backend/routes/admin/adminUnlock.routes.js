import express from "express";
import { unlockAdminPage } from "../../controllers/admin/adminUnclock.controller.js";
import { authMiddleware, onlyAdmin } from "../../middleware/admin/auth/auth.middleware.js";

const router = express.Router();

router.post("/unlock", authMiddleware, onlyAdmin, unlockAdminPage);

export default router;