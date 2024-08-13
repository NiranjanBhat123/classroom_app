// components/RoleSelection.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserTie, faChalkboardTeacher, faUserGraduate } from '@fortawesome/free-solid-svg-icons';
import '../styles/RoleSelection.css';

function RoleSelection() {
  return (
    <div className="role-selection">
      <h1>Select Your Role</h1>
      <div className="role-buttons">
        <Link to="/login/principal" className="role-button">
          <FontAwesomeIcon icon={faUserTie} size="3x" />
          <span>Principal</span>
        </Link>
        <Link to="/login/teacher" className="role-button">
          <FontAwesomeIcon icon={faChalkboardTeacher} size="3x" />
          <span>Teacher</span>
        </Link>
        <Link to="/login/student" className="role-button">
          <FontAwesomeIcon icon={faUserGraduate} size="3x" />
          <span>Student</span>
        </Link>
      </div>
    </div>
  );
}

export default RoleSelection;