import React from 'react';
import { CheckboxGroup, RadioGroup, TextInput } from '../FormInputs';
import { FormData } from '../../types';

interface Props {
  data: FormData;
  updateData: (key: keyof FormData, value: any) => void;
}

const Step8Bank: React.FC<Props> = ({ data, updateData }) => {
  return (
    <>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">银行开户</h2>
      <p className="text-gray-500 mb-6">对公账户是企业资金流转的中枢</p>

      <RadioGroup
        label="是否需要协助开户"
        options={[
          { label: '否 (自行解决)', value: 'no' },
          { label: '是 (需协助)', value: 'yes' },
        ]}
        layout="row"
        value={data.needBankAssist}
        onChange={(val) => updateData('needBankAssist', val)}
      />

      <RadioGroup
        label="开户偏好"
        options={[
          { label: '尽快办理', value: 'fast' },
          { label: '指定银行', value: 'designated' },
          { label: '优先线上', value: 'online' },
          { label: '优先上门', value: 'visit' },
          { label: '必须线下面签', value: 'offline' },
        ]}
        layout="grid"
        value={data.bankPreference}
        onChange={(val) => updateData('bankPreference', val)}
      />
      {data.bankPreference === 'designated' && (
         <TextInput
           placeholder="请输入指定银行名称"
           value={data.designatedBank}
           onChange={(val) => updateData('designatedBank', val)}
         />
      )}

      <CheckboxGroup
        label="账户主要用途"
        options={[
          { label: '日常收款', value: 'receive' },
          { label: '发薪', value: 'payroll' },
          { label: '缴税', value: 'tax' },
          { label: '社保公积金', value: 'social_security' },
          { label: '其他', value: 'other' },
        ]}
        layout="grid"
        value={data.accountUsage}
        onChange={(val) => updateData('accountUsage', val)}
      />
    </>
  );
};

export default Step8Bank;