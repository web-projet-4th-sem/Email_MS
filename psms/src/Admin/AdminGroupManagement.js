import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminGroupManagement.css';

const AdminGroupManagement = () => {
  const navigate = useNavigate();

  const handleGroupClick = (group) => {
    navigate(`/admin/manage-groups/${group}`);
  };

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
            <h2>Manage Groups</h2>
          </div>
          <div className="admin-icons">
            <span>🔔</span>
            <span>💬</span>
          </div>
        </header>

        <section className="group-grid">
          <div className="group-card" onClick={() => handleGroupClick('CIS')}>
            1st Sem Project<br />CIS
          </div>
          <div className="group-card selected" onClick={() => handleGroupClick('SE')}>
            1st Sem Project<br />SE
          </div>
          <div className="group-card" onClick={() => handleGroupClick('DS')}>
            1st Sem Project<br />DS
          </div>
          <div className="group-card" onClick={() => handleGroupClick('IS')}>
            1st Sem Project<br />IS
          </div>
          <div className="group-card add-new" onClick={() => alert("Add new project group")}>
            Add projects<br /><span className="plus">+</span>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminGroupManagement;
