import express from "express";

import {
  logProgress,
  getProgress,
} from "../controllers/progressController.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

// Protected — logs progress for the logged-in user
router.post(
  "/log",
  protect,
  logProgress
);

// Protected — gets progress for the logged-in user
router.get(
  "/current",
  protect,
  getProgress
);

export default router;