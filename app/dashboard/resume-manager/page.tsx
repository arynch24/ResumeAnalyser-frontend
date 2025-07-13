"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import {
  Search,
  FileText,
  Layers2
} from 'lucide-react';
import { useDashboard } from '@/context/DashboardContext';
import { ResumeData, JobMatch, Resume, ResumeAnalysis } from '@/types/resume';
import JobMatchCard from '@/components/dashboard/resume-manager/JobMatchCard';
import ResumeCard from '@/components/dashboard/resume-manager/ResumeCard';
import DeleteConfirmationDialog from '@/components/dashboard/resume-manager/DeleteConfirmationDialog';





// API functions
const api = {
  getResumes: async (): Promise<Resume[]> => {
    const response = await axios.get('http://localhost:8000/api/v1/resume', {
      withCredentials: true
    });
    return response.data.resume;
  },

  getJobMatches: async (): Promise<JobMatch[]> => {
    const response = await axios.get('http://localhost:8000/api/v1/resume/resume-analysis', {
      withCredentials: true
    });
    return response.data.resume_analysis;
  },

  deleteResume: async (id: string): Promise<void> => {
    await axios.delete(`http://localhost:8000/api/v1/resume/${id}`, {
      withCredentials: true
    });
  },

  deleteJobMatch: async (id: string): Promise<void> => {
    await axios.delete(`http://localhost:8000/api/v1/resume/resume-analysis/${id}`, {
      withCredentials: true
    });
  },
};

