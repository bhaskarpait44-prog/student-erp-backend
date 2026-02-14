import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  gender: String,
  mobile: String,
  email: String,
  fatherName: String,
  motherName: String,
}, { timestamps: true });

export default mongoose.model("Student", studentSchema);
