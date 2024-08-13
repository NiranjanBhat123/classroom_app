const jwt = require("jsonwebtoken");
const Teacher = require("../models/teacher");

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    const token = authHeader.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const teacher = await Teacher.findById(decoded.id);

    if (!teacher) {
      return res.status(401).json({ message: "Teacher not found" });
    }

    req.teacher = teacher;
    req.token = token;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Invalid token" });
    }
    console.error("Authentication error:", error);
    res.status(401).json({ message: "Please authenticate" });
  }
};

module.exports = auth;
