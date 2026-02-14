import mongoose from "mongoose";

const feeStructureSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AcademicSession",
      required: true,
    },

    className: {
      type: String,
      required: true,
    },

    admissionFee: { type: Number, default: 0 },
    yearlyFee: { type: Number, default: 0 },
    monthlyFee: { type: Number, default: 0 },

  },
  { timestamps: true }
);

/* Prevent duplicate class in same session */
feeStructureSchema.index(
  { sessionId: 1, className: 1 },
  { unique: true }
);

export default mongoose.model("FeeStructure", feeStructureSchema);
