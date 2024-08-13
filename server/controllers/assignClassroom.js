const express = require("express");
const router = express.Router();
const Teacher = require("../models/teacher");
const Classroom = require("../models/classroom");

router.post("/assign_classroom", async (req, res) => {
  try {
    const { teacherId, classroomId } = req.body;

    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const classroom = await Classroom.findById(classroomId);
    if (!classroom) {
      return res.status(404).json({ message: "Classroom not found" });
    }

    teacher.assignedClassroom = classroomId;
    await teacher.save();

    res.json({ message: "Classroom assigned successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error assigning classroom" });
  }
});


module.exports = router;