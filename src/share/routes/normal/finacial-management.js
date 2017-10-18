import ConfirmManagement from 'containers/financial-management/confirm-payment'

//确认付款
const confirmPayment = {
  key:'confirm-payment',
  url:'/main/financial-management/confirm-payment',
  components: ConfirmManagement,
  parent: 'financial-management'
};

//财务管理
const financialManagement = {
  key:'financial-management',
  subMenu: [confirmPayment],
  icon: 'pay-circle-o'
};

export default financialManagement;
