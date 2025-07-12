// ProjectsForm.tsx
"use client";

import { Plus, Code, Trash2, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Project, LoadingStates, AISuggestions, AIDialogState } from '@/types/resume';
import { generateProjectSuggestions } from '@/services/aiService';
import AISuggestionBox from './AISuggestionBox';
import AIDialog from './AIDialog';

interface ProjectsFormProps {
  data: Project[];
  onChange: (data: Project[]) => void;
}

const ProjectsForm: React.FC<ProjectsFormProps> = ({ data, onChange }) => {
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestions>({});
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({});
  const [dialogState, setDialogState] = useState<AIDialogState>({
    isOpen: false,
    projectId: null,
    suggestions: []
  });

  const addProject = (): void => {
    const newProject: Project = {
      title: '',
      project_link: '',
      date: {
        start: '',
        end: ''
      },
      location: '',
      organization: '',
      bullet_points: [''],
      technologies_used: []
    };
    onChange([...data, newProject]);
  };

  const updateProject = (index: number, field: keyof Project, value: string | string[]): void => {
    const updatedData = [...data];
    updatedData[index] = { ...updatedData[index], [field]: value };
    onChange(updatedData);
  };

  const updateProjectDate = (index: number, dateField: keyof Project['date'], value: string): void => {
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

  const updateTechnologies = (index: number, techString: string): void => {
    const updatedData = [...data];
    
    if (techString.trim() === '') {
      updatedData[index] = {
        ...updatedData[index],
        technologies_used: []
      };
    } else {
      const techArray = techString
        .split(',')
        .map(tech => tech.trim())
        .filter(tech => tech.length > 0 || techString.endsWith(','));
      
      updatedData[index] = {
        ...updatedData[index],
        technologies_used: techArray
      };
    }
    
    onChange(updatedData);
  };

  const removeProject = (index: number): void => {
    onChange(data.filter((_, i) => i !== index));
    // Clean up AI suggestions for removed project
    const newSuggestions = { ...aiSuggestions };
    delete newSuggestions[index.toString()];
    setAiSuggestions(newSuggestions);
  };

  const addBulletPoint = (index: number): void => {
    const updatedData = [...data];
    updatedData[index] = {
      ...updatedData[index],
      bullet_points: [...updatedData[index].bullet_points, '']
    };
    onChange(updatedData);
  };

  const updateBulletPoint = (projectIndex: number, bulletIndex: number, value: string): void => {
    const updatedData = [...data];
    const newBulletPoints = [...updatedData[projectIndex].bullet_points];
    newBulletPoints[bulletIndex] = value;
    updatedData[projectIndex] = {
      ...updatedData[projectIndex],
      bullet_points: newBulletPoints
    };
    onChange(updatedData);
  };

  const removeBulletPoint = (projectIndex: number, bulletIndex: number): void => {
    const updatedData = [...data];
    if (updatedData[projectIndex].bullet_points.length > 1) {
      const newBulletPoints = updatedData[projectIndex].bullet_points.filter((_, i) => i !== bulletIndex);
      updatedData[projectIndex] = {
        ...updatedData[projectIndex],
        bullet_points: newBulletPoints
      };
      onChange(updatedData);
    }
  };

  const generateAISuggestion = async (projectIndex: number): Promise<void> => {
    const project = data[projectIndex];
    if (!project) return;

    setLoadingStates(prev => ({ ...prev, [projectIndex]: true }));

    try {
      const suggestions = await generateProjectSuggestions(project);

      if (project.bullet_points.length === 1) {
        // Single bullet point - show inline suggestion
        setAiSuggestions(prev => ({ ...prev, [projectIndex]: suggestions }));
      } else {
        // Multiple bullet points - show dialog
        setDialogState({
          isOpen: true,
          projectId: projectIndex,
          suggestions: suggestions
        });
      }
    } catch (error) {
      console.error('Failed to generate AI suggestion:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, [projectIndex]: false }));
    }
  };

  const acceptAISuggestion = (projectIndex: number): void => {
    const suggestions = aiSuggestions[projectIndex];
    if (suggestions) {
      updateProject(projectIndex, 'bullet_points', suggestions);
      setAiSuggestions(prev => ({ ...prev, [projectIndex]: null }));
    }
  };

  const declineAISuggestion = (projectIndex: number): void => {
    setAiSuggestions(prev => ({ ...prev, [projectIndex]: null }));
  };

  const regenerateAISuggestion = async (projectIndex: number): Promise<void> => {
    await generateAISuggestion(projectIndex);
  };

  // Dialog handlers
  const handleDialogAccept = (): void => {
    if (dialogState.projectId !== null) {
      const projectIndex = dialogState.projectId;
      updateProject(projectIndex, 'bullet_points', dialogState.suggestions);
      setDialogState({ isOpen: false, projectId: null, suggestions: [] });
    }
  };

  const handleDialogRegenerate = async (): Promise<void> => {
    if (dialogState.projectId !== null) {
      const projectIndex = dialogState.projectId;
      setLoadingStates(prev => ({ ...prev, [projectIndex]: true }));
      
      try {
        const project = data[projectIndex];
        if (project) {
          const newSuggestions = await generateProjectSuggestions(project);
          setDialogState(prev => ({ ...prev, suggestions: newSuggestions }));
        }
      } catch (error) {
        console.error('Failed to regenerate AI suggestions:', error);
      } finally {
        setLoadingStates(prev => ({ ...prev, [projectIndex]: false }));
      }
    }
  };

  const handleDialogClose = (): void => {
    setDialogState({ isOpen: false, projectId: null, suggestions: [] });
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Projects</h3>
          </div>
          <button
            onClick={addProject}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Project
          </button>
        </div>

        {data.map((project, index) => (
          <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-gray-700">Project {index+1}</h4>
              <button
                onClick={() => removeProject(index)}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <input
              type="text"
              placeholder="Project Title"
              value={project.title}
              onChange={(e) => updateProject(index, 'title', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:outline-none transition-colors"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Start Date (MM YYYY)"
                value={project.date.start}
                onChange={(e) => updateProjectDate(index, 'start', e.target.value)}
                className="p-2 border border-gray-300 rounded focus:ring-1 focus:outline-none transition-colors"
              />
              <input
                type="text"
                placeholder="End Date (MM YYYY)"
                value={project.date.end}
                onChange={(e) => updateProjectDate(index, 'end', e.target.value)}
                className="p-2 border border-gray-300 rounded focus:ring-1 focus:outline-none transition-colors"
              />
            </div>

            <input
              type="text"
              placeholder="Technologies Used (comma-separated)"
              value={project.technologies_used.join(', ')}
              onChange={(e) => updateTechnologies(index, e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:outline-none transition-colors"
            />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Bullet Points</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => generateAISuggestion(index)}
                    disabled={loadingStates[index]}
                    className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Sparkles className="w-3 h-3" />
                    {loadingStates[index] ? 'Generating...' : 'AI Generate'}
                  </button>
                  <button
                    onClick={() => addBulletPoint(index)}
                    className="text-blue-600 hover:text-blue-700 text-sm transition-colors"
                  >
                    + Add Point
                  </button>
                </div>
              </div>

              {/* AI Suggestion Box for single bullet point */}
              {aiSuggestions[index] && project.bullet_points.length === 1 && (
                <AISuggestionBox
                  suggestion={aiSuggestions[index]![0]}
                  onAccept={() => acceptAISuggestion(index)}
                  onDecline={() => declineAISuggestion(index)}
                  onRegenerate={() => regenerateAISuggestion(index)}
                  className="mb-3"
                />
              )}

              {project.bullet_points.map((point, bulletIndex) => (
                <div key={bulletIndex} className="flex gap-2">
                  <textarea
                    placeholder="Bullet point"
                    value={point}
                    onChange={(e) => updateBulletPoint(index, bulletIndex, e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded focus:ring-1 focus:rin-1 focus:outline-none transition-colors resize-none"
                    rows={point.length > 100 ? 3 : 2}
                  />
                  {project.bullet_points.length > 1 && (
                    <button
                      onClick={() => removeBulletPoint(index, bulletIndex)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            <input
              type="url"
              placeholder="Project Link"
              value={project.project_link}
              onChange={(e) => updateProject(index, 'project_link', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:outline-none transition-colors"
            />
          </div>
        ))}
      </div>

      {/* AI Dialog for multiple bullet points */}
      <AIDialog
        isOpen={dialogState.isOpen}
        suggestions={dialogState.suggestions}
        isLoading={dialogState.projectId !== null ? loadingStates[dialogState.projectId] || false : false}
        onClose={handleDialogClose}
        onAccept={handleDialogAccept}
        onRegenerate={handleDialogRegenerate}
      />
    </>
  );
};

export default ProjectsForm;