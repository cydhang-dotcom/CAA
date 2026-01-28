import React from 'react';
import { RadioGroup, TextArea } from '../FormInputs';
import { FormData } from '../../types';

interface Props {
  data: FormData;
  updateData: (key: keyof FormData, value: any) => void;
}

const Step7Address: React.FC<Props> = ({ data, updateData }) => {
  return (
    <>
      <h2 className="text-2xl font-bold text-stone-800 mb-2">注册地址与办公</h2>
      <p className="text-stone-500 mb-6">合规的地址是银行开户与税务核查的前提</p>

      {/* 1. Registered Address Recommendation */}
      <RadioGroup
        label="是否需要推荐注册地址"
        subLabel="如无自有商用地址，可选择园区挂靠"
        options={[
          { label: '是 (需推荐)', value: 'yes' },
          { label: '否 (自有地址)', value: 'no' },
        ]}
        value={data.needAddressRecommend}
        onChange={(val) => {
            updateData('needAddressRecommend', val);
            if (val === 'yes') {
                updateData('addressType', '');
            }
        }}
        layout="row"
      />

      {/* 2. Own Address Type (If No Recommendation) */}
      {data.needAddressRecommend === 'no' && (
        <RadioGroup
          label="自有地址类型"
          options={[
             { label: '商业产权 (写字楼/商铺)', value: 'commercial' },
             { label: '商住两用 (公寓)', value: 'commercial_residential' },
             { label: '住宅', value: 'residential' },
             { label: '其他', value: 'other' },
          ]}
          layout="grid"
          value={data.addressType}
          onChange={(val) => updateData('addressType', val)}
        />
      )}

      {/* 3. Physical Office Recommendation */}
      <RadioGroup
          label="是否需要推荐实体办公场地"
          subLabel="联合办公空间 / 写字楼租赁"
          options={[
            { label: '是 (需推荐)', value: 'yes' },
            { label: '否', value: 'no' }, 
          ]}
          layout="row"
          value={data.needPhysicalOffice}
          onChange={(val) => updateData('needPhysicalOffice', val)}
      />

      {/* 4. Remarks */}
      <TextArea
        label="具体需求备注"
        placeholder="请补充对地址的具体要求（如：特定行政区、预算范围、是否需要配合看点、特殊税收政策需求等）..."
        value={data.addressRequirements}
        onChange={(val) => updateData('addressRequirements', val)}
      />
    </>
  );
};

export default Step7Address;