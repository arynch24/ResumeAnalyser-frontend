"use client";

import { Plus, Trash2, Sparkles, Briefcase } from 'lucide-react';
import { useState } from 'react';
import { WorkExperience, LoadingStates, AISuggestions, AIDialogState } from '@/types/resume';
import { generateExperienceResponsibilities } from '@/services/aiService';
import AISuggestionBox from './AISuggestionBox';
import AIDialog from './AIDialog';

const ExperienceForm: React.FC<{
  data: WorkExperience[];
  onChange: (data: WorkExperience[]) => void;
}> = ({ data, onChange }) => {
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestions>({});
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({});
  const [dialogState, setDialogState] = useState<AIDialogState>({
    isOpen: false,
    projectId: null,
    suggestions: []
  });

  const addExperience = () => {
    const newExperience: WorkExperience = {
      company_name: '',
      job_title: '',
      location: '',
      date: {
        start: '',
        end: ''
      },
      bullet_points: ['']
    };
    onChange([...data, newExperience]);
  };

  const updateExperience = (index: number, field: keyof WorkExperience, value: string | string[] | { start: string; end: string }) => {
    const newData = [...data];
    newData[index] = { ...newData[index], [field]: value };
    onChange(newData);
  };

  const updateDateField = (index: number, dateField: 'start' | 'end', value: string) => {
    const experience = data[index];
    if (experience) {
      const newDate = { ...experience.date, [dateField]: value };
      updateExperience(index, 'date', newDate);
    }
  };

  const removeExperience = (index: number) => {
    const newData = data.filter((_, i) => i !== index);
    onChange(newData);
    // Clean up AI suggestions for removed experience
    const newSuggestions = { ...aiSuggestions };
    delete newSuggestions[index];
    setAiSuggestions(newSuggestions);
  };

  const addBulletPoint = (index: number) => {
    const experience = data[index];
    if (experience) {
      updateExperience(index, 'bullet_points', [...experience.bullet_points, '']);
    }
  };

  const updateBulletPoint = (experienceIndex: number, bulletIndex: number, value: string) => {
    const experience = data[experienceIndex];
    if (experience) {
      const newBulletPoints = [...experience.bullet_points];
      newBulletPoints[bulletIndex] = value;
      updateExperience(experienceIndex, 'bullet_points', newBulletPoints);
    }
  };

  const removeBulletPoint = (experienceIndex: number, bulletIndex: number) => {
    const experience = data[experienceIndex];
    if (experience && experience.bullet_points.length > 1) {
      const newBulletPoints = experience.bullet_points.filter((_, i) => i !== bulletIndex);
      updateExperience(experienceIndex, 'bullet_points', newBulletPoints);
    }
  };

  const generateAISuggestion = async (experienceIndex: number): Promise<void> => {
    const experience = data[experienceIndex];
    if (!experience) return;

    setLoadingStates(prev => ({ ...prev, [experienceIndex]: true }));

    try {
      const suggestions = await generateExperienceResponsibilities(experience);

      if (experience.bullet_points.length === 1) {
        // Single bullet point - show inline suggestion
        setAiSuggestions(prev => ({ ...prev, [experienceIndex]: suggestions }));
      } else {
        // Multiple bullet points - show dialog
        setDialogState({
          isOpen: true,
          projectId: experienceIndex,
          suggestions: suggestions
        });
      }
    } catch (error) {
      console.error('Failed to generate AI suggestion:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, [experienceIndex]: false }));
    }
  };

  const acceptAISuggestion = (experienceIndex: number): void => {
    const suggestions = aiSuggestions[experienceIndex];
    if (suggestions) {
      updateExperience(experienceIndex, 'bullet_points', suggestions);
      setAiSuggestions(prev => ({ ...prev, [experienceIndex]: null }));
    }
  };

  const declineAISuggestion = (experienceIndex: number): void => {
    setAiSuggestions(prev => ({ ...prev, [experienceIndex]: null }));
  };

  const acceptDialogSuggestions = (): void => {
    if (dialogState.projectId !== null) {
      updateExperience(dialogState.projectId, 'bullet_points', dialogState.suggestions);
      setDialogState({ isOpen: false, projectId: null, suggestions: [] });
    }
  };

  const declineDialogSuggestions = (): void => {
    setDialogState({ isOpen: false, projectId: null, suggestions: [] });
  };

  const regenerateDialogSuggestions = async () => {
    if (dialogState.projectId === null) return;

    const experience = data[dialogState.projectId];
    if (!experience) return;

    setLoadingStates(prev => ({ ...prev, [dialogState.projectId!]: true }));

    try {
      const suggestions = await generateExperienceResponsibilities(experience);
      setDialogState(prev => ({ ...prev, suggestions }));
    } catch (error) {
      console.error('Failed to regenerate AI suggestions:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, [dialogState.projectId!]: false }));
    }
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Experience</h3>
          </div>
          <button
            onClick={addExperience}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Experience
          </button>
        </div>

        {data.map((experience, experienceIndex) => (
          <div key={experienceIndex} className="p-4 border border-gray-200 rounded-lg space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-gray-700">Experience {experienceIndex + 1}</h4>
              <button
                onClick={() => removeExperience(experienceIndex)}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Company/Organization"
                value={experience.company_name}
                onChange={(e) => updateExperience(experienceIndex, 'company_name', e.target.value)}
                className="p-2 border border-gray-300 rounded focus:ring-1 focus:outline-none transition-colors"
              />
              <input
                type="text"
                placeholder="Job Title/Position"
                value={experience.job_title}
                onChange={(e) => updateExperience(experienceIndex, 'job_title', e.target.value)}
                className="p-2 border border-gray-300 rounded focus:ring-1 focus:outline-none transition-colors"
              />
              <input
                type="text"
                placeholder="Location"
                value={experience.location}
                onChange={(e) => updateExperience(experienceIndex, 'location', e.target.value)}
                className="p-2 border border-gray-300 rounded focus:ring-1 focus:outline-none transition-colors"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Start (MM YYYY)"
                  value={experience.date.start}
                  onChange={(e) => updateDateField(experienceIndex, 'start', e.target.value)}
                  className="p-2 border border-gray-300 rounded focus:ring-1 focus:outline-none transition-colors"
                />
                <input
                  type="text"
                  placeholder="End (MM YYYY)"
                  value={experience.date.end}
                  onChange={(e) => updateDateField(experienceIndex, 'end', e.target.value)}
                  className="p-2 border border-gray-300 rounded focus:ring-1 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Bullet Points</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => generateAISuggestion(experienceIndex)}
                    disabled={loadingStates[experienceIndex]}
                    className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Sparkles className="w-3 h-3" />
                    {loadingStates[experienceIndex] ? 'Generating...' : 'AI Generate Suggestion'}
                  </button>
                  <button
                    onClick={() => addBulletPoint(experienceIndex)}
                    className="text-blue-600 hover:text-blue-700 text-sm transition-colors"
                  >
                    + Add Bullet Point
                  </button>
                </div>
              </div>

              {/* Inline AI Suggestion Box (for single bullet point) */}
              {aiSuggestions[experienceIndex] && experience.bullet_points.length === 1 && (
                <AISuggestionBox
                  suggestion={aiSuggestions[experienceIndex]![0]}
                  onAccept={() => acceptAISuggestion(experienceIndex)}
                  onDecline={() => declineAISuggestion(experienceIndex)}
                  onRegenerate={() => generateAISuggestion(experienceIndex)}
                />
              )}

              {experience.bullet_points.map((bulletPoint, bulletIndex) => (
                <div key={bulletIndex} className="flex gap-2">
                  <textarea
                    placeholder="Bullet Point/Achievement"
                    value={bulletPoint}
                    onChange={(e) => updateBulletPoint(experienceIndex, bulletIndex, e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded focus:ring-1 focus:outline-none transition-colors resize-none"
                    rows={bulletPoint.length > 100 ? 3 : 2}
                  />
                  {experience.bullet_points.length > 1 && (
                    <button
                      onClick={() => removeBulletPoint(experienceIndex, bulletIndex)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <AIDialog
        isOpen={dialogState.isOpen}
        suggestions={dialogState.suggestions}
        isLoading={loadingStates[dialogState.projectId || 0]}
        onClose={declineDialogSuggestions}
        onAccept={acceptDialogSuggestions}
        onRegenerate={regenerateDialogSuggestions}
      />
    </>
  );
};

export default ExperienceForm;