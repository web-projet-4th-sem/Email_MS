import React, { useState, useEffect } from 'react';
import { Calendar, Users, FileText, Download, Send, Clock } from 'lucide-react';
import axios from 'axios';

interface Project {
  _id: string;
  name: string;
  description: string;
  deadline: string;
  students: Array<{
    _id: string;
    name: string;
    email: string;
  }>;
  status: string;
}

interface Submission {
  _id: string;
  originalName: string;
  submittedAt: string;
  student: {
    _id: string;
    name: string;
    email: string;
  };
}

interface Feedback {
  _id: string;
  message: string;
  sentAt: string;
  student: {
    _id: string;
    name: string;
    email: string;
  };
  submission: {
    _id: string;
    originalName: string;
    submittedAt: string;
  };
}

export default function LecturerProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [sendingFeedback, setSendingFeedback] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      fetchSubmissions(selectedProject._id);
      fetchFeedback(selectedProject._id);
    }
  }, [selectedProject]);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('/projects');
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async (projectId: string) => {
    try {
      const response = await axios.get(`/submissions/project/${projectId}`);
      setSubmissions(response.data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
  };

  const fetchFeedback = async (projectId: string) => {
    try {
      const response = await axios.get(`/feedback/project/${projectId}`);
      setFeedback(response.data);
    } catch (error) {
      console.error('Error fetching feedback:', error);
    }
  };

  const handleDownload = async (submissionId: string) => {
    try {
      const response = await axios.get(`/submissions/download/${submissionId}`, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;

      const contentDisposition = response.headers['content-disposition'];
      const filename = contentDisposition
        ? contentDisposition.split('filename=')[1].replace(/"/g, '')
        : 'download';

      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      setError('Failed to download file');
    }
  };

  const handleSendFeedback = async () => {
    if (!feedbackMessage.trim() || !selectedSubmission) {
      setError('Please select a submission and enter feedback message');
      return;
    }

    setSendingFeedback(true);
    setError('');
    setSuccess('');

    try {
      await axios.post('/feedback', {
        submissionId: selectedSubmission,
        message: feedbackMessage
      });

      setSuccess('Feedback sent successfully!');
      setFeedbackMessage('');
      setSelectedSubmission('');

      if (selectedProject) {
        fetchFeedback(selectedProject._id);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to send feedback');
    } finally {
      setSendingFeedback(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  if (!selectedProject) {
    return (
      <div>
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Supervised Projects</h2>
          <p className="text-gray-600">Manage and supervise your assigned projects</p>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Projects Assigned</h3>
            <p className="text-gray-600">You haven't been assigned any projects to supervise yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedProject(project)}
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{project.name}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    project.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {project.status}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{project.description}</p>

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    Due: {formatDate(project.deadline)}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    {project.students.length} student{project.students.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => setSelectedProject(null)}
          className="text-blue-600 hover:text-blue-800 font-medium mb-4"
        >
          ← Back to Projects
        </button>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedProject.name}</h2>
        <p className="text-gray-600">{selectedProject.description}</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Project Details & Submissions */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Details</h3>
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                <span className="text-gray-600">Deadline:</span>
                <span className="ml-2 font-medium">{formatDate(selectedProject.deadline)}</span>
              </div>
              <div className="flex items-center text-sm">
                <Users className="w-4 h-4 mr-2 text-gray-400" />
                <span className="text-gray-600">Students:</span>
                <span className="ml-2 font-medium">{selectedProject.students.length}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Submissions</h3>
            {submissions.length === 0 ? (
              <p className="text-gray-600 text-center py-4">No submissions yet</p>
            ) : (
              <div className="space-y-3">
                {submissions.map((submission) => (
                  <div key={submission._id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{submission.student.name}</p>
                      <p className="text-sm text-gray-600">{submission.originalName}</p>
                      <p className="text-xs text-gray-500">Submitted: {formatDate(submission.submittedAt)}</p>
                    </div>
                    <button
                      onClick={() => handleDownload(submission._id)}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Feedback Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Send Feedback</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Submission
                </label>
                <select
                  value={selectedSubmission}
                  onChange={(e) => setSelectedSubmission(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Choose a submission...</option>
                  {submissions.map((submission) => (
                    <option key={submission._id} value={submission._id}>
                      {submission.student.name} - {submission.originalName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Feedback Message
                </label>
                <textarea
                  value={feedbackMessage}
                  onChange={(e) => setFeedbackMessage(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your feedback here..."
                />
              </div>

              <button
                onClick={handleSendFeedback}
                disabled={sendingFeedback || !feedbackMessage.trim() || !selectedSubmission}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4 mr-2" />
                {sendingFeedback ? 'Sending...' : 'Send Feedback'}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Feedback History</h3>
            {feedback.length === 0 ? (
              <p className="text-gray-600 text-center py-4">No feedback sent yet</p>
            ) : (
              <div className="space-y-4">
                {feedback.map((item) => (
                  <div key={item._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-gray-900">{item.student.name}</p>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatDate(item.sentAt)}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Re: {item.submission.originalName}
                    </p>
                    <p className="text-sm text-gray-800">{item.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/*Footer */}
      <footer className="mt-16 border-t border-gray-200 py-6 text-center text-sm text-gray-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>&copy; {currentYear} Project Supervision System</div>
          <div className="flex space-x-4">
            <a href="/dashboard" className="hover:text-blue-600 transition-colors">Dashboard</a>
            <a href="/Profile" className="hover:text-blue-600 transition-colors">Profile</a>
            <a href="/Support" className="hover:text-blue-600 transition-colors">Support</a>
          </div>
          <div>🎓Designed for SE Web Project</div>
        </div>
      </footer>
    </div>
  );
}
