import React from 'react';
import { CheckboxGroup, RadioGroup, TextInput, TextArea } from '../FormInputs';
import { FormData } from '../../types';

interface Props {
  data: FormData;
  updateData: (key: keyof FormData, value: any) => void;
}

const Step1Business: React.FC<Props> = ({ data, updateData }) => {
  return (
    <>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">业务与许可</h2>
      <p className="text-gray-500 mb-6">描述业务类型，确认是否涉及特殊资质</p>

      <TextArea
        label="业务描述"
        placeholder="例如：开发一款AI聊天软件，向个人用户收取订阅费..."
        value={data.businessDescription}
        onChange={(val) => updateData('businessDescription', val)}
      />

      <RadioGroup
        label="是否涉及许可/备案/资质"
        options={[
          { label: '否', value: 'no' },
          { label: '是', value: 'yes' },
        ]}
        value={data.hasLicense}
        onChange={(val) => updateData('hasLicense', val)}
        layout="row"
      />
      
      {data.hasLicense === 'yes' && (
        <TextInput
          placeholder="请简述所需资质 (如: ICP, 食品经营许可证)"
          value={data.licenseDetail}
          onChange={(val) => updateData('licenseDetail', val)}
        />
      )}

      <CheckboxGroup
        label="是否涉及敏感要素"
        subLabel="可能影响名称审核、地址或税务"
        options={[
          { label: '教培', value: 'education' },
          { label: '医疗/器械', value: 'medical' },
          { label: '食品/餐饮', value: 'food' },
          { label: '进出口', value: 'import_export' },
          { label: '直播/MCN', value: 'media' },
          { label: '金融/理财', value: 'finance' },
          { label: '人力/劳务', value: 'hr_service' },
          { label: '建筑/施工', value: 'construction' },
          { label: '危化/环保', value: 'chemical' },
          { label: '网络文化/ICP', value: 'icp' },
          { label: '其他', value: 'other' },
        ]}
        layout="grid"
        value={data.sensitiveTypes}
        onChange={(val) => updateData('sensitiveTypes', val)}
      />
      {data.sensitiveTypes.includes('other') && (
         <TextInput
           placeholder="其他敏感要素说明"
           value={data.otherSensitiveType}
           onChange={(val) => updateData('otherSensitiveType', val)}
         />
      )}

      <div className="mt-8 border-t border-gray-100 pt-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">经营范围</h3>
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

export default Step1Business;