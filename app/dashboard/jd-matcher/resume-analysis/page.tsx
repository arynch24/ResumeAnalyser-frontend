"use client";

import { ResumeHeader } from '@/components/dashboard/jd-matcher/ResumeHeader';
import { CircularProgress } from '@/components/dashboard/jd-matcher/CircularProgress';
import { ProgressBar } from '@/components/dashboard/jd-matcher/ProgressBar';
import { SkillTag } from '@/components/dashboard/jd-matcher/SkillTag';
import { SectionCard } from '@/components/dashboard/jd-matcher/SectionCard';
import { ResumeJDUpload } from '@/components/dashboard/ResumeJdUpload';
import { Copy } from 'lucide-react';
import { useDashboard } from '@/context/DashboardContext';

export default function JdMatcher() {

  const { openDialog, setOpenDialog, resumeAnalysisData } = useDashboard();

  const handleRefresh = () => {
    console.log('Refreshing analysis...');
  };

  const handleDownload = () => {
    console.log('Downloading report...');
  };

  const handleUploadNew = () => {
    setOpenDialog(true);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(resumeAnalysisData?.resume_analysis?.llm_analysis?.overall_analysis?.resume_summary || '')
      .then(() => {
        console.log('Summary copied to clipboard');
      })
      .catch(err => {
        console.error('Failed to copy summary: ', err);
      });
  };

  if (openDialog) {
    return <>
      <ResumeJDUpload />
    </>
  }


  return (
    resumeAnalysisData &&
    <div className="h-screen bg-gray-50 overflow-y-scroll">
      <div className='sticky top-0 px-8 py-4 shadow-sm bg-white border-b border-gray-100 z-10'>
        <ResumeHeader
          fileName={resumeAnalysisData.resume_metadata.resume_name} 
          onDownload={handleDownload}
          onUploadNew={handleUploadNew}
        />
      </div>
      <div className="max-w-7xl mx-auto px-8 py-8">

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* ATS Compatibility Score */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-xl font-semibold text-gray-900">ATS Compatibility Score</h2>
            </div>
            <p className="text-gray-600 text-sm mb-6">
              How well your resume passes automated screening
            </p>

            <div className="flex items-center mt-12">
              <div className="flex-1">
                <CircularProgress
                  percentage={resumeAnalysisData.resume_analysis.ats_score.ats_score}
                  color="#3B82F6"
                  label="ATS Score"
                />
              </div>

              <div className="flex-1 mr-4">
                <ProgressBar
                  label="Format Compliance"
                  percentage={resumeAnalysisData.resume_analysis.ats_score.format_compliance}
                />
                <ProgressBar
                  label="Keyword Optimization"
                  percentage={resumeAnalysisData.resume_analysis.ats_score.keyword_optimization}
                />
                <ProgressBar
                  label="Readability"
                  percentage={resumeAnalysisData.resume_analysis.ats_score.readability}
                />
              </div>
            </div>
          </div>

          {/* Job Description Match */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-xl font-semibold text-gray-900">Job Description Match</h2>
            </div>
            <p className="text-gray-600 text-sm mb-6">
              For: {resumeAnalysisData.job_title}
            </p>

            <div className="flex items-center justify-between mb-6">
              <CircularProgress
                percentage={resumeAnalysisData.resume_analysis.job_match_score}
                color="#10B981"
                label="Match Rate"
              />

              <div className="flex-1 ml-8">
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Key Matched Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {resumeAnalysisData.resume_analysis.matched_skills.map((skill, index) => (
                      <SkillTag key={index} skill={skill} type="matched" />
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Missing Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {resumeAnalysisData.resume_analysis.missing_skills.map((skill, index) => (
                      <SkillTag key={index} skill={skill} type="missing" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI-Generated Resume Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">AI-Generated Resume Summary</h2>
          </div>
          <p className="text-gray-700 leading-relaxed">{resumeAnalysisData.resume_analysis.llm_analysis.overall_analysis.resume_summary}</p>
          <div className="flex justify-end mt-4 cursor-pointer">
            <span className="text-sm text-gray-500 px-3 py-2 rounded  w-fit hover:bg-gray-50 hover:text-blue-500"
              onClick={handleCopyToClipboard}>
              <Copy size={16} className="inline mr-1" />
              Copy to clipboard
            </span>
          </div>
        </div>

        {/* Section-by-Section Analysis */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Section-by-Section Analysis</h2>

          <SectionCard
            title="Education"
            analysis={resumeAnalysisData.resume_analysis.llm_analysis.section_wise_analysis.education}
          />

          <SectionCard
            title="Work Experience"
            analysis={resumeAnalysisData.resume_analysis.llm_analysis.section_wise_analysis.experience}
          />

          <SectionCard
            title="Projects"
            analysis={resumeAnalysisData.resume_analysis.llm_analysis.section_wise_analysis.projects}
          />

          <SectionCard
            title="Skills"
            analysis={resumeAnalysisData.resume_analysis.llm_analysis.section_wise_analysis.skills}
          />

          <SectionCard
            title="Extracurricular"
            analysis={resumeAnalysisData.resume_analysis.llm_analysis.section_wise_analysis.extracurricular}
          />
        </div>
      </div>
    </div>
  );
}