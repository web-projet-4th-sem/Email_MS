import React from "react";
import { useNavigate } from "react-router-dom";
import "./AdminUserManagement.css";

const batches = ["Select", "19/20", "20/21", "21/22", "22/23", "23/24"];
const departments = ["Select", "SE", "IS", "CIS", "DS"];

const users = [
  { id: 1, name: "Module 01" },
  { id: 2, name: "Module 02" },
  { id: 3, name: "Module 03" },
  { id: 4, name: "Module 04" },
];

const AdminUserManagement = () => {
  const navigate = useNavigate();

  const handleView = (id) => {
    navigate(`/admin/view-member/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/admin/edit-member/${id}`);
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
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

      {/* Main Section */}
      <main className="admin-main">
        <header className="admin-header">
          <div className="admin-header-text">
            <h2>Manage Users</h2>
          </div>
          <div className="admin-icons">
            <span>🔔</span>
            <span>💬</span>
          </div>
        </header>

        <section className="user-table-container">
          <table className="custom-user-table">
            <thead>
              <tr>
                <th>NO</th>
                <th>Name</th>
                <th>Batch</th>
                <th>Department</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>
                    <select className="dropdown">
                      {batches.map((batch) => (
                        <option key={batch}>{batch}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select className="dropdown">
                      {departments.map((dept) => (
                        <option key={dept}>{dept}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="view-btn" onClick={() => handleView(user.id)}>View</button>
                      <button className="edit-btn" onClick={() => handleEdit(user.id)}>Edit</button>
                      <button className="delete-btn">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="pagination-btn">Previous</button>
        </section>
      </main>
    </div>
  );
};

export default AdminUserManagement;
