import mongoose from "mongoose";
import dotenv from "dotenv";

import Student from "../modules/student/student.model.js";
import StudentSession from "../modules/student-session/studentSession.model.js";
import Fee from "../modules/fee/fee.model.js";

dotenv.config();

async function clearData() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Student.deleteMany({});
    await StudentSession.deleteMany({});
    await Fee.deleteMany({});

    console.log("✅ All Seed Data Deleted Successfully");

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

clearData();
