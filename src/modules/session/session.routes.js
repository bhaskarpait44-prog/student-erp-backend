import express from "express";
import * as sessionController from "./session.controller.js";

const router = express.Router();

router.post("/", sessionController.createSession);
router.get("/", sessionController.getSessions);
router.get("/active", sessionController.getActiveSession);
router.put("/activate/:id", sessionController.activateSession);
router.delete("/:id", sessionController.deleteSession);


export default router;
