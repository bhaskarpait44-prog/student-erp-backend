import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    rollNo: { type: String, required: true, unique: true },

    gender: { type: String, enum: ["Male", "Female", "Other"] },

    dob: { type: Date },

    bloodGroup: { type: String },

    religion: { type: String },

    caste: { type: String },

    category: { type: String },

    motherTongue: { type: String },

    language: { type: String },

    address: { type: String },

    permanentAddress: { type: String },

    mobile: { type: String, required: true },

    email: { type: String, lowercase: true },

    fatherName: { type: String },

    motherName: { type: String },

    guardianName: { type: String },

    guardianPhone: { type: String },

    previousSchool: { type: String },

    bankDetails: {
      bankName: String,
      accountNumber: String,
      ifscCode: String,
      branch: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);
