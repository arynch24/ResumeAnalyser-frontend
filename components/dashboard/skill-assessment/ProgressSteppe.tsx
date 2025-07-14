
const ProgressSteppe: React.FC<{ currentStep: number; totalSteps: number }> = ({ currentStep, totalSteps }) => (
    <div className="w-full flex items-center gap-4 mb-8">
        {Array.from({ length: totalSteps }, (_, i) => (
            <div key={i} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${i + 1 <= currentStep ? 'bg-blue-500' : 'bg-gray-300'
                    }`}>
                    {i + 1}
                </div>
                <span className={`ml-3 font-medium ${i + 1 <= currentStep ? 'text-blue-500' : 'text-gray-500'
                    }`}>
                    {i === 0 ? 'Skill Extraction' : i === 1 ? 'Assessment' : 'Career Feedback'}
                </span>
                {i < totalSteps - 1 && (
                    <div className={`w-64 h-[1px] mx-4 ${i + 1 < currentStep ? 'bg-blue-500' : 'bg-gray-300'
                        }`} />
                )}
            </div>
        ))}
    </div>
);

export default ProgressSteppe;