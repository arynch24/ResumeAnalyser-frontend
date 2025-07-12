"use client";

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  Upload, 
  FileText, 
  Download, 
  Edit, 
  Trash2, 
  Eye,
  RefreshCw,
  Star,
  Grid,
  List,
  MoreHorizontal,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

// Types
interface Resume {
  id: string;
  name: string;
  uploadDate: string;
  status: 'completed' | 'in-progress' | 'error';
  type: 'pdf' | 'docx';
  isFavorite?: boolean;
  builderType?: 'Resume Builder';
}

interface JobMatch {
  id: string;
  resumeId: string;
  resumeName: string;
  jobTitle: string;
  matchScore: number;
  matchedSkills: number;
  totalSkills: number;
  sectionsNeedImprovement: number;
  matchedDate: string;
}

interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// Mock API functions
const mockApi = {
  getResumes: async (): Promise<ApiResponse<Resume[]>> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockResumes: Resume[] = [
      {
        id: '1',
        name: 'Aryan_Resume_V1.pdf',
        uploadDate: 'Jan 12, 2025',
        status: 'completed',
        type: 'pdf',
        builderType: 'Resume Builder'
      },
      {
        id: '2',
        name: 'Aryan_Resume_V2.docx',
        uploadDate: 'Feb 3, 2025',
        status: 'in-progress',
        type: 'docx',
        builderType: 'Resume Builder'
      },
      {
        id: '3',
        name: 'Google_Application.pdf',
        uploadDate: 'Feb 18, 2025',
        status: 'completed',
        type: 'pdf',
        isFavorite: true,
        builderType: 'Resume Builder'
      }
    ];
    
    return { data: mockResumes, success: true };
  },

  getJobMatches: async (): Promise<ApiResponse<JobMatch[]>> => {
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const mockMatches: JobMatch[] = [
      {
        id: '1',
        resumeId: '1',
        resumeName: 'Aryan_JDmatch_V2.pdf',
        jobTitle: 'Frontend_Dev_JD.pdf',
        matchScore: 82,
        matchedSkills: 12,
        totalSkills: 18,
        sectionsNeedImprovement: 3,
        matchedDate: 'Mar 4, 2025'
      },
      {
        id: '2',
        resumeId: '3',
        resumeName: 'Google_Application.pdf',
        jobTitle: 'Google_SWE_JD.pdf',
        matchScore: 67,
        matchedSkills: 8,
        totalSkills: 15,
        sectionsNeedImprovement: 5,
        matchedDate: 'Mar 10, 2025'
      },
      {
        id: '3',
        resumeId: '1',
        resumeName: 'Aryan_Resume_V1.pdf',
        jobTitle: 'Product_Manager_JD.pdf',
        matchScore: 45,
        matchedSkills: 5,
        totalSkills: 14,
        sectionsNeedImprovement: 7,
        matchedDate: 'Mar 15, 2025'
      }
    ];
    
    return { data: mockMatches, success: true };
  },

  uploadResume: async (file: File): Promise<ApiResponse<Resume>> => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newResume: Resume = {
      id: Date.now().toString(),
      name: file.name,
      uploadDate: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }),
      status: 'in-progress',
      type: file.name.endsWith('.pdf') ? 'pdf' : 'docx',
      builderType: 'Resume Builder'
    };
    
    return { data: newResume, success: true };
  },

  deleteResume: async (id: string): Promise<ApiResponse<null>> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { data: null, success: true };
  },

  toggleFavorite: async (id: string): Promise<ApiResponse<null>> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { data: null, success: true };
  }
};

// Shimmer Component
const Shimmer: React.FC = () => (
  <div className="animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
  </div>
);

// Empty State Component
const EmptyState: React.FC<{ onUpload: () => void }> = ({ onUpload }) => (
  <div className="text-center py-12">
    <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
      <FileText className="w-8 h-8 text-blue-600" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">No resumes uploaded yet</h3>
    <p className="text-gray-600 mb-6">Get started by uploading your first resume to analyze and manage your job applications.</p>
    <button
      onClick={onUpload}
      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
    >
      Upload Your First Resume
    </button>
  </div>
);

// Resume Card Component
const ResumeCard: React.FC<{
  resume: Resume;
  onEdit: (id: string) => void;
  onDownload: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}> = ({ resume, onEdit, onDownload, onDelete, onToggleFavorite }) => {
  const getStatusIcon = () => {
    switch (resume.status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
    }
  };

  const getStatusText = () => {
    switch (resume.status) {
      case 'completed':
        return 'Completed';
      case 'in-progress':
        return 'In Progress';
      case 'error':
        return 'Error';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{resume.name}</h3>
            <p className="text-sm text-gray-500">Uploaded on {resume.uploadDate}</p>
          </div>
        </div>
        <button
          onClick={() => onToggleFavorite(resume.id)}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <Star 
            className={`w-5 h-5 ${resume.isFavorite ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} 
          />
        </button>
      </div>

      <div className="flex items-center space-x-4 mb-4">
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className="text-sm font-medium text-gray-700">{getStatusText()}</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-600 rounded"></div>
          <span className="text-sm text-gray-600">{resume.builderType}</span>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => onEdit(resume.id)}
          className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded"
        >
          <Edit className="w-4 h-4" />
          <span>Edit</span>
        </button>
        <button
          onClick={() => onDownload(resume.id)}
          className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded"
        >
          <Download className="w-4 h-4" />
          <span>Download</span>
        </button>
        <button
          onClick={() => onDelete(resume.id)}
          className="flex items-center space-x-1 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded"
        >
          <Trash2 className="w-4 h-4" />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
};

// Job Match Card Component
const JobMatchCard: React.FC<{
  match: JobMatch;
  onViewResults: (id: string) => void;
  onReanalyze: (id: string) => void;
  onDelete: (id: string) => void;
}> = ({ match, onViewResults, onReanalyze, onDelete }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{match.resumeName}</h3>
            <p className="text-sm text-gray-500">+ {match.jobTitle}</p>
            <p className="text-sm text-gray-500">Matched on {match.matchedDate}</p>
          </div>
        </div>
        <button className="p-1 hover:bg-gray-100 rounded">
          <MoreHorizontal className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Match Score:</span>
          <span className={`text-2xl font-bold ${getScoreColor(match.matchScore)}`}>
            {match.matchScore}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${getScoreBgColor(match.matchScore)}`}
            style={{ width: `${match.matchScore}%` }}
          ></div>
        </div>
      </div>

      <div className="flex items-center space-x-4 mb-4">
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span className="text-sm text-gray-600">
            Matched: {match.matchedSkills}/{match.totalSkills} Skills
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-orange-600" />
          <span className="text-sm text-gray-600">
            {match.sectionsNeedImprovement} sections need improvement
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => onViewResults(match.id)}
          className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded"
        >
          <Eye className="w-4 h-4" />
          <span>View Results</span>
        </button>
        <button
          onClick={() => onReanalyze(match.id)}
          className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Re-analyze</span>
        </button>
        <button
          onClick={() => onDelete(match.id)}
          className="flex items-center space-x-1 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded"
        >
          <Trash2 className="w-4 h-4" />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
};

// Main Resume Manager Component
const ResumeManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'builder' | 'matches'>('all');
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [jobMatches, setJobMatches] = useState<JobMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [resumesResponse, matchesResponse] = await Promise.all([
        mockApi.getResumes(),
        mockApi.getJobMatches()
      ]);
      
      if (resumesResponse.success) {
        setResumes(resumesResponse.data);
      }
      
      if (matchesResponse.success) {
        setJobMatches(matchesResponse.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const response = await mockApi.uploadResume(file);
      if (response.success) {
        setResumes(prev => [...prev, response.data]);
      }
    } catch (error) {
      console.error('Error uploading resume:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await mockApi.deleteResume(id);
      setResumes(prev => prev.filter(resume => resume.id !== id));
    } catch (error) {
      console.error('Error deleting resume:', error);
    }
  };

  const handleToggleFavorite = async (id: string) => {
    try {
      await mockApi.toggleFavorite(id);
      setResumes(prev => prev.map(resume => 
        resume.id === id ? { ...resume, isFavorite: !resume.isFavorite } : resume
      ));
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const filteredResumes = resumes.filter(resume =>
    resume.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderContent = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
              <Shimmer />
            </div>
          ))}
        </div>
      );
    }

    if (activeTab === 'all' || activeTab === 'builder') {
      if (resumes.length === 0) {
        return <EmptyState onUpload={() => document.getElementById('resume-upload')?.click()} />;
      }

      return (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <span>Resume Builder Uploads</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResumes.map(resume => (
                <ResumeCard
                  key={resume.id}
                  resume={resume}
                  onEdit={() => console.log('Edit', resume.id)}
                  onDownload={() => console.log('Download', resume.id)}
                  onDelete={handleDelete}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'matches') {
      if (jobMatches.length === 0) {
        return (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No job matches yet</h3>
            <p className="text-gray-600">Upload resumes and job descriptions to start matching.</p>
          </div>
        );
      }

      return (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Search className="w-5 h-5 text-blue-600" />
              <span>Resume + JD Matching Analysis</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobMatches.map(match => (
                <JobMatchCard
                  key={match.id}
                  match={match}
                  onViewResults={() => console.log('View results', match.id)}
                  onReanalyze={() => console.log('Re-analyze', match.id)}
                  onDelete={() => console.log('Delete match', match.id)}
                />
              ))}
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Resume Manager</h1>
              <p className="text-gray-600">Manage all your uploaded resumes and job descriptions in one place</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <input
              type="file"
              id="resume-upload"
              accept=".pdf,.doc,.docx"
              onChange={handleUpload}
              className="hidden"
            />
            <button
              onClick={() => document.getElementById('resume-upload')?.click()}
              disabled={isUploading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              <Upload className="w-4 h-4" />
              <span>{isUploading ? 'Uploading...' : 'Upload New Resume'}</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center space-x-6 mb-6">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'all' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All Uploads
          </button>
          <button
            onClick={() => setActiveTab('builder')}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'builder' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Resume Builder
          </button>
          <button
            onClick={() => setActiveTab('matches')}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'matches' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            JD Matches
          </button>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search resumes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <ArrowUpDown className="w-4 h-4" />
              <span>Sort</span>
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        {renderContent()}
      </div>
    </div>
  );
};

export default ResumeManager;