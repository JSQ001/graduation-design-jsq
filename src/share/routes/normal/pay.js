import PayWorkbench from 'containers/pay/pay-workbench/pay-workbench'
import PaymentDetail from 'containers/pay/pay-workbench/payment-detail'

import BankDefinition from 'containers/pay/bank-definition/bank-definition'
import BranchBankInformation from 'containers/pay/bank-definition/branch-bank-information'

import PaymentMethod from 'containers/pay/payment-method/payment-method'

import PaymentCompanySetting from 'containers/pay/payment-company-setting/payment-company-setting'
import CashFlowItem from 'containers/pay/cash-flow-item/cash-flow-item'
import CreateOrUpdateCashFlowItem from 'containers/pay/cash-flow-item/createOrUpdate-item'
import CashTransactionClass from 'containers/pay/cash-transaction-class/cash-transaction-class'
import NewCashTransactionClass from 'containers/pay/cash-transaction-class/new-cash-transaction-class'
import CashTransactionClassDetail from 'containers/pay/cash-transaction-class/cash-transaction-class-detail'

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

//写入现金流量项
const createOrUpdateCashFlowItem = {
  key:'create-cash-flow-item',
  url:'/main/pay/cash-flow-item/create-cash-flow-item',
  components: CreateOrUpdateCashFlowItem ,
  parent: 'cash-flow-item',
};

//现金流量项
const cashFlowItem = {
  key:'cash-flow-item',
  url:'/main/pay/cash-flow-item',
  components: CashFlowItem ,
  parent: 'pay',
  children: {
    createOrUpdateCashFlowItem
  }
};


//现金事务分类详情
const cashTransactionClassDetail = {
  key:'cash-transaction-class-detail',
  url:'/main/pay/cash-transaction-class/:classId/cash-transaction-class-detail',
  components: CashTransactionClassDetail ,
  parent: 'cash-transaction-class',
};

//新建现金事务
const newCashTransactionClass = {
  key:'new-cash-transaction-class',
  url:'/main/pay/cash-transaction-class/new-cash-transaction-class',
  components: NewCashTransactionClass ,
  parent: 'cash-transaction-class',
};

//现金事务定义
const cashTransactionClass = {
  key:'cash-transaction-class',
  url:'/main/pay/cash-transaction-class',
  components: CashTransactionClass ,
  parent: 'pay',
  children: {
    newCashTransactionClass,
    cashTransactionClassDetail
  }
};

//支付
const pay = {
  key:'pay',
  subMenu: [payWorkbench, bankDefinition,paymentMethod,paymentCompanySetting,cashFlowItem,cashTransactionClass],
  icon: 'pay-circle'
};

export default pay
