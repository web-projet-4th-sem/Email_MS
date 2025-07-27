import { useState } from 'react';
import Header from '../Layout/Header';
import Sidebar from '../Layout/Sidebar';
import LecturerProjects from './Lecturer/LecturerProjects';
import LecturerProfile from './Lecturer/LecturerProfile';

export default function LecturerDashboard() {
  const [activeTab, setActiveTab] = useState('projects');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-64 transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar 
          activeTab={activeTab} 
          onTabChange={(tab) => {
            setActiveTab(tab);
            setIsSidebarOpen(false); // Close sidebar on mobile after selection
          }} 
          userRole="lecturer" 
        />
      </div>
      
      {/* Main content */}
      <div className="flex flex-col flex-1 w-0 overflow-hidden lg:w-auto">
        <Header 
          title="Lecturer Dashboard" 
          subtitle="Supervise projects and provide feedback"
          onMenuClick={() => setIsSidebarOpen(true)}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="container px-2 py-4 mx-auto sm:px-4 sm:py-6 lg:px-8 lg:py-8 max-w-7xl">
            {renderContent()}
          </div>
        </main>

        {/* Footer - Mobile Responsive */}
        <footer className="pt-3 pb-3 text-xs text-gray-500 bg-white border-t border-gray-200 sm:pt-4 sm:pb-4 sm:text-sm">
          <div className="container max-w-6xl px-2 mx-auto sm:px-4 lg:px-8">
            <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-col items-center space-y-1 sm:flex-row sm:space-y-0 sm:space-x-2">
                <span>© {new Date().getFullYear()} Project Supervision System</span>
                <span className="hidden sm:inline">|</span>
                <span className="flex items-center space-x-1">
                  <span role="img" aria-label="lecturer">👨‍🏫</span>
                  <span>Lecturer Portal</span>
                </span>
              </div>

              <div className="flex flex-col items-center space-y-1 sm:flex-row sm:space-y-0 sm:space-x-4">
                <a href="/dashboard" className="flex items-center transition-colors hover:text-blue-600">
                  🧭 Dashboard
                </a>
                <a href="/profile" className="flex items-center transition-colors hover:text-blue-600">
                  👤 Profile
                </a>
                <a href="/support" className="flex items-center transition-colors hover:text-blue-600">
                  🛠️ Support
                </a>
              </div>
              

              <div className="text-center md:text-right">
                <span className="flex items-center justify-center space-x-1">
                  <span role="img" aria-label="heart">❤️</span>
                  <span>Designed for SE Web Projects</span>
                </span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}