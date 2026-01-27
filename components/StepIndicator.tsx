import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps }) => {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="w-full bg-stone-50 z-10 pt-6 pb-2 px-6 md:px-8 border-b border-stone-100 flex-shrink-0">
      <div className="flex justify-between items-end mb-3">
        <h1 className="text-xl font-medium tracking-tight text-stone-800">
           {currentStep === totalSteps - 1 ? '最终确认' : `步骤 ${currentStep + 1}`}
        </h1>
        <span className="text-xs font-medium text-stone-400 tracking-widest uppercase">
           {currentStep + 1} / {totalSteps}
        </span>
      </div>
      <div className="w-full bg-stone-200 rounded-full h-1 overflow-hidden">
        <div 
          className="bg-stone-600 h-1 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default StepIndicator;