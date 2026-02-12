import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    receiptNo: { type: String },

    feeType: {
      type: String,
      enum: ["Admission", "Monthly", "Yearly"],
      required: true,
    },

    amount: { type: Number, required: true },

    paymentMode: {
      type: String,
      enum: ["Cash", "UPI", "Bank"],
    },

    paymentDate: { type: Date, default: Date.now },
  },
  { _id: false }
);

const feeSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      unique: true, // one fee structure per student
    },

    admissionFee: { type: Number, default: 0 },
    yearlyFee: { type: Number, default: 0 },
    monthlyFee: { type: Number, default: 0 },

    payments: [paymentSchema],
  },
  { timestamps: true }
);

// 🔥 Auto Calculations
feeSchema.virtual("totalPaid").get(function () {
  return this.payments.reduce((sum, p) => sum + p.amount, 0);
});

feeSchema.virtual("totalAmount").get(function () {
  return this.admissionFee + this.yearlyFee + this.monthlyFee;
});

feeSchema.virtual("dueAmount").get(function () {
  return this.totalAmount - this.totalPaid;
});

feeSchema.set("toJSON", { virtuals: true });
feeSchema.set("toObject", { virtuals: true });

export default mongoose.model("Fee", feeSchema);
