"use client";

import { useState } from 'react';
import { Plus } from 'lucide-react';


const AddSkillButton: React.FC<{
    type: 'technical' | 'soft';
    onAdd: (name: string, type: 'technical' | 'soft') => void;
}> = ({ type, onAdd }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [skillName, setSkillName] = useState('');

    const handleAdd = () => {
        if (skillName.trim()) {
            onAdd(skillName.trim(), type);
            setSkillName('');
            setIsAdding(false);
        }
    };

    const handleCancel = () => {
        setSkillName('');
        setIsAdding(false);
    };

    if (isAdding) {
        return (
            <div className="inline-flex items-center gap-2">
                <input
                    type="text"
                    value={skillName}
                    onChange={(e) => setSkillName(e.target.value)}
                    placeholder="Enter skill name"
                    className="px-3 py-1 border border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') handleAdd();
                        if (e.key === 'Escape') handleCancel();
                    }}
                    autoFocus
                />
                <button
                    onClick={handleAdd}
                    className="px-3 py-1 bg-green-500 text-white rounded-full text-sm hover:bg-green-600"
                >
                    Add
                </button>
                <button
                    onClick={handleCancel}
                    className="px-3 py-1 bg-gray-300 text-gray-700 rounded-full text-sm hover:bg-gray-400"
                >
                    Cancel
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center gap-1 px-3 py-1 border-2 border-dashed border-gray-300 rounded-full text-sm text-gray-600 hover:border-gray-400 hover:text-gray-800"
        >
            <Plus size={14} />
            Add Skill
        </button>
    );
};

export default AddSkillButton;