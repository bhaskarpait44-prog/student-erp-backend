import express from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import {
  getFeeByStudent,
  addPayment,
  deletePayment,
  getFeeStatus,
  getDefaulters,
  getCollectionReport
} from "./fee.controller.js";

const router = express.Router();

router.use(protect);

/* 🔥 IMPORTANT: Specific routes FIRST */
router.post("/payment", addPayment);
router.delete("/payment", deletePayment);
router.get("/status/all", getFeeStatus);
router.get("/report/defaulters", getDefaulters); 
router.get("/report/collection", getCollectionReport);


/* 🔥 Dynamic route LAST */
router.get("/:studentId", getFeeByStudent);

export default router;
