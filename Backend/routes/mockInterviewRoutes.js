import express from "express";

import {
  getQuestions,
  evaluateAnswer,
} from "../controllers/mockInterviewController.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post(
  "/questions",
  protect,
  getQuestions
);

router.post(
  "/evaluate",
  protect,
  evaluateAnswer
);

export default router;