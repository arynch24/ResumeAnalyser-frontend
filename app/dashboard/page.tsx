"use client";

import { useState, useEffect } from 'react';
import { Upload, FileText, AlertCircle, Loader2 } from 'lucide-react';
import ATSOptimization from '@/components/dashboard/ATSOptimization';
import StrengthsAndImprovements from '@/components/dashboard/StrengthsAndImprovements';
import CurrentResume from '@/components/dashboard/CurrentResume';
import ScoreCard from '@/components/dashboard/ScoreCard';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useDashboard } from '@/context/DashboardContext';
import { LatestResumeData } from '@/types/resume';

const ResumeDashboard: React.FC = () => {
  const [resumeData, setResumeData] = useState<LatestResumeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasResume, setHasResume] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { setSkills } = useDashboard();

  // Transform API response to component format
  const transformApiResponse = (data: any): LatestResumeData => ({
    id: data._id,
    resumeId: data.resume_id,
    fileName: data.resume_metadata.resume_name || 'Latest Resume',
    lastUpdated: new Date(data.updated_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    analysisStatus: 'completed',
    atsScore: data.ats_score.ats_score,
    matchRate: Math.round(data.job_match_score),
    overallStrengths: data.llm_analysis.overall_analysis.overall_strengths,
    areasForImprovement: data.llm_analysis.overall_analysis.areas_for_improvement,
    atsOptimizationSuggestions: data.llm_analysis.overall_analysis.ats_optimization_suggestions,
    jobFitAssessment: data.llm_analysis.overall_analysis.job_fit_assessment,
    recommendationScore: data.llm_analysis.overall_analysis.recommendation_score,
    resumeSummary: data.llm_analysis.overall_analysis.resume_summary,
    technicalSkills: data.techinal_skills || [],
    softSkills: data.soft_skills || [],
    jobTitle: data.job_title
  });

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

  const navigateToJDMatcher = () => {
    router.push('/dashboard/jd-matcher');
  };

  // Fetch latest resume analysis from API
  useEffect(() => {
    const fetchResumeData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await axios.get('http://localhost:8000/api/v1/resume/latest-analysis', {
          withCredentials: true,
        });

        if (response.data.success && response.data.resume_analysis) {
          setHasResume(true);
          const transformedData = transformApiResponse(response.data.resume_analysis);
          setResumeData(transformedData);
          setSkills({
            technicalSkills: transformedData.technicalSkills,
            softSkills: transformedData.softSkills
          });
          setUserName(response.data.user_name || 'User'); 

        } else {
          setHasResume(false);
          setResumeData(null);
          setSkills(null);
        }
      } catch (err) {
        console.error('Error fetching resume data:', err);

        if (axios.isAxiosError(err)) {
          if (err.response?.status === 404) {
            // No resume found
            setHasResume(false);
            setResumeData(null);
          } else {
            setError(`API Error: ${err.response?.data?.message || err.message}`);
          }
        } else {
          setError('An unexpected error occurred while fetching resume data');
        }
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
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, {userName} 👋</h1>
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
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">
            Welcome back, {userName} 👋
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
              label="ATS Score"
              tooltipText="This score indicates how well your resume is optimized for Applicant Tracking Systems (ATS). Higher scores mean better compatibility with automated screening tools."
            />
            <ScoreCard
              title="Job Description Match"
              score={resumeData?.matchRate || 0}
              color="#f59e0b"
              label="Match Score"
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