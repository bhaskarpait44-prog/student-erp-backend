import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/user/user.routes.js";
import studentRoutes from "./modules/student/student.routes.js";
import feeRoutes from "./modules/fee/fee.routes.js";
import feeStructureRoutes from "./modules/feeStructure/feeStructure.routes.js";









const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/fees", feeRoutes);
app.use("/api/fee-structure", feeStructureRoutes);




export default app;
