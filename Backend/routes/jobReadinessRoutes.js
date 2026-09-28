import express from "express";

import {
  analyzeJobReadiness,
} from "../controllers/jobReadinessController.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post(
  "/analyze",
  protect,
  analyzeJobReadiness
);

export default router;