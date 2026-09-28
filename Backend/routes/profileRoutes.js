import express from "express";

import {
  getProfile,
  saveProfile,
} from "../controllers/profileController.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

// All profile operations require login

router.get("/current", protect, getProfile);

router.post("/save", protect, saveProfile);

export default router;