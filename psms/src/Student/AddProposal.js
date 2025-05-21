import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddProposal.css';

const LecturerReview = () => {
   const navigate = useNavigate();
  const reviewInputRef = useRef(null);
  const [reviewText, setReviewText] = useState('');

  const handleDownload = () => {
    // Replace the below with your actual file download URL
    const link = document.createElement('a');
    link.href = '/sample-document.pdf';
    link.download = 'review-document.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
          <h2>Proposal Submission</h2>
          <div className="icons">
            <span className="icon">🔔</span>
            <span className="icon">💬</span>
          </div>
        </header>

        <section className="review-section">
          <button className="download-button" onClick={handleDownload}>
            Add Document
          </button>

          <button className="mark-button">
            ➕ 
          </button>
        </section>
      </main>
    </div>
  );
};

export default LecturerReview;
