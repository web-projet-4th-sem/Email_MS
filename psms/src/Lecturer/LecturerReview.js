import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ add this
import './LecturerReview.css';

const LecturerReview = () => {
  const navigate = useNavigate(); // ✅ init navigate function
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

  const handleAddReview = () => {
    reviewInputRef.current?.scrollIntoView({ behavior: 'smooth' });
    reviewInputRef.current?.focus();
  };

  const handleSendReview = () => {
    if (reviewText.trim()) {
      console.log('Review sent:', reviewText);
      // TODO: Send to backend
      alert('Review sent successfully!');
      setReviewText('');
    } else {
      alert('Please enter a review before sending.');
    }
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
          <button onClick={() => navigate('/lecturer/dashboard')}>📁 My Projects</button>
          <button onClick={() => navigate('/lecturer/review')}>👨‍🏫 Review</button>
          <button onClick={() => navigate('/lecturer/timeline')}>📅 Time lines</button>
          <button onClick={() => navigate('/lecturer/settings')}>⚙️ Settings</button>
        </nav>
      </aside>

      <main className="main-content">
        <header className="main-header">
          <h2>Review</h2>
          <div className="icons">
            <span className="icon">🔔</span>
            <span className="icon">💬</span>
          </div>
        </header>

        <section className="review-section">
          <button className="download-button" onClick={handleDownload}>
            Download Document
          </button>
          <button className="review-button" onClick={handleAddReview}>
            Add Review
          </button>

          <div className="review-box">
            <textarea
              ref={reviewInputRef}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Type your review here..."
            />
            <button className="send-button" onClick={handleSendReview}>
              Send
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LecturerReview;
