import React from 'react';
import { CheckboxGroup, RadioGroup, TextInput } from '../FormInputs';
import { FormData } from '../../types';

interface Props {
  data: FormData;
  updateData: (key: keyof FormData, value: any) => void;
}

const Step4Structure: React.FC<Props> = ({ data, updateData }) => {
  return (
    <>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">股东与控制权</h2>
      <p className="text-gray-500 mb-6">确认股权结构，避免未来纠纷</p>

      <CheckboxGroup
        label="股东类型"
        options={[
          { label: '自然人', value: 'person' },
          { label: '公司股东', value: 'company' },
          { label: '境外主体', value: 'foreign' },
        ]}
        layout="row"
        value={data.shareholderType}
        onChange={(val) => updateData('shareholderType', val)}
      />

      <RadioGroup
        label="股东人数"
        options={[
          { label: '1 人', value: '1' },
          { label: '2 人', value: '2' },
          { label: '3 人及以上', value: '3+' },
        ]}
        layout="row"
        value={data.shareholderCount}
        onChange={(val) => updateData('shareholderCount', val)}
      />

      <RadioGroup
        label="是否需要期权池/激励份额"
        options={[
          { label: '否', value: 'no' },
          { label: '是', value: 'yes' },
        ]}
        layout="row"
        value={data.optionPool}
        onChange={(val) => updateData('optionPool', val)}
      />
      {data.optionPool === 'yes' && (
        <TextInput
          placeholder="预留比例 (如: 10-15%)"
          value={data.optionPoolPercent}
          onChange={(val) => updateData('optionPoolPercent', val)}
        />
      )}

      <RadioGroup
        label="是否存在代持/隐名/借名"
        options={[
          { label: '否', value: 'no' },
          { label: '是', value: 'yes' },
        ]}
        layout="row"
        value={data.hasNominee}
        onChange={(val) => updateData('hasNominee', val)}
      />

       <CheckboxGroup
        label="需要设置的角色 (多选)"
        options={[
          { label: '执行董事', value: 'director' },
          { label: '董事会', value: 'board' },
          { label: '经理', value: 'manager' },
          { label: '法人非大股东', value: 'legal_rep_not_major' },
        ]}
        layout="grid"
        value={data.roles}
        onChange={(val) => updateData('roles', val)}
      />

      <div className="mt-8 border-t border-gray-100 pt-6">
        <RadioGroup
          label="是否接受我司公司治理模板包"
          options={[
            { label: '是 (推荐)', value: 'yes' },
            { label: '否 (需定制)', value: 'no' },
          ]}
          layout="row"
          value={data.acceptGovernanceTemplate}
          onChange={(val) => updateData('acceptGovernanceTemplate', val)}
        />
        
        {data.acceptGovernanceTemplate === 'no' && (
          <CheckboxGroup
            label="请选择需定制的模板"
            options={[
              { label: '公司章程', value: 'articles' },
              { label: '股东协议', value: 'shareholder_agreement' },
              { label: '授权与用印制度', value: 'auth_seal' },
              { label: '任职与决议', value: 'appointment' },
              { label: '期权协议', value: 'option_agreement' },
            ]}
            layout="grid"
            value={data.customGovernanceDocs}
            onChange={(val) => updateData('customGovernanceDocs', val)}
          />
        )}
      </div>
    </>
  );
};

export default Step4Structure;