"use client";

import { useState, useEffect } from 'react';
import { Upload, FileText, AlertCircle, Loader2 } from 'lucide-react';
import ATSOptimization from '@/components/dashboard/ATSOptimization';
import StrengthsAndImprovements from '@/components/dashboard/StrengthsAndImprovements';
import CurrentResume from '@/components/dashboard/CurrentResume';
import { LatestResumeData } from '@/types/resume';
import ScoreCard from '@/components/dashboard/ScoreCard';

interface ApiResponse {
  success: boolean;
  data: LatestResumeData | null;
  hasResume: boolean;
  message?: string;
}

// Mock API functions
const mockApiCall = async (delay: number = 1500): Promise<ApiResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate different states - you can modify this logic
      const hasExistingResume = true; // 20% chance of having a resume (mostly new users)

      if (hasExistingResume) {
        resolve({
          success: true,
          hasResume: true,
          data: {
            fileName: 'Aryan_Chauhan_Resume.pdf',
            lastUpdated: 'December 15, 2024',
            analysisStatus: 'completed',
            atsScore: 75,
            matchRate: 40,
            overallStrengths: [
              {
                description: "Strong educational background in Data Science and Artificial Technology",
                weightage: 20
              },
              {
                description: "Developed multiple projects showcasing web development skills",
                weightage: 15
              },
              {
                description: "Extracurricular activities in data analytics and competitive programming",
                weightage: 10
              }
            ],
            areasForImprovement: [
              {
                description: "Lack of direct relevance to string development",
                weightage: 30
              },
              {
                description: "Insufficient focus on technical skills specific to string development",
                weightage: 20
              }
            ],
            atsOptimizationSuggestions: [
              {
                description: "Highlighting specific technical skills relevant to string development",
                weightage: 20
              },
              {
                description: "Including a project demonstrating string development skills",
                weightage: 30
              }
            ],
            jobFitAssessment: {
              score: 40,
              notes: "The candidate has a strong educational background, but it does not directly relate to string development. The lack of relevant projects and technical skills specific to string development is a significant concern."
            },
            recommendationScore: 40,
            resumeSummary: "Aryan Chauhan's resume highlights his strong educational background in Data Science and Artificial Technology, but it lacks direct relevance to string development. He has developed multiple projects showcasing web development skills, but none of them specifically focus on string development. To strengthen his application, he should focus on highlighting specific technical skills relevant to string development and include a project demonstrating his skills in this area.",
            technicalSkills: ["Python", "JavaScript", "React", "Node.js"],
            softSkills: ["Problem Solving", "Team Collaboration", "Time Management"]
          }
        });
      } else {
        resolve({
          success: true,
          hasResume: false,
          data: null,
          message: "No resume found. Please upload your first resume to get started."
        });
      }
    }, delay);
  });
};

// Navigation function
const navigateToJDMatcher = () => {
  // In a real app, you'd use router.push('/dashboard/jd-matcher') for Next.js
  // For now, we'll simulate navigation
  window.location.href = '/dashboard/jd-matcher';
};

// Main Dashboard Component
const ResumeDashboard: React.FC = () => {
  const [resumeData, setResumeData] = useState<LatestResumeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasResume, setHasResume] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to get ATS score subtitle based on score
  const getATSSubtitle = (score: number): string => {
    if (score >= 90) return "Excellent ATS optimization";
    if (score >= 80) return "Very good ATS compatibility";
    if (score >= 70) return "Good ATS-friendly resume";
    if (score >= 60) return "Your resume is moderately ATS-friendly";
    if (score >= 50) return "Fair ATS compatibility - needs improvement";
    if (score >= 40) return "Poor ATS optimization";
    return "Critical ATS issues - immediate attention needed";
  };

  // Function to get JD match subtitle based on score
  const getJDMatchSubtitle = (score: number): string => {
    if (score >= 90) return "Excellent match with job requirements";
    if (score >= 80) return "Very good alignment with the role";
    if (score >= 70) return "Good match for the position";
    if (score >= 60) return "Moderate alignment with job requirements";
    if (score >= 50) return "Room for improvement in role alignment";
    if (score >= 40) return "Poor match with job requirements";
    return "Significant gaps in job requirements match";
  };

  // Fetch initial resume data
  useEffect(() => {
    const fetchResumeData = async () => {
      try {
        setIsLoading(true);
        const response = await mockApiCall();

        if (response.success) {
          setHasResume(response.hasResume);
          setResumeData(response.data);
        } else {
          setError(response.message || 'Failed to fetch resume data');
        }
      } catch (err) {
        setError('An error occurred while fetching resume data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchResumeData();
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show upload overlay if no resume exists
  if (!hasResume) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center relative">
        {/* Blurred Background Content */}
        <div className="absolute inset-0 bg-gray-50 p-6 blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, Aryan 👋</h1>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                Upload New Resume
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-48"></div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-48"></div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-48"></div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-96"></div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-96"></div>
            </div>
          </div>
        </div>

        {/* Upload CTA Overlay */}
        <div className="relative z-10 bg-white rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <div className="bg-blue-600 rounded-full p-4">
              <FileText className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Welcome to Your Resume Dashboard
            </h2>
            <p className="text-gray-600 mb-6">
              Get started by uploading your resume to unlock powerful AI-driven insights,
              ATS compatibility scores, and personalized career recommendations.
            </p>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-left">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="text-sm text-gray-700">AI-powered resume analysis</span>
              </div>
              <div className="flex items-center gap-3 text-left">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="text-sm text-gray-700">ATS compatibility scoring</span>
              </div>
              <div className="flex items-center gap-3 text-left">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="text-sm text-gray-700">Personalized career insights</span>
              </div>
            </div>
            <button
              onClick={navigateToJDMatcher}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 flex items-center justify-center gap-2 font-medium"
            >
              <Upload className="h-5 w-5" />
              Upload Your Resume
            </button>
            <p className="text-xs text-gray-500 mt-3">
              Supported formats: PDF, DOC, DOCX (Max 5MB)
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show dashboard only when user has a resume
  return (
    <div className="h-screen bg-gray-50 p-6 relative overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, Aryan 👋
          </h1>
          <button
            onClick={navigateToJDMatcher}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Upload New Resume
          </button>
        </div>

        {/* Dashboard Content */}
        <div className="space-y-8">
          {/* Top Row - Resume, ATS Score, JD Match */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <CurrentResume
              data={resumeData}
              onUpload={navigateToJDMatcher}
            />
            <ScoreCard
              title="ATS Compatibility Score"
              score={resumeData?.atsScore || 0}
              color="#3b82f6"
              subtitle={getATSSubtitle(resumeData?.atsScore || 0)}
              tooltipText="This score indicates how well your resume is optimized for Applicant Tracking Systems (ATS). Higher scores mean better compatibility with automated screening tools."
            />
            <ScoreCard
              title="Job Description Match"
              score={resumeData?.matchRate || 0}
              color="#f59e0b"
              subtitle={getJDMatchSubtitle(resumeData?.matchRate || 0)}
              tooltipText="This score indicates how well your resume matches the job description provided. It analyzes skills, experience, and qualifications alignment."
            />
          </div>

          {/* Bottom Row - Analysis Components */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <StrengthsAndImprovements
              strengths={resumeData?.overallStrengths || []}
              improvements={resumeData?.areasForImprovement || []}
            />
            <ATSOptimization
              suggestions={resumeData?.atsOptimizationSuggestions || []}
              jobFitAssessment={resumeData?.jobFitAssessment || { score: 0, notes: "Analysis in progress..." }}
              resumeSummary={resumeData?.resumeSummary || "Analysis in progress..."}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeDashboard;