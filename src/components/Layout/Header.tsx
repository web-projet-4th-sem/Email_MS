import React from 'react';
import { LogOut, User, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="text-sm">
                <p className="font-medium text-gray-900">{user?.name}</p>
                <p className="text-gray-600 capitalize">{user?.role}</p>
              </div>
            </div>
            
            <button
              onClick={logout}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}