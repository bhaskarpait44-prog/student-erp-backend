import express from "express";
import { protect } from "../../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * TEST PROTECTED ROUTE
 * GET /api/user/me
 */
router.get("/me", protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Protected route working",
    user: req.user
  });
});

export default router;
