import ConfirmManagement from 'containers/financial-management/confirm-payment'
import PaymentBatch from 'containers/financial-management/payment-batch'

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

//财务管理
const financialManagement = {
  key:'financial-management',
  subMenu: [confirmPayment, paymentBatch],
  icon: 'pay-circle-o'
};

export default financialManagement;
