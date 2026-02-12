import mongoose from "mongoose";
import dotenv from "dotenv";
import Student from "../modules/student/student.model.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const classes = [
  "LKG",
  "UKG",
  "1", "2", "3", "4", "5",
  "6", "7", "8", "9", "10",
  "11", "12"
];

const firstNames = [
  "Aarav","Vivaan","Aditya","Vihaan","Arjun",
  "Sai","Krishna","Ishaan","Reyansh","Kabir",
  "Anaya","Diya","Ira","Saanvi","Myra",
  "Aadhya","Riya","Navya","Meera","Kiara"
];

const lastNames = [
  "Sharma","Verma","Patel","Reddy","Singh",
  "Kumar","Nair","Joshi","Gupta","Yadav"
];

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function seedStudents() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB Connected");

    // Optional: clear existing students
    await Student.deleteMany({});
    console.log("Old students removed");

    let students = [];

    classes.forEach((cls, classIndex) => {

      for (let i = 1; i <= 10; i++) {

        const first = random(firstNames);
        const last = random(lastNames);

        const rollNo = `${cls}-${i}`;
        const email =
          `${first.toLowerCase()}${classIndex}${i}@school.com`;

        students.push({
          name: `${first} ${last}`,
          rollNo,
          className: cls,
          gender: Math.random() > 0.5 ? "Male" : "Female",
          mobile:
            "9" + Math.floor(100000000 + Math.random() * 900000000),
          email,
          fatherName: `Mr. ${last}`,
          motherName: `Mrs. ${last}`,
        });
      }
    });

    await Student.insertMany(students);

    console.log("140 Students Inserted Successfully");
    process.exit();

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

seedStudents();
