import { useState, useEffect } from 'react';
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
          <div className="w-8 h-8 mx-auto border-b-2 border-blue-600 rounded-full animate-spin"></div>
          <p className="mt-2 text-sm text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  if (!selectedProject) {
    return (
      <div>
        <div className="px-2 mb-6 sm:mb-8 sm:px-0">
          <h2 className="mb-2 text-xl font-bold text-gray-900 sm:text-2xl">Supervised Projects</h2>
          <p className="text-sm text-gray-600 sm:text-base">Manage and supervise your assigned projects</p>
        </div>

        {projects.length === 0 ? (
          <div className="px-4 py-8 text-center sm:py-12">
            <FileText className="w-10 h-10 mx-auto mb-4 text-gray-400 sm:w-12 sm:h-12" />
            <h3 className="mb-2 text-base font-medium text-gray-900 sm:text-lg">No Projects Assigned</h3>
            <p className="text-sm text-gray-600 sm:text-base">You haven't been assigned any projects to supervise yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 px-2 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6 sm:px-0">
            {projects.map((project) => (
              <div
                key={project._id}
                className="p-4 transition-shadow bg-white border border-gray-200 rounded-lg shadow-sm cursor-pointer sm:p-6 hover:shadow-md"
                onClick={() => setSelectedProject(project)}
              >
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <h3 className="pr-2 text-base font-semibold text-gray-900 sm:text-lg line-clamp-2">{project.name}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full flex-shrink-0 ${
                    project.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {project.status}
                  </span>
                </div>

                <p className="mb-3 text-xs text-gray-600 sm:text-sm sm:mb-4 line-clamp-3">{project.description}</p>

                <div className="space-y-2">
                  <div className="flex items-center text-xs text-gray-600 sm:text-sm">
                    <Calendar className="flex-shrink-0 w-3 h-3 mr-2 sm:w-4 sm:h-4" />
                    <span className="truncate">Due: {formatDate(project.deadline)}</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-600 sm:text-sm">
                    <Users className="flex-shrink-0 w-3 h-3 mr-2 sm:w-4 sm:h-4" />
                    <span className="truncate">{project.students.length} student{project.students.length !== 1 ? 's' : ''}</span>
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
    <div className="px-2 sm:px-0">
      <div className="mb-4 sm:mb-6">
        <button
          onClick={() => setSelectedProject(null)}
          className="mb-3 text-sm font-medium text-blue-600 hover:text-blue-800 sm:mb-4 sm:text-base"
        >
          ← Back to Projects
        </button>
        <h2 className="mb-2 text-xl font-bold text-gray-900 sm:text-2xl">{selectedProject.name}</h2>
        <p className="text-sm text-gray-600 sm:text-base">{selectedProject.description}</p>
      </div>

      {error && (
        <div className="px-3 py-2 mb-4 text-sm text-red-600 border border-red-200 rounded-lg sm:mb-6 bg-red-50 sm:px-4 sm:py-3">
          {error}
        </div>
      )}

      {success && (
        <div className="px-3 py-2 mb-4 text-sm text-green-600 border border-green-200 rounded-lg sm:mb-6 bg-green-50 sm:px-4 sm:py-3">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 sm:gap-6 lg:gap-8">
        {/* Project Details & Submissions */}
        <div className="space-y-4 sm:space-y-6">
          <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-6">
            <h3 className="mb-3 text-base font-semibold text-gray-900 sm:text-lg sm:mb-4">Project Details</h3>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex flex-col text-xs sm:flex-row sm:items-center sm:text-sm">
                <div className="flex items-center mb-1 sm:mb-0">
                  <Calendar className="flex-shrink-0 w-3 h-3 mr-2 text-gray-400 sm:w-4 sm:h-4" />
                  <span className="text-gray-600">Deadline:</span>
                </div>
                <span className="font-medium sm:ml-2">{formatDate(selectedProject.deadline)}</span>
              </div>
              <div className="flex flex-col text-xs sm:flex-row sm:items-center sm:text-sm">
                <div className="flex items-center mb-1 sm:mb-0">
                  <Users className="flex-shrink-0 w-3 h-3 mr-2 text-gray-400 sm:w-4 sm:h-4" />
                  <span className="text-gray-600">Students:</span>
                </div>
                <span className="font-medium sm:ml-2">{selectedProject.students.length}</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-6">
            <h3 className="mb-3 text-base font-semibold text-gray-900 sm:text-lg sm:mb-4">Student Submissions</h3>
            {submissions.length === 0 ? (
              <p className="py-3 text-sm text-center text-gray-600 sm:py-4">No submissions yet</p>
            ) : (
              <div className="space-y-3">
                {submissions.map((submission) => (
                  <div key={submission._id} className="flex flex-col p-3 space-y-2 border border-gray-200 rounded-lg sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate sm:text-base">{submission.student.name}</p>
                      <p className="text-xs text-gray-600 break-words sm:text-sm">{submission.originalName}</p>
                      <p className="text-xs text-gray-500">Submitted: {formatDate(submission.submittedAt)}</p>
                    </div>
                    <button
                      onClick={() => handleDownload(submission._id)}
                      className="inline-flex items-center justify-center w-full px-3 py-2 text-xs font-medium text-gray-700 transition-colors bg-white border border-gray-300 rounded-lg sm:w-auto sm:text-sm hover:bg-gray-50"
                    >
                      <Download className="w-3 h-3 mr-1 sm:w-4 sm:h-4" />
                      Download
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Feedback Section */}
        <div className="space-y-4 sm:space-y-6">
          <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-6">
            <h3 className="mb-3 text-base font-semibold text-gray-900 sm:text-lg sm:mb-4">Send Feedback</h3>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block mb-2 text-xs font-medium text-gray-700 sm:text-sm">
                  Select Submission
                </label>
                <select
                  value={selectedSubmission}
                  onChange={(e) => setSelectedSubmission(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                <label className="block mb-2 text-xs font-medium text-gray-700 sm:text-sm">
                  Feedback Message
                </label>
                <textarea
                  value={feedbackMessage}
                  onChange={(e) => setFeedbackMessage(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg resize-none sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your feedback here..."
                />
              </div>

              <button
                onClick={handleSendFeedback}
                disabled={sendingFeedback || !feedbackMessage.trim() || !selectedSubmission}
                className="inline-flex items-center justify-center w-full px-3 py-2 text-xs font-medium text-white transition-colors bg-blue-600 border border-transparent rounded-lg sm:px-4 sm:text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-3 h-3 mr-2 sm:w-4 sm:h-4" />
                {sendingFeedback ? 'Sending...' : 'Send Feedback'}
              </button>
            </div>
          </div>

          <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-6">
            <h3 className="mb-3 text-base font-semibold text-gray-900 sm:text-lg sm:mb-4">Feedback History</h3>
            {feedback.length === 0 ? (
              <p className="py-3 text-sm text-center text-gray-600 sm:py-4">No feedback sent yet</p>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {feedback.map((item) => (
                  <div key={item._id} className="p-3 border border-gray-200 rounded-lg sm:p-4">
                    <div className="flex flex-col mb-2 space-y-1 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                      <p className="text-sm font-medium text-gray-900 sm:text-base">{item.student.name}</p>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="flex-shrink-0 w-3 h-3 mr-1" />
                        <span>{formatDate(item.sentAt)}</span>
                      </div>
                    </div>
                    <p className="mb-2 text-xs text-gray-600 sm:text-sm">
                      Re: <span className="break-words">{item.submission.originalName}</span>
                    </p>
                    <p className="text-xs text-gray-800 break-words sm:text-sm">{item.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer - Mobile Responsive */}
      <footer className="py-4 mt-8 text-xs text-center text-gray-500 border-t border-gray-200 sm:mt-16 sm:py-6 sm:text-sm">
        <div className="max-w-6xl px-2 mx-auto sm:px-4 lg:px-8">
          <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:justify-between md:items-center">
            <div className="order-3 md:order-1">
              &copy; {currentYear} Project Supervision System
            </div>
            <div className="flex flex-col items-center order-1 space-y-2 md:order-2 sm:flex-row sm:space-y-0 sm:space-x-4">
              <a href="/dashboard" className="transition-colors hover:text-blue-600">Dashboard</a>
              <a href="/Profile" className="transition-colors hover:text-blue-600">Profile</a>
              <a href="/Support" className="transition-colors hover:text-blue-600">Support</a>
            </div>
            <div className="flex items-center justify-center order-2 space-x-1 md:order-3">
              <span>🎓</span>
              <span>Designed for SE Web Project</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
