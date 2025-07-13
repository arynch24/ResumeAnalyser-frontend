"use client";

import React, { useState, useEffect } from 'react';
import { User, Edit3, LogOut, ExternalLink, Github, Linkedin, Globe, FileText, Trophy, Calendar, Activity, MapPin, Phone, Briefcase, Mail, Save, X, AlertCircle } from 'lucide-react';
import axios from 'axios';


interface UserProfile {
  _id: string;
  email: string;
  name: string;
  isVerified: boolean;
  current_profession: string | null;
  mobile_number: string | null;
  location: string;
  github: string | null;
  linkedin: string | null;
  portfolio: string | null;
  createdAt: string;
  updatedAt: string;
}

interface DashboardStats {
  totalResumes: number;
  bestScore: number;
  accountCreated: string;
  lastActivity: string;
}

const ProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalResumes: 0,
    bestScore: 0,
    accountCreated: '',
    lastActivity: ''
  });

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setIsFetching(true);
      setError(null);

      const response = await axios.get('http://localhost:8000/api/v1/user/', {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        const userData = response.data.user;
        setUserProfile(userData);
        setEditedProfile(userData);

        // Set dashboard stats
        setDashboardStats({
          totalResumes: response.data.total_resumes,
          bestScore: response.data.best_score,
          accountCreated: new Date(userData.createdAt).toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
          }),
          lastActivity: new Date(userData.updatedAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          })
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Failed to load profile data. Please try again.');
    } finally {
      setIsFetching(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!editedProfile) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.patch('http://localhost:8000/api/v1/user/', {
        "user_details": JSON.stringify(editedProfile)
      }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      if (response.data.success) {
        setUserProfile(editedProfile);
        setIsEditing(false);
      } else {
        setError('Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    if (editedProfile) {
      setEditedProfile({
        ...editedProfile,
        [field]: value || null
      });
    }
  };

  const handleLogout = async () => {

    try {
      await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/logout`, {
        withCredentials: true,
      })
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'Failed to log out. Please try again.');
      }
    }
  };

  if (isFetching) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Failed to load profile</p>
          <button
            onClick={fetchUserData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 py-8 px-4 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
            <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Resumes</p>
                <p className="text-xl font-semibold text-gray-900">{dashboardStats.totalResumes}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Trophy size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Best Score</p>
                <p className="text-xl font-semibold text-gray-900">{dashboardStats.bestScore}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Member Since</p>
                <p className="text-xl font-semibold text-gray-900">{dashboardStats.accountCreated}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Activity size={20} className="text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Last Updated</p>
                <p className="text-xl font-semibold text-gray-900">{dashboardStats.lastActivity}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                <p className="text-gray-600 mt-1">Update your personal details and contact information</p>
              </div>
              <button
                onClick={() => {
                  setIsEditing(!isEditing);
                  if (isEditing) {
                    setEditedProfile(userProfile);
                    setError(null);
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
              >
                {isEditing ? <X size={16} /> : <Edit3 size={16} />}
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Profile Picture and Basic Info */}
            <div className="flex items-start gap-6 mb-8">
              <div className="w-16 h-16 rounded-full flex items-center justify-center border-1 border-gray-300 bg-gray-50">
                <User size={24}  />
              </div>

              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input
                          type="text"
                          value={editedProfile?.name || ''}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                          type="email"
                          value={editedProfile?.email || ''}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold text-gray-900">{userProfile.name}</h3>
                      {userProfile.isVerified ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                          Verified
                        </span>
                      ):(
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                          Not Verified
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 flex items-center gap-2">
                      <Mail size={16} />
                      {userProfile.email}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Personal Details */}
            <div className="border-t border-gray-400 pt-6 mb-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Personal Details</h4>

              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Profession</label>
                    <input
                      type="text"
                      value={editedProfile?.current_profession || ''}
                      onChange={(e) => handleInputChange('current_profession', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Software Engineer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                    <input
                      type="tel"
                      value={editedProfile?.mobile_number || ''}
                      onChange={(e) => handleInputChange('mobile_number', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your mobile number"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input
                      type="text"
                      value={editedProfile?.location || ''}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your location"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Briefcase size={18} className="text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Profession</p>
                      <p className="font-medium text-gray-900">
                        {userProfile.current_profession || 'Not specified'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Phone size={18} className="text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Mobile</p>
                      <p className="font-medium text-gray-900">
                        {userProfile.mobile_number || 'Not specified'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 md:col-span-2">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <MapPin size={18} className="text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-medium text-gray-900">{userProfile.location}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Professional Links */}
            <div className="border-t border-gray-400 pt-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Professional Links</h4>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                    <input
                      type="url"
                      value={editedProfile?.linkedin || ''}
                      onChange={(e) => handleInputChange('linkedin', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">GitHub</label>
                    <input
                      type="url"
                      value={editedProfile?.github || ''}
                      onChange={(e) => handleInputChange('github', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://github.com/yourusername"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio</label>
                    <input
                      type="url"
                      value={editedProfile?.portfolio || ''}
                      onChange={(e) => handleInputChange('portfolio', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://yourportfolio.com"
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleSaveProfile}
                      disabled={isLoading}
                      className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={16} />
                          Save Changes
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditedProfile(userProfile);
                        setError(null);
                      }}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {userProfile.linkedin && (
                    <a
                      href={userProfile.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors"
                    >
                      <Linkedin size={20} className="text-blue-600" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">LinkedIn</p>
                        <p className="text-sm text-gray-500">Professional Profile</p>
                      </div>
                      <ExternalLink size={16} className="text-gray-400" />
                    </a>
                  )}

                  {userProfile.github && (
                    <a
                      href={userProfile.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors"
                    >
                      <Github size={20} className="text-gray-700" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">GitHub</p>
                        <p className="text-sm text-gray-500">Code Repository</p>
                      </div>
                      <ExternalLink size={16} className="text-gray-400" />
                    </a>
                  )}

                  {userProfile.portfolio && (
                    <a
                      href={userProfile.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors"
                    >
                      <Globe size={20} className="text-green-600" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Portfolio</p>
                        <p className="text-sm text-gray-500">Personal Website</p>
                      </div>
                      <ExternalLink size={16} className="text-gray-400" />
                    </a>
                  )}

                  {!userProfile.linkedin && !userProfile.github && !userProfile.portfolio && (
                    <div className="md:col-span-3 text-center py-8">
                      <Globe size={24} className="text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">No professional links added yet</p>
                      <p className="text-sm text-gray-400">Click "Edit Profile" to add your links</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;