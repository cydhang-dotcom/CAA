import React from 'react';
import { CheckboxGroup, RadioGroup } from '../FormInputs';
import { FormData } from '../../types';

interface Props {
  data: FormData;
  updateData: (key: keyof FormData, value: any) => void;
}

const Step9HR: React.FC<Props> = ({ data, updateData }) => {
  return (
    <>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">用工与人事</h2>
      <p className="text-gray-500 mb-6">提前规划社保公积金账户</p>

      <RadioGroup
         label="近期(1-2个月)是否用工并缴社保"
         options={[{ label: '否', value: 'no' }, { label: '是', value: 'yes' }]}
         layout="row"
         value={data.nearTermHiring}
         onChange={(val) => updateData('nearTermHiring', val)}
      />

       <RadioGroup
         label="首批用工人数预估"
         options={[
           { label: '1-3 人', value: '1-3' },
           { label: '4-10 人', value: '4-10' },
           { label: '10人以上', value: '10+' },
         ]}
         layout="row"
         value={data.headcount}
         onChange={(val) => updateData('headcount', val)}
      />

      <CheckboxGroup
        label="用工形态"
        options={[
          { label: '全职劳动合同', value: 'fulltime' },
          { label: '劳务/外包', value: 'contractor' },
          { label: '兼职', value: 'parttime' },
        ]}
        value={data.employmentType}
        onChange={(val) => updateData('employmentType', val)}
      />
    </>
  );
};

export default Step9HR;