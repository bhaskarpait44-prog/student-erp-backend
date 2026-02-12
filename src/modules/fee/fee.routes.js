import express from "express";
import * as feeController from "./fee.controller.js";



const router = express.Router();

// 🔹 Set Fee Structure (Admin)
router.post("/set", feeController.setFeeStructure);

// 🔹 Add Payment
router.post("/pay", feeController.addPayment);

// 🔹 Get Fee by Student ID
router.get("/:studentId", feeController.getFeeByStudent);

// 🔹 Get Fee by all Student
router.get("/", feeController.getAllFees);

router.get("/report/collection", feeController.getCollectionReport);
router.get("/report/defaulters", feeController.getDefaulters);
router.delete("/payment", feeController.deletePayment);

export default router;
