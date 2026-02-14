import express from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import {
  getStudentsByClass,
  promoteStudents,
  getStudentsBySession
} from "./studentSession.controller.js";
import { verifyApiKey } from "../../middlewares/apiKey.middleware.js";

const router = express.Router();

// External API (for fetching students outside system)
router.get("/external", verifyApiKey, getStudentsBySession);

router.use(protect);

/* Get students of active session */
router.get("/", getStudentsBySession);

/* Get students by class in active session */
router.get("/class/:className", getStudentsByClass);

/* Promote selected students */
router.post("/promote", promoteStudents);

export default router;
