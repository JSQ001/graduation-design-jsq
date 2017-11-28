import PayWorkbench from 'containers/pay/pay-workbench/pay-workbench'
import PaymentDetail from 'containers/pay/pay-workbench/payment-detail'

import BankDefinition from 'containers/pay/bank-definition/bank-definition'
import BranchBankInformation from 'containers/pay/bank-definition/branch-bank-information'

import PaymentMethod from 'containers/pay/payment-method/payment-method'

import PaymentCompanySetting from 'containers/pay/payment-company-setting/payment-company-setting'

//支付流水详情
const paymentDetail = {
  key:'payment-detail',
  url:'/main/pay/pay-workbench/payment-detail/:id',
  components: PaymentDetail,
  parent: 'pay-workbench'
};

//付款工作台
const payWorkbench = {
  key: 'pay-workbench',
  url:'/main/pay/pay-workbench',
  components: PayWorkbench,
  parent: 'pay',
  children: {
    paymentDetail
  }
};

//分行信息
const branchBankInformation = {
  key:'branch-bank-information',
  url:'/main/budget/bank-definition/branch-bank-information/:id',
  components: BranchBankInformation,
  parent: 'bank-definition',
};

//银行定义
const bankDefinition = {
  key:'bank-definition',
  url:'/main/budget/bank-definition',
  components: BankDefinition ,
  parent: 'budget',
  children: {
    branchBankInformation
  }
};

//付款方式定义
const paymentMethod = {
  key:'payment-method',
  url:'/main/pay/payment-method',
  components: PaymentMethod ,
  parent: 'pay',
  children: {}
};

//付款公司配置
const paymentCompanySetting = {
  key:'payment-company-setting',
  url:'/main/pay/payment-company-setting',
  components: PaymentCompanySetting ,
  parent: 'pay',
  children: {}
};


//支付
const pay = {
  key:'pay',
  subMenu: [payWorkbench, bankDefinition,paymentMethod,paymentCompanySetting],
  icon: 'pay-circle'
};

export default pay
