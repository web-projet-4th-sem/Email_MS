import React, { useState, useEffect } from 'react';
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading overview...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">System Overview</h2>
        <p className="text-gray-600">Get a quick overview of your academic project management system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => (
          <div
            key={index}
            className={`${card.color} rounded-lg border-2 p-6 transition-transform hover:scale-105`}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {card.icon}
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="font-medium text-gray-900">Create New Project</p>
            <p className="text-sm text-gray-600">Set up a new academic project</p>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="font-medium text-gray-900">Manage Users</p>
            <p className="text-sm text-gray-600">View and manage system users</p>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="font-medium text-gray-900">View Projects</p>
            <p className="text-sm text-gray-600">Monitor all active projects</p>
          </div>
        </div>
      </div>
      <footer className="mt-12 border-t border-gray-200 pt-6 pb-4 text-sm text-gray-500 bg-white">
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
    
    <div className="flex items-center space-x-2">
      <span>© {new Date().getFullYear()} Project Supervision System</span>
      <span className="hidden sm:inline">|</span>
      <span className="flex items-center space-x-1">
        <span role="img" aria-label="graduate">🎓</span>
        <span>Academic Edition</span>
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

    </>
  );
}