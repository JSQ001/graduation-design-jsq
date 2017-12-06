import ConfirmManagement from 'containers/financial-management/confirm-payment'
import PaymentBatch from 'containers/financial-management/payment-batch'
import FinanceReview from 'containers/financial-management/finance-review'
import FinanceView from 'containers/financial-management/finance-view'
import ExpenseReportDetail from 'containers/expense-report/expense-report-detail'
import LoanRequestDetail from 'containers/request/loan-request-detail'
import CheckCenter from 'containers/financial-management/check-center'

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

//对账中心
const checkCenter = {
  key: 'check-center',
  url: '/main/financial-management/check-center',
  components: CheckCenter,
  parent: 'financial-management'
};

//财务管理
const financialManagement = {
  key:'financial-management',
  subMenu: [financeReview, confirmPayment, paymentBatch, financeView, checkCenter],
  icon: 'pay-circle-o'
};

export default financialManagement;
