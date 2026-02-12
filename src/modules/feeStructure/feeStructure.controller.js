import FeeStructure from "./feeStructure.model.js";

export const setClassFee = async (req, res) => {
  try {
    const { className, admissionFee, yearlyFee, monthlyFee } = req.body;

    let structure = await FeeStructure.findOne({ className });

    if (!structure) {
      structure = await FeeStructure.create({
        className,
        admissionFee,
        yearlyFee,
        monthlyFee,
      });
    } else {
      structure.admissionFee = admissionFee;
      structure.yearlyFee = yearlyFee;
      structure.monthlyFee = monthlyFee;
      await structure.save();
    }

    res.json(structure);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllClassFees = async (req, res) => {
  const data = await FeeStructure.find();
  res.json(data);
};

export const deleteClassFee = async (req, res) => {
  try {
    await FeeStructure.findByIdAndDelete(req.params.id);
    res.json({ message: "Class fee deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

