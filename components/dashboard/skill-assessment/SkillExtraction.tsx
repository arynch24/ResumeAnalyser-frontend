"use client";

import { useState } from 'react';
import { Code, Users, AlertCircle, ChevronRight, Loader2 } from 'lucide-react';
import { AssessmentSkill } from '@/types/resume';
import { useDashboard } from '@/context/DashboardContext';
import SkillTag from './SkillTag';
import AddSkillButton from './AddSkillButton';

interface SkillExtractionProps {
    skills?: AssessmentSkill[];
    onSkillsChange?: (skills: AssessmentSkill[]) => void;
    onNext?: () => void;
    loading?: boolean;
}

const SkillExtraction: React.FC<SkillExtractionProps> = ({
    skills,
    onSkillsChange = () => { },
    onNext = () => { },
    loading = false
}) => {
    const { skills: contextSkills } = useDashboard();

    // Transform context skills to AssessmentSkill format
    const transformedSkills: AssessmentSkill[] = (() => {
        if (!contextSkills) return [];

        const skills: AssessmentSkill[] = [];

        // Add technical skills
        if (contextSkills.technicalSkills) {
            contextSkills.technicalSkills.forEach((skill, index) => {
                skills.push({
                    id: `tech-${index + 1}`,
                    name: skill,
                    type: 'technical'
                });
            });
        }

        // Add soft skills
        if (contextSkills.softSkills) {
            contextSkills.softSkills.forEach((skill, index) => {
                skills.push({
                    id: `soft-${index + 1}`,
                    name: skill,
                    type: 'soft'
                });
            });
        }

        return skills;
    })();

    const [currentSkills, setCurrentSkills] = useState<AssessmentSkill[]>(transformedSkills);

    const addSkill = (name: string, type: 'technical' | 'soft') => {
        const currentTechnicalSkills = currentSkills.filter(skill => skill.type === 'technical');
        const currentSoftSkills = currentSkills.filter(skill => skill.type === 'soft');
        
        // Check if we already have 8 skills of this type
        if (type === 'technical' && currentTechnicalSkills.length >= 8) {
            return; // Don't add more technical skills if we already have 8
        }
        if (type === 'soft' && currentSoftSkills.length >= 8) {
            return; // Don't add more soft skills if we already have 8
        }

        const newSkill: AssessmentSkill = {
            id: Date.now().toString(),
            name,
            type
        };
        const updatedSkills = [...currentSkills, newSkill];
        setCurrentSkills(updatedSkills);
        onSkillsChange(updatedSkills);
    };

    const removeSkill = (skillId: string) => {
        const updatedSkills = currentSkills.filter(skill => skill.id !== skillId);
        setCurrentSkills(updatedSkills);
        onSkillsChange(updatedSkills);
    };

    const technicalSkills = currentSkills.filter(skill => skill.type === 'technical');
    const softSkills = currentSkills.filter(skill => skill.type === 'soft');

    const hasMinimumSkills = technicalSkills.length >= 2 && softSkills.length >= 2;
    const hasMaximumSkills = technicalSkills.length <= 8 && softSkills.length <= 8;
    const hasMaxTechnicalSkills = technicalSkills.length >= 8;
    const hasMaxSoftSkills = softSkills.length >= 8;

    return (
        <div className="bg-white p-8 rounded-lg shadow-sm max-w-6xl mx-auto">
            <div className="mb-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900">Skills Extracted from Resume</h2>
                </div>

                {/* Technical Skills */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <Code className="text-blue-500" size={20} />
                        <h3 className="text-lg font-medium text-gray-900">Technical Skills</h3>
                        <span className="text-sm text-gray-500">({technicalSkills.length} skills)</span>
                    </div>
                    <div className="flex flex-wrap gap-3 items-center">
                        {technicalSkills.map(skill => (
                            <SkillTag key={skill.id} skill={skill} onRemove={removeSkill} />
                        ))}
                        <AddSkillButton 
                            type="technical"    
                            onAdd={addSkill}
                            disabled={hasMaxTechnicalSkills}
                        />
                    </div>
                </div>

                {/* Soft Skills */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <Users className="text-purple-500" size={20} />
                        <h3 className="text-lg font-medium text-gray-900">Soft Skills</h3>
                        <span className="text-sm text-gray-500">({softSkills.length} skills)</span>
                    </div>
                    <div className="flex flex-wrap gap-3 items-center">
                        {softSkills.map(skill => (
                            <SkillTag key={skill.id} skill={skill} onRemove={removeSkill} />
                        ))}
                        <AddSkillButton 
                            type="soft" 
                            onAdd={addSkill}
                            disabled={hasMaxSoftSkills}
                        />
                    </div>
                </div>

                {/* Maximum skills warning */}
                {(hasMaxTechnicalSkills || hasMaxSoftSkills) && (
                    <div className="mb-6 flex items-center gap-2 px-4 py-3 bg-orange-50 rounded-lg">
                        <AlertCircle size={20} className="text-orange-600" />
                        <span className="text-orange-800 text-sm">
                            {hasMaxTechnicalSkills && hasMaxSoftSkills
                                ? "You've reached the maximum limit of 8 skills for both categories."
                                : hasMaxTechnicalSkills
                                ? "You've reached the maximum limit of 8 technical skills."
                                : "You've reached the maximum limit of 8 soft skills."
                            } Remove a skill to add a new one.
                        </span>
                    </div>
                )}
            </div>

            {/* Bottom Section */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 px-4 py-3 bg-blue-50 rounded-lg">
                    <AlertCircle size={20} className="text-blue-600" />
                    <span className="text-blue-800 text-sm">
                        Verify and edit your skills before proceeding to the assessment
                    </span>
                </div>

                <div className="flex flex-col items-end gap-2">
                    {!hasMinimumSkills && (
                        <p className="text-sm text-orange-600">
                            Add at least 2 technical and 2 soft skills to proceed
                        </p>
                    )}
                    <button
                        onClick={onNext}
                        disabled={!hasMinimumSkills || !hasMaximumSkills || loading}
                        className={`px-6 py-3 rounded-lg flex items-center gap-2 font-medium transition-colors ${!hasMinimumSkills ||!hasMaximumSkills || loading
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-blue-500 text-white hover:bg-blue-600'
                            }`}
                    >
                        {loading ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                Generating Questions...
                            </>
                        ) : (
                            <>
                                Start Skill Assessment
                                <ChevronRight size={20} />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SkillExtraction;