import React from 'react';
import './StudentRegistrationForm.css';
import { Link } from 'react-router-dom';


export default function StudentRegistrationForm() {
  const handleStudentSubmit = (e) => {
    e.preventDefault();
    alert("Student registration submitted!");
  };

  return (
    <div className="student-form-container">
      <img src="/web-project-logo.png" alt="Oxford Logo" className="logo" />
      <h3>Sign up Your Account</h3>
      <form onSubmit={handleStudentSubmit}>
        <label>Full Name</label>
        <input type="text" placeholder="Enter full name" required />

        <label>Batch</label>
        <input type="text" placeholder="Enter batch" required />

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
