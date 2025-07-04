import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, User, Users, Calendar, FileText } from 'lucide-react';
import axios from 'axios';

interface CreateProjectForm {
  name: string;
  description: string;
  deadline: string;
  supervisor: string;
  students: string[];
}

interface User {
  _id: string;
  name: string;
  email: string;
}

export default function CreateProject() {
  const [lecturers, setLecturers] = useState<User[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateProjectForm>();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const [lecturersRes, studentsRes] = await Promise.all([
        axios.get('/users/by-role/lecturer'),
        axios.get('/users/by-role/student')
      ]);
      setLecturers(lecturersRes.data);
      setStudents(studentsRes.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleStudentSelection = (studentId: string) => {
    setSelectedStudents(prev => 
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const onSubmit = async (data: CreateProjectForm) => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      await axios.post('/projects', {
        ...data,
        students: selectedStudents
      });

      setSuccess('Project created successfully!');
      reset();
      setSelectedStudents([]);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create project');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Create New Project</h2>
        <p className="text-gray-600">Set up a new academic project with students and supervisor</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4 inline mr-2" />
                Project Name
              </label>
              <input
                {...register('name', { required: 'Project name is required' })}
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter project name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Deadline
              </label>
              <input
                {...register('deadline', { required: 'Deadline is required' })}
                type="date"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.deadline && (
                <p className="mt-1 text-sm text-red-600">{errors.deadline.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              {...register('description', { required: 'Description is required' })}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter project description"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Supervisor
            </label>
            <select
              {...register('supervisor', { required: 'Supervisor is required' })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a supervisor</option>
              {lecturers.map((lecturer) => (
                <option key={lecturer._id} value={lecturer._id}>
                  {lecturer.name} ({lecturer.email})
                </option>
              ))}
            </select>
            {errors.supervisor && (
              <p className="mt-1 text-sm text-red-600">{errors.supervisor.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Users className="w-4 h-4 inline mr-2" />
              Assign Students
            </label>
            <div className="border border-gray-300 rounded-lg p-4 max-h-48 overflow-y-auto">
              {students.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No students available</p>
              ) : (
                <div className="space-y-2">
                  {students.map((student) => (
                    <label key={student._id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(student._id)}
                        onChange={() => handleStudentSelection(student._id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{student.name}</p>
                        <p className="text-sm text-gray-600">{student.email}</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
            {selectedStudents.length > 0 && (
              <p className="mt-2 text-sm text-gray-600">
                {selectedStudents.length} student{selectedStudents.length !== 1 ? 's' : ''} selected
              </p>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              {isLoading ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
      <footer className="mt-12 border-t border-gray-200 pt-6 pb-4 text-sm text-gray-500 bg-white">
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
    
    <div className="flex items-center space-x-2">
      <span>© {new Date().getFullYear()} Project Supervision System</span>
      <span className="hidden sm:inline">|</span>
      <span className="flex items-center space-x-1">
        <span role="img" aria-label="graduate">🎓</span>
        
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

    </div>
    
  );
}