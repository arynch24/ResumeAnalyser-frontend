import { Project, WorkExperience, Extracurricular } from '@/types/resume';
import axios from 'axios';

// Mock AI suggestion function - replace with your actual AI API call
export const generateProjectSuggestions = async (projectData: Project): Promise<string[]> => {
  const suggestions: string[] = [];

  try {
    const res = await axios.post("http://localhost:8000/api/v1/resume/project", {
      project_name: projectData.title,
      tech_stack: projectData.technologies_used.join(", "),
      bullet_points:projectData.bullet_points?.join('@ ') ?? null,
    }, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    suggestions.push(...res.data.bullet_points);
    return suggestions;

  } catch (error: any) {
    console.error("❌ Error generating project suggestions:", error.response?.data || error.message);
    return [];
  }
};


// Mock AI suggestion function for experience responsibilities - replace with your actual AI API call
export const generateExperienceResponsibilities = async (experienceData: WorkExperience): Promise<string[]> => {

  // Mock response based on number of existing responsibilities
  // const numPoints = experienceData.bullet_points.length;
  const suggestions: string[] = [];

  try {
    const res = await axios.post("http://localhost:8000/api/v1/resume/experience", {
      "organisation_name": experienceData.company_name,
      "position": experienceData.job_title,
      "location": experienceData.location,
      "bullet_points": experienceData.bullet_points?.join('@ ') ?? null,
    }, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    suggestions.push(...res.data.bullet_points);
    return suggestions;

  } catch (error) {
    console.error("Error generating project suggestions:", error);
    return [];
  }
};

// Mock AI suggestion function for extracurricular responsibilities - replace with your actual AI API call
export const generateExtracurricularResponsibilities = async (activityData: Extracurricular): Promise<string[]> => {
  
  // Mock response based on number of existing responsibilities
  // const numPoints = activityData.bullet_points.length;
  const suggestions: string[] = [];

  try {
    const res = await axios.post("http://localhost:8000/api/v1/resume/extracurricular", {
      "organisation_name": activityData.organization_name,
      "position": activityData.role,
      "location": activityData.location,
      "bullet_points": activityData.bullet_points?.join('@ ') ?? null,
    }, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    suggestions.push(...res.data.bullet_points);
    return suggestions;

  } catch (error) {
    console.error("Error generating project suggestions:", error);
    return [];
  }
};