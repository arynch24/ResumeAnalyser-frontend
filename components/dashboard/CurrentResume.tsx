"use client";

import { FileText, Calendar, Download, Upload } from 'lucide-react';
import { LatestResumeData } from '@/types/resume';

const CurrentResume: React.FC<{
    data: LatestResumeData | null;
    onUpload?: () => void;
}> = ({ data, onUpload }) => {
    if (!data) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Current Resume</h3>
                    <Upload className="h-5 w-5 text-gray-400" />
                </div>
                <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No resume uploaded yet</p>
                    <button
                        onClick={onUpload}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                        Upload your first resume
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Current Resume</h3>
                <Download className="h-5 w-5 text-gray-400 cursor-pointer hover:text-gray-600" />
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-2">{data.fileName}</h4>
            <div className="flex items-center text-gray-500 mb-4">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Last updated: {data.lastUpdated}</span>
            </div>
            <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Analysis Status</span>
                <span className={`px-3 py-1 rounded-full text-sm ${data.analysisStatus === 'completed'
                    ? 'bg-green-100 text-green-800'
                    : data.analysisStatus === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                    {data.analysisStatus.charAt(0).toUpperCase() + data.analysisStatus.slice(1)}
                </span>
            </div>
        </div>
    );
};

export default CurrentResume;