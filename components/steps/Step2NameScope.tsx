import React from 'react';
import { FormData } from '../../types';

interface Props {
  data: FormData;
  updateData: (key: keyof FormData, value: any) => void;
}

const Step2NameScope: React.FC<Props> = ({ data, updateData }) => {
  const handleNameChange = (index: number, value: string) => {
    const newNames = [...data.proposedNames];
    newNames[index] = value;
    updateData('proposedNames', newNames);
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">企业名称</h2>
      <p className="text-gray-500 mb-6">拟定备选字号，提高核名通过率</p>

      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
        <label className="block text-sm font-bold text-gray-800 mb-4">拟用字号 (建议准备 3-5 个)</label>
        <div className="space-y-4">
          {data.proposedNames.map((name, idx) => (
            <div key={idx} className="flex items-center">
              <span className="text-stone-400 font-medium w-8 text-sm">0{idx + 1}</span>
              <input
                className="flex-1 p-3.5 rounded-xl bg-stone-50 border border-stone-200 focus:border-stone-500 focus:ring-1 focus:ring-stone-500 outline-none transition-all placeholder-stone-400 text-stone-800"
                placeholder={`备选名称 ${idx + 1}`}
                value={name}
                onChange={(e) => handleNameChange(idx, e.target.value)}
              />
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-stone-400 leading-relaxed">
          * 提示：字号建议使用 3-4 个汉字，避免使用常见词汇、地名或行业通用词，以提高工商核名通过率。
        </p>
      </div>
    </>
  );
};

export default Step2NameScope;