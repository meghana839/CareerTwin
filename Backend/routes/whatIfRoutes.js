import express from "express";

import { simulateWhatIf } from "../controllers/whatIfController.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post(
  "/simulate",
  protect,
  simulateWhatIf
);

export default router;