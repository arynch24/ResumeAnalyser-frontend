"use client";

import { useState } from "react";
import { Upload, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDashboard } from "@/context/DashboardContext";
import Loader from "@/components/dashboard/Loader";
import axios from "axios";

export default function ResumeStarter() {

  const { setResumeData } = useDashboard();

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleImportClick = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.doc,.docx";

    input.onchange = async (event: Event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setIsLoading(true); 

      try {
        const formData = new FormData();
        formData.append("resume_file", file);

        const res = await axios.post("http://localhost:8000/api/v1/resume/", formData, {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const resumeExtracts = res.data.resume_details;

        setResumeData(resumeExtracts);
        router.push("/dashboard/resume-builder/edit");
      } catch (error) {
        console.error("Error importing resume:", error);
      } finally {
        setIsLoading(false); // Hide loader
      }
    };

    input.click();
  };

  const handleCreateClick = () => {
    // Navigate to the create resume page
    setResumeData({
      personal_info: {
        name: '',
        contact_info: {
          email: '',
          mobile: '',
          location: '',
          social_links: {
            linkedin: '',
            github: '',
            portfolio: ''
          },
        },
        professional_summary: ''
      },
      educations: [],
      work_experiences: [],
      projects: [],
      skills: [],
      achievements: [],
      certifications: [],
      languages: [],
      publications: [],
      extracurriculars: [],
      ats_score:0
    });
    router.push("/dashboard/resume-builder/edit");
  };


  if (isLoading)
    return (
      <div className="min-h-screen relative">
        <div className="absolute inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6">
            <Loader message="Processing your resume..." size="lg" />
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full flex flex-col justify-center items-center">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            How do you want to start?
          </h1>
          <p className="text-lg text-gray-600">
            Choose an option to begin building your resume tailored for the job you want.
          </p>
        </div>

        {/* Options Grid */}
        <div className="max-w-2xl grid md:grid-cols-2 gap-6">
          {/* Import Existing */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer group"

            onClick={handleImportClick}>
            <div className="flex flex-col items-center text-center">
              <div className="w-13 h-13 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-200 transition-colors">
                <Upload className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Import existing resume
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Upload your current resume and we&apos;ll help you optimise them using AI.
              </p>
            </div>
          </div>

          {/* Create New */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer group"
            onClick={handleCreateClick}>
            <div className="flex flex-col items-center text-center">
              <div className="w-13 h-13 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-200 transition-colors">
                <Plus className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Create from scratch
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Build your resume step-by-step with our guided setup process.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-sm text-gray-500">
            Not sure which option to choose? You can always change your approach later.
          </p>
        </div>
      </div>
    </div>
  );
}