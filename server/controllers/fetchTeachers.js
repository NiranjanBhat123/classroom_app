const express = require('express');
const router = express.Router();
const Teacher = require('../models/teacher');


router.get('/fetch_teachers', async (req, res) => {
  try {
    const teachers = await Teacher.find({ assignedClassroom: null }, "_id email");
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching teachers" });
  }
});



module.exports = router;