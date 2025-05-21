import React from 'react'
import './ForgotPassword.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Optional: You can validate or trigger email sending here

    navigate('/otp-verification'); // Redirect to OTP Form
  };
  return (
    <div className="forgot-container d-flex justify-content-center align-items-center">
    <div className="forgot-box text-center">
      <img src="/web-project-logo.png" alt="Oxford Logo" className="logo-img mb-3" />
      <h5>Forgot Password</h5>
      <form className="mt-4" onSubmit={handleSubmit}>
        <label htmlFor="email" className="form-label">Email</label>
        <input
          type="email"
          className="form-control mb-3"
          id="email"
          placeholder="Enter your email"
          required
        />
        <button type="submit" className="btn btn-dark w-100">Submit</button>
      </form>
      <p className="mt-3">
          Already have an account? <Link to="/">Sign in</Link>
      </p>

    </div>
  </div>
  )
}
