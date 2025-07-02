import React from 'react';
import { 
  LayoutDashboard, 
  FolderOpen, 
  User, 
  Users, 
  BookOpen,
  Plus
} from 'lucide-react';

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
      </div>
    </aside>
  );
}