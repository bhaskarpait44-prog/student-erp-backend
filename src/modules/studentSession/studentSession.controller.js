import StudentSession from "./studentSession.model.js";
import AcademicSession from "../session/session.model.js";

/* ========================================
   GET STUDENTS OF ACTIVE SESSION
======================================== */
export const getStudentsBySession = async (req, res) => {
  try {

    const activeSession = await AcademicSession.findOne({ isActive: true });

    if (!activeSession) return res.json([]);

    const records = await StudentSession.find({
      sessionId: activeSession._id,
      status: "active"
    }).populate("studentId");

    const students = records
      .filter(r => r.studentId)
      .map(r => ({
        ...r.studentId.toObject(),
        className: r.className,
        section: r.section,
        promoted: r.promoted
      }));

    res.json(students);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* ========================================
   GET STUDENTS BY CLASS
======================================== */
export const getStudentsByClass = async (req, res) => {
  try {

    const activeSession = await AcademicSession.findOne({ isActive: true });

    if (!activeSession) return res.json([]);

    const records = await StudentSession.find({
      sessionId: activeSession._id,
      className: req.params.className,
      status: "active"
    }).populate("studentId");

    const students = records
      .filter(r => r.studentId)
      .map(r => ({
        ...r.studentId.toObject(),
        className: r.className,
        section: r.section,
        promoted: r.promoted
      }));

    res.json(students);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* ========================================
   PROMOTE SELECTED STUDENTS
======================================== */
export const promoteStudents = async (req, res) => {
  try {

    const { studentIds, newClass, newSection, nextSessionId } = req.body;

    if (!studentIds?.length)
      return res.status(400).json({ message: "No students selected" });

    const activeSession = await AcademicSession.findOne({ isActive: true });

    if (!activeSession)
      return res.status(400).json({ message: "No active session found" });

    const nextSession = await AcademicSession.findById(nextSessionId);

    if (!nextSession)
      return res.status(400).json({ message: "Invalid next session" });

    for (let id of studentIds) {

      // Check already promoted
      const existing = await StudentSession.findOne({
        studentId: id,
        sessionId: nextSession._id
      });

      if (existing) continue; // skip duplicates

      // Create new enrollment
      await StudentSession.create({
        studentId: id,
        sessionId: nextSession._id,
        className: newClass,
        section: newSection,
        promoted: false,
        status: "active"
      });

      // Update old record
      await StudentSession.updateOne(
        { studentId: id, sessionId: activeSession._id },
        {
          promoted: true,
          status: "graduated"
        }
      );
    }

    res.json({
      success: true,
      message: "Students promoted successfully"
    });

 } catch (err) {
  console.error("🔥 PROMOTION ERROR FULL:", err);
  res.status(500).json({ message: err.message });
}

};
