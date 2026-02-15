import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/user/user.routes.js";
import studentRoutes from "./modules/student/student.routes.js";
import feeRoutes from "./modules/fee/fee.routes.js";
import feeStructureRoutes from "./modules/feeStructure/feeStructure.routes.js";
import sessionRoutes from "./modules/session/session.routes.js";
import promotionRoutes from "./modules/promotion/promotion.routes.js";
import studentSessionRoutes from "./modules/studentSession/studentSession.routes.js";
import attendanceRoutes from "./modules/attendance/attendance.routes.js";



const app = express();
import cors from "cors";

app.use(cors());

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/fees", feeRoutes);
app.use("/api/fee-structure", feeStructureRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/promotions", promotionRoutes);
app.use("/api/student-session", studentSessionRoutes);
app.use("/api/attendance", attendanceRoutes);





export default app;
