const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const router = express.Router();

const Teacher = require("../models/teacher");

router.post("/add_teacher", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) {
      return res
        .status(400)
        .json({ error: "Teacher with this email already exists" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newTeacher = new Teacher({
      email,
      password: hashedPassword,
    });

    await newTeacher.save();

    res.status(201).json({ message: "Teacher added successfully" });
  } catch (error) {
    console.error("Error adding teacher:", error);
    res
      .status(500)
      .json({ error: "An error occurred while adding the teacher" });
  }
});

module.exports = router;
