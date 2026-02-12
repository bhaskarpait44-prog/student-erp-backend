import express from "express";
import * as controller from "./feeStructure.controller.js";

const router = express.Router();

router.post("/", controller.setClassFee);
router.get("/", controller.getAllClassFees);
router.delete("/:id", controller.deleteClassFee);


export default router;
