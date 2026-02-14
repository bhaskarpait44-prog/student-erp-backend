import express from "express";
import * as promotionController from "./promotion.controller.js";

const router = express.Router();

router.post("/class-wise", promotionController.promoteClassWise);
router.post("/student-wise", promotionController.promoteSelectedStudents);
router.get("/students", promotionController.getStudentsByClass);


export default router;
