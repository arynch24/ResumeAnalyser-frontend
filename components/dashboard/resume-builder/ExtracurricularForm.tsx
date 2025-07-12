"use client";

import { Plus, Trash2, Users, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Extracurricular, LoadingStates, AISuggestions, AIDialogState } from '@/types/resume';
import { generateExtracurricularResponsibilities } from '@/services/aiService';
import AISuggestionBox from './AISuggestionBox';
import AIDialog from './AIDialog';

const ExtracurricularForm: React.FC<{
  data: Extracurricular[];
  onChange: (data: Extracurricular[]) => void;
}> = ({ data, onChange }) => {
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestions>({});
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({});
  const [dialogState, setDialogState] = useState<AIDialogState>({
    isOpen: false,
    projectId: null,
    suggestions: []
  });

  const addActivity = () => {
    const newActivity: Extracurricular = {
      title: '',
      organization_name: '',
      role: '',
      date: {
        start: '',
        end: ''
      },
      bullet_points: [''],
      certificate:'',
      location:''
    };
    onChange([...data, newActivity]);
  };

  const updateActivity = (index: number, field: keyof Extracurricular, value: string | string[] | { start: string; end: string }) => {
    const newData = [...data];
    newData[index] = { ...newData[index], [field]: value };
    onChange(newData);
  };

  const updateDateField = (index: number, dateField: 'start' | 'end', value: string) => {
    const activity = data[index];
    if (activity) {
      const newDate = { ...activity.date, [dateField]: value };
      updateActivity(index, 'date', newDate);
    }
  };

  const removeActivity = (index: number) => {
    const newData = data.filter((_, i) => i !== index);
    onChange(newData);
    // Clean up AI suggestions for removed activity
    const newSuggestions = { ...aiSuggestions };
    delete newSuggestions[index];
    setAiSuggestions(newSuggestions);
  };

  const addBulletPoint = (index: number) => {
    const activity = data[index];
    if (activity) {
      updateActivity(index, 'bullet_points', [...activity.bullet_points, '']);
    }
  };

  const updateBulletPoint = (activityIndex: number, bulletIndex: number, value: string) => {
    const activity = data[activityIndex];
    if (activity) {
      const newBulletPoints = [...activity.bullet_points];
      newBulletPoints[bulletIndex] = value;
      updateActivity(activityIndex, 'bullet_points', newBulletPoints);
    }
  };

  const removeBulletPoint = (activityIndex: number, bulletIndex: number) => {
    const activity = data[activityIndex];
    if (activity && activity.bullet_points.length > 1) {
      const newBulletPoints = activity.bullet_points.filter((_, i) => i !== bulletIndex);
      updateActivity(activityIndex, 'bullet_points', newBulletPoints);
    }
  };

  const generateAISuggestion = async (activityIndex: number): Promise<void> => {
    const activity = data[activityIndex];
    if (!activity) return;

    setLoadingStates(prev => ({ ...prev, [activityIndex]: true }));
    
    try {
      const suggestions = await generateExtracurricularResponsibilities(activity);
      
      if (activity.bullet_points.length === 1) {
        // Single bullet point - show inline suggestion
        setAiSuggestions(prev => ({ ...prev, [activityIndex]: suggestions }));
      } else {
        // Multiple bullet points - show dialog
        setDialogState({
          isOpen: true,
          projectId: activityIndex,
          suggestions: suggestions
        });
      }
    } catch (error) {
      console.error('Failed to generate AI suggestion:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, [activityIndex]: false }));
    }
  };

  const acceptAISuggestion = (activityIndex: number): void => {
    const suggestions = aiSuggestions[activityIndex];
    if (suggestions) {
      updateActivity(activityIndex, 'bullet_points', suggestions);
      setAiSuggestions(prev => ({ ...prev, [activityIndex]: null }));
    }
  };

  const declineAISuggestion = (activityIndex: number): void => {
    setAiSuggestions(prev => ({ ...prev, [activityIndex]: null }));
  };

  const acceptDialogSuggestions = (): void => {
    if (dialogState.projectId !== null) {
      updateActivity(dialogState.projectId, 'bullet_points', dialogState.suggestions);
      setDialogState({ isOpen: false, projectId: null, suggestions: [] });
    }
  };

  const declineDialogSuggestions = (): void => {
    setDialogState({ isOpen: false, projectId: null, suggestions: [] });
  };

  const regenerateDialogSuggestions = async () => {
    if (dialogState.projectId === null) return;
    
    const activity = data[dialogState.projectId];
    if (!activity) return;

    setLoadingStates(prev => ({ ...prev, [dialogState.projectId!]: true }));
    
    try {
      const suggestions = await generateExtracurricularResponsibilities(activity);
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
            <Users className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Extracurricular Activities</h3>
          </div>
          <button
            onClick={addActivity}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Activity
          </button>
        </div>

        {data.map((activity, activityIndex) => (
          <div key={activityIndex} className="p-4 border border-gray-200 rounded-lg space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-gray-700">Activity {activityIndex+1}</h4>
              <button
                onClick={() => removeActivity(activityIndex)}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Activity Title"
                value={activity.title}
                onChange={(e) => updateActivity(activityIndex, 'title', e.target.value)}
                className="p-2 border border-gray-300 rounded focus:ring-1 focus:outline-none transition-colors"
              />
              <input
                type="text"
                placeholder="Organization Name"
                value={activity.organization_name}
                onChange={(e) => updateActivity(activityIndex, 'organization_name', e.target.value)}
                className="p-2 border border-gray-300 rounded focus:ring-1 focus:outline-none transition-colors"
              />
              <input
                type="text"
                placeholder="Role/Position"
                value={activity.role}
                onChange={(e) => updateActivity(activityIndex, 'role', e.target.value)}
                className="p-2 border border-gray-300 rounded focus:ring-1 focus:outline-none transition-colors"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Start (MM YYYY)"
                  value={activity.date.start}
                  onChange={(e) => updateDateField(activityIndex, 'start', e.target.value)}
                  className="p-2 border border-gray-300 rounded focus:ring-1 focus:outline-none transition-colors"
                />
                <input
                  type="text"
                  placeholder="End (MM YYYY)"
                  value={activity.date.end}
                  onChange={(e) => updateDateField(activityIndex, 'end', e.target.value)}
                  className="p-2 border border-gray-300 rounded focus:ring-1 focus:outline-none transition-colors"
                />
              </div>
              <input
                type="text"
                placeholder="Location (optional)"
                value={activity.location}
                onChange={(e) => updateActivity(activityIndex, 'location', e.target.value)}
                className="p-2 border border-gray-300 rounded focus:ring-1 focus:outline-none transition-colors"
              />
              <input
                type="text"
                placeholder="Certificate (optional)"
                value={activity.certificate}
                onChange={(e) => updateActivity(activityIndex, 'certificate', e.target.value)}
                className="p-2 border border-gray-300 rounded focus:ring-1 focus:outline-none transition-colors"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Bullet Points</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => generateAISuggestion(activityIndex)}
                    disabled={loadingStates[activityIndex]}
                    className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Sparkles className="w-3 h-3" />
                    {loadingStates[activityIndex] ? 'Generating...' : 'AI Generate Suggestion'}
                  </button>
                  <button
                    onClick={() => addBulletPoint(activityIndex)}
                    className="text-blue-600 hover:text-blue-700 text-sm transition-colors"
                  >
                    + Add Bullet Point
                  </button>
                </div>
              </div>

              {/* Inline AI Suggestion Box (for single bullet point) */}
              {aiSuggestions[activityIndex] && activity.bullet_points.length === 1 && (
                <AISuggestionBox
                  suggestion={aiSuggestions[activityIndex]![0]}
                  onAccept={() => acceptAISuggestion(activityIndex)}
                  onDecline={() => declineAISuggestion(activityIndex)}
                  onRegenerate={() => generateAISuggestion(activityIndex)}
                />
              )}

              {activity.bullet_points.map((bulletPoint, bulletIndex) => (
                <div key={bulletIndex} className="flex gap-2">
                  <textarea
                    placeholder="Bullet Point/Achievement"
                    value={bulletPoint}
                    onChange={(e) => updateBulletPoint(activityIndex, bulletIndex, e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded focus:ring-1 focus:outline-none transition-colors resize-none"
                    rows={bulletPoint.length > 100 ? 3 : 2}
                  />
                  {activity.bullet_points.length > 1 && (
                    <button
                      onClick={() => removeBulletPoint(activityIndex, bulletIndex)}
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

export default ExtracurricularForm;