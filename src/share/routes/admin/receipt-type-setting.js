import PrePaymentType from 'containers/receipt-type-setting/pre-payment-type/pre-payment-type'
import ContractTypeDefine from 'containers/receipt-type-setting/contract-type-define/contract-type-define'
import CompanyDistribution from 'containers/receipt-type-setting/contract-type-define/company-distribution'
import NewContractType from 'containers/receipt-type-setting/contract-type-define/new-contract-type'

//单据类型设置
const receiptTypeSetting = {
  key:'receipt-type-setting',
  subMenu: [
    //预付款类型定义
    {
      key:'pre-payment-type',
      url:'/main/receipt-type-setting/pre-payment-type',
      components: PrePaymentType,
      parent: 'receipt-type-setting'
    },
    //合同类型定义
    {
      key:'contract-type-define',
      url:'/main/receipt-type-setting/contract-type-define',
      components: ContractTypeDefine,
      parent: 'receipt-type-setting',
      children:{
        //公司分配
        companyDistribution: {
          key:'company-distribution',
          url:'/main/receipt-type-setting/contract-type-define/company-distribution/:setOfBooksId/:id',
          components: CompanyDistribution,
          parent: 'contract-type-define'
        },
        //新建合同类型
        newContractType: {
          key:'new-contract-type',
          url:'/main/receipt-type-setting/contract-type-define/new-contract-type',
          components: NewContractType,
          parent:'contract-type-define'
        },
        //编辑合同类型
        editContractType: {
          key:'edit-contract-type',
          url:'/main/receipt-type-setting/contract-type-define/edit-contract-type/:setOfBooksId/:id',
          components: NewContractType,
          parent:'contract-type-define'
        }}
    }],
  icon: 'pay-circle',
  admin: true
};

export default receiptTypeSetting
