import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps }) => {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="w-full bg-zinc-50/90 backdrop-blur-md pt-6 pb-2 px-8 sticky top-0 z-10">
      <div className="flex justify-between items-end mb-3">
        <h1 className="text-xl font-bold tracking-tight text-zinc-900">
           {currentStep === totalSteps - 1 ? '最终确认' : `步骤 ${currentStep + 1}`}
        </h1>
        <span className="text-xs font-medium text-zinc-400 tracking-widest uppercase">
           {currentStep + 1} / {totalSteps}
        </span>
      </div>
      <div className="w-full bg-zinc-200 rounded-full h-1 overflow-hidden">
        <div 
          className="bg-zinc-900 h-1 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default StepIndicator;