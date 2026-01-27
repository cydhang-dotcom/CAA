import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Sparkles, RefreshCw, CheckCircle2, ChevronRight } from 'lucide-react';
import StepIndicator from './components/StepIndicator';
import { FormData, INITIAL_DATA } from './types';
import { generatePlan } from './services/gemini';

// Import Steps
import Step0CoreGoals from './components/steps/Step0CoreGoals';
import Step1Business from './components/steps/Step1Business';
import Step3TaxInvoice from './components/steps/Step3TaxInvoice';
import Step4Structure from './components/steps/Step4Structure';
import Step5Capital from './components/steps/Step5Capital';
import Step6Personnel from './components/steps/Step6Personnel';
import Step7Address from './components/steps/Step7Address';
import Step8Bank from './components/steps/Step8Bank';
import Step9HR from './components/steps/Step9HR';
import Step10Review from './components/steps/Step10Review';

const App: React.FC = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(INITIAL_DATA);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string>('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const TOTAL_STEPS = 10;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, 0);
    }
  }, [step]);

  const updateData = (key: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS - 1) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setIsGenerating(true);
    const plan = await generatePlan(formData);
    setResult(plan);
    setIsGenerating(false);
  };

  // --- Render Steps ---
  const renderStep = () => {
    switch (step) {
      case 0:
        return <Step0CoreGoals data={formData} updateData={updateData} />;
      case 1:
        return <Step1Business data={formData} updateData={updateData} />;
      case 2:
        return <Step3TaxInvoice data={formData} updateData={updateData} />;
      case 3:
        return <Step4Structure data={formData} updateData={updateData} />;
      case 4:
        return <Step5Capital data={formData} updateData={updateData} />;
      case 5:
        return <Step6Personnel data={formData} updateData={updateData} />;
      case 6:
        return <Step7Address data={formData} updateData={updateData} />;
      case 7:
        return <Step8Bank data={formData} updateData={updateData} />;
      case 8:
        return <Step9HR data={formData} updateData={updateData} />;
      case 9:
        return <Step10Review data={formData} />;
      default:
        return null;
    }
  };

  // --- Render Result View ---
  if (result) {
    return (
      <div className="min-h-screen bg-zinc-50 pb-10 font-sans">
        <div className="bg-white/80 backdrop-blur-md border-b border-zinc-200 sticky top-0 z-20 px-6 py-4 flex items-center justify-between shadow-sm">
          <h1 className="text-lg font-bold text-zinc-900 flex items-center tracking-tight">
             <CheckCircle2 className="w-5 h-5 text-green-600 mr-2" />
             方案已生成
          </h1>
          <button 
            onClick={() => { setResult(''); setStep(0); }}
            className="text-sm font-semibold text-zinc-600 hover:text-zinc-900 flex items-center px-4 py-2 rounded-full hover:bg-zinc-100 transition-colors"
          >
            <RefreshCw size={14} className="mr-1.5" /> 重置
          </button>
        </div>
        
        <div className="max-w-2xl mx-auto p-6">
          <div className="prose prose-zinc prose-sm max-w-none bg-white p-10 rounded-3xl shadow-xl shadow-zinc-200/50 border border-zinc-100">
             {/* Simple Markdown Renderer fallback */}
             {result.split('\n').map((line, i) => {
               if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-black text-zinc-900 mt-2 mb-8 pb-4 border-b border-zinc-100 tracking-tight">{line.replace('# ', '')}</h1>
               if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold text-zinc-800 mt-10 mb-4 flex items-center tracking-tight"><div className="w-1.5 h-6 bg-zinc-900 mr-3 rounded-full"></div>{line.replace('## ', '')}</h2>
               if (line.startsWith('### ')) return <h3 key={i} className="text-base font-bold text-zinc-700 mt-6 mb-2">{line.replace('### ', '')}</h3>
               if (line.startsWith('- [ ]')) return (
                 <div key={i} className="flex items-start my-3 p-3.5 bg-zinc-50 rounded-xl border border-zinc-100 hover:border-zinc-300 transition-colors">
                   <div className="w-5 h-5 rounded-md border-2 border-zinc-300 mr-3 mt-0.5 flex-shrink-0 bg-white"></div>
                   <span className="text-zinc-700 font-medium">{line.replace('- [ ]', '')}</span>
                 </div>
               )
               if (line.startsWith('- ')) return <li key={i} className="ml-4 text-zinc-600 my-2 leading-relaxed list-disc marker:text-zinc-400">{line.replace('- ', '')}</li>
               if (line.startsWith('*')) return <p key={i} className="text-zinc-500 italic my-4 text-sm bg-zinc-50 p-3 rounded-lg border-l-2 border-zinc-300">{line.replace(/\*/g, '')}</p>
               return <p key={i} className="text-zinc-600 my-3 leading-relaxed whitespace-pre-wrap">{line}</p>
             })}
          </div>

          <div className="mt-12 text-center px-6">
            <p className="text-xs text-zinc-400 font-medium tracking-wide uppercase">AI Generate Content • For Reference Only</p>
          </div>
        </div>
      </div>
    );
  }

  // --- Render Loading View ---
  if (isGenerating) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 p-6">
        <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-zinc-200 border border-zinc-100">
           <Sparkles className="w-10 h-10 text-zinc-900 animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold text-zinc-900 mb-3 tracking-tight">正在生成方案</h2>
        <p className="text-zinc-500 text-center max-w-xs text-sm leading-relaxed">
          AI 正在分析您的业务需求<br/>规划税务路径并生成合规清单...
        </p>
      </div>
    );
  }

  // --- Render Wizard View ---
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col font-sans text-zinc-900">
      <StepIndicator currentStep={step} totalSteps={TOTAL_STEPS} />

      <div className="flex-1 overflow-y-auto no-scrollbar" ref={scrollRef}>
        <div className="max-w-xl mx-auto p-6 pb-40 pt-4">
          {renderStep()}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 z-30 pointer-events-none">
        <div className="max-w-xl mx-auto flex justify-between gap-4 pointer-events-auto">
          <button
            onClick={handlePrev}
            disabled={step === 0}
            className={`
              flex-1 py-4 rounded-2xl font-bold flex items-center justify-center transition-all text-sm backdrop-blur-xl border
              ${step === 0 
                ? 'bg-white/50 text-zinc-300 border-zinc-100 cursor-not-allowed' 
                : 'bg-white/90 text-zinc-700 border-zinc-200 hover:bg-white hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 shadow-sm'}
            `}
          >
            <ArrowLeft size={16} className="mr-2" />
            上一步
          </button>
          
          {step === TOTAL_STEPS - 1 ? (
             <button
               onClick={handleSubmit}
               className="flex-[2] bg-zinc-900 text-white py-4 rounded-2xl font-bold shadow-xl shadow-zinc-300 flex items-center justify-center hover:-translate-y-0.5 active:translate-y-0 transition-all text-sm border border-zinc-900"
             >
               生成方案
               <Sparkles size={16} className="ml-2 text-yellow-300" />
             </button>
          ) : (
             <button
               onClick={handleNext}
               className="flex-[2] bg-zinc-900 text-white py-4 rounded-2xl font-bold shadow-xl shadow-zinc-300 flex items-center justify-center hover:-translate-y-0.5 active:translate-y-0 transition-all text-sm border border-zinc-900"
             >
               下一步
               <ArrowRight size={16} className="ml-2" />
             </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;