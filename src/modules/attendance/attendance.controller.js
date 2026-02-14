import Attendance from "./attendance.model.js";
import AcademicSession from "../session/session.model.js";

export const markAttendance = async (req, res) => {
  try {

    const { studentId, date, status } = req.body;

    // 🔥 Auto detect active session
    const activeSession = await AcademicSession.findOne({ isActive: true });

    if (!activeSession) {
      return res.status(400).json({ message: "No active session found" });
    }

    const attendance = await Attendance.findOneAndUpdate(
      {
        studentId,
        sessionId: activeSession._id,
        date: new Date(date)
      },
      {
        studentId,
        sessionId: activeSession._id,
        date: new Date(date),
        status
      },
      { upsert: true, new: true }
    );

    res.json({ success: true, data: attendance });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getStudentAttendance = async (req, res) => {
  try {

    const { studentId } = req.params;

    const activeSession = await AcademicSession.findOne({ isActive: true });

    if (!activeSession) {
      return res.json([]);
    }

    const data = await Attendance.find({
      studentId,
      sessionId: activeSession._id
    });

    res.json(data);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
