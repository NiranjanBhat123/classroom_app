const express = require('express');
const router = express.Router();
const Teacher = require('../models/teacher'); 
const Student = require('../models/student'); 

router.put('/edit_user', async (req, res) => {
  const { id, email, role } = req.body;

  try {
    let userModel;

  
    if (role === 'teacher') {
      userModel = Teacher;
    } else if (role === 'student') {
      userModel = Student;
    } else {
      return res.status(400).json({ message: 'Invalid role' });
    }

   
    const updatedUser = await userModel.findByIdAndUpdate(id, { email }, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: `${role.charAt(0).toUpperCase() + role.slice(1)} updated successfully`, updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
});

module.exports = router;
