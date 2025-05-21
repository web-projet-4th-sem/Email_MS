// RegistrationPage.js
import './RegistrationPage.css';
import React, { useState } from 'react';
import StudentRegistrationForm from './StudentRegistrationForm';
import LecturerRegistrationPage from './LecturerRegistrationPage'; // Corrected import
import { Link } from 'react-router-dom';

export default function RegistrationPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState('');

  const handleNext = (e) => {
    e.preventDefault(); // Prevent form refresh
    if (selectedRole) {
      setCurrentStep(2);
    } else {
      alert("Please select a role before proceeding.");
    }
  };

  // Redirect to specific role form
  if (currentStep === 2) {
    if (selectedRole === "Student") {
      return <StudentRegistrationForm />;
    } else if (selectedRole === "Lecturer") {
      return <LecturerRegistrationPage />;
    } else {
      return <div>Admin registration not yet implemented.</div>;
    }
  }

  return (
    <div className="registration-container">
      <div className="registration-card">
        <div className="registration-header">
          <img src="/web-project-logo.png" alt="Logo" style={{ width: "100px" }} />
          <h3>Sign up Your Account</h3>
        </div>

        {/* Form step 1 */}
        <form onSubmit={handleNext}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username</label>
            <input type="text" className="form-control" id="username" placeholder="Enter username" />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" className="form-control" id="password" placeholder="Enter password" />
          </div>

          <div className="mb-3">
            <label htmlFor="role" className="form-label">Role</label>
            <select
              className="form-select"
              id="role"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="">Select role</option>
              <option value="Student">Student</option>
              <option value="Lecturer">Lecturer</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <button type="submit" className="btn btn-dark w-100">Next</button>

          
          <div className="mt-3 text-center">
  Already have an account? <Link to="/">Sign in</Link>
</div>

        </form>
      </div>
    </div>
  );
}
