import express from "express";

import {
  getLearningRecommendations,
} from "../controllers/learningController.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post(
  "/recommend",
  protect,
  getLearningRecommendations
);

export default router;