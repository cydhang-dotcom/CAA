
export interface FormData {
  // 1. Core Goals
  coreNeeds: string[];
  expectedDate: string;

  // 2. Business & License
  businessDescription: string;
  hasLicense: string; // 'no' | 'yes'
  licenseDetail: string;
  sensitiveTypes: string[];
  otherSensitiveType: string;
  // Moved from former Step 2
  acceptScopeTemplate: string; // 'yes' | 'no'
  scopeDetail: string;

  // 3. Tax & Invoice
  invoiceType: string; // 'special' | 'normal' | 'uncertain'
  monthlyInvoiceAmount: string;
  taxpayerType: string;
  invoiceContent: string;
  revenueModel: string[];
  taxTools: string[];

  // 4. Structure
  shareholderType: string[];
  shareholderCount: string;
  equityRatioStatus: string;
  optionPool: string; // 'no' | 'yes'
  optionPoolPercent: string;
  hasNominee: string;
  hasAgreements: string;
  roles: string[];
  // New Governance fields
  acceptGovernanceTemplate: string; // 'yes' | 'no'
  customGovernanceDocs: string[];

  // 5. Capital
  registeredCapital: string;
  subscriptionType: string; // 'all_subscribed' | 'has_paid'
  paidPlan: string;
  sourceExplainable: string;
  needCapitalVerify: string;

  // 6. Personnel
  realNameAuth: string;
  faceAuth: string;
  offlineSign: string;
  videoAuth: string;
  restrictions: string[];
  restrictionDetail: string;

  // 7. Address
  needAddressRecommend: string;
  addressType: string;
  addressMaterialTime: string;
  addressAcceptance: string[];
  needPhysicalOffice: string;

  // 8. Bank
  needBankAssist: string;
  bankPreference: string;
  designatedBank: string;
  accountUsage: string[];
  otherAccountUsage: string;

  // 9. HR
  nearTermHiring: string;
  acceptHrTemplate: string;
  headcount: string;
  employmentType: string[];
}

const getDefaultExpectedDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 45); // +1.5 months (approx 45 days)
  return date.toISOString().split('T')[0];
};

export const INITIAL_DATA: FormData = {
  coreNeeds: [],
  expectedDate: getDefaultExpectedDate(),
  businessDescription: '',
  hasLicense: 'no',
  licenseDetail: '',
  sensitiveTypes: [],
  otherSensitiveType: '',
  acceptScopeTemplate: 'yes',
  scopeDetail: '',
  invoiceType: 'uncertain',
  monthlyInvoiceAmount: '',
  taxpayerType: 'uncertain',
  invoiceContent: '',
  revenueModel: [],
  taxTools: [],
  shareholderType: [],
  shareholderCount: '1',
  equityRatioStatus: 'uncertain',
  optionPool: 'no',
  optionPoolPercent: '',
  hasNominee: 'no',
  hasAgreements: 'no',
  roles: [],
  acceptGovernanceTemplate: 'yes',
  customGovernanceDocs: [],
  registeredCapital: '',
  subscriptionType: 'all_subscribed',
  paidPlan: '',
  sourceExplainable: 'yes',
  needCapitalVerify: 'no',
  realNameAuth: 'yes',
  faceAuth: 'yes',
  offlineSign: 'yes',
  videoAuth: 'yes',
  restrictions: ['none'],
  restrictionDetail: '',
  needAddressRecommend: 'no',
  addressType: '',
  addressMaterialTime: 'yes',
  addressAcceptance: [],
  needPhysicalOffice: 'no',
  needBankAssist: 'no',
  bankPreference: '',
  designatedBank: '',
  accountUsage: [],
  otherAccountUsage: '',
  nearTermHiring: 'no',
  acceptHrTemplate: 'yes',
  headcount: '',
  employmentType: [],
};
