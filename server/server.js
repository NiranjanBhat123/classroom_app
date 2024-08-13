require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const principalRoutes = require('./routes/principalRoutes');
const teacherAuthRoutes = require('./routes/teacherAuthRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const studentRoutes = require('./routes/studentRoutes');
const studentAuthRoutes = require("./routes/studentAuthRoutes");

const app = express();

connectDB();


app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/principal',principalRoutes);
app.use('/api/teacher_auth',teacherAuthRoutes);
app.use('/api/teacher',teacherRoutes);
app.use('/api/student_auth',studentAuthRoutes);
app.use('/api/student',studentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));