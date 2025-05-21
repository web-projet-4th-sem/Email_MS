import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <img src="/web-project-logo.png" alt="Oxford Logo" />
        </div>
        <div className="admin-profile">
          <img src="/profileImage.jpg" alt="Profile" className="admin-avatar" />
          <div className="admin-info">
            <p>Hi, Alex</p>
            <span>E173037</span>
          </div>
        </div>
        <nav className="admin-nav">
          <button onClick={() => navigate('/admin/dashboard')}>📊 Dash Board</button>
          <button onClick={() => navigate('/admin/manage-users')}>👥 Manage Users</button>
          <button onClick={() => navigate('/admin/manage-groups')}>👨‍👩‍👧‍👦 Manage Groups</button>
          <button onClick={() => navigate('/admin/settings')}>⚙️ Settings</button>
        </nav>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div className="admin-header-text">
            <h2>Dash Board</h2>
            <h3>Welcome</h3>
          </div>
          <div className="admin-icons">
            <span>🔔</span>
            <span>💬</span>
          </div>
        </header>

        <section className="admin-stats">
          <div className="stat-box">Total Admins<br /><strong>01</strong></div>
          <div className="stat-box">Total Lectures<br /><strong>01</strong></div>
          <div className="stat-box">Total Students<br /><strong>01</strong></div>
          <div className="stat-box">Total Projects<br /><strong>01</strong></div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
