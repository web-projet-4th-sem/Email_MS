// psms-src-src/Lecturer/LecturerDashboard.js

import React from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ add this
import './LecturerDashboard.css';

const LecturerDashboard = () => {
  const navigate = useNavigate(); // ✅ init navigate function

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="logo">
          <img src="/web-project-logo.png" alt="Oxford Logo" />
        </div>
        <div className="profile">
          <img src="/profileImage.jpg" alt="Profile" className="avatar" />
          <div className="info">
            <p>Hi, Alex</p>
            <span>E173037</span>
          </div>
        </div>

        {/* ✅ Button onClick handlers to navigate to pages */}
        <nav className="nav-links">
          <button onClick={() => navigate('/lecturer/dashboard')}>📁 My Projects</button>
          <button onClick={() => navigate('/lecturer/review')}>👨‍🏫 Review</button>
          <button onClick={() => navigate('/lecturer/timeline')}>📅 Time lines</button>
          <button onClick={() => navigate('/lecturer/settings')}>⚙️ Settings</button>
        </nav>
      </aside>

      <main className="main-content">
        <header className="main-header">
          <h2>My projects</h2>
          <div className="icons">
            <span className="icon">🔔</span>
            <span className="icon">💬</span>
          </div>
        </header>

        <section className="projects-grid">
          {['OXF/ENG/01', 'OXF/DIT/01', 'OXF/HND/01'].map((code) =>
            [1, 2, 3].map((n) => (
              <div className="project-card" key={`${code}-${n}`}>
                <div className="icon">📄</div>
                <p>Project 0{n}</p>
                <span>{code}</span>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
};

export default LecturerDashboard;
