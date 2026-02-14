import express from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import {
  createFeeStructure,
  getAllClassFees,
  deleteClassFee
} from "./feeStructure.controller.js";

const router = express.Router();

router.use(protect);

router.post("/", createFeeStructure);
router.get("/", getAllClassFees);
router.delete("/:id", deleteClassFee);

export default router;
