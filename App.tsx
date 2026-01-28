import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Sparkles, RefreshCw, CheckCircle2, Download, Loader2 } from 'lucide-react';
import StepIndicator from './components/StepIndicator';
import { FormData, INITIAL_DATA } from './types';
import { generatePlan } from './services/gemini';
import PhoneVerificationModal from './components/PhoneVerificationModal';

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
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Loading animation state
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  const TOTAL_STEPS = 10;
  
  const LOADING_TEXTS = [
    "AI 正在深度分析您的业务模式...",
    "正在匹配最适合的税务优惠政策...",
    "正在规划股权架构与风险隔离...",
    "正在生成公司注册执行清单...",
    "正在最终优化排版与格式..."
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, 0);
    }
  }, [step]);

  // Cycle loading texts
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating) {
      setLoadingTextIndex(0);
      interval = setInterval(() => {
        setLoadingTextIndex(prev => (prev + 1) % LOADING_TEXTS.length);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  const updateData = (key: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS - 1) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleStartGeneration = () => {
    setIsVerifyModalOpen(true);
  };

  const handleVerifySuccess = async (phone: string) => {
    setIsVerifyModalOpen(false);
    setIsGenerating(true);
    // You could save the phone number to formData if needed here
    const plan = await generatePlan(formData);
    setResult(plan);
    setIsGenerating(false);
  };

  const handleDownload = () => {
    if (!result || isDownloading) return;
    
    setIsDownloading(true);
    
    const element = document.getElementById('plan-content');
    if (!element) {
      setIsDownloading(false);
      return;
    }

    const opt = {
      margin:       [15, 15, 15, 15],
      filename:     `公司注册执行方案_${new Date().toISOString().split('T')[0]}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, logging: false },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // Use html2pdf from window object
    const html2pdf = (window as any).html2pdf;
    if (html2pdf) {
      html2pdf().set(opt).from(element).save().then(() => {
        setIsDownloading(false);
      }).catch(() => {
        setIsDownloading(false);
        alert('PDF生成失败，请重试');
      });
    } else {
      setIsDownloading(false);
      alert('PDF组件未加载，请刷新页面');
    }
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
      
      // Hide code block delimiters
      if (trimmed.startsWith('```')) {
        return null;
      }

      if (trimmed.length === 0) return <div key={i} className="h-4"></div>;

      // H1
      if (line.startsWith('# ')) {
        return <h1 key={i} className="text-2xl md:text-3xl font-medium text-stone-800 mt-4 mb-6 pb-4 border-b border-stone-100 tracking-tight">{line.replace('# ', '')}</h1>;
      }
      
      // H2
      if (line.startsWith('## ')) {
        return (
          <h2 key={i} className="text-lg md:text-xl font-bold text-stone-700 mt-8 mb-4 flex items-center tracking-tight">
            <div className="w-1.5 h-6 bg-stone-500 mr-3 rounded-full"></div>
            {line.replace('## ', '')}
          </h2>
        );
      }
      
      // H3
      if (line.startsWith('### ')) {
        return <h3 key={i} className="text-base font-bold text-stone-600 mt-6 mb-2">{formatInline(line.replace('### ', ''))}</h3>;
      }

      // Horizontal Rule (---)
      if (trimmed === '---' || trimmed === '***') {
        return <hr key={i} className="my-8 border-stone-200 border-t-2" />;
      }
      
      // Checkbox (- [ ])
      if (line.startsWith('- [ ]')) {
        return (
          <div key={i} className="flex items-start my-3 p-3 bg-stone-50 rounded-xl border border-stone-100 hover:border-stone-300 transition-colors">
            <div className="w-5 h-5 rounded-md border-2 border-stone-300 mr-3 mt-0.5 flex-shrink-0 bg-white"></div>
            <span className="text-stone-700 font-medium">{formatInline(line.replace('- [ ]', ''))}</span>
          </div>
        );
      }
      
      // Indented Unordered List (   - item)
      // Matches 2 or more spaces followed by dash and space
      if (line.match(/^\s{2,}-\s/)) {
        return (
          <div key={i} className="flex items-start my-1.5 ml-8">
             <div className="w-1.5 h-1.5 rounded-full border border-stone-400 mt-2 mr-3 flex-shrink-0 bg-transparent scale-75"></div>
             <p className="text-stone-500 leading-relaxed flex-1 text-sm">{formatInline(trimmed.replace(/^-\s/, ''))}</p>
          </div>
        );
      }

      // Unordered List (- item)
      if (line.startsWith('- ')) {
        return (
          <div key={i} className="flex items-start my-2 ml-1">
             <div className="w-1.5 h-1.5 rounded-full bg-stone-400 mt-2 mr-3 flex-shrink-0"></div>
             <p className="text-stone-600 leading-relaxed flex-1">{formatInline(line.replace('- ', ''))}</p>
          </div>
        );
      }

      // Ordered List (1. item)
      // Regex matches "1. ", "2. ", "10. " etc.
      const orderedListMatch = line.match(/^(\d+)\.\s+(.*)/);
      if (orderedListMatch) {
        const number = orderedListMatch[1];
        const content = orderedListMatch[2];
        return (
          <div key={i} className="flex items-start my-3 ml-1">
            <span className="font-bold text-stone-800 mr-3 flex-shrink-0 select-none bg-stone-200 w-6 h-6 rounded-full flex items-center justify-center text-xs">{number}</span>
            <p className="text-stone-600 leading-relaxed flex-1">{formatInline(content)}</p>
          </div>
        );
      }

      // Blockquote (> text)
      if (line.startsWith('> ')) {
        return (
          <div key={i} className="my-6 p-5 bg-stone-50 border-l-4 border-stone-400 rounded-r-xl text-stone-600 italic leading-relaxed shadow-sm">
             {formatInline(line.replace('> ', ''))}
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
  return (
    <div className="min-h-screen w-full md:flex md:items-center md:justify-center md:py-10 transition-colors duration-500">
      
      {/* Phone Verification Modal */}
      <PhoneVerificationModal 
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
        onVerify={handleVerifySuccess}
      />

      {/* Main Card Container */}
      <div className="w-full h-[100vh] md:h-[85vh] md:max-w-2xl bg-stone-50 md:rounded-3xl md:shadow-2xl md:shadow-stone-900/10 md:border md:border-white/50 flex flex-col relative overflow-hidden">
        
        {/* --- Loading View (Updated with Minimalist Motion) --- */}
        {isGenerating && (
          <div className="absolute inset-0 z-50 bg-stone-50 flex flex-col items-center justify-center p-6 fade-in">
            {/* Spinning Rings Animation */}
            <div className="relative flex items-center justify-center mb-10">
               {/* Outer slow ring */}
               <div className="absolute w-32 h-32 rounded-full border border-stone-200 animate-[spin_8s_linear_infinite]"></div>
               {/* Middle medium ring */}
               <div className="absolute w-24 h-24 rounded-full border-2 border-stone-200 border-t-stone-800 animate-[spin_3s_linear_infinite]"></div>
               {/* Inner decorative ring */}
               <div className="absolute w-16 h-16 rounded-full border border-stone-100 bg-white shadow-lg flex items-center justify-center z-10">
                  <Sparkles className="w-6 h-6 text-stone-700 animate-pulse" />
               </div>
            </div>

            <h2 className="text-2xl font-bold text-stone-800 mb-4 tracking-tight">正在生成方案</h2>
            
            {/* Dynamic Loading Text */}
            <div className="h-8 flex items-center justify-center mb-2">
              <p 
                key={loadingTextIndex} 
                className="text-stone-500 text-center text-sm font-medium animate-[fadeIn_0.5s_ease-out]"
              >
                {LOADING_TEXTS[loadingTextIndex]}
              </p>
            </div>

            {/* Simple Progress Indicator */}
            <div className="w-16 flex justify-center gap-1.5 mt-4">
              <div className="w-1.5 h-1.5 bg-stone-800 rounded-full animate-[bounce_1s_infinite_0ms]"></div>
              <div className="w-1.5 h-1.5 bg-stone-600 rounded-full animate-[bounce_1s_infinite_200ms]"></div>
              <div className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-[bounce_1s_infinite_400ms]"></div>
            </div>
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
              <div className="flex items-center gap-2">
                 <button 
                  onClick={() => { setResult(''); setStep(0); }}
                  className="text-sm font-semibold text-stone-500 hover:text-stone-700 flex items-center px-3 py-2 rounded-lg hover:bg-stone-100 transition-colors"
                >
                  <RefreshCw size={14} className="mr-1.5" /> 重置
                </button>
              </div>
            </div>
            
            {/* Result Content (Scrollable) */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-6 pb-24">
              <div id="plan-content" className="prose prose-stone prose-sm max-w-none bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-stone-100 pdf-content">
                {renderMarkdown(result)}
              </div>
              <div className="mt-8 text-center px-6">
                <p className="text-xs text-stone-400 font-medium tracking-wide uppercase">AI Generate Content • For Reference Only</p>
              </div>
            </div>

            {/* Result Footer Action (Sticky) */}
             <div className="flex-shrink-0 p-6 bg-stone-50 border-t border-stone-100 z-20 absolute bottom-0 w-full backdrop-blur-sm bg-stone-50/90">
                <button 
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="w-full bg-stone-800 text-white py-4 rounded-xl font-bold shadow-xl shadow-stone-300 flex items-center justify-center hover:-translate-y-0.5 active:translate-y-0 transition-all text-sm border border-stone-800 hover:bg-stone-900 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isDownloading ? (
                    <>
                       <Loader2 size={16} className="mr-2 animate-spin" /> 生成 PDF 中...
                    </>
                  ) : (
                    <>
                      <Download size={16} className="mr-2" /> 下载完整方案
                    </>
                  )}
                </button>
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
                    onClick={handleStartGeneration}
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