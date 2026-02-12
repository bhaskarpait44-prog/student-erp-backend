import mongoose from "mongoose";

const feeStructureSchema = new mongoose.Schema(
  {
    className: {
      type: String,
      required: true,
      unique: true,
    },

    admissionFee: { type: Number, default: 0 },
    yearlyFee: { type: Number, default: 0 },
    monthlyFee: { type: Number, default: 0 },

  },
  { timestamps: true }
);

export default mongoose.model("FeeStructure", feeStructureSchema);
