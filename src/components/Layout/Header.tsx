import { LogOut, User, Menu } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onMenuClick?: () => void;
}

export default function Header({ title, subtitle, onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-2 mx-auto max-w-7xl sm:px-4 lg:px-8">
        <div className="flex items-center py-4 sm:py-6">
          {/* Mobile menu button - positioned at far left for small displays */}
          {onMenuClick && (
            <button
              onClick={onMenuClick}
              className="mr-2 sm:mr-3 p-1.5 sm:p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          
          {/* Title section - flex-1 to take remaining space */}
          <div className="flex-1 lg:flex-none">
            <h1 className="text-lg font-bold text-gray-900 sm:text-xl lg:text-2xl">{title}</h1>
            {subtitle && <p className="mt-1 text-xs text-gray-600 sm:text-sm">{subtitle}</p>}
          </div>
          
          {/* Right side content - pushed to the right */}
          <div className="flex items-center ml-auto space-x-2 lg:ml-0 sm:space-x-4">
            <div className="items-center hidden space-x-3 sm:flex">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="text-sm">
                <p className="font-medium text-gray-900">{user?.name}</p>
                <p className="text-gray-600 capitalize">{user?.role}</p>
              </div>
            </div>
            
            {/* Mobile user info */}
            <div className="sm:hidden">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full">
                <User className="w-4 h-4 text-white" />
              </div>
            </div>
            
            <button
              onClick={logout}
              className="inline-flex items-center px-2 py-2 text-xs font-medium text-gray-700 transition-colors bg-white border border-gray-300 rounded-lg sm:px-3 sm:text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <LogOut className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}