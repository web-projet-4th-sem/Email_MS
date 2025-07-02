import React, { useState } from 'react';
import Header from '../Layout/Header';
import Sidebar from '../Layout/Sidebar';
import LecturerProjects from './Lecturer/LecturerProjects';
import LecturerProfile from './Lecturer/LecturerProfile';

export default function LecturerDashboard() {
  const [activeTab, setActiveTab] = useState('projects');

  const renderContent = () => {
    switch (activeTab) {
      case 'projects':
        return <LecturerProjects />;
      case 'profile':
        return <LecturerProfile />;
      default:
        return <LecturerProjects />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} userRole="lecturer" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Lecturer Dashboard" subtitle="Supervise projects and provide feedback" />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}