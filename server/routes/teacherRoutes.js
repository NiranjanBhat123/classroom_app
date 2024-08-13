const express = require("express");
const router = express.Router();
const auth = require("../middleware/teacherAuth");
const Student = require("../models/student");
const bcrypt = require("bcrypt");
const Classroom = require("../models/classroom");




router.get("/me", auth, (req, res) => {
  try {
    res.status(200).json({ email: req.teacher.email });
  } catch (error) {
    console.log("some error occured");
    res.status(500).json({ message: "Failed to load teacher information" });
  }
});

router.post("/add_student", auth, async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    
    let student = await Student.findOne({ email });
    
    if (student) {
      
      const teacher = req.teacher;
      if (!teacher.assignedClassroom) {
        return res
          .status(400)
          .json({ error: "You are not currently assigned to a classroom" });
      }

      const classroom = await Classroom.findById(teacher.assignedClassroom);
      if (!classroom) {
        return res.status(404).json({ error: "Assigned classroom not found" });
      }

      if (classroom.students.includes(student._id)) {
        return res
          .status(400)
          .json({ error: "Student is already assigned to this classroom" });
      }

      classroom.students.push(student._id);
      await classroom.save();

      return res.status(200).json({
        message: "Existing student added to classroom successfully",
      });
    } else {
      
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      student = new Student({
        email,
        password: hashedPassword,
      });

      await student.save();

      const teacher = req.teacher;
      if (!teacher.assignedClassroom) {
        return res
          .status(400)
          .json({ error: "You are not currently assigned to a classroom" });
      }

      const classroom = await Classroom.findById(teacher.assignedClassroom);
      if (!classroom) {
        return res.status(404).json({ error: "Assigned classroom not found" });
      }

      classroom.students.push(student._id);
      await classroom.save();

      res.status(201).json({
        message: "New student created and assigned to classroom successfully",
      });
    }
  } catch (error) {
    console.error("Error adding student:", error);
    res
      .status(500)
      .json({ error: "An error occurred while adding the student" });
  }
});




router.get('/classroom_info', auth, async (req, res) => {
  try {
    const teacher = req.teacher;
    if (!teacher || !teacher.assignedClassroom) {
      return res.status(400).json({ error: 'Teacher not assigned to any classroom' });
    }

    const classroomId = teacher.assignedClassroom;
    const classroom = await Classroom.findById(classroomId).populate('students');
    if (!classroom) {
      return res.status(404).json({ error: 'Classroom not found' });
    }

    const students = await Student.find({ _id: { $in: classroom.students } });

    res.status(200).json({
      classroom,
      students,
    });
  } catch (error) {
    console.error('Error fetching classroom info:', error);
    res.status(500).json({ error: 'Failed to fetch classroom information' });
  }
});


module.exports = router;
