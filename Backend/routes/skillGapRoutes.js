import express from "express";

import {
  analyzeSkillGap,
} from "../controllers/skillGapController.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post(
  "/analyze",
  protect,
  analyzeSkillGap
);

export default router;