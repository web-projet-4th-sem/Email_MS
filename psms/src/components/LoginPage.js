import React, { useState } from "react";
import "./LoginPage.css";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.msg || "Login failed");
        return;
      }

      if (data.token && data.user && data.user.role) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userRole", data.user.role);

        if (data.user.role === "admin") navigate("/admin/dashboard");
        else if (data.user.role === "student") navigate("/student/dashboard");
        else if (data.user.role === "lecturer") navigate("/lecturer/dashboard");
        else alert("Unknown role: " + data.user.role);
      } else {
        alert("Unexpected response from server");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
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
}
