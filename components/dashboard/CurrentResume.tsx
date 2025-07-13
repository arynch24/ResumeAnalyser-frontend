"use client";

import { FileText, Calendar, Download, Upload, Sparkles } from 'lucide-react';
import { LatestResumeData } from '@/types/resume';
import axios from 'axios';
import { useDashboard } from '@/context/DashboardContext';
import { useRouter } from 'next/navigation';

const CurrentResume: React.FC<{
    data: LatestResumeData | null;
    onUpload?: () => void;
}> = ({ data, onUpload }) => {

    const { setResumeData, setResumeAnalysisData } = useDashboard();
    const router = useRouter();

    const handlEditResume = async () => {
        try {
            const res = await axios.get(`http://localhost:8000/api/v1/resume/resume/${data?.resumeId}`, {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                },
            })
            setResumeData(res.data.resume);
            router.push('/dashboard/resume-builder/edit');
        } catch (error) {
            console.error("Error fetching resume data:", error);
        }
    }

    const handleViewResume = async () => {
        try {
            console.log("Viewing resume:", data?.id);
            const res = await axios.get(`http://localhost:8000/api/v1/resume/resume-analysis/${data?.id}`, {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                },
            });

            setResumeAnalysisData(res.data);
            router.push('/dashboard/jd-matcher/resume-analysis');

        } catch (error) {
            console.error("Error downloading resume:", error);
        }
    }


    if (!data) {
        return (
            <div className="group bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-dashed border-blue-200 hover:border-blue-300 transition-all duration-300 p-8 hover:shadow-lg">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-blue-500" />
                        Current Resume
                    </h3>
                    <div className="p-2 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                        <Upload className="h-5 w-5 text-blue-600" />
                    </div>
                </div>
                <div className="text-center py-12">
                    <div className="relative mb-6">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-lg opacity-20"></div>
                        <div className="relative p-2 bg-white rounded-full shadow-lg">
                            <FileText className="h-12 w-12 text-blue-500 mx-auto" />
                        </div>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">No resume uploaded yet</h4>
                    <p className="text-gray-600 mb-6">Upload your resume to get started with ATS optimization and job matching</p>
                    <button
                        onClick={onUpload}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                        <Upload className="h-4 w-4" />
                        Upload Your Resume
                    </button>
                </div>
            </div>
        );
    }
    return (
        <div className="group bg-white rounded-lg border shadow-sm border-gray-200 p-6 ">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    Current Resume
                </h3>
                <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors group">
                    <Download className="h-5 w-5 text-gray-600 group-hover:text-gray-800" />
                </button>
            </div>

            <div className="space-y-4">
                {/* Resume Title */}
                <div >
                    <h4 className="text-2xl font-semibold text-gray-900">{data?.fileName || ''}</h4>
                    <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center text-gray-500">
                            <Calendar className="h-4 w-4 mr-1.5" />
                            <span className="text-sm">Last updated: {data?.lastUpdated || ''}</span>
                        </div>
                    </div>
                </div>


                {/* Job Title Section */}
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">Optimized for:</p>
                            <p className="text-lg font-semibold text-gray-900">
                                {data?.jobTitle || 'Not specified'}
                            </p>
                        </div>

                    </div>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center gap-3 pt-2">
                    <button
                        onClick={handleViewResume}
                        className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors">
                        View Resume
                    </button>
                    <button
                        onClick={handlEditResume}
                        className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors">
                        Edit Resume
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CurrentResume;