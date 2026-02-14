import StudentSession from "../studentSession/studentSession.model.js";
import Fee from "../fee/fee.model.js";
import AcademicSession from "../session/session.model.js";


export const promoteClassWise = async (req, res) => {
  try {
    const { fromClass, toClass, fromSessionId, toSessionId } = req.body;

    const students = await StudentSession.find({
      className: fromClass,
      sessionId: fromSessionId
    });

    for (const record of students) {

      await StudentSession.create({
        studentId: record.studentId,
        sessionId: toSessionId,
        className: toClass,
        promoted: true
      });

      // Reset fee for new session
      await Fee.deleteMany({
        studentId: record.studentId,
        sessionId: fromSessionId
      });
    }

    res.json({ message: "Class promoted successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const promoteSelectedStudents = async (req, res) => {
  try {
    const { studentIds, toClass, toSessionId } = req.body;

    for (const id of studentIds) {

      await StudentSession.create({
        studentId: id,
        sessionId: toSessionId,
        className: toClass,
        promoted: true
      });

      await Fee.deleteMany({ studentId: id });
    }

    res.json({ message: "Selected students promoted" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export async function promotionController() {

  const table = document.getElementById("promotionTable");
  const currentClassSelect = document.getElementById("currentClass");
  const newClassSelect = document.getElementById("newClass");

  const promoteAllBtn = document.getElementById("promoteAllBtn");
  const promoteSelectedBtn = document.getElementById("promoteSelectedBtn");

  const selectAll = document.getElementById("selectAll");

  let students = [];

  /* LOAD CLASS OPTIONS */
  function loadClassOptions() {

    const classes = [
      "LKG","UKG","1","2","3","4","5",
      "6","7","8","9","10","11","12"
    ];

    currentClassSelect.innerHTML =
      `<option value="">Select Class</option>` +
      classes.map(c =>
        `<option value="${c}">${c}</option>`
      ).join("");

    newClassSelect.innerHTML =
      `<option value="">Select New Class</option>` +
      classes.map(c =>
        `<option value="${c}">${c}</option>`
      ).join("");
  }

  loadClassOptions();

  /* LOAD STUDENTS BY CLASS */
  async function loadStudents() {

    if (!currentClassSelect.value) return;

    students = await request(
      `/student-session/class/${currentClassSelect.value}`
    );

    renderTable(students);
  }

  function renderTable(rows) {

    table.innerHTML = rows.map(s => `
      <tr class="border-b border-slate-700 hover:bg-slate-900">
        <td class="p-3">
          <input type="checkbox"
            class="studentCheck"
            value="${s._id}"/>
        </td>
        <td class="p-3">${s.name}</td>
        <td class="p-3">${s.rollNo}</td>
        <td class="p-3">${s.className}</td>
      </tr>
    `).join("");

    selectAll.checked = false;
  }

  currentClassSelect.addEventListener("change", loadStudents);

  selectAll.addEventListener("change", () => {
    document.querySelectorAll(".studentCheck")
      .forEach(cb => cb.checked = selectAll.checked);
  });

  /* PROMOTE SELECTED */
  promoteSelectedBtn.addEventListener("click", async () => {

    const selected = [
      ...document.querySelectorAll(".studentCheck:checked")
    ].map(cb => cb.value);

    if (!selected.length)
      return alert("Select at least one student");

    if (!newClassSelect.value)
      return alert("Select new class");

    await request("/student-session/promote", {
      method: "POST",
      body: JSON.stringify({
        studentIds: selected,
        newClass: newClassSelect.value
      })
    });

    alert("Students promoted successfully");

    loadStudents();
  });

  /* PROMOTE ENTIRE CLASS */
  promoteAllBtn.addEventListener("click", async () => {

    if (!students.length)
      return alert("No students found");

    if (!newClassSelect.value)
      return alert("Select new class");

    const allIds = students.map(s => s._id);

    await request("/student-session/promote", {
      method: "POST",
      body: JSON.stringify({
        studentIds: allIds,
        newClass: newClassSelect.value
      })
    });

    alert("Entire class promoted");

    loadStudents();
  });
}

export const getStudentsByClass = async (req, res) => {
  try {
    const { className } = req.query;

    if (!className) {
      return res.status(400).json({ message: "Class required" });
    }

    const activeSession = await AcademicSession.findOne({ isActive: true });

    if (!activeSession) {
      return res.status(400).json({ message: "No active session" });
    }

    const records = await StudentSession.find({
      sessionId: activeSession._id,
      className
    }).populate("studentId");

    const students = records
      .filter(r => r.studentId)
      .map(r => ({
        _id: r.studentId._id,
        name: r.studentId.name,
        rollNo: r.studentId.rollNo,
        className: r.className,
        section: r.section
      }));

    res.json(students);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

