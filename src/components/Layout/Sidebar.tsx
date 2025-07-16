import React from 'react';
import { 
  LayoutDashboard, 
  FolderOpen, 
  User, 
  Users, 
  BookOpen,
  Plus
} from 'lucide-react';
import { useState, useEffect } from 'react'; // <-- Add this
import { Bell } from 'lucide-react'; // <-- Already imported others, just add Bell too
import { useNotification } from '../../contexts/NotificationContext';



interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  userRole: 'admin' | 'student' | 'lecturer';
}

export default function Sidebar({ activeTab, onTabChange, userRole }: SidebarProps) {
  const getMenuItems = (): SidebarItem[] => {
    switch (userRole) {
      case 'admin':
        return [
          { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-5 h-5" /> },
          { id: 'create-project', label: 'Create Project', icon: <Plus className="w-5 h-5" /> },
          { id: 'projects', label: 'All Projects', icon: <FolderOpen className="w-5 h-5" /> },
          { id: 'users', label: 'Users', icon: <Users className="w-5 h-5" /> }
        ];
      case 'student':
        return [
          { id: 'projects', label: 'My Projects', icon: <BookOpen className="w-5 h-5" /> },
          { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> }
        ];
      case 'lecturer':
        return [
          { id: 'projects', label: 'Supervised Projects', icon: <BookOpen className="w-5 h-5" /> },
          { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> }
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

const { notificationCount, notifications, clearNotifications } = useNotification();
const [dropdownOpen, setDropdownOpen] = useState(false);

const toggleDropdown = () => {
  setDropdownOpen(prev => !prev);
};

  return (
    <aside className="bg-white w-64 min-h-screen shadow-sm border-r border-gray-200">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Navigation</h2>
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                activeTab === item.id
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {item.icon}
              <span className="ml-3 font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="mt-8 px-4 relative">
  <button
    onClick={toggleDropdown}
    className="relative flex items-center gap-2 text-gray-700 hover:text-blue-600 transition w-full"
  >
    <Bell className="w-5 h-5" />
    <span className="font-medium">Notifications</span>
    {notificationCount > 0 && (
      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
        {notificationCount}
      </span>
    )}
  </button>

  {dropdownOpen && (
    <div className="absolute left-0 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-80 overflow-y-auto">
      {notifications.length === 0 ? (
        <p className="p-4 text-sm text-gray-500 text-center">No notifications</p>
      ) : (
        notifications.map((n) => (
          <div
            key={n._id}
            className={`px-4 py-2 text-sm border-b border-gray-100 ${
              n.read ? 'text-gray-500' : 'text-gray-900 font-semibold'
            }`}
          >
            <p>{n.message}</p>
            <span className="text-xs text-gray-400">
              {new Date(n.createdAt).toLocaleString()}
            </span>
          </div>
        ))
      )}

      <button
        onClick={clearNotifications}
        className="w-full text-center text-sm text-blue-600 hover:underline py-2 bg-gray-50 rounded-b-lg"
      >
        Mark all as read
      </button>
    </div>
  )}
</div>

      </div>
    </aside>
  );
}