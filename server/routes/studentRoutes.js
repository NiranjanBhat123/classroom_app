const express = require("express");
const router = express.Router();
const auth = require("../middleware/studentAuth");
const Student = require("../models/student");
const bcrypt = require("bcrypt");
const Classroom = require("../models/classroom");

router.get("/me", auth, (req, res) => {
  try {
    res.status(200).json({ email: req.student.email,id:req.student._id });
  } catch (error) {
    console.log("some error occured");
    res.status(500).json({ message: "Failed to load teacher information" });
  }
});

router.get("/:studentId", async (req, res) => {
  try {
    const studentId = req.params.studentId;
    console.log(`student id is ${studentId}`);
    const classrooms = await Classroom.find({ students: studentId })
      .populate("students", "email")
      .select("name students");
    console.log("reached till here , classrooms are", classrooms);
    if (!classrooms || classrooms.length === 0) {
      return res
        .status(404)
        .json({ message: "No classrooms found for this student" });
    }

    const formattedClassrooms = classrooms.map((classroom) => ({
      _id: classroom._id,
      name: classroom.name,
      students: classroom.students.map((student) => ({
        _id: student._id,
        email: student.email,
      })),
    }));

    console.log(`formatted data for the student is ${formattedClassrooms}`);

    res.json({ classrooms: formattedClassrooms });
  } catch (error) {
    console.error("Error fetching classrooms:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
