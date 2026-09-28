import express from "express";

import {
  getQuestions,
  submitAssessment,
} from "../controllers/assessmentController.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

// Public — only gets assessment questions
router.post("/questions", getQuestions);

// Protected — saves the result for the logged-in user
router.post("/submit", protect, submitAssessment);

export default router;