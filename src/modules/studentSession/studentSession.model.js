import mongoose from "mongoose";

const studentSessionSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true
  },
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AcademicSession",
    required: true
  },
  className: { type: String, required: true },
  section: { type: String },
  rollNo: { type: String },
  promoted: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ["active", "graduated", "left"],
    default: "active"
  }
}, { timestamps: true });

export default mongoose.model("StudentSession", studentSessionSchema);
