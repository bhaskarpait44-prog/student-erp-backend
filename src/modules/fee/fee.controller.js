import Fee from "./fee.model.js";
import AcademicSession from "../session/session.model.js";
import FeeStructure from "../feeStructure/feeStructure.model.js";
import StudentSession from "../studentSession/studentSession.model.js";


/* ========================================
   GET FEE BY STUDENT (AUTO CREATE)
======================================== */
export const getFeeByStudent = async (req, res) => {
  try {
    const activeSession = await AcademicSession.findOne({ isActive: true });

    if (!activeSession)
      return res.status(400).json({ message: "No active session found" });

    const enrollment = await StudentSession.findOne({
      studentId: req.params.studentId,
      sessionId: activeSession._id,
    }).populate("studentId");

    if (!enrollment)
      return res.status(404).json({
        message: "Student not enrolled in active session",
      });

    let fee = await Fee.findOne({
      studentId: req.params.studentId,
      sessionId: activeSession._id,
    });

    if (!fee) {
      const structure = await FeeStructure.findOne({
        className: enrollment.className,
        sessionId: activeSession._id,
      });

      if (!structure)
        return res.status(404).json({
          message: "Fee structure not set for class in this session",
        });

      fee = await Fee.create({
        studentId: req.params.studentId,
        sessionId: activeSession._id,
        className: enrollment.className,
        admissionFee: structure.admissionFee,
        yearlyFee: structure.yearlyFee,
        monthlyFee: structure.monthlyFee,
        payments: [],
      });
    }

    // 🔥 VERY IMPORTANT: attach class & roll from StudentSession
    const response = {
      ...fee.toObject(),
      studentId: {
        ...enrollment.studentId.toObject(),
        className: enrollment.className,
        rollNo: enrollment.rollNo,
      },
    };

    res.json(response);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



/* ========================================
   ADD PAYMENT
======================================== */
export const addPayment = async (req, res) => {
  try {

    const { studentId, feeType, amount, paymentMode } = req.body;

    const activeSession = await AcademicSession.findOne({ isActive: true });

    if (!activeSession)
      return res.status(400).json({ message: "No active session found" });

    const fee = await Fee.findOne({
      studentId,
      sessionId: activeSession._id,
    });

    if (!fee)
      return res.status(404).json({ message: "Fee record not found" });

    fee.payments.push({
      receiptNo: "RCPT-" + Date.now(),
      feeType,
      amount,
      paymentMode,
    });

    await fee.save();

    res.json(fee);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* ========================================
   DELETE PAYMENT
======================================== */
export const deletePayment = async (req, res) => {
  try {

    const { studentId, receiptNo } = req.body;

    const activeSession = await AcademicSession.findOne({ isActive: true });

    const fee = await Fee.findOne({
      studentId,
      sessionId: activeSession._id,
    });

    if (!fee)
      return res.status(404).json({
        message: "Fee record not found",
      });

    fee.payments = fee.payments.filter(
      p => p.receiptNo !== receiptNo
    );

    await fee.save();

    res.json(fee);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* ==========================================
   GET FEE STATUS (SESSION BASED)
========================================== */
export const getFeeStatus = async (req, res) => {
  try {

    const { className } = req.query;

    const activeSession = await AcademicSession.findOne({ isActive: true });

    if (!activeSession)
      return res.status(400).json({ message: "No active session found" });

    const filter = {
      sessionId: activeSession._id,
    };

    if (className) {
      filter.className = className;
    }

    const enrollments = await StudentSession.find(filter)
      .populate("studentId");

    const result = [];

    for (let record of enrollments) {

      // 🔥 Prevent crash if student deleted
      if (!record.studentId) continue;

      let fee = await Fee.findOne({
        studentId: record.studentId._id,
        sessionId: activeSession._id,
      });

      if (!fee) continue;

      result.push({
        studentId: record.studentId._id,
        name: record.studentId.name,
        rollNo: record.rollNo,
        className: record.className,

        totalAmount: fee.totalAmount,
        totalPaid: fee.totalPaid,
        dueAmount: fee.dueAmount,

        status: fee.dueAmount > 0 ? "Due" : "Paid",
      });
    }

    res.json(result);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getDefaulters = async (req, res) => {
  try {

    const activeSession = await AcademicSession.findOne({ isActive: true });

    if (!activeSession)
      return res.status(400).json({ message: "No active session found" });

    const enrollments = await StudentSession.find({
      sessionId: activeSession._id
    }).populate("studentId");

    const result = [];

    for (let record of enrollments) {

      if (!record.studentId) continue;

      const fee = await Fee.findOne({
        studentId: record.studentId._id,
        sessionId: activeSession._id
      });

      if (!fee) continue;

      if (fee.dueAmount > 0) {

        result.push({
          studentId: record.studentId._id,
          name: record.studentId.name,
          rollNo: record.rollNo,
          className: record.className,
          totalAmount: fee.totalAmount,
          totalPaid: fee.totalPaid,
          dueAmount: fee.dueAmount
        });

      }
    }

    res.json(result);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getCollectionReport = async (req, res) => {
  try {

    const { start, end } = req.query;

    const activeSession = await AcademicSession.findOne({ isActive: true });

    if (!activeSession)
      return res.status(400).json({ message: "No active session found" });

    const fees = await Fee.find({
      sessionId: activeSession._id,
    }).populate("studentId");

    const startDate = start ? new Date(start) : null;
    const endDate = end ? new Date(end) : null;

    if (endDate) {
      endDate.setHours(23, 59, 59, 999);
    }

    const result = [];

    for (let fee of fees) {

      if (!fee.studentId) continue;

      for (let payment of fee.payments) {

        const paymentDate = new Date(payment.paymentDate);

        if (
          (!startDate || paymentDate >= startDate) &&
          (!endDate || paymentDate <= endDate)
        ) {

          result.push({
            receiptNo: payment.receiptNo,
            date: payment.paymentDate,
            studentName: fee.studentId.name,
            rollNo: fee.studentId.rollNo,
            className: fee.className,
            feeType: payment.feeType,
            amount: payment.amount,
            paymentMode: payment.paymentMode
          });

        }
      }
    }

    res.json(result);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

