const mongoose = require('mongoose');

const TeacherSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  assignedClassroom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Classroom',
    default: null
  }
});

module.exports = mongoose.model('Teacher', TeacherSchema);