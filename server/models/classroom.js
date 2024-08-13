// models/Classroom.js
const mongoose = require('mongoose');

const ClassroomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  schedule: {
    Monday: { start: String, end: String },
    Tuesday: { start: String, end: String },
    Wednesday: { start: String, end: String },
    Thursday: { start: String, end: String },
    Friday: { start: String, end: String },
    Saturday: { start: String, end: String },
  },
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
    },
  ],
  
});

module.exports = mongoose.model('Classroom', ClassroomSchema);