const express = require("express");
const router = express.Router();
const Classroom = require("../models/classroom");

router.get("/fetch_classrooms", async (req, res) => {
  try {
    const classrooms = await Classroom.find({}, "_id name");
    res.json(classrooms);
  } catch (error) {
    res.status(500).json({ message: "Error fetching classrooms" });
  }
});


module.exports = router;