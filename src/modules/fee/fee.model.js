import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    receiptNo: String,
    feeType: String,
    amount: Number,
    paymentMode: String,
    paymentDate: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const feeSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AcademicSession",
      required: true,
    },
    className: String,

    admissionFee: { type: Number, default: 0 },
    yearlyFee: { type: Number, default: 0 },
    monthlyFee: { type: Number, default: 0 },

    payments: [paymentSchema],
  },
  { timestamps: true }
);

feeSchema.index(
  { studentId: 1, sessionId: 1 },
  { unique: true }
);


/* ====== VIRTUALS ====== */
feeSchema.virtual("totalAmount").get(function () {
  return (
    (this.admissionFee || 0) +
    (this.yearlyFee || 0) +
    (this.monthlyFee || 0)
  );
});

feeSchema.virtual("totalPaid").get(function () {
  return this.payments.reduce(
    (sum, p) => sum + (p.amount || 0),
    0
  );
});

feeSchema.virtual("dueAmount").get(function () {
  return this.totalAmount - this.totalPaid;
});

feeSchema.set("toObject", { virtuals: true });
feeSchema.set("toJSON", { virtuals: true });

export default mongoose.model("Fee", feeSchema);
