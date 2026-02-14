import FeeStructure from "./feeStructure.model.js";
import AcademicSession from "../session/session.model.js";

/* =========================================
   SET CLASS FEE (SESSION BASED)
========================================= */
export const createFeeStructure = async (req, res) => {
  try {

    const activeSession = await AcademicSession.findOne({ isActive: true });

    if (!activeSession)
      return res.status(400).json({ message: "No active session found" });

    const structure = await FeeStructure.create({
      sessionId: activeSession._id,
      className: req.body.className,
      admissionFee: req.body.admissionFee,
      yearlyFee: req.body.yearlyFee,
      monthlyFee: req.body.monthlyFee,
    });

    res.status(201).json(structure);

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


/* =========================================
   GET CLASS FEES (SESSION BASED)
========================================= */
export const getAllClassFees = async (req, res) => {

  const activeSession = await AcademicSession.findOne({ isActive: true });

  if (!activeSession) return res.json([]);

  const data = await FeeStructure.find({
    sessionId: activeSession._id,
  });

  res.json(data);
};

/* =========================================
   DELETE CLASS FEE
========================================= */
export const deleteClassFee = async (req, res) => {
  try {
    await FeeStructure.findByIdAndDelete(req.params.id);
    res.json({ message: "Class fee deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

