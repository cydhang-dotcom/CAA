import React, { useState, useEffect } from 'react';
import { X, Smartphone, ShieldCheck, Loader2, ArrowRight } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (phone: string) => void;
}

const PhoneVerificationModal: React.FC<Props> = ({ isOpen, onClose, onVerify }) => {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  if (!isOpen) return null;

  const handleSendCode = () => {
    if (!phone || phone.length < 11) return;
    setCountdown(60);
    // Fake logic for sending code
  };

  const handleSubmit = () => {
    if (!phone || !code) return;
    setIsSubmitting(true);
    // Simulate API verification delay
    setTimeout(() => {
      setIsSubmitting(false);
      onVerify(phone);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />
      
      {/* Modal Card */}
      <div className="relative bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl scale-100 transition-all animate-[fadeIn_0.2s_ease-out]">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 transition-colors p-1"
        >
          <X size={20} />
        </button>
        
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mb-3 border border-stone-200">
            <ShieldCheck className="w-6 h-6 text-stone-600" />
          </div>
          <h3 className="text-xl font-bold text-stone-800 tracking-tight">安全验证</h3>
          <p className="text-sm text-stone-500 text-center mt-1 leading-relaxed">
            为了保护您的企业数据安全<br/>请验证手机号后生成方案
          </p>
        </div>

        <div className="space-y-5">
          {/* Phone Input */}
          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1.5 ml-1">手机号码</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none">
                <Smartphone size={18} />
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="请输入 11 位手机号"
                className="w-full h-12 pl-10 pr-4 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-stone-500 focus:border-stone-500 outline-none text-stone-800 font-medium placeholder-stone-400 transition-all text-base"
                maxLength={11}
              />
            </div>
          </div>

          {/* Code Input */}
          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1.5 ml-1">验证码</label>
            <div className="flex gap-3 items-center">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="4 位验证码"
                className="flex-1 h-12 px-4 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-stone-500 focus:border-stone-500 outline-none text-stone-800 font-medium placeholder-stone-400 transition-all text-base"
                maxLength={6}
              />
              <button
                onClick={handleSendCode}
                disabled={countdown > 0 || phone.length < 11}
                className={`h-12 px-4 rounded-xl text-sm font-semibold transition-all w-28 flex-shrink-0 flex items-center justify-center border
                  ${countdown > 0 || phone.length < 11
                    ? 'bg-stone-100 text-stone-400 border-stone-100 cursor-not-allowed'
                    : 'bg-stone-800 text-white border-stone-800 hover:bg-stone-700 shadow-sm'
                  }`}
              >
                {countdown > 0 ? `${countdown}s` : '获取验证码'}
              </button>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleSubmit}
            disabled={!phone || !code || isSubmitting}
            className={`w-full h-12 rounded-xl font-bold text-sm mt-4 flex items-center justify-center transition-all shadow-lg
              ${!phone || !code || isSubmitting
                ? 'bg-stone-200 text-stone-400 cursor-not-allowed shadow-none'
                : 'bg-stone-800 text-white hover:bg-stone-900 shadow-stone-300'
              }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin mr-2" size={18} />
                验证中...
              </>
            ) : (
              <>
                验证并生成
                <ArrowRight className="ml-2" size={18} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhoneVerificationModal;