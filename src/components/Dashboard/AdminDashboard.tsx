import React, { useState } from 'react';
import Header from '../Layout/Header';
import Sidebar from '../Layout/Sidebar';
import AdminOverview from './Admin/AdminOverview';
import CreateProject from './Admin/CreateProject';
import ProjectList from './Admin/ProjectList';
import UserList from './Admin/UserList';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <AdminOverview />;
      case 'create-project':
        return <CreateProject />;
      case 'projects':
        return <ProjectList />;
      case 'users':
        return <UserList />;
      default:
        return <AdminOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} userRole="admin" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Admin Dashboard" subtitle="Manage projects and users" />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {renderContent()}
          </div>
        </main>
      </div>
       
    </div>
  );
}