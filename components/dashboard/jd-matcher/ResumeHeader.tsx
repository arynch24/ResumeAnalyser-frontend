"use client";

import { Download, Upload } from 'lucide-react';

interface ResumeHeaderProps {
    fileName: string;
    onDownload: () => void;
    onUploadNew: () => void;
}

export const ResumeHeader: React.FC<ResumeHeaderProps> = ({
    fileName,
    onDownload,
    onUploadNew
}) => {
    return (
        <div className="flex items-center justify-between z-1 ">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Resume Analysis</h1>
                <div className="flex items-center space-x-4">
                    <span className="text-gray-700 font-medium">{fileName}</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded">
                        Analyzed
                    </span>

                </div>
            </div>
            <div className='flex flex-col gap-2'>
                <div className="flex items-center space-x-3">
                    <button
                        onClick={onDownload}
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <Download size={20} />
                    </button>
                    <button
                        onClick={onUploadNew}
                        className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 cursor-pointer"
                    >
                        <Upload size={20} />
                        <span>Upload New Resume</span>
                    </button>
                </div>
            </div>
        </div>
    );
};