const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Teacher = require('../models/teacher');
const Student = require('../models/student');
const Classroom = require('../models/classroom');

router.get('/fetch_users', async (req, res) => {
  try {
    // Fetch all teachers and students
    const [teachers, students] = await Promise.all([
      Teacher.find({}).select('email assignedClassroom'),
      Student.find({}).select('email')
    ]);

    // Fetch classroom names for teachers
    const teacherData = await Promise.all(teachers.map(async (teacher) => {
      let classroomName = 'No classroom assigned';
      if (teacher.assignedClassroom) {
        const classroom = await Classroom.findById(teacher.assignedClassroom).select('name');
        classroomName = classroom ? classroom.name : 'No classroom assigned';
      }

      return {
        ...teacher._doc,
        role: 'Teacher',
        assignedClassroom: classroomName
      };
    }));

    // Map students with default classroom assignment
    const studentData = students.map(student => ({
      ...student._doc,
      role: 'Student',
      assignedClassroom: 'No classroom assigned'
    }));

    // Combine teachers and students data
    const users = [...teacherData, ...studentData];

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
});

module.exports = router;
