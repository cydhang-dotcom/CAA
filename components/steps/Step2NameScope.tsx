import React from 'react';
import { RadioGroup, TextArea } from '../FormInputs';
import { FormData } from '../../types';

interface Props {
  data: FormData;
  updateData: (key: keyof FormData, value: any) => void;
}

const Step2NameScope: React.FC<Props> = ({ data, updateData }) => {
  return (
    <>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">企业名称</h2>
      <p className="text-gray-500 mb-6">拟定备选字号，提高核名通过率</p>

      <label className="block text-sm font-bold text-gray-800 mb-3">拟用字号 (建议 3-5 个)</label>
      {data.proposedNames.map((name, idx) => (
        <div key={idx} className="mb-3 flex items-center">
          <span className="text-gray-400 font-medium w-6">{idx + 1}.</span>
          <input
            className="flex-1 p-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 outline-none"
            placeholder={`备选名称 ${idx + 1}`}
            value={name}
            onChange={(e) => {
              const newNames = [...data.proposedNames];
              newNames[idx] = e.target.value;
              updateData('proposedNames', newNames);
            }}
          />
        </div>
      ))}

      <div className="mt-6">
        <RadioGroup
          label="经营范围是否接受标准模板"
          subLabel="使用工商局标准表述更容易通过"
          options={[
            { label: '接受标准模板', value: 'yes' },
            { label: '需指定特殊范围', value: 'no' },
          ]}
          value={data.acceptScopeTemplate}
          onChange={(val) => updateData('acceptScopeTemplate', val)}
        />
        {data.acceptScopeTemplate === 'no' && (
          <TextArea
            placeholder="请输入您需要指定的特殊经营范围..."
            value={data.scopeDetail}
            onChange={(val) => updateData('scopeDetail', val)}
          />
        )}
      </div>
    </>
  );
};

export default Step2NameScope;