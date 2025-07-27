import { useState } from 'react';
import { User, Mail, FileText, Camera, Save } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

export default function LecturerProfile() {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    description: user?.description || '',
    profilePicture: user?.profilePicture || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await updateProfile(formData);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      description: user?.description || '',
      profilePicture: user?.profilePicture || ''
    });
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow max-w-4xl px-2 mx-auto sm:px-0">
        <div className="mb-6 sm:mb-8">
          <h2 className="mb-2 text-xl font-bold text-gray-900 sm:text-2xl">Lecturer Profile</h2>
          <p className="text-sm text-gray-600 sm:text-base">Manage your profile information and settings</p>
        </div>

        {success && (
          <div className="px-3 py-2 mb-4 text-sm text-green-600 border border-green-200 rounded-lg sm:mb-6 bg-green-50 sm:px-4 sm:py-3">
            {success}
          </div>
        )}

        {error && (
          <div className="px-3 py-2 mb-4 text-sm text-red-600 border border-red-200 rounded-lg sm:mb-6 bg-red-50 sm:px-4 sm:py-3">
            {error}
          </div>
        )}

        <div className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
          {/* Profile Header */}
          <div className="px-4 py-6 bg-gradient-to-r from-blue-500 to-indigo-600 sm:px-6 sm:py-8">
            <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6 sm:items-start">
              <div className="relative flex-shrink-0">
                {formData.profilePicture ? (
                  <img
                    src={formData.profilePicture}
                    alt="Profile"
                    className="object-cover w-16 h-16 border-4 border-white rounded-full sm:w-20 sm:h-20"
                  />
                ) : (
                  <div className="flex items-center justify-center w-16 h-16 bg-white border-4 border-white rounded-full sm:w-20 sm:h-20">
                    <User className="w-8 h-8 text-gray-400 sm:w-10 sm:h-10" />
                  </div>
                )}
                {isEditing && (
                  <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 sm:p-2 rounded-full hover:bg-blue-700 transition-colors">
                    <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                )}
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-xl font-bold text-white sm:text-2xl">{user?.name}</h3>
                <p className="text-sm text-blue-100 capitalize sm:text-base">{user?.role}</p>
                <div className="flex items-center justify-center mt-2 text-blue-100 sm:justify-start">
                  <Mail className="w-3 h-3 mr-2 sm:w-4 sm:h-4" />
                  <span className="text-xs truncate sm:text-sm">{user?.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-4 sm:p-6">
            {!isEditing ? (
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h4 className="mb-3 text-base font-semibold text-gray-900 sm:text-lg sm:mb-4">Profile Information</h4>
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 sm:gap-6">
                    <div>
                      <label className="block mb-2 text-xs font-medium text-gray-700 sm:text-sm">
                        Full Name
                      </label>
                      <div className="flex items-center p-3 rounded-lg bg-gray-50">
                        <User className="flex-shrink-0 w-4 h-4 mr-3 text-gray-400 sm:w-5 sm:h-5" />
                        <span className="text-sm text-gray-900 truncate sm:text-base">{user?.name}</span>
                      </div>
                    </div>
                    <div>
                      <label className="block mb-2 text-xs font-medium text-gray-700 sm:text-sm">
                        Email Address
                      </label>
                      <div className="flex items-center p-3 rounded-lg bg-gray-50">
                        <Mail className="flex-shrink-0 w-4 h-4 mr-3 text-gray-400 sm:w-5 sm:h-5" />
                        <span className="text-sm text-gray-900 truncate sm:text-base">{user?.email}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-xs font-medium text-gray-700 sm:text-sm">
                    Description
                  </label>
                  <div className="flex items-start p-3 rounded-lg bg-gray-50">
                    <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-900 sm:text-base">
                      {user?.description || 'No description provided'}
                    </span>
                  </div>
                </div>

                <div className="flex justify-center sm:justify-end">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white transition-colors bg-blue-600 border border-transparent rounded-lg sm:w-auto hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div>
                  <h4 className="mb-3 text-base font-semibold text-gray-900 sm:text-lg sm:mb-4">Edit Profile Information</h4>
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 sm:gap-6">
                    <div>
                      <label className="block mb-2 text-xs font-medium text-gray-700 sm:text-sm">
                        Full Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <User className="w-4 h-4 text-gray-400 sm:w-5 sm:h-5" />
                        </div>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="block w-full py-2 pl-10 pr-3 text-sm border border-gray-300 rounded-lg sm:py-3 sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block mb-2 text-xs font-medium text-gray-700 sm:text-sm">
                        Profile Picture URL
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Camera className="w-4 h-4 text-gray-400 sm:w-5 sm:h-5" />
                        </div>
                        <input
                          type="url"
                          name="profilePicture"
                          value={formData.profilePicture}
                          onChange={handleInputChange}
                          className="block w-full py-2 pl-10 pr-3 text-sm border border-gray-300 rounded-lg sm:py-3 sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter profile picture URL"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-xs font-medium text-gray-700 sm:text-sm">
                    Description
                  </label>
                  <div className="relative">
                    <div className="absolute pointer-events-none top-2 sm:top-3 left-3">
                      <FileText className="w-4 h-4 text-gray-400 sm:w-5 sm:h-5" />
                    </div>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="block w-full py-2 pl-10 pr-3 text-sm border border-gray-300 rounded-lg resize-none sm:py-3 sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Tell us about yourself, your expertise, and research interests..."
                    />
                  </div>
                </div>

                <div className="flex flex-col justify-center space-y-3 sm:flex-row sm:justify-end sm:space-y-0 sm:space-x-3">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 transition-colors bg-white border border-gray-300 rounded-lg sm:w-auto hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white transition-colors bg-blue-600 border border-transparent rounded-lg sm:w-auto hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-3 h-3 mr-2 sm:w-4 sm:h-4" />
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* FOOTER - Mobile Responsive */}
      <footer className="py-4 mt-8 text-xs text-center text-gray-500 border-t border-gray-200 sm:mt-16 sm:py-6 sm:text-sm">
        <div className="max-w-4xl px-2 mx-auto sm:px-4 lg:px-8">
          <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:justify-between md:items-center">
            <div className="order-3 md:order-1">
              &copy; {new Date().getFullYear()} Project Supervision System
            </div>
            <div className="flex flex-col items-center order-1 space-y-2 md:order-2 sm:flex-row sm:space-y-0 sm:space-x-4">
              <a href="/dashboard" className="transition-colors hover:text-blue-600">Dashboard</a>
              <a href="/Profile" className="transition-colors hover:text-blue-600">Profile</a>
              <a href="/support" className="transition-colors hover:text-blue-600">Support</a>
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
