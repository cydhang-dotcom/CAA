import React from 'react';
import { RadioGroup, TextInput } from '../FormInputs';
import { FormData } from '../../types';

interface Props {
  data: FormData;
  updateData: (key: keyof FormData, value: any) => void;
}

const Step5Capital: React.FC<Props> = ({ data, updateData }) => {
  return (
    <>
      <h2 className="text-2xl font-bold text-stone-800 mb-2">注册资本</h2>
      <p className="text-stone-500 mb-6">认缴制下，注册资本并非越高越好</p>

      <RadioGroup
        label="注册资本数额"
        options={[
          { label: '自行决定', value: 'custom' },
          { label: '由注册专家/AI 推荐', value: 'recommend' },
        ]}
        value={data.registeredCapitalMode || 'custom'}
        onChange={(val) => {
            updateData('registeredCapitalMode', val);
            if(val === 'recommend') {
              updateData('registeredCapital', '');
            }
        }}
        layout="row"
      />

      {data.registeredCapitalMode === 'recommend' ? (
         <div className="bg-stone-100 p-4 rounded-xl border border-stone-200 mb-8 text-sm text-stone-600 leading-relaxed fade-in">
             <span className="font-semibold text-stone-700 block mb-1">💡 专家提示</span>
             我们将综合您的业务规模、行业标准及未来融资需求，为您推荐最合适的注册资本方案，既能彰显企业实力，又能有效控制股东责任风险。
         </div>
      ) : (
        <TextInput
          label="输入金额 (万元)"
          type="number"
          placeholder="如: 100"
          value={data.registeredCapital}
          onChange={(val) => updateData('registeredCapital', val)}
        />
      )}

      <RadioGroup
        label="出资方式"
        options={[
          { label: '全认缴 (注册时无需出资)', value: 'all_subscribed' },
          { label: '有实缴计划', value: 'has_paid' },
        ]}
        value={data.subscriptionType}
        onChange={(val) => updateData('subscriptionType', val)}
      />
      {data.subscriptionType === 'has_paid' && (
         <TextInput
           placeholder="简述实缴计划 (金额/时间)"
           value={data.paidPlan}
           onChange={(val) => updateData('paidPlan', val)}
         />
      )}

      <RadioGroup
        label="资金来源是否可解释"
        subLabel="银行开户时可能会被询问"
        options={[
          { label: '可说明', value: 'yes' },
          { label: '不可/困难', value: 'no' },
        ]}
        layout="row"
        value={data.sourceExplainable}
        onChange={(val) => updateData('sourceExplainable', val)}
      />
    </>
  );
};

export default Step5Capital;