import express from "express";

import {
  generateCareerAnalysis,
} from "../controllers/careerAnalysisController.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post(
  "/generate",
  protect,
  generateCareerAnalysis
);

export default router;