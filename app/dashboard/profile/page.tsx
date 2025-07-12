"use client";

import React, { useState } from 'react';
import { User, Edit3, LogOut, ExternalLink, Github, Linkedin, Globe, FileText, Trophy, Calendar, Activity } from 'lucide-react';

interface UserProfile {
  fullName: string;
  email: string;
  profilePicture: string;
  linkedinUrl: string;
  githubUrl: string;
  portfolioUrl: string;
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
  const [userProfile, setUserProfile] = useState<UserProfile>({
    fullName: "Alex Johnson",
    email: "alex.johnson@email.com",
    profilePicture: "",
    linkedinUrl: "https://linkedin.com/in/alexjohnson",
    githubUrl: "https://github.com/alexjohnson",
    portfolioUrl: "https://alexjohnson.dev"
  });

  const [dashboardStats] = useState<DashboardStats>({
    totalResumes: 3,
    bestScore: 87,
    accountCreated: "June 2024",
    lastActivity: "Today"
  });

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      // Mock API call - replace with actual API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate API call
      console.log('API Call: Updating profile...', userProfile);
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    console.log('Logging out...');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <FileText size={20} className="text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Resumes</p>
                <p className="text-xl font-semibold text-gray-900">{dashboardStats.totalResumes}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <Trophy size={20} className="text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Best Score</p>
                <p className="text-xl font-semibold text-gray-900">{dashboardStats.bestScore}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <Calendar size={20} className="text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Member Since</p>
                <p className="text-xl font-semibold text-gray-900">{dashboardStats.accountCreated}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <Activity size={20} className="text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Last Active</p>
                <p className="text-xl font-semibold text-gray-900">{dashboardStats.lastActivity}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2 px-3 py-1.5 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <Edit3 size={16} />
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {/* Profile Picture and Basic Info */}
          <div className="flex items-start gap-6 mb-6">
            <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
              {userProfile.profilePicture ? (
                <img
                  src={userProfile.profilePicture}
                  alt={userProfile.fullName}
                  className="w-20 h-20 rounded-lg object-cover"
                />
              ) : (
                <User size={32} className="text-gray-400" />
              )}
            </div>

            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={userProfile.fullName}
                      onChange={(e) => setUserProfile({ ...userProfile, fullName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={userProfile.email}
                      onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{userProfile.fullName}</h3>
                  <p className="text-gray-600 mb-3">{userProfile.email}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Active</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Professional Links */}
          <div className="border-t pt-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Professional Links</h4>
            
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                  <input
                    type="url"
                    value={userProfile.linkedinUrl}
                    onChange={(e) => setUserProfile({ ...userProfile, linkedinUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">GitHub</label>
                  <input
                    type="url"
                    value={userProfile.githubUrl}
                    onChange={(e) => setUserProfile({ ...userProfile, githubUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://github.com/yourusername"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Portfolio</label>
                  <input
                    type="url"
                    value={userProfile.portfolioUrl}
                    onChange={(e) => setUserProfile({ ...userProfile, portfolioUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://yourportfolio.com"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleSaveProfile}
                    disabled={isLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {userProfile.linkedinUrl && (
                  <a
                    href={userProfile.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Linkedin size={20} className="text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">LinkedIn</p>
                      <p className="text-sm text-gray-500">View Profile</p>
                    </div>
                    <ExternalLink size={16} className="text-gray-400 ml-auto" />
                  </a>
                )}
                
                {userProfile.githubUrl && (
                  <a
                    href={userProfile.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Github size={20} className="text-gray-700" />
                    <div>
                      <p className="font-medium text-gray-900">GitHub</p>
                      <p className="text-sm text-gray-500">View Code</p>
                    </div>
                    <ExternalLink size={16} className="text-gray-400 ml-auto" />
                  </a>
                )}
                
                {userProfile.portfolioUrl && (
                  <a
                    href={userProfile.portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Globe size={20} className="text-green-600" />
                    <div>
                      <p className="font-medium text-gray-900">Portfolio</p>
                      <p className="text-sm text-gray-500">Visit Site</p>
                    </div>
                    <ExternalLink size={16} className="text-gray-400 ml-auto" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;