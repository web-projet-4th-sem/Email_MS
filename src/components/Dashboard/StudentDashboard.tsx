import { useState } from 'react';
import Header from '../Layout/Header';
import Sidebar from '../Layout/Sidebar';
import StudentProjects from './Student/StudentProjects';
import StudentProfile from './Student/StudentProfile';

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('projects');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
          userRole="student" 
        />
      </div>
      
      {/* Main content */}
      <div className="flex flex-col flex-1 w-0 lg:w-auto overflow-hidden">
        <Header 
          title="Student Dashboard" 
          subtitle="Manage your projects and submissions"
          onMenuClick={() => setIsSidebarOpen(true)}
        />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-2 py-4 sm:px-4 sm:py-6 lg:px-8 lg:py-8 max-w-7xl">
            {renderContent()}
          </div>
        </main>

        {/* Footer - Mobile Responsive */}
        <footer className="border-t border-gray-200 pt-3 pb-3 sm:pt-4 sm:pb-4 text-xs sm:text-sm text-gray-500 bg-white">
          <div className="container mx-auto px-2 sm:px-4 lg:px-8 max-w-6xl">
            <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-col items-center space-y-1 sm:flex-row sm:space-y-0 sm:space-x-2">
                <span>© {new Date().getFullYear()} Project Supervision System</span>
                <span className="hidden sm:inline">|</span>
                <span className="flex items-center space-x-1">
                  <span role="img" aria-label="student">🎓</span>
                  <span>Student Portal</span>
                </span>
              </div>

              <div className="flex flex-col items-center space-y-1 sm:flex-row sm:space-y-0 sm:space-x-4">
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
