import express from "express";
import {
  markAttendance,
  getStudentAttendance,
} from "./attendance.controller.js";

import { protect } from "../../middlewares/auth.middleware.js";
import { verifyApiKey } from "../../middlewares/apiKey.middleware.js";

const router = express.Router();

// External system routes
router.post("/external-mark", verifyApiKey, markAttendance);
router.get("/external/:studentId", verifyApiKey, getStudentAttendance);

// Internal app routes
router.post("/mark", protect, markAttendance);
router.get("/:studentId", protect, getStudentAttendance);

export default router;
