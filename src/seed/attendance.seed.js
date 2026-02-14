import mongoose from "mongoose";
import dotenv from "dotenv";

import Attendance from "../modules/attendance/attendance.model.js";
import AcademicSession from "../modules/session/session.model.js";
import Student from "../modules/student/student.model.js";
import connectDB from "../config/db.js";

dotenv.config();
await connectDB();

async function seedAttendance() {

  try {

    const activeSession = await AcademicSession.findOne({ isActive: true });

    if (!activeSession) {
      console.log("No active session found");
      process.exit();
    }

    const students = await Student.find().limit(5);

    if (!students.length) {
      console.log("No students found");
      process.exit();
    }

    for (let student of students) {

      for (let i = 1; i <= 30; i++) {

        const randomStatus = getRandomStatus();

        await Attendance.create({
          studentId: student._id,
          sessionId: activeSession._id,
          date: new Date(2025, 5, i), // June (month index 5)
          status: randomStatus
        });
      }
    }

    console.log("Dummy attendance inserted successfully");
    process.exit();

  } catch (err) {
    console.error(err);
    process.exit();
  }
}

function getRandomStatus() {
  const statuses = ["present", "absent", "late", "halfday"];
  return statuses[Math.floor(Math.random() * statuses.length)];
}

seedAttendance();
