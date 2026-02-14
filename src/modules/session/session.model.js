import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  startDate: Date,
  endDate: Date,
  isActive: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model("AcademicSession", sessionSchema);
