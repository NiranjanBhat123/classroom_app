import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import RoleSelection from './components/RoleSelection';
import PrincipalLogin from './components/PrincipalLogin';
import TeacherLogin from './components/TeacherLogin';
import StudentLogin from './components/StudentLogin';
import PrincipalDashBoard from './components/PrincipalDashBoard';
import TeacherDashBoard from './components/TeacherDashBoard';
import StudentDashBoard from './components/StudentDashBoard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RoleSelection />} />
        <Route path="/login/principal" element={<PrincipalLogin />} />
        <Route path="/login/teacher" element={<TeacherLogin />} />
        <Route path="/login/student" element={<StudentLogin />} />
        <Route path="/principal/dashboard" element={<PrincipalDashBoard />} />
        <Route path="/teacher/dashboard" element={<TeacherDashBoard />} />
        <Route path="/student/dashboard" element={<StudentDashBoard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;