import express from "express";

import {
  getActiveContest,
  joinContest,
  myContests,
} from "../../controllers/users/usercontest.controller.js";

import { customerAuth } from "../../middleware/users/auth/auth.middleware.js";

const router = express.Router();

/* =========================================================
   🟦 ACTIVE CONTESTS (PUBLIC)
========================================================= */
router.get("/active", getActiveContest);

/* =========================================================
   🟩 JOIN CONTEST (LOGIN REQUIRED)
========================================================= */
router.post("/join", customerAuth, joinContest);

/* =========================================================
   🟪 MY CONTEST HISTORY (LOGIN REQUIRED)
========================================================= */
router.get("/my", customerAuth, myContests);

export default router;