"use client";

import { GraduationCap, Plus, Trash2 } from 'lucide-react';
import { Education } from '@/types/resume';
import React from 'react';

const EducationForm: React.FC<{
  data: Education[];
  onChange: (data: Education[]) => void;
}> = ({ data, onChange }) => {
  const addEducation = () => {
    const newEducation: Education = {
      institute_name: '',
      degree: '',
      specialisation: '',
      date: {
        start: '',
        end: ''
      },
      location: '',
      gpa: '',
      relevant_coursework: []
    };
    onChange([...data, newEducation]);
  };

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    const updatedData = [...data];
    if (field === 'date') {
      // This case shouldn't happen with current implementation
      return;
    } else {
      updatedData[index] = { ...updatedData[index], [field]: value };
    }
    onChange(updatedData);
  };

  const updateEducationDates = (index: number, dateField: keyof Education['date'], value: string) => {
    const updatedData = [...data];
    updatedData[index] = {
      ...updatedData[index],
      date: {
        ...updatedData[index].date,
        [dateField]: value
      }
    };
    onChange(updatedData);
  };

  const updateCoursework = (index: number, courseworkString: string) => {
    const updatedData = [...data];
    updatedData[index] = {
      ...updatedData[index],
      relevant_coursework: courseworkString.split(',').map(course => course.trim()).filter(course => course.length > 0)
    };
    onChange(updatedData);
  };

  const removeEducation = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Education</h3>
        </div>
        <button
          onClick={addEducation}
          className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add Education
        </button>
      </div>

      {data.map((edu, index) => (
        <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-gray-700">Education {index+1}</h4>
            <button
              onClick={() => removeEducation(index)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Institute Name"
              value={edu.institute_name}
              onChange={(e) => updateEducation(index, 'institute_name', e.target.value)}
              className="p-2 border border-gray-300 rounded focus:ring-1 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Degree"
              value={edu.degree}
              onChange={(e) => updateEducation(index, 'degree', e.target.value)}
              className="p-2 border border-gray-300 rounded focus:ring-1 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Specialisation"
              value={edu.specialisation}
              onChange={(e) => updateEducation(index, 'specialisation', e.target.value)}
              className="p-2 border border-gray-300 rounded focus:ring-1 focus:outline-none"
            />
            <input
              type="text"
              placeholder="GPA"
              value={edu.gpa}
              onChange={(e) => updateEducation(index, 'gpa', e.target.value)}
              className="p-2 border border-gray-300 rounded focus:ring-1 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Start Date (MM YYYY)"
              value={edu.date.start}
              onChange={(e) => updateEducationDates(index, 'start', e.target.value)}
              className="p-2 border border-gray-300 rounded focus:ring-1 focus:outline-none"
            />
            <input
              type="text"
              placeholder="End Date (MM YYYY)"
              value={edu.date.end}
              onChange={(e) => updateEducationDates(index, 'end', e.target.value)}
              className="p-2 border border-gray-300 rounded focus:ring-1 focus:outline-none"
            />
          </div>
          <input
            type="text"
            placeholder="Location"
            value={edu.location}
            onChange={(e) => updateEducation(index, 'location', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:outline-none"
          />
          {/* <input
            type="text"
            placeholder="Relevant Coursework (comma-separated)"
            value={edu.relevant_coursework.join(', ')}
            onChange={(e) => updateCoursework(index, e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:outline-none"
          /> */}
        </div>
      ))}
    </div>
  );
};

export default EducationForm;