import { useState, useEffect } from 'react';
import { Users, BookOpen, Clock, CheckCircle } from 'lucide-react';
import axios from 'axios';

interface Stats {
  totalProjects: number;
  totalStudents: number;
  totalLecturers: number;
  activeProjects: number;
}

export default function AdminOverview() {
  const [stats, setStats] = useState<Stats>({
    totalProjects: 0,
    totalStudents: 0,
    totalLecturers: 0,
    activeProjects: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [projectsRes, studentsRes, lecturersRes] = await Promise.all([
        axios.get('/projects'),
        axios.get('/users/by-role/student'),
        axios.get('/users/by-role/lecturer')
      ]);

      const projects = projectsRes.data;
      const activeProjects = projects.filter((p: any) => p.status === 'active').length;

      setStats({
        totalProjects: projects.length,
        totalStudents: studentsRes.data.length,
        totalLecturers: lecturersRes.data.length,
        activeProjects
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Projects',
      value: stats.totalProjects,
      icon: <BookOpen className="w-8 h-8 text-blue-600" />,
      color: 'bg-blue-50 border-blue-200'
    },
    {
      title: 'Active Projects',
      value: stats.activeProjects,
      icon: <Clock className="w-8 h-8 text-green-600" />,
      color: 'bg-green-50 border-green-200'
    },
    {
      title: 'Students',
      value: stats.totalStudents,
      icon: <Users className="w-8 h-8 text-purple-600" />,
      color: 'bg-purple-50 border-purple-200'
    },
    {
      title: 'Lecturers',
      value: stats.totalLecturers,
      icon: <CheckCircle className="w-8 h-8 text-indigo-600" />,
      color: 'bg-indigo-50 border-indigo-200'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 mx-auto border-b-2 border-blue-600 rounded-full animate-spin"></div>
          <p className="mt-2 text-sm text-gray-600">Loading overview...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="px-2 mb-8 sm:px-4">
        <h2 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl">System Overview</h2>
        <p className="text-sm text-gray-600 sm:text-base">Get a quick overview of your academic project management system</p>
      </div>

      <div className="grid grid-cols-1 gap-4 px-2 mb-8 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6 sm:px-0">
        {statCards.map((card, index) => (
          <div
            key={index}
            className={`${card.color} rounded-lg border-2 p-4 sm:p-6 transition-transform hover:scale-105`}
          >
            <div className="flex flex-col items-center sm:flex-row sm:items-start">
              <div className="flex-shrink-0 mb-2 sm:mb-0">
                {card.icon}
              </div>
              <div className="text-center sm:ml-4 sm:text-left">
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-xl font-bold text-gray-900 sm:text-2xl">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 mx-2 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-6 sm:mx-0">
        <h3 className="mb-4 text-lg font-semibold text-center text-gray-900 sm:text-left">Quick Actions</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 sm:gap-4">
          <div className="p-3 text-center transition-colors border border-gray-200 rounded-lg sm:p-4 hover:bg-gray-50">
            <BookOpen className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <p className="font-medium text-gray-900">Create New Project</p>
            <p className="text-sm text-gray-600">Set up a new academic project</p>
          </div>
          <div className="p-3 text-center transition-colors border border-gray-200 rounded-lg sm:p-4 hover:bg-gray-50">
            <Users className="w-8 h-8 mx-auto mb-2 text-purple-600" />
            <p className="font-medium text-gray-900">Manage Users</p>
            <p className="text-sm text-gray-600">View and manage system users</p>
          </div>
          <div className="p-3 text-center transition-colors border border-gray-200 rounded-lg sm:p-4 hover:bg-gray-50">
            <Clock className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <p className="font-medium text-gray-900">View Projects</p>
            <p className="text-sm text-gray-600">Monitor all active projects</p>
          </div>
        </div>
      </div>
      <footer className="pt-6 pb-4 mt-12 text-sm text-gray-500 bg-white border-t border-gray-200">
        <div className="flex flex-col max-w-6xl gap-4 px-2 mx-auto sm:px-4 lg:px-8 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col items-center space-y-1 sm:flex-row sm:space-y-0 sm:space-x-2">
            <span>© {new Date().getFullYear()} Project Supervision System</span>
            <span className="hidden sm:inline">|</span>
            <span className="flex items-center space-x-1">
              <span role="img" aria-label="graduate">🎓</span>
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
            <span className="flex items-center space-x-1">
              <span role="img" aria-label="heart"></span>
              <span>Designed for SE Web Projects</span>
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}