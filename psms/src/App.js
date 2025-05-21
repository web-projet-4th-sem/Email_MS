/*import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegistrationPage from './components/RegistrationPage';
import LoginPage from './components/LoginPage';
import ForgotPassword from './components/ForgotPassword';
import OtpForm from './components/OtpForm';
import LecturerDashboard from './Lecturer/LecturerDashboard';
import LecturerReview from './Lecturer/LecturerReview';
import LecturerSettings from './Lecturer/LecturerSettings';
import StudentDashboard from './Student/StudentDashboard';
import AddProposal from './Student/AddProposal';
import StudentSettings from './Student/StudentSettings';
import StudentTimeline from './Student/StudentTimeline';
import LecturerTimeline from './Lecturer/LecturerTimeline';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/otp-verification" element={<OtpForm />} />
        <Route path="/lecturer" element={<LecturerDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;*/
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegistrationPage from './components/RegistrationPage';
import LoginPage from './components/LoginPage';
import ForgotPassword from './components/ForgotPassword';
import OtpForm from './components/OtpForm';

import LecturerDashboard from './Lecturer/LecturerDashboard';
import LecturerReview from './Lecturer/LecturerReview';
import LecturerSettings from './Lecturer/LecturerSettings';
import LecturerTimeline from './Lecturer/LecturerTimeline';

import StudentDashboard from './Student/StudentDashboard';
import AddProposal from './Student/AddProposal';
import StudentSettings from './Student/StudentSettings';
import StudentTimeline from './Student/StudentTimeline';

import AdminDashboard from './Admin/AdminDashboard';
import AdminUserManagement from './Admin/AdminUserManagement';
import AdminGroupManagement from './Admin/AdminGroupManagement';
import AdminSettings from './Admin/AdminSettings';
import AddGroupMembers from './Admin/AddGroupMembers';
import ViewMember from './Admin/ViewMember'; 
import EditMember from './Admin/EditMember'; 


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/otp" element={<OtpForm />} />

        {/* Dashboards */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/lecturer/dashboard" element={<LecturerDashboard />} />

        {/* Student routes */}
        <Route path="/student/add-proposal" element={<AddProposal />} />
        <Route path="/student/settings" element={<StudentSettings />} />
        <Route path="/student/timeline" element={<StudentTimeline />} />

        {/* Lecturer routes */}
        <Route path="/lecturer/review" element={<LecturerReview />} />
        <Route path="/lecturer/settings" element={<LecturerSettings />} />
        <Route path="/lecturer/timeline" element={<LecturerTimeline />} />

        {/* Admin routes */}
        <Route path="/admin/manage-users" element={<AdminUserManagement />} />
        <Route path="/admin/manage-groups" element={<AdminGroupManagement />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
        <Route path="/admin/manage-groups/:groupId" element={<AddGroupMembers />} />
       <Route path="/admin/view-member/:id" element={<ViewMember />} />
       <Route path="/admin/edit-member/:id" element={<EditMember />} />
        
      </Routes>
    </Router>
  );
}

export default App;

