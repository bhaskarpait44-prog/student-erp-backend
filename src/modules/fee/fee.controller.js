import Fee from "./fee.model.js";

// 🔹 Admin sets yearly/monthly/admission fee
export const setFeeStructure = async (req, res) => {
  try {
    const { studentId, admissionFee, yearlyFee, monthlyFee } = req.body;

    let fee = await Fee.findOne({ studentId });

    if (!fee) {
      fee = await Fee.create({
        studentId,
        admissionFee,
        yearlyFee,
        monthlyFee,
      });
    } else {
      fee.admissionFee = admissionFee;
      fee.yearlyFee = yearlyFee;
      fee.monthlyFee = monthlyFee;
      await fee.save();
    }

    res.json({ success: true, data: fee });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 🔹 Add Payment
export const addPayment = async (req, res) => {
  try {
    const { studentId, feeType, amount, paymentMode } = req.body;

    const fee = await Fee.findOne({ studentId });

    if (!fee)
      return res.status(404).json({ message: "Fee not set for this student" });

    const receiptNo = "RCPT-" + Date.now();

    fee.payments.push({
      receiptNo,
      feeType,
      amount,
      paymentMode,
    });

    await fee.save({ validateModifiedOnly: true });


    res.json({ success: true, data: fee });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 🔹 Fetch Full Fee Details
import Student from "../student/student.model.js";
import FeeStructure from "../feeStructure/feeStructure.model.js";

export const getFeeByStudent = async (req, res) => {
  try {
    let fee = await Fee.findOne({
      studentId: req.params.studentId,
    }).populate("studentId");

    // 🔥 If fee not found → auto create from class structure
    if (!fee) {

      const student = await Student.findById(
        req.params.studentId
      );

      if (!student)
        return res.status(404).json({
          message: "Student not found"
        });

      const classFee =
        await FeeStructure.findOne({
          className: student.className
        });

      if (!classFee)
        return res.status(404).json({
          message: "Class fee not set"
        });

      fee = await Fee.create({
        studentId: student._id,
        admissionFee: classFee.admissionFee,
        yearlyFee: classFee.yearlyFee,
        monthlyFee: classFee.monthlyFee,
        payments: [],
      });

      fee = await fee.populate("studentId");
    }

    res.json({ success: true, data: fee });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};


export const getAllFees = async (req, res) => {
  try {
    const fees = await Fee.find().populate("studentId");
    res.json(fees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getCollectionReport = async (req, res) => {
  try {
    const { start, end } = req.query;

    const startDate = new Date(start);
    const endDate = new Date(end);

    const result = await Fee.aggregate([
      { $unwind: "$payments" },
      {
        $match: {
          "payments.paymentDate": {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalCollection: { $sum: "$payments.amount" },
        },
      },
    ]);

    res.json(result[0] || { totalCollection: 0 });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getDefaulters = async (req, res) => {
  try {
    const fees = await Fee.find().populate("studentId");

    const defaulters = fees.filter(f => f.dueAmount > 0);

    res.json(defaulters);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deletePayment = async (req, res) => {
  try {
    const { studentId, receiptNo } = req.body;

    const fee = await Fee.findOne({ studentId });

    if (!fee)
      return res.status(404).json({ message: "Fee not found" });

    fee.payments = fee.payments.filter(
      p => p.receiptNo !== receiptNo
    );

    await fee.save({ validateModifiedOnly: true });

    res.json({ success: true, data: fee });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


