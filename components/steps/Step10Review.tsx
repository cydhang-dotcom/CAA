import React from 'react';
import { FileText } from 'lucide-react';
import { Option } from '../FormInputs';
import { FormData } from '../../types';

interface Props {
  data: FormData;
}

const ReviewRow = ({ label, value }: { label: string, value: string | React.ReactNode }) => (
  <div className="flex justify-between items-start py-4 group">
    <span className="text-stone-500 text-sm font-medium w-1/3 flex-shrink-0 group-hover:text-stone-700 transition-colors">{label}</span>
    <span className="text-stone-800 text-sm font-medium text-right flex-1 break-words">{value || '-'}</span>
  </div>
);

const SectionHeader = ({ title }: { title: string }) => (
  <div className="bg-stone-50 px-6 py-3 border-b border-stone-100 flex items-center">
    <div className="w-1.5 h-1.5 rounded-full bg-stone-500 mr-2"></div>
    <span className="font-bold text-xs text-stone-500 uppercase tracking-wider">{title}</span>
  </div>
);

const Step10Review: React.FC<Props> = ({ data }) => {
  // --- Mappings for Review Display ---
  const mapLabels = (values: string[], options: Option[]) => {
    if (!values || values.length === 0) return '无';
    return values.map(v => options.find(o => o.value === v)?.label || v).join(', ');
  };
  
  const mapLabel = (value: string, options: Option[]) => {
    return options.find(o => o.value === value)?.label || value || '-';
  };

  return (
    <div className="fade-in">
      <h2 className="text-3xl font-medium text-stone-800 mb-3 tracking-tight">信息确认</h2>
      <p className="text-stone-500 mb-8 leading-relaxed">请核对以下关键信息，确认无误后生成方案。</p>
      
      <div className="bg-white rounded-2xl border border-stone-200 divide-y divide-stone-50 shadow-xl shadow-stone-200/40 overflow-hidden mb-8">
        <SectionHeader title="基础信息" />
        <div className="px-6">
           <ReviewRow label="核心需求" value={mapLabels(data.coreNeeds, [
             { label: '主体', value: 'license' }, { label: '收款', value: 'payment' },
             { label: '开票', value: 'invoice' }, { label: '用工', value: 'hr' }
           ])} />
           <ReviewRow label="交付时间" value={data.expectedDate} />
           <ReviewRow label="注册资本" value={
             data.registeredCapitalMode === 'recommend' 
               ? <span className="text-stone-500 italic">待专家推荐</span>
               : `${data.registeredCapital || '0'} 万 ${data.subscriptionType === 'all_subscribed' ? '(认缴)' : '(实缴)'}`
           } />
        </div>

        <SectionHeader title="业务与治理" />
        <div className="px-6">
           <ReviewRow label="业务描述" value={data.businessDescription} />
           <ReviewRow label="经营范围" value={data.acceptScopeTemplate === 'yes' ? '接受标准模板' : '需指定特殊范围'} />
           <ReviewRow label="敏感要素" value={mapLabels(data.sensitiveTypes, [
              { label: '教培', value: 'education' }, { label: '医疗', value: 'medical' }, { label: '食品', value: 'food' },
              { label: '进出口', value: 'import_export' }, { label: '直播/MCN', value: 'media' }, { label: '金融', value: 'finance' },
              { label: '其他', value: 'other' }
           ])} />
           <ReviewRow label="治理模板" value={data.acceptGovernanceTemplate === 'yes' ? '接受标准包' : `定制: ${mapLabels(data.customGovernanceDocs, [
             { label: '公司章程', value: 'articles' }, { label: '股东协议', value: 'shareholder_agreement' },
             { label: '授权与用印', value: 'auth_seal' }, { label: '任职与决议', value: 'appointment' },
             { label: '期权协议', value: 'option_agreement' }
           ])}`} />
        </div>

        <SectionHeader title="场地与银行" />
        <div className="px-6">
           <ReviewRow label="地址需求" value={data.needAddressRecommend === 'yes' ? '需推荐' : '自有地址'} />
           <ReviewRow label="银行开户" value={data.needBankAssist === 'yes' ? '需协助' : '自行办理'} />
           <ReviewRow label="人员限制" value={mapLabels(data.restrictions, [
             { label: '无', value: 'none' }, { label: '黑名单/失信', value: 'blacklist' },
             { label: '税务异常', value: 'tax_issue' }, { label: '企业异常', value: 'company_issue' }
           ])} />
        </div>
      </div>
      
      <div className="bg-stone-700 text-stone-50 p-5 rounded-xl text-sm mb-6 flex items-start shadow-lg shadow-stone-300/50">
         <FileText size={18} className="mt-0.5 mr-3 flex-shrink-0 text-stone-400" />
         <p className="font-medium tracking-wide">点击“生成方案”后，AI 将根据上述信息为您规划注册路径、规避风险并生成待办清单。</p>
      </div>
    </div>
  );
};

export default Step10Review;