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

        {/* ✅ Footer Added Here */}
        <footer className="border-t border-gray-200 pt-4 pb-4 text-sm text-gray-500 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <span>© {new Date().getFullYear()} Project Supervision System</span>
              <span className="hidden sm:inline">|</span>
              <span className="flex items-center space-x-1">
                <span role="img" aria-label="student">🎓</span>
                <span>Student Portal</span>
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <a href="/dashboard" className="hover:text-blue-600 transition-colors flex items-center">
                🧭 Dashboard
              </a>
              <a href="/profile" className="hover:text-blue-600 transition-colors flex items-center">
                👤 Profile
              </a>
              <a href="/support" className="hover:text-blue-600 transition-colors flex items-center">
                🛠️ Support
              </a>
            </div>

            <div className="text-center md:text-right">
              <span className="flex items-center space-x-1">
                <span role="img" aria-label="heart"></span>
                <span>Designed for SE Web Projects</span>
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
