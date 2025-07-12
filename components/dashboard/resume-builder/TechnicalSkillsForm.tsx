"use client";

import React, { useState } from 'react';
import { Code, Plus, X, Trash2 } from 'lucide-react';

// Define the Skill interface since we don't have access to the types file
interface Skill {
    skill_group: string;
    skills: string[];
}

const TechnicalSkillsForm: React.FC<{
    data: Skill[];
    onChange: (data: Skill[]) => void;
}> = ({ data, onChange }) => {

    // Get all existing skill groups from data
    const getExistingGroups = (): string[] => {
        return data.map(item => item.skill_group);
    };

    // Helper function to get skills for a specific group
    const getSkillsForGroup = (group: string): string[] => {
        const skillItem = data.find(item => item.skill_group === group);
        return skillItem ? skillItem.skills : [];
    };

    // Local state to track input values for real-time typing
    const [inputValues, setInputValues] = useState<Record<string, string>>(() => {
        const initialValues: Record<string, string> = {};
        getExistingGroups().forEach(group => {
            initialValues[group] = getSkillsForGroup(group).join(', ');
        });
        return initialValues;
    });

    // State for new skill group input
    const [newGroupName, setNewGroupName] = useState('');
    const [showAddGroup, setShowAddGroup] = useState(false);

    const updateSkills = (skillGroup: string, value: string) => {
        // Update local input state immediately for real-time display
        setInputValues(prev => ({ ...prev, [skillGroup]: value }));

        // Parse and update skills data
        const skills = value.split(',').map(skill => skill.trim()).filter(skill => skill);

        // Update or add the skill group in the data
        const updatedData = data.filter(item => item.skill_group !== skillGroup);
        if (skills.length > 0) {
            updatedData.push({
                skill_group: skillGroup,
                skills,
            });
        }

        onChange(updatedData);
    };

    const addNewSkillGroup = () => {
        if (newGroupName.trim() && !getExistingGroups().includes(newGroupName.trim())) {
            const trimmedName = newGroupName.trim();
            setInputValues(prev => ({ ...prev, [trimmedName]: '' }));
            setNewGroupName('');
            setShowAddGroup(false);

            // Add empty group to data
            const updatedData = [...data, {
                skill_group: trimmedName,
                skills: []
            }];
            onChange(updatedData);
        }
    };

    const removeSkillGroup = (groupToRemove: string) => {
        // Remove from input values
        const updatedInputValues = { ...inputValues };
        delete updatedInputValues[groupToRemove];
        setInputValues(updatedInputValues);

        // Remove from data
        const updatedData = data.filter(item => item.skill_group !== groupToRemove);
        onChange(updatedData);
    };

    // Get current skill groups (only from data)
    const currentGroups = getExistingGroups();

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Code className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold">Technical Skills</h3>
                </div>
                <button
                    onClick={() => setShowAddGroup(true)}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    <Plus className="w-4 h-4" />
                    Add Skill Group
                </button>
            </div>

            {/* Add new skill group section */}
            {showAddGroup && (
                <div className="p-4 border border-gray-200 rounded-lg space-y-3">
                    <div className="flex justify-between items-center">
                        <h4 className="font-medium text-gray-700">New Skill Group</h4>
                        <button
                            onClick={() => {
                                setShowAddGroup(false);
                                setNewGroupName('');
                            }}
                            className="text-red-500 hover:text-red-700"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Enter skill group name (e.g., 'Cloud Platforms', 'Databases')"
                            value={newGroupName}
                            onChange={(e) => setNewGroupName(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    addNewSkillGroup();
                                }
                            }}
                            className="flex-1 p-2 border border-gray-300 rounded focus:ring-1 focus:outline-none"
                            autoFocus
                        />
                        <button
                            type="button"
                            onClick={addNewSkillGroup}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Add
                        </button>
                    </div>
                </div>
            )}

            {currentGroups.map((group, index) => (
                <div key={group} className="p-4 border border-gray-200 rounded-lg space-y-3">
                    <div className="flex justify-between items-center">
                        <h4 className="font-medium text-gray-700">{group}</h4>
                        <button
                            onClick={() => removeSkillGroup(group)}
                            className="text-red-500 hover:text-red-700"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                    <input
                        type="text"
                        placeholder="Enter skills (comma-separated)"
                        value={inputValues[group] || ''}
                        onChange={(e) => updateSkills(group, e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:outline-none"
                    />
                </div>
            ))}
        </div>
    );
};

export default TechnicalSkillsForm;