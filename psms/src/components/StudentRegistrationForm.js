import React, { useState } from 'react';
import './StudentRegistrationForm.css';
import { Link, useNavigate } from 'react-router-dom';

export default function StudentRegistrationForm() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [batch, setBatch] = useState('');
  const [department, setDepartment] = useState('');
  const [password, setPassword] = useState('');

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          batch,
          department,
          email,
          password,
          role: 'student'
        })
      });

      const data = await res.json();
      if (res.ok) {
        alert('Student registered successfully!');
        navigate('/');
      } else {
        alert(data.msg || 'Registration failed');
      }
    } catch (err) {
      console.error(err);
      alert('Server error');
    }
  };

  return (
    <div className="student-form-container">
      <img src="/web-project-logo.png" alt="Oxford Logo" className="logo" />
      <h3>Sign up Your Account</h3>
      <form onSubmit={handleStudentSubmit}>
        <label>Full Name</label>
        <input type="text" placeholder="Enter full name" value={name} onChange={(e) => setName(e.target.value)} required />

        <label>Email</label>
        <input type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label>Batch</label>
        <input type="text" placeholder="Enter batch" value={batch} onChange={(e) => setBatch(e.target.value)} required />

        <label>Department</label>
        <input type="text" placeholder="Enter department" value={department} onChange={(e) => setDepartment(e.target.value)} required />

        <label>Password</label>
        <input type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        <button type="submit">Register</button>
      </form>
      <div className="sign-in-text">
        Already have an account? <Link to="/">Sign in</Link>
      </div>
    </div>
  );
}
