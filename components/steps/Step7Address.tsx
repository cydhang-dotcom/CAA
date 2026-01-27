import React from 'react';
import { CheckboxGroup, RadioGroup } from '../FormInputs';
import { FormData } from '../../types';

interface Props {
  data: FormData;
  updateData: (key: keyof FormData, value: any) => void;
}

const Step7Address: React.FC<Props> = ({ data, updateData }) => {
  return (
    <>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">注册地址</h2>
      <p className="text-gray-500 mb-6">合规的地址是银行开户的前提</p>

      <RadioGroup
        label="是否需要推荐注册地址"
        options={[
          { label: '否 (自有地址)', value: 'no' },
          { label: '是 (需挂靠/租赁)', value: 'yes' },
        ]}
        value={data.needAddressRecommend}
        onChange={(val) => updateData('needAddressRecommend', val)}
        layout="row"
      />

      {data.needAddressRecommend === 'no' && (
        <RadioGroup
          label="自有地址类型"
          options={[
             { label: '产权房', value: 'owned' },
             { label: '标准租赁', value: 'leased' },
             { label: '住宅/商住', value: 'residential' },
          ]}
          value={data.addressType}
          onChange={(val) => updateData('addressType', val)}
        />
      )}

      <CheckboxGroup
        label="地址配合度"
        options={[
          { label: '园区集群挂靠', value: 'cluster' },
          { label: '配合工商税务抽查', value: 'inspection' },
          { label: '接收政府信函', value: 'mail' },
        ]}
        value={data.addressAcceptance}
        onChange={(val) => updateData('addressAcceptance', val)}
      />
       <RadioGroup
          label="是否需要实际办公场地"
          options={[{ label: '否', value: 'no' }, { label: '是', value: 'yes' }]}
          layout="row"
          value={data.needPhysicalOffice}
          onChange={(val) => updateData('needPhysicalOffice', val)}
        />
    </>
  );
};

export default Step7Address;