import AcademicSession from "./session.model.js";
import Session from "./session.model.js";
import StudentSession from "../studentSession/studentSession.model.js";

/* CREATE SESSION */
export const createSession = async (req, res) => {
  try {
    const { name, startDate, endDate } = req.body;

    const session = await AcademicSession.create({
      name,
      startDate,
      endDate,
    });

    res.json({ success: true, data: session });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* GET ALL SESSIONS */
export const getSessions = async (req, res) => {
  try {
    const sessions = await AcademicSession.find().sort({
      createdAt: -1,
    });

    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ACTIVATE SESSION */
export const activateSession = async (req, res) => {
  try {
    const { id } = req.params;

    // Deactivate all
    await AcademicSession.updateMany(
      {},
      { isActive: false }
    );

    // Activate selected
    const session = await AcademicSession.findByIdAndUpdate(
      id,
      { isActive: true },
      { new: true }
    );

    res.json({ success: true, data: session });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* GET ACTIVE SESSION */
export const getActiveSession = async (req, res) => {
  try {
    const session = await AcademicSession.findOne({
      isActive: true,
    });

    res.json(session);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



export const deleteSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session)
      return res.status(404).json({ message: "Session not found" });

    if (session.isActive)
      return res.status(400).json({
        message: "Cannot delete active session"
      });

    // delete related student session records
    await StudentSession.deleteMany({ sessionId: session._id });

    await session.deleteOne();

    res.json({ message: "Session deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

