import React from 'react';
import { CheckboxGroup, RadioGroup, TextInput } from '../FormInputs';
import { FormData } from '../../types';

interface Props {
  data: FormData;
  updateData: (key: keyof FormData, value: any) => void;
}

const Step6Personnel: React.FC<Props> = ({ data, updateData }) => {
  return (
    <>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">关键人员</h2>
      <p className="text-gray-500 mb-6">法人/监事/股东是否能配合线上操作</p>

      <div className="grid grid-cols-2 gap-4">
        <RadioGroup
          label="实名认证"
          options={[{ label: '可', value: 'yes' }, { label: '不可', value: 'no' }]}
          layout="row"
          value={data.realNameAuth}
          onChange={(val) => updateData('realNameAuth', val)}
        />
         <RadioGroup
          label="人脸识别"
          options={[{ label: '可', value: 'yes' }, { label: '不可', value: 'no' }]}
          layout="row"
          value={data.faceAuth}
          onChange={(val) => updateData('faceAuth', val)}
        />
      </div>

      <CheckboxGroup
        label="是否存在限制情形"
        options={[
          { label: '无', value: 'none' },
          { label: '被执行/失信/限高', value: 'blacklist' },
          { label: '税务非正常/黑名单', value: 'tax_issue' },
          { label: '名下企业异常', value: 'company_issue' },
        ]}
        value={data.restrictions}
        onChange={(val) => {
           if(val.includes('none') && val.length > 1) {
              const newVal = val.filter(v => v !== 'none');
              updateData('restrictions', newVal);
           } else if (val.length === 0) {
               updateData('restrictions', ['none']);
           } else {
               if (val[val.length - 1] === 'none') {
                  updateData('restrictions', ['none']);
               } else {
                  updateData('restrictions', val);
               }
           }
        }}
      />
      {data.restrictions.some(r => r !== 'none') && (
         <TextInput
           placeholder="请说明具体限制情况..."
           value={data.restrictionDetail}
           onChange={(val) => updateData('restrictionDetail', val)}
         />
      )}
    </>
  );
};

export default Step6Personnel;