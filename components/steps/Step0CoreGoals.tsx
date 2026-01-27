import React from 'react';
import { CheckboxGroup, TextInput } from '../FormInputs';
import { FormData } from '../../types';

interface Props {
  data: FormData;
  updateData: (key: keyof FormData, value: any) => void;
}

const Step0CoreGoals: React.FC<Props> = ({ data, updateData }) => {
  return (
    <>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">核心目标与节点</h2>
      <p className="text-gray-500 mb-6">确认公司注册的主要用途及预期时间!</p>
      
      <CheckboxGroup
        label="近期核心需求 (多选)"
        options={[
          { label: '公司主体 (营业执照/公章)', value: 'license' },
          { label: '近期需要对公收款', value: 'payment' },
          { label: '近期需要开票 (普票/专票)', value: 'invoice' },
          { label: '近期需要用工并缴社保', value: 'hr' },
        ]}
        value={data.coreNeeds}
        onChange={(val) => updateData('coreNeeds', val)}
      />
      
      <TextInput
        label="交付时间"
        type="date"
        value={data.expectedDate}
        onChange={(val) => updateData('expectedDate', val)}
      />
    </>
  );
};

export default Step0CoreGoals;