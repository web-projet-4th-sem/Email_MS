import React, { useState } from 'react';
import Header from '../Layout/Header';
import Sidebar from '../Layout/Sidebar';
import StudentProjects from './Student/StudentProjects';
import StudentProfile from './Student/StudentProfile';

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('projects');

  const renderContent = () => {
    switch (activeTab) {
      case 'projects':
        return <StudentProjects />;
      case 'profile':
        return <StudentProfile />;
      default:
        return <StudentProjects />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} userRole="student" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Student Dashboard" subtitle="Manage your projects and submissions" />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}