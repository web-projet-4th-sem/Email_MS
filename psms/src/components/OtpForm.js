import React, { useState } from 'react';
import './OtpForm.css';
import { useNavigate } from 'react-router-dom';


const OtpForm = () => {
  const [otp, setOtp] = useState(Array(6).fill(''));

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/, ''); // Allow only numbers
    if (value) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      // Focus next input
      if (index < 5 && e.target.nextSibling) {
        e.target.nextSibling.focus();
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`OTP Submitted: ${otp.join('')}`);
  };

  const handleResend = () => {
    alert("OTP Resent");
  };
  const navigate = useNavigate();
  const handleBackToLogin = () => {
    navigate('/');
  };
  

  return (
    <div className="otp-container">
      <img src="/web-project-logo.png" alt="Logo" className="otp-logo" />
      <h3>Sent OTP on Your Email</h3>
      <form onSubmit={handleSubmit} className="otp-form">
        <div className="otp-inputs">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e, index)}
            />
          ))}
        </div>
        <button type="button" className="resend-btn" onClick={handleResend}>
          Resent OTP
        </button>
        <button type="submit" className="submit-btn">Submit</button>
        <p className="back-link" onClick={handleBackToLogin} style={{ cursor: 'pointer', color: 'blue' }}>
  Back to Login Page
</p>

      </form>
    </div>
  );
};

export default OtpForm;
