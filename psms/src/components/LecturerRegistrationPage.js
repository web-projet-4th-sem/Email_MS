import React from 'react';
import './LecturerRegistrationForm.css';
import { Link } from 'react-router-dom';


export default function LecturerRegistrationPage() {
  const handleLecturerSubmit = (e) => {
    e.preventDefault();
    alert("Lecturer registration submitted!");
  };

  return (
    <div className="lecturer-form-container">
      <img src="/web-project-logo.png" alt="Oxford Logo" className="logo" />
      <h3>Sign up Your Account</h3>
      <form onSubmit={handleLecturerSubmit}>
        <label>Full Name</label>
        <input type="text" placeholder="Enter full name" required />

        <label>Position</label>
        <input type="text" placeholder="Enter position" required />

        <label>Department</label>
        <input type="text" placeholder="Enter department" required />

        <button type="submit">Register</button>
      </form>
      <div className="sign-in-text">
  Already have an account? <Link to="/">Sign in</Link>
</div>
    </div>
  );
}
