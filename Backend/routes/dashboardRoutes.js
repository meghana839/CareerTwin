import express from "express";

import {
  getDashboardSummary,
} from "../controllers/dashboardController.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get(
  "/summary/current",
  protect,
  getDashboardSummary
);

export default router;