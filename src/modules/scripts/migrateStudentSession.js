import mongoose from "mongoose";
import Student from "../src/modules/student/student.model.js";
import Session from "../src/modules/session/session.model.js";
import StudentSession from "../src/modules/studentSession/studentSession.model.js";
import dotenv from "dotenv";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

const activeSession = await Session.findOne({ isActive: true });

if (!activeSession) {
  console.log("No active session found");
  process.exit();
}

const students = await Student.find();

for (const student of students) {

  const exists = await StudentSession.findOne({
    studentId: student._id,
    sessionId: activeSession._id
  });

  if (!exists) {
    await StudentSession.create({
      studentId: student._id,
      sessionId: activeSession._id,
      className: student.className,
      promoted: false
    });
  }
}

console.log("Migration completed");
process.exit();
