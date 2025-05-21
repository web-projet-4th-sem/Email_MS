/*import React, { useState } from 'react';
import './LoginPage.css';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      const { role } = res.data;

      if (role === 'lecturer') navigate('/lecturer');
      else if (role === 'student') navigate('/student');
      else if (role === 'admin') navigate('/admin');
      else alert('Unknown role.');
    } catch (err) {
      alert('Login failed: ' + (err.response?.data?.msg || 'Server error'));
    }
   
   
  };

  return (
    <div className="login-form-container">
      <img src="/web-project-logo.png" alt="Oxford Logo" className="logo" />
      <h3>Sign in Your Account</h3>
      <form onSubmit={handleLogin}>
        <label>Email</label>
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="options">
          <label>
            <input type="checkbox" />
            Remember my preference
          </label>
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>

        <button type="submit">Sign In</button>
      </form>
      <div className="signup-text">
        Don't have an account? <Link to="/register">Sign up</Link>
      </div>
    </div>
  );
}*/
// psms-src-src/components/LoginPage.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Simulate login check without backend
    if (email === 'admin1@gmail.com' && password === 'Temp@123') {
      navigate('/admin/dashboard');
    } else if (email === 'lecturer1@gmail.com' && password === 'Temp@123') {
      navigate('/lecturer/dashboard');
    } else if (email === 'student1@gmail.com' && password === 'Temp@123') {
      navigate('/student/dashboard');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;
