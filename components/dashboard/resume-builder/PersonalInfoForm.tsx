"use client";

import { User } from 'lucide-react';
import { PersonalInfo } from '@/types/resume';

const PersonalInfoForm: React.FC<{
  data: PersonalInfo;
  onChange: (data: PersonalInfo) => void;
}> = ({ data, onChange }) => {
  const handleContactChange = (field: keyof PersonalInfo['contact_info'], value: string) => {
    onChange({
      ...data,
      contact_info: {
        ...data.contact_info,
        [field]: value
      }
    });
  };

  const handleSocialChange = (field: keyof PersonalInfo['contact_info']['social_links'], value: string) => {
    onChange({
      ...data,
      contact_info: {
        ...data.contact_info,
        social_links: {
          ...data.contact_info.social_links,
          [field]: value
        }
      }
    });
  };

  const handleDirectChange = (field: keyof PersonalInfo, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <User className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Personal Information</h3>
      </div>

      <div className='border-1 border-gray-200 rounded-lg p-4'>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Full Name"
            value={data?.name || ''}
            onChange={(e) => handleDirectChange('name', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:outline-none transition-colors"
          />
          <input
            type="email"
            placeholder="Email"
            value={data?.contact_info?.email || ''}
            onChange={(e) => handleContactChange('email', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:outline-none transition-colors"
          />
          <input
            type="tel"
            placeholder="Mobile"
            value={data?.contact_info?.mobile || ''}
            onChange={(e) => handleContactChange('mobile', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:outline-none transition-colors"
          />
          <input
            type="text"
            placeholder="Location"
            value={data?.contact_info?.location || ''}
            onChange={(e) => handleContactChange('location', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-1 focus:outline-none transition-colors"
          />
          <input
            type="text"
            placeholder="LinkedIn Profile"
            value={data?.contact_info?.social_links?.linkedin || ''}
            onChange={(e) => handleSocialChange('linkedin', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:outline-none transition-colors"
          />
          <input
            type="text"
            placeholder="GitHub Profile"
            value={data?.contact_info?.social_links?.github || ''}
            onChange={(e) => handleSocialChange('github', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:outline-none transition-colors"
          />
        </div>

        <input
          type="url"
          placeholder="Portfolio Website"
          value={data?.contact_info?.social_links?.portfolio || ''}
          onChange={(e) => handleSocialChange('portfolio', e.target.value)}
          className="w-full p-3 mt-4 border border-gray-300 rounded-lg focus:ring-1 focus:outline-none transition-colors"
        />
      </div>
    </div>
  );
};

export default PersonalInfoForm;