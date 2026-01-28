import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Sparkles, RefreshCw, CheckCircle2 } from 'lucide-react';
import StepIndicator from './components/StepIndicator';
import { FormData, INITIAL_DATA } from './types';
import { generatePlan } from './services/gemini';

// Import Steps
import Step0CoreGoals from './components/steps/Step0CoreGoals';
import Step1Business from './components/steps/Step1Business';
// Step2NameScope removed
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

  // --- Markdown Rendering Helper ---
  const renderMarkdown = (text: string) => {
    // Helper to parse inline bold syntax (**text**)
    const formatInline = (str: string) => {
      // Split by **text** pattern
      return str.split(/(\*\*.*?\*\*)/g).map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
          return <strong key={index} className="font-bold text-stone-900">{part.slice(2, -2)}</strong>;
        }
        return part;
      });
    };

    return text.split('\n').map((line, i) => {
      const trimmed = line.trim();
      if (trimmed.length === 0) return <div key={i} className="h-4"></div>;

      if (line.startsWith('# ')) {
        return <h1 key={i} className="text-2xl md:text-3xl font-medium text-stone-800 mt-4 mb-6 pb-4 border-b border-stone-100 tracking-tight">{line.replace('# ', '')}</h1>;
      }
      
      if (line.startsWith('## ')) {
        return (
          <h2 key={i} className="text-lg md:text-xl font-bold text-stone-700 mt-8 mb-4 flex items-center tracking-tight">
            <div className="w-1.5 h-6 bg-stone-500 mr-3 rounded-full"></div>
            {line.replace('## ', '')}
          </h2>
        );
      }
      
      if (line.startsWith('### ')) {
        return <h3 key={i} className="text-base font-bold text-stone-600 mt-6 mb-2">{formatInline(line.replace('### ', ''))}</h3>;
      }
      
      if (line.startsWith('- [ ]')) {
        return (
          <div key={i} className="flex items-start my-3 p-3 bg-stone-50 rounded-xl border border-stone-100 hover:border-stone-300 transition-colors">
            <div className="w-5 h-5 rounded-md border-2 border-stone-300 mr-3 mt-0.5 flex-shrink-0 bg-white"></div>
            <span className="text-stone-700 font-medium">{formatInline(line.replace('- [ ]', ''))}</span>
          </div>
        );
      }
      
      if (line.startsWith('- ')) {
        return (
          <div key={i} className="flex items-start my-2 ml-1">
             <div className="w-1.5 h-1.5 rounded-full bg-stone-400 mt-2 mr-3 flex-shrink-0"></div>
             <p className="text-stone-600 leading-relaxed flex-1">{formatInline(line.replace('- ', ''))}</p>
          </div>
        );
      }

      // Block italics/notes (starts with * but not **)
      if (line.startsWith('*') && !line.startsWith('**')) {
        return <p key={i} className="text-stone-500 italic my-4 text-sm bg-stone-50 p-3 rounded-lg border-l-2 border-stone-300">{formatInline(line.replace(/^\*|\*$/g, ''))}</p>;
      }

      // Standard paragraph
      return <p key={i} className="text-stone-600 my-3 leading-relaxed whitespace-pre-wrap">{formatInline(line)}</p>;
    });
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

  // --- Layout Wrapper ---
  // On Mobile: Full screen, bg-stone-50
  // On Desktop: Center aligned card, bg-stone-200 backdrop
  return (
    <div className="min-h-screen w-full md:flex md:items-center md:justify-center md:py-10 transition-colors duration-500">
      
      {/* Main Card Container */}
      <div className="w-full h-[100vh] md:h-[85vh] md:max-w-2xl bg-stone-50 md:rounded-3xl md:shadow-2xl md:shadow-stone-900/10 md:border md:border-white/50 flex flex-col relative overflow-hidden">
        
        {/* --- Loading View --- */}
        {isGenerating && (
          <div className="absolute inset-0 z-50 bg-stone-50 flex flex-col items-center justify-center p-6 fade-in">
            <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-stone-200 border border-stone-100">
              <Sparkles className="w-10 h-10 text-stone-600 animate-pulse" />
            </div>
            <h2 className="text-2xl font-medium text-stone-800 mb-3 tracking-tight">正在生成方案</h2>
            <p className="text-stone-500 text-center max-w-xs text-sm leading-relaxed">
              AI 正在分析您的业务需求<br/>规划税务路径并生成合规清单...
            </p>
          </div>
        )}

        {/* --- Result View --- */}
        {result ? (
          <div className="flex flex-col h-full bg-stone-50 font-sans text-stone-800">
            {/* Result Header */}
            <div className="bg-white/50 backdrop-blur-md border-b border-stone-200 flex-shrink-0 px-6 py-4 flex items-center justify-between z-10">
              <h1 className="text-lg font-bold text-stone-800 flex items-center tracking-tight">
                <CheckCircle2 className="w-5 h-5 text-green-600 mr-2" />
                方案已生成
              </h1>
              <button 
                onClick={() => { setResult(''); setStep(0); }}
                className="text-sm font-semibold text-stone-600 hover:text-stone-900 flex items-center px-4 py-2 rounded-full hover:bg-white transition-colors"
              >
                <RefreshCw size={14} className="mr-1.5" /> 重置
              </button>
            </div>
            
            {/* Result Content (Scrollable) */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-6">
              <div className="prose prose-stone prose-sm max-w-none bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-stone-100">
                {renderMarkdown(result)}
              </div>
              <div className="mt-8 text-center px-6 pb-6">
                <p className="text-xs text-stone-400 font-medium tracking-wide uppercase">AI Generate Content • For Reference Only</p>
              </div>
            </div>
          </div>
        ) : (
          /* --- Wizard View --- */
          <div className="flex flex-col h-full font-sans text-stone-800">
            
            {/* Header (Fixed in Flex) */}
            <StepIndicator currentStep={step} totalSteps={TOTAL_STEPS} />

            {/* Scrollable Form Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar relative" ref={scrollRef}>
              <div className="p-6 md:p-10 pb-20">
                {renderStep()}
              </div>
            </div>

            {/* Footer Actions (Fixed in Flex) */}
            <div className="flex-shrink-0 p-6 bg-stone-50 border-t border-stone-100 z-20">
              <div className="flex justify-between gap-4">
                <button
                  onClick={handlePrev}
                  disabled={step === 0}
                  className={`
                    flex-1 py-4 rounded-xl font-bold flex items-center justify-center transition-all text-sm backdrop-blur-xl border
                    ${step === 0 
                      ? 'bg-stone-100 text-stone-300 border-transparent cursor-not-allowed' 
                      : 'bg-white text-stone-600 border-stone-200 hover:bg-white hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 shadow-sm'}
                  `}
                >
                  <ArrowLeft size={16} className="mr-2" />
                  上一步
                </button>
                
                {step === TOTAL_STEPS - 1 ? (
                  <button
                    onClick={handleSubmit}
                    className="flex-[2] bg-stone-700 text-white py-4 rounded-xl font-bold shadow-xl shadow-stone-300 flex items-center justify-center hover:-translate-y-0.5 active:translate-y-0 transition-all text-sm border border-stone-700 hover:bg-stone-800"
                  >
                    生成方案
                    <Sparkles size={16} className="ml-2 text-yellow-100" />
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="flex-[2] bg-stone-800 text-white py-4 rounded-xl font-bold shadow-xl shadow-stone-300 flex items-center justify-center hover:-translate-y-0.5 active:translate-y-0 transition-all text-sm border border-stone-800 hover:bg-stone-900"
                  >
                    下一步
                    <ArrowRight size={16} className="ml-2" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;