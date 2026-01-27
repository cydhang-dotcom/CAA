import React from 'react';
import { Check } from 'lucide-react';

// --- Types ---
export interface Option {
  label: string;
  value: string;
}

interface BaseProps {
  label?: string;
  subLabel?: string;
  error?: string;
  required?: boolean;
}

// --- Shared Styles ---
const LABEL_STYLE = "block text-sm font-semibold text-zinc-800 mb-1.5";
const SUB_LABEL_STYLE = "text-xs text-zinc-500 mb-4 leading-relaxed";
const INPUT_BASE_STYLE = "w-full p-4 rounded-2xl bg-white border border-zinc-200 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-none transition-all text-zinc-900 placeholder-zinc-400 shadow-sm";

// --- Checkbox Group ---
interface CheckboxGroupProps extends BaseProps {
  options: Option[];
  value: string[];
  onChange: (val: string[]) => void;
  layout?: 'grid' | 'col' | 'row';
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ label, subLabel, options, value, onChange, layout = 'col' }) => {
  const toggleValue = (val: string) => {
    if (value.includes(val)) {
      onChange(value.filter(v => v !== val));
    } else {
      onChange([...value, val]);
    }
  };

  let layoutClass = 'flex flex-col gap-3';
  if (layout === 'grid') layoutClass = 'grid grid-cols-2 gap-3';
  if (layout === 'row') layoutClass = 'flex flex-row gap-3 overflow-x-auto pb-2 no-scrollbar';

  return (
    <div className="mb-8 fade-in">
      {label && <label className={LABEL_STYLE}>{label}</label>}
      {subLabel && <p className={SUB_LABEL_STYLE}>{subLabel}</p>}
      <div className={layoutClass}>
        {options.map((opt) => {
          const isSelected = value.includes(opt.value);
          return (
            <div
              key={opt.value}
              onClick={() => toggleValue(opt.value)}
              className={`
                relative flex items-center p-4 rounded-2xl border cursor-pointer transition-all duration-300 flex-shrink-0
                ${isSelected 
                  ? 'bg-zinc-900 border-zinc-900 text-white shadow-lg shadow-zinc-200 transform scale-[1.01]' 
                  : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50'}
              `}
            >
              <div className={`
                w-5 h-5 rounded-md border flex items-center justify-center mr-3 transition-colors flex-shrink-0
                ${isSelected ? 'bg-white border-white' : 'bg-transparent border-zinc-300'}
              `}>
                {isSelected && <Check size={12} className="text-zinc-900 stroke-[3]" />}
              </div>
              <span className="text-sm font-medium">
                {opt.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- Radio Group ---
interface RadioGroupProps extends BaseProps {
  options: Option[];
  value: string;
  onChange: (val: string) => void;
  layout?: 'grid' | 'col' | 'row';
}

export const RadioGroup: React.FC<RadioGroupProps> = ({ label, subLabel, options, value, onChange, layout = 'col' }) => {
  let gridClass = 'flex flex-col space-y-3';
  if (layout === 'grid') gridClass = 'grid grid-cols-2 gap-3';
  if (layout === 'row') gridClass = 'flex flex-row space-x-3 overflow-x-auto pb-2 no-scrollbar';

  return (
    <div className="mb-8 fade-in">
      {label && <label className={LABEL_STYLE}>{label}</label>}
      {subLabel && <p className={SUB_LABEL_STYLE}>{subLabel}</p>}
      <div className={gridClass}>
        {options.map((opt) => {
          const isSelected = value === opt.value;
          return (
            <div
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className={`
                relative flex items-center p-4 rounded-2xl border cursor-pointer transition-all duration-300 flex-shrink-0
                ${isSelected 
                  ? 'bg-zinc-900 border-zinc-900 text-white shadow-lg shadow-zinc-200 transform scale-[1.01]' 
                  : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50'}
              `}
            >
              <div className={`
                w-5 h-5 rounded-full border flex items-center justify-center mr-3 transition-colors flex-shrink-0
                ${isSelected ? 'border-white' : 'border-zinc-300'}
              `}>
                {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
              </div>
              <span className="text-sm font-medium">
                {opt.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- Text Input ---
interface TextInputProps extends BaseProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  type?: 'text' | 'number' | 'date';
}

export const TextInput: React.FC<TextInputProps> = ({ label, subLabel, value, onChange, placeholder, type = 'text' }) => {
  return (
    <div className="mb-8 fade-in">
      {label && <label className={LABEL_STYLE}>{label}</label>}
      {subLabel && <p className={SUB_LABEL_STYLE}>{subLabel}</p>}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={INPUT_BASE_STYLE}
      />
    </div>
  );
};

// --- Text Area ---
interface TextAreaProps extends BaseProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  rows?: number;
}

export const TextArea: React.FC<TextAreaProps> = ({ label, subLabel, value, onChange, placeholder, rows = 3 }) => {
  return (
    <div className="mb-8 fade-in">
      {label && <label className={LABEL_STYLE}>{label}</label>}
      {subLabel && <p className={SUB_LABEL_STYLE}>{subLabel}</p>}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={`${INPUT_BASE_STYLE} resize-none`}
      />
    </div>
  );
};