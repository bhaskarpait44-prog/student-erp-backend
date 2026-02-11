import Student from "./student.model.js";

// ➕ Create Student
export const createStudent = async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 📄 Get All Students
export const getStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📄 Get Student By ID
export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student)
      return res.status(404).json({ message: "Student not found" });

    res.json(student);
  } catch (err) {
    res.status(400).json({ message: "Invalid ID" });
  }
};

// ✏️ Update Student
export const updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!student)
      return res.status(404).json({ message: "Student not found" });

    res.json(student);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ❌ Delete Student
export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student)
      return res.status(404).json({ message: "Student not found" });

    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


