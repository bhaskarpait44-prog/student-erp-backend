import express from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import {
  getStudentsByClass,
  promoteStudents,
  getStudentsBySession
} from "./studentSession.controller.js";

const router = express.Router();

router.use(protect);

/* Get students of active session */
router.get("/", getStudentsBySession);

/* Get students by class in active session */
router.get("/class/:className", getStudentsByClass);

/* Promote selected students */
router.post("/promote", promoteStudents);

export default router;
