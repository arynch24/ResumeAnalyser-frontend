"use client";

import React from 'react';
import { Resume } from '@/types/resume';
import { formatDate } from '@/lib/utils';
import { Edit, Download, Trash2 } from 'lucide-react';

const ResumeCard: React.FC<{
    resume: Resume;
    onEdit: (resume: Resume) => void;
    onDownload: (id: string) => void;
    onDelete: (id: string) => void;
  }> = ({ resume, onEdit, onDownload, onDelete }) => {
    const getScoreColor = (score: number) => {
      if (score >= 80) return 'text-green-600';
      if (score >= 60) return 'text-yellow-600';
      return 'text-red-600';
    };
  
    const getScoreBgColor = (score: number) => {
      if (score >= 80) return 'bg-green-600';
      if (score >= 60) return 'bg-yellow-600';
      return 'bg-red-600';
    };
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div>
              <h3 className="font-semibold text-gray-900">{resume.resume_name}</h3>
              <p className="text-sm text-gray-500">Uploaded on {formatDate(resume.created_at)}</p>
            </div>
          </div>
          {/* <div className="flex items-center space-x-2">
            {resume.is_primary && (
              <Star className="w-5 h-5 text-yellow-500 fill-current" />
            )}
          </div> */}
        </div>
  
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">ATS Score:</span>
            <span className={`text-xl font-bold ${getScoreColor(resume.ats_score)}`}>
              {resume.ats_score}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full ${getScoreBgColor(resume.ats_score)}`}
              style={{ width: `${resume.ats_score}%` }}
            ></div>
          </div>
        </div>
  
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(resume)}
            className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded"
          >
            <Edit className="w-4 h-4" />
            <span>Edit</span>
          </button>
          <button
            onClick={() => onDownload(resume._id)}
            className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
          <button
            onClick={() => onDelete(resume._id)}
            className="flex items-center space-x-1 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    );
  };

  export default ResumeCard;