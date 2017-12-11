import PayWorkbench from 'containers/pay/pay-workbench/pay-workbench'
import PaymentDetail from 'containers/pay/pay-workbench/payment-detail'


//支付流水详情
const paymentDetail = {
  key:'payment-detail',
  url:'/main/pay/pay-workbench/payment-detail/:tab/:id',
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


//支付
const pay = {
  key:'pay',
  subMenu: [payWorkbench],
  icon: 'pay-circle'
};

export default pay
