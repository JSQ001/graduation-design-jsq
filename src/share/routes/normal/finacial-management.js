import ConfirmManagement from 'containers/financial-management/confirm-payment'
import PaymentBatch from 'containers/financial-management/payment-batch'
import FinanceReview from 'containers/financial-management/finance-review'
import FinanceView from 'containers/financial-management/finance-view'
import ExpenseReportDetail from 'containers/expense-report/expense-report-detail'
import LoanRequestDetail from 'containers/request/loan-request-detail'
import CheckCenter from 'containers/financial-management/check-center/check-center'
import CheckCenterTicket from  'containers/financial-management/check-center/check-center-ticket'
import CheckCenterHotel from  'containers/financial-management/check-center/check-center-hotel'
import CheckCenterTrain from  'containers/financial-management/check-center/check-center-train'
import SupplierManagement from  'containers/financial-management/supplier-management/supplier-management'
import SupplierBankAccount from  'containers/financial-management/supplier-management/supplier-bank-account'
import SupplierCompanyDelivery from  'containers/financial-management/supplier-management/supplier-company-delivery'


//报销单详情
const expenseReportDetailReview = {
  key:'expense-report-detail-review',
  url:'/main/financial-management/finance-review/expense-report-detail-review/:id',
  components: ExpenseReportDetail,
  parent: 'finance-review'
};

const loanRequestDetailReview = {
  key:'loan-request-detail-review',
  url:'/main/financial-management/finance-review/loan-request-detail-review/:id',
  components: LoanRequestDetail,
  parent: 'finance-review'
};

//单据审核
const financeReview = {
  key:'finance-review',
  url:'/main/financial-management/finance-review',
  components: FinanceReview,
  parent: 'financial-management',
  children: {
    expenseReportDetailReview,
    loanRequestDetailReview
  }
};

//确认付款
const confirmPayment = {
  key:'confirm-payment',
  url:'/main/financial-management/confirm-payment',
  components: ConfirmManagement,
  parent: 'financial-management'
};

//付款批次
const paymentBatch = {
  key:'payment-batch',
  url:'/main/financial-management/payment-batch',
  components: PaymentBatch,
  parent: 'financial-management'
};

//单据查看
const financeView = {
  key:'finance-view',
  url:'/main/financial-management/finance-view',
  components: FinanceView,
  parent: 'financial-management'
};

//机票账单
const checkCenterTicket = {
  key: 'check-center-ticket',
  url: '/main/financial-management/check-center/check-center-ticket',
  components: CheckCenterTicket,
  parent: 'financial-management'
};

//酒店账单
const checkCenterHotel = {
  key: 'check-center-hotel',
  url: '/main/financial-management/check-center/check-center-hotel',
  components: CheckCenterHotel,
  parent: 'financial-management'
};

//火车账单
const checkCenterTrain = {
  key: 'check-center-train',
  url: '/main/financial-management/check-center/check-center-train',
  components: CheckCenterTrain,
  parent: 'financial-management'
};


//对账中心
const checkCenter = {
  key: 'check-center',
  url: '/main/financial-management/check-center',
  components: CheckCenter,
  children:{
    checkCenterTicket,
    checkCenterHotel,
    checkCenterTrain
  },
  parent: 'financial-management'
};

//供应商管理-银行定义
const supplierBankAccount = {
  key: 'supplier-bank-account',
  url: '/main/financial-management/supplier-management/:id/supplier-bank-account',
  components: SupplierBankAccount,
  parent: 'supplier-management'
};

//供应商管理-公司分配
const supplierCompanyDelivery = {
  key: 'supplier-company-delivery',
  url: '/main/financial/management/supplier-management/:id/supplier-company-delivery',
  components: SupplierCompanyDelivery,
  parent: 'supplier-management'
};

//供应商管理
const supplierManagement = {
  key: 'supplier-management',
  url: '/main/financial-management/supplier-management',
  components: SupplierManagement,
  children:{
    supplierBankAccount,
    supplierCompanyDelivery
  },
  parent: 'financial-management'
};

//财务管理
const financialManagement = {
  key:'financial-management',
  subMenu: [financeReview, confirmPayment, paymentBatch, financeView, checkCenter, supplierManagement],
  icon: 'pay-circle-o'
};

export default financialManagement;
