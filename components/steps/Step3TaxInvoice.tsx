import React from 'react';
import { CheckboxGroup, RadioGroup, TextInput } from '../FormInputs';
import { FormData } from '../../types';

interface Props {
  data: FormData;
  updateData: (key: keyof FormData, value: any) => void;
}

const Step3TaxInvoice: React.FC<Props> = ({ data, updateData }) => {
  return (
    <>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">开票与税务</h2>
      <p className="text-gray-500 mb-6">规划未来的税务成本与开票能力</p>

      <RadioGroup
        label="近期客户开票要求"
        options={[
          { label: '不确定', value: 'uncertain' },
          { label: '增值税专用发票', value: 'special' },
          { label: '增值税普通发票', value: 'normal' },
        ]}
        value={data.invoiceType}
        onChange={(val) => updateData('invoiceType', val)}
      />

      <RadioGroup
        label="预计月开票额"
        options={[
          { label: '< 10 万', value: 'under_10w' },
          { label: '10 - 50 万', value: '10_50w' },
          { label: '50 - 200 万', value: '50_200w' },
          { label: '> 200 万', value: 'above_200w' },
        ]}
        layout="grid"
        value={data.monthlyInvoiceAmount}
        onChange={(val) => updateData('monthlyInvoiceAmount', val)}
      />

      <RadioGroup
        label="纳税人类型倾向"
        options={[
          { label: '不确定', value: 'uncertain' },
          { label: '小规模纳税人', value: 'small' },
          { label: '一般纳税人', value: 'general' },
        ]}
        value={data.taxpayerType}
        onChange={(val) => updateData('taxpayerType', val)}
        layout="row"
      />

      <TextInput
        label="开票核心类目"
        placeholder="如：技术服务费、咨询费、餐饮服务..."
        value={data.invoiceContent}
        onChange={(val) => updateData('invoiceContent', val)}
      />
      
      <CheckboxGroup
         label="收入模式 (多选)"
         options={[
           { label: '服务费', value: 'service' },
           { label: '货物销售', value: 'goods' },
           { label: '平台抽佣', value: 'commission' },
           { label: '项目/阶段款', value: 'project' },
           { label: '混合模式', value: 'mixed' },
         ]}
         layout="grid"
         value={data.revenueModel}
         onChange={(val) => updateData('revenueModel', val)}
      />
    </>
  );
};

export default Step3TaxInvoice;