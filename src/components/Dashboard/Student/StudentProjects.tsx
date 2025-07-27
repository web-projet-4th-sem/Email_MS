import { useState, useEffect } from 'react';
import { Calendar, FileText, Upload, MessageSquare, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

interface Project {
  _id: string;
  name: string;
  description: string;
  deadline: string;
  supervisor: {
    _id: string;
    name: string;
    email: string;
  };
  status: string;
}

interface Submission {
  _id: string;
  originalName: string;
  submittedAt: string;
  status: string;
}

interface Feedback {
  _id: string;
  message: string;
  sentAt: string;
  lecturer: {
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

export default function StudentProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
      setError('');
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'application/zip': ['.zip'],
      'application/x-rar-compressed': ['.rar']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  const handleSubmission = async () => {
    if (!selectedFile || !selectedProject) {
      setError('Please select a file to upload');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('proposal', selectedFile);
    formData.append('projectId', selectedProject._id);

    try {
      await axios.post('/submissions', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setSuccess('Proposal submitted successfully!');
      setSelectedFile(null);
      fetchSubmissions(selectedProject._id);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to submit proposal');
    } finally {
      setUploading(false);
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

  const isDeadlinePassed = (deadline: string) => {
    return new Date(deadline) < new Date();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'reviewed':
        return <MessageSquare className="w-4 h-4 text-blue-600" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
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
        <div className="mb-6 sm:mb-8 px-2 sm:px-0">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">My Projects</h2>
          <p className="text-sm sm:text-base text-gray-600">View and manage your assigned projects</p>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-8 sm:py-12 px-4">
            <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No Projects Assigned</h3>
            <p className="text-sm sm:text-base text-gray-600">You haven't been assigned any projects yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-2 sm:px-0">
            {projects.map((project) => (
              <div
                key={project._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedProject(project)}
              >
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-2 pr-2">{project.name}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full flex-shrink-0 ${
                    project.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {project.status}
                  </span>
                </div>
                
                <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-3">{project.description}</p>
                
                <div className="space-y-2">
                  <div className={`flex items-center text-xs sm:text-sm ${
                    isDeadlinePassed(project.deadline) ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
                    <span className="truncate">Due: {formatDate(project.deadline)}</span>
                  </div>
                  <div className="flex items-center text-xs sm:text-sm text-gray-600">
                    <FileText className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
                    <span className="truncate">Supervisor: {project.supervisor.name}</span>
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
          className="text-blue-600 hover:text-blue-800 font-medium mb-3 sm:mb-4 text-sm sm:text-base"
        >
          ← Back to Projects
        </button>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{selectedProject.name}</h2>
        <p className="text-sm sm:text-base text-gray-600">{selectedProject.description}</p>
      </div>

      {error && (
        <div className="mb-4 sm:mb-6 bg-red-50 border border-red-200 text-red-600 px-3 py-2 sm:px-4 sm:py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 sm:mb-6 bg-green-50 border border-green-200 text-green-600 px-3 py-2 sm:px-4 sm:py-3 rounded-lg text-sm">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        {/* Project Details & Submission */}
        <div className="space-y-4 sm:space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Project Details</h3>
            <div className="space-y-2 sm:space-y-3">
              <div className={`flex flex-col sm:flex-row sm:items-center text-xs sm:text-sm ${
                isDeadlinePassed(selectedProject.deadline) ? 'text-red-600' : 'text-gray-600'
              }`}>
                <div className="flex items-center mb-1 sm:mb-0">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
                  <span>Deadline:</span>
                </div>
                <div className="flex items-center sm:ml-2">
                  <span className="font-medium">{formatDate(selectedProject.deadline)}</span>
                  {isDeadlinePassed(selectedProject.deadline) && (
                    <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                      Overdue
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center text-xs sm:text-sm text-gray-600">
                <div className="flex items-center mb-1 sm:mb-0">
                  <FileText className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
                  <span>Supervisor:</span>
                </div>
                <span className="font-medium sm:ml-2 truncate">{selectedProject.supervisor.name}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Submit Proposal</h3>
            
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-4 sm:p-6 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-blue-400 bg-blue-50'
                  : selectedFile
                  ? 'border-green-400 bg-green-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className={`w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 ${
                selectedFile ? 'text-green-600' : 'text-gray-400'
              }`} />
              {selectedFile ? (
                <div>
                  <p className="text-xs sm:text-sm font-medium text-green-800 break-all">{selectedFile.name}</p>
                  <p className="text-xs text-green-600">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 px-2">
                    {isDragActive
                      ? 'Drop the file here...'
                      : 'Drag & drop your proposal file here, or click to select'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 px-2">
                    Supported formats: PDF, DOC, DOCX, TXT, ZIP, RAR (Max 10MB)
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={handleSubmission}
              disabled={!selectedFile || uploading || isDeadlinePassed(selectedProject.deadline)}
              className="w-full mt-3 sm:mt-4 inline-flex items-center justify-center px-3 py-2 sm:px-4 border border-transparent text-xs sm:text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Upload className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              {uploading ? 'Submitting...' : 'Submit Proposal'}
            </button>

            {isDeadlinePassed(selectedProject.deadline) && (
              <p className="mt-2 text-xs sm:text-sm text-red-600 text-center">
                Submission deadline has passed
              </p>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">My Submissions</h3>
            {submissions.length === 0 ? (
              <p className="text-gray-600 text-center py-3 sm:py-4 text-sm">No submissions yet</p>
            ) : (
              <div className="space-y-3">
                {submissions.map((submission) => (
                  <div key={submission._id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{submission.originalName}</p>
                      <p className="text-sm text-gray-600">Submitted: {formatDate(submission.submittedAt)}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(submission.status)}
                      <span className="text-sm font-medium capitalize text-gray-700">
                        {submission.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Feedback Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Feedback History</h3>
          {feedback.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No feedback received yet</p>
              <p className="text-sm text-gray-500 mt-1">
                Your supervisor will provide feedback after reviewing your submissions
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {feedback.map((item) => (
                <div key={item._id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-gray-900">{item.lecturer.name}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatDate(item.sentAt)}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Re: {item.submission.originalName}
                  </p>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-800">{item.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}