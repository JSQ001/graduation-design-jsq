import PrePaymentType from 'containers/receipt-type-setting/pre-payment-type'
import ContractTypeDefine from 'containers/receipt-type-setting/contract-type-define/contract-type-define'
import CompanyDistribution from 'containers/receipt-type-setting/contract-type-define/company-distribution'

//预付款类型定义
const prePaymentType = {
  key:'pre-payment-type',
  url:'/main/receipt-type-setting/pre-payment-type',
  components: PrePaymentType,
  parent: 'receipt-type-setting'
};

//公司分配
const companyDistribution = {
  key:'company-distribution',
  url:'/main/receipt-type-setting/contract-type-define/company-distribution/:setOfBooksId/:id',
  components: CompanyDistribution,
  parent: 'contract-type-define'
};

//合同类型定义
const contractTypeDefine = {
  key:'contract-type-define',
  url:'/main/receipt-type-setting/contract-type-define',
  components: ContractTypeDefine,
  parent: 'receipt-type-setting',
  children:{companyDistribution}
};

//单据类型设置
const receiptTypeSetting = {
  key:'receipt-type-setting',
  subMenu: [prePaymentType, contractTypeDefine],
  icon: 'pay-circle',
  admin: true
};

export default receiptTypeSetting