// Utility functions
const sortByDate = <T extends { created_at: string }>(items: T[]): T[] => {
  return [...items].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
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

const ResumeManager: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'all' | 'builder' | 'matches'>('all');
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [jobMatches, setJobMatches] = useState<JobMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { setResumeData, setResumeAnalysisData } = useDashboard();

  // Delete confirmation state
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    type: 'resume' | 'jobMatch';
    id: string;
    name: string;
    isDeleting: boolean;
  }>({
    isOpen: false,
    type: 'resume',
    id: '',
    name: '',
    isDeleting: false
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [resumesData, matchesData] = await Promise.all([
        api.getResumes(),
        api.getJobMatches()
      ]);

      setResumes(sortByDate(resumesData));
      setJobMatches(sortByDate(matchesData));
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteResume = async (id: string) => {
    const resume = resumes.find(r => r._id === id);
    if (!resume) return;

    setDeleteConfirmation({
      isOpen: true,
      type: 'resume',
      id,
      name: resume.resume_name,
      isDeleting: false
    });
  };

  const handleDeleteJobMatch = async (id: string) => {
    const match = jobMatches.find(m => m._id === id);
    if (!match) return;

    setDeleteConfirmation({
      isOpen: true,
      type: 'jobMatch',
      id,
      name: match.resume_metadata.resume_name,
      isDeleting: false
    });
  };

  const confirmDelete = async () => {
    setDeleteConfirmation(prev => ({ ...prev, isDeleting: true }));

    try {
      if (deleteConfirmation.type === 'resume') {
        await api.deleteResume(deleteConfirmation.id);
        setResumes(prev => prev.filter(resume => resume._id !== deleteConfirmation.id));
      } else {
        await api.deleteJobMatch(deleteConfirmation.id);
        setJobMatches(prev => prev.filter(match => match._id !== deleteConfirmation.id));
      }

      setDeleteConfirmation({
        isOpen: false,
        type: 'resume',
        id: '',
        name: '',
        isDeleting: false
      });
    } catch (error) {
      console.error('Error deleting:', error);
      setError(`Failed to delete ${deleteConfirmation.type}. Please try again.`);
      setDeleteConfirmation(prev => ({ ...prev, isDeleting: false }));
    }
  };

  const closeDeleteConfirmation = () => {
    if (deleteConfirmation.isDeleting) return;

    setDeleteConfirmation({
      isOpen: false,
      type: 'resume',
      id: '',
      name: '',
      isDeleting: false
    });
  };

  const handleEditResume = (resume: Resume) => {
    const resumeData: ResumeData = {
      _id: resume._id,
      resume_name: resume.resume_name,
      is_primary: resume.is_primary,
      personal_info: resume.personal_info,
      educations: resume.educations,
      work_experiences: resume.work_experiences,
      projects: resume.projects,
      skills: resume.skills,
      achievements: resume.achievements,
      certifications: resume.certifications,
      languages: resume.languages,
      publications: resume.publications,
      extracurriculars: resume.extracurriculars,
      ats_score: resume.ats_score,
    };

    setResumeData(resumeData);
    router.push('/dashboard/resume-builder/edit');
  };

  const handleViewJobMatch = (match: JobMatch) => {
    // Create the analysis object in the expected format
    const analysisData: ResumeAnalysis = {
      success: true,
      message: 'Analysis retrieved successfully',
      resume_metadata: {
        resume_name: match.resume_metadata.resume_name,
        is_primary: false,
      },
      resume_analysis: {
        ats_score: match.ats_score,
        job_match_score: match.job_match_score,
        skill_match_percent: match.skill_match_percent,
        technical_skills: match.technical_skills.flatMap(group => group.skills),
        soft_skills: match.soft_skills.flatMap(group => group.skills),
        matched_skills: match.matched_skills,
        missing_skills: match.missing_skills,
        nlp_analysis: {
          word_count: 0,
          entities: [],
          keywords: [],
          role_match_score: match.job_match_score,
          role_matched: null,
        },
        llm_analysis: match.llm_analysis,
      },
      job_title: match.job_title || 'Not specified',
    };

    setResumeAnalysisData(analysisData);

    router.push('/dashboard/jd-matcher/resume-analysis');
  };

  const filteredResumes = resumes.filter(resume =>
    resume.resume_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredJobMatches = jobMatches.filter(match =>
    match.resume_metadata.resume_name.toLowerCase().includes(searchTerm.toLowerCase())
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

    if (error) {
      return (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <Layers2 className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Data</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={loadData}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      );
    }

    if (activeTab === 'all') {
      if (resumes.length === 0 && jobMatches.length === 0) {
        return <EmptyState onUpload={() => document.getElementById('resume-upload')?.click()} />;
      }

      return (
        <div className="space-y-6">
          {/* Resume Builder Section */}
          {resumes.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <span>Resume Builder Uploads</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResumes.map(resume => (
                  <ResumeCard
                    key={resume._id}
                    resume={resume}
                    onEdit={handleEditResume}
                    onDownload={(id) => console.log('Download', id)}
                    onDelete={handleDeleteResume}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Job Matches Section */}
          {jobMatches.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Search className="w-5 h-5 text-green-600" />
                <span>Resume + JD Matching Analysis</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredJobMatches.map(match => (
                  <JobMatchCard
                    key={match._id}
                    match={match}
                    onViewResults={handleViewJobMatch}
                    onDelete={handleDeleteJobMatch}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    if (activeTab === 'builder') {
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
                  key={resume._id}
                  resume={resume}
                  onEdit={handleEditResume}
                  onDownload={(id) => console.log('Download', id)}
                  onDelete={handleDeleteResume}
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
              <Search className="w-8 h-8 text-blue-600" />
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
              <Search className="w-5 h-5 text-green-600" />
              <span>Resume + JD Matching Analysis</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobMatches.map(match => (
                <JobMatchCard
                  key={match._id}
                  match={match}
                  onViewResults={handleViewJobMatch}
                  onDelete={handleDeleteJobMatch}
                />
              ))}
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="h-screen bg-gray-50 overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Resume Manager</h1>
              <p className="text-gray-600">Manage all your uploaded resumes and job descriptions in one place</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-between mb-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            {[
              { id: 'all', label: 'All Files', count: resumes.length + jobMatches.length },
              { id: 'builder', label: 'Resume Builder', count: resumes.length },
              { id: 'matches', label: 'Job Matches', count: jobMatches.length }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'all' | 'builder' | 'matches')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
          {/* Search */}
          <div className="flex items-center space-x-4 mr-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search resumes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        {renderContent()}
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={deleteConfirmation.isOpen}
        onClose={closeDeleteConfirmation}
        onConfirm={confirmDelete}
        title={deleteConfirmation.type === 'resume' ? 'Delete Resume' : 'Delete Job Match'}
        message={
          deleteConfirmation.type === 'resume'
            ? `Are you sure you want to delete this resume? This action cannot be undone.`
            : `Are you sure you want to delete this job match analysis? This action cannot be undone.`
        }
        itemName={deleteConfirmation.name}
        isDeleting={deleteConfirmation.isDeleting}
      />
    </div>
  );
};

export default ResumeManager;