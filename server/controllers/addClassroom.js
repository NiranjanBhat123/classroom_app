const express = require('express');
const router = express.Router();
const Classroom = require('../models/classroom');

router.post('/create_classroom', async (req, res) => {
  try {
    const { name, schedule } = req.body;
    console.log(schedule);

    const newClassroom = new Classroom({
      name,
      schedule,
    });

    await newClassroom.save();

    res.status(201).json({ message: 'Classroom created successfully', classroom: newClassroom });
  } catch (error) {
    console.error('Error creating classroom:', error);
    res.status(500).json({ error: 'An error occurred while creating the classroom' });
  }
});

module.exports = router;