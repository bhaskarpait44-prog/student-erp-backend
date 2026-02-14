import express from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
} from "./student.controller.js";

const router = express.Router();

router.use(protect);

router.post("/", createStudent);
router.get("/", getStudents);
router.get("/:id", getStudentById);
router.put("/:id", updateStudent);
router.delete("/:id", deleteStudent);

export default router;
