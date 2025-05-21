import React from 'react';
import './EditMember.css';

const EditMember = () => {
  return (
    <div className="member-container">
      <h2 className="title">Members Details</h2>
      <div className="form-box">
        <div className="form-section">
          <label>Full Name</label>
          <input type="text" placeholder="Enter full name" />

          <label>Email</label>
          <input type="email" placeholder="Enter email" />

          <label>Password</label>
          <input type="password" placeholder="Enter password" />
        </div>
        <div className="form-section">
          <label>Role</label>
          <input type="text" placeholder="Enter role" />

          <label>Batch</label>
          <input type="text" placeholder="Enter batch" />

          <label>Department</label>
          <input type="text" placeholder="Enter department" />
        </div>
      </div>
      <button className="edit-button">Save</button>
    </div>
  );
};

export default EditMember;
