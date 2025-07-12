"use client";

import { Eye, Download, RefreshCw } from 'lucide-react';
import { useDashboard } from '@/context/DashboardContext';
import ReactToPdf from 'react-to-pdf';

const BuilderHeader: React.FC<{
    score: number;
    onPreview: () => void;
    onRefresh: () => void;
}> = ({ score, onPreview, onRefresh }) => {

    const { resumeRef } = useDashboard();

    const handleDownloadPdf = async () => {
        if (resumeRef?.current) {
            try {
                await ReactToPdf(resumeRef, {
                    filename: 'resume.pdf',
                    page: {
                        margin: 5,
                        format: 'a4',
                    },
                    canvas: {
                        mimeType: 'image/png',
                        qualityRatio: 1,
                    },
                });
            } catch (error) {
                console.error('Error generating PDF:', error);
            }
        }
    };

    return (
        <div className="flex items-center justify-between w-full mx-auto px-4 sm:px-6 lg:px-8 ">
            <div className="flex justify-between items-center py-4">
                <div className="flex flex-col">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Resume Builder</h1>
                    <span className="text-gray-700 font-medium">Create and optimize your professional resume</span>
                </div>
            </div>

            <div className="flex space-x-2 items-center">
                <div className='border-1 border-gray-300 rounded px-3 py-2'>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onRefresh}
                            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <RefreshCw size={20} />
                        </button>
                        <div className='flex flex-col'>
                            <span className="text-xs text-gray-500">ATS Score</span>
                            <div>
                                <span className="text-xl font-bold text-gray-900">{score}</span>
                                <span className="text-sm text-gray-500">/100</span>
                            </div>
                        </div>
                        <div className="w-10 h-10 relative bottom-1 right-1">
                            <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                                <path
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="#e5e7eb"
                                    strokeWidth="4"
                                />
                                <path
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="#3b82f6"
                                    strokeWidth="4"
                                    strokeDasharray={`${score}, 100`}
                                />
                            </svg>
                        </div>
                    </div>
                </div>
                {/* <button
                    onClick={onPreview}
                    className="flex items-center h-fit space-x-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-300"
                >
                    <Eye size={16} />
                    <span>Preview</span>
                </button> */}

                <button
                    onClick={handleDownloadPdf}
                    className="flex items-center h-fit space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-800 cursor-pointer transition-colors duration-300"
                >
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                </button>
            </div>
        </div>
    )
};

export default BuilderHeader;