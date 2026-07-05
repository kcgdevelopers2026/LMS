import express from "express";

import {
  getContests,
  createContest,
  getContestById,

  addFields,
  getFields,

  getEntries,
  getEntryById,
  deleteEntry,

  selectWinner,
  getWinner,
  removeWinner,
} from "../../controllers/admin/admincontest.controller.js";

import {
  authMiddleware,
  onlyAdmin,
} from "../../middleware/admin/auth/auth.middleware.js";

const router = express.Router();

/* =========================================================
   🟦 CONTESTS
========================================================= */
router.get("/", authMiddleware, onlyAdmin, getContests);
router.post("/", authMiddleware, onlyAdmin, createContest);
router.get("/:id", authMiddleware, onlyAdmin, getContestById);


/* =========================================================
   🟨 FIELDS (FORM BUILDER)
========================================================= */
router.post("/fields", authMiddleware, onlyAdmin, addFields);
router.get("/fields/:id", authMiddleware, onlyAdmin, getFields);


/* =========================================================
   🟩 ENTRIES (PARTICIPANTS)
========================================================= */
router.get("/entries/:id", authMiddleware, onlyAdmin, getEntries);
router.get("/entry/:id", authMiddleware, onlyAdmin, getEntryById);
router.delete("/entry/:id", authMiddleware, onlyAdmin, deleteEntry);


/* =========================================================
   🟥 WINNER SYSTEM
========================================================= */
router.post("/winner", authMiddleware, onlyAdmin, selectWinner);
router.get("/winners/:id", authMiddleware, onlyAdmin, getWinner);
router.delete("/winner/:id", authMiddleware, onlyAdmin, removeWinner);

export default router;