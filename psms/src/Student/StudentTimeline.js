import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import './StudentTimeline.css';

const StudentTimeline = () => {
  const navigate = useNavigate();
  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="logo">
          <img src="/web-project-logo.png" alt="Oxford Logo" />
        </div>
        <div className="profile">
          <img src="/profileImage.jpg" alt="Profile" className="avatar" />
          <div className="profile-info">
            <p>Hi, Alex</p>
            <span>E173037</span>
          </div>
        </div>
        <nav className="nav-links">
          <button onClick={() => navigate('/student/dashboard')}>📁 My Projects</button> {/* ✅ NEW */}
          <button onClick={() => navigate('/student/add-proposal')}>📝 Add Proposals</button> {/* ✅ NEW */}
          <button onClick={() => navigate('/student/timeline')}>📅 Time lines</button> {/* ✅ NEW */}
          <button onClick={() => navigate('/student/settings')}>⚙️ Settings</button> {/* ✅ NEW */}
        </nav>
      </aside>

      <main className="main-content">
        <header className="main-header">
          <h2>Time Lines</h2>
          <div className="icons">
            <span className="icon">🔔</span>
            <span className="icon">💬</span>
          </div>
        </header>

        <div className="timeline-box">
          <div className="timeline-header">
            <span>Project_Name</span>
            <span>Deadline</span>
            <span>Remaining</span>
            <span>Status</span>
          </div>

          <div className="timeline-row">
            <span>Module 01</span>
            <span>02/05/2026</span>
            <span>01 days more</span>
            <span className="status completed">Completed</span>
          </div>
          <div className="timeline-row">
            <span>Module 02</span>
            <span>02/05/2026</span>
            <span>01 days more</span>
            <span className="status ongoing">Ongoing</span>
          </div>
          <div className="timeline-row">
            <span>Module 03</span>
            <span>02/05/2026</span>
            <span>01 days more</span>
            <span className="status pending">Pending</span>
          </div>
          <div className="timeline-row">
            <span>Module 04</span>
            <span>02/05/2026</span>
            <span>01 days more</span>
            <span className="status pending">Pending</span>
          </div>

          <div className="pagination">
            <button>Previous</button>
            <button>Next</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentTimeline;
