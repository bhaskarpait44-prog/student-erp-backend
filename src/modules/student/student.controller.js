import Student from "./student.model.js";
import StudentSession from "../studentSession/studentSession.model.js";
import AcademicSession from "../session/session.model.js";

/* ==============================
   CREATE STUDENT
================================ */
export const createStudent = async (req, res) => {
  try {

    const {
      name,
      gender,
      mobile,
      email,
      fatherName,
      motherName,
      className,
      section,
      rollNo
    } = req.body;

    const student = await Student.create({
      name,
      gender,
      mobile,
      email,
      fatherName,
      motherName,
    });

    const activeSession = await AcademicSession.findOne({ isActive: true });

    if (!activeSession)
      return res.status(400).json({ message: "No active session found" });

    await StudentSession.create({
      studentId: student._id,
      sessionId: activeSession._id,
      className,
      section: section || "A",
      rollNo
    });

    res.status(201).json(student);

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};



/* ==============================
   GET STUDENTS (SESSION BASED)
================================ */
export const getStudents = async (req, res) => {
  try {

    const activeSession = await AcademicSession.findOne({ isActive: true });
    if (!activeSession) return res.json([]);

    const records = await StudentSession.find({
      sessionId: activeSession._id
    }).populate("studentId");

    const students = records
      .filter(r => r.studentId)
      .map(r => ({
        ...r.studentId.toObject(),
        className: r.className,
        section: r.section,
        rollNo: r.rollNo
      }));

    res.json(students);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* ==============================
   GET STUDENT BY ID
================================ */
export const getStudentById = async (req, res) => {
  try {

    const activeSession = await AcademicSession.findOne({ isActive: true });

    if (!activeSession) {
      return res.status(400).json({ message: "No active session" });
    }

    const record = await StudentSession.findOne({
      studentId: req.params.id,
      sessionId: activeSession._id
    }).populate("studentId");

    if (!record || !record.studentId) {
      return res.status(404).json({ message: "Student not found" });
    }

    const student = {
      ...record.studentId.toObject(),
      className: record.className,
      section: record.section,
      rollNo: record.rollNo
    };

    res.json(student);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* ==============================
   UPDATE STUDENT
================================ */
export const updateStudent = async (req, res) => {
  try {

    const {
      name,
      gender,
      mobile,
      email,
      fatherName,
      motherName,
      className,
      section,
      rollNo
    } = req.body;

    // 1️⃣ Update Student basic info
    await Student.findByIdAndUpdate(
      req.params.id,
      {
        name,
        gender,
        mobile,
        email,
        fatherName,
        motherName
      }
    );

    // 2️⃣ Get active session
    const activeSession = await AcademicSession.findOne({ isActive: true });

    if (!activeSession)
      return res.status(400).json({ message: "No active session" });

    // 3️⃣ Update StudentSession data
    await StudentSession.findOneAndUpdate(
      {
        studentId: req.params.id,
        sessionId: activeSession._id
      },
      {
        className,
        section,
        rollNo
      }
    );

    res.json({ message: "Student updated successfully" });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


/* ==============================
   DELETE STUDENT
================================ */
export const deleteStudent = async (req, res) => {
  try {

    await StudentSession.deleteMany({
      studentId: req.params.id
    });

    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    res.json({
      success: true,
      message: "Student deleted successfully"
    });

  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
};
