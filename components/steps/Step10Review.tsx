import React from 'react';
import { FileText, Sparkles } from 'lucide-react';
import { Option } from '../FormInputs';
import { FormData } from '../../types';

interface Props {
  data: FormData;
}

const ReviewRow = ({ label, value, highlight = false }: { label: string, value: string | React.ReactNode, highlight?: boolean }) => (
  <div className="flex justify-between items-start py-3.5 group">
    <span className="text-stone-500 text-sm font-medium w-1/3 flex-shrink-0 group-hover:text-stone-700 transition-colors">{label}</span>
    <span className={`text-sm font-medium text-right flex-1 break-words ${highlight ? 'text-stone-900 font-bold' : 'text-stone-800'}`}>{value || '-'}</span>
  </div>
);

const SectionHeader = ({ title }: { title: string }) => (
  <div className="bg-stone-50 px-6 py-3 border-b border-stone-100 flex items-center mt-0">
    <div className="w-1.5 h-1.5 rounded-full bg-stone-500 mr-2"></div>
    <span className="font-bold text-xs text-stone-500 uppercase tracking-wider">{title}</span>
  </div>
);

const Step10Review: React.FC<Props> = ({ data }) => {
  // --- Helpers ---
  const mapLabels = (values: string[], options: Option[]) => {
    if (!values || values.length === 0) return '无';
    return values.map(v => options.find(o => o.value === v)?.label || v).join(', ');
  };
  
  const mapLabel = (value: string, options: Option[]) => {
    return options.find(o => o.value === value)?.label || value || '-';
  };

  const getYesNo = (val: string) => val === 'yes' ? '是' : (val === 'no' ? '否' : '-');

  return (
    <div className="fade-in pb-10">
      <h2 className="text-3xl font-medium text-stone-800 mb-3 tracking-tight">信息确认</h2>
      <p className="text-stone-500 mb-8 leading-relaxed">请核对以下关键信息，确认无误后 AI 将为您生成执行方案。</p>
      
      <div className="bg-white rounded-2xl border border-stone-200 divide-y divide-stone-50 shadow-xl shadow-stone-200/40 overflow-hidden mb-8">
        
        {/* 1. 基础信息 */}
        <SectionHeader title="基础信息" />
        <div className="px-6 py-2">
           {/* '拟定字号' removed as per request to remove Name Step */}
           <ReviewRow label="核心需求" value={mapLabels(data.coreNeeds, [
             { label: '主体', value: 'license' }, { label: '收款', value: 'payment' },
             { label: '开票', value: 'invoice' }, { label: '用工', value: 'hr' }
           ])} />
           <ReviewRow label="交付日期" value={data.expectedDate} />
        </div>

        {/* 2. 业务与税务 */}
        <SectionHeader title="业务与税务" />
        <div className="px-6 py-2">
           <ReviewRow label="业务描述" value={data.businessDescription} />
           <ReviewRow label="敏感要素" value={mapLabels(data.sensitiveTypes, [
              { label: '教培', value: 'education' }, { label: '医疗', value: 'medical' }, { label: '食品', value: 'food' },
              { label: '进出口', value: 'import_export' }, { label: '直播/MCN', value: 'media' }, { label: '金融', value: 'finance' },
              { label: '其他', value: 'other' }
           ])} />
           <ReviewRow label="纳税人类型" value={mapLabel(data.taxpayerType, [
             { label: '不确定', value: 'uncertain' }, { label: '小规模纳税人', value: 'small' }, { label: '一般纳税人', value: 'general' }
           ])} />
           <ReviewRow label="开票需求" value={mapLabel(data.invoiceType, [
             { label: '不确定', value: 'uncertain' }, { label: '增值税专票', value: 'special' }, { label: '增值税普票', value: 'normal' }
           ])} />
           <ReviewRow label="收入模式" value={mapLabels(data.revenueModel, [
             { label: '服务费', value: 'service' }, { label: '货物销售', value: 'goods' }, 
             { label: '平台抽佣', value: 'commission' }, { label: '项目款', value: 'project' }
           ])} />
        </div>

        {/* 3. 结构与人员 */}
        <SectionHeader title="结构与人员" />
        <div className="px-6 py-2">
           <ReviewRow label="注册资本" value={
             data.registeredCapitalMode === 'recommend' 
               ? '待专家推荐'
               : `${data.registeredCapital || '0'} 万 ${data.subscriptionType === 'all_subscribed' ? '(认缴)' : '(实缴)'}`
           } />
           <ReviewRow label="股东结构" value={`${mapLabel(data.shareholderType[0], [{label:'自然人',value:'person'},{label:'公司',value:'company'}])}等 ${data.shareholderCount} 人`} />
           <ReviewRow label="治理模版" value={data.acceptGovernanceTemplate === 'yes' ? '标准包' : '定制'} />
           <ReviewRow label="配合度" value={`实名: ${data.realNameAuth === 'yes' ? '可' : '否'} / 人脸: ${data.faceAuth === 'yes' ? '可' : '否'}`} />
           <ReviewRow label="任职限制" value={mapLabels(data.restrictions, [
             { label: '无', value: 'none' }, { label: '被执行/失信', value: 'blacklist' }, { label: '税务异常', value: 'tax_issue' }
           ])} />
        </div>

        {/* 4. 配套资源 */}
        <SectionHeader title="配套资源" />
        <div className="px-6 py-2">
           <ReviewRow label="注册地址" value={
             data.needAddressRecommend === 'yes' ? '需推荐' : `自有 (${mapLabel(data.addressType, [
                { label: '商业产权', value: 'commercial' }, { label: '商住', value: 'commercial_residential' }, { label: '住宅', value: 'residential' }
             ])})`
           } />
           <ReviewRow label="实体办公" value={data.needPhysicalOffice === 'yes' ? '需推荐' : '暂无'} />
           <ReviewRow label="银行开户" value={data.needBankAssist === 'yes' ? '需协助' : '自行办理'} />
           {data.needBankAssist === 'yes' && (
             <ReviewRow label="开户偏好" value={mapLabel(data.bankPreference, [
               { label: '时效优先', value: 'fast' }, { label: '指定银行', value: 'designated' }, 
               { label: '优先线上', value: 'online' }, { label: '上门服务', value: 'visit' }
             ])} />
           )}
           <ReviewRow label="用工计划" value={data.nearTermHiring === 'yes' ? `近期招聘 ${data.headcount} 人` : '暂无'} />
        </div>
      </div>
      
      <div className="bg-stone-800 text-stone-100 p-5 rounded-xl text-sm mb-6 flex items-start shadow-xl shadow-stone-300/50 border border-stone-700">
         <Sparkles size={18} className="mt-0.5 mr-3 flex-shrink-0 text-yellow-400" />
         <p className="font-medium tracking-wide leading-relaxed">AI 将根据上述信息，为您生成包含<span className="text-white font-bold mx-1">时间轴</span>与<span className="text-white font-bold mx-1">待办清单</span>的定制化注册方案。</p>
      </div>
    </div>
  );
};

export default Step10Review;