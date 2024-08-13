
const express = require('express');
const router = express.Router();
const Teacher = require('../models/teacher');
const Student = require('../models/student');

router.delete('/delete_user', async (req, res) => {
  const { id, role } = req.body;

  try {
    if (role === 'teacher') {
      
      await Teacher.findByIdAndDelete(id);
    } else{
      
      await Student.findByIdAndDelete(id);
    }

    res.status(200).json({ message: 'User deleted successfully!' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user.' });
  }
});

module.exports = router;
