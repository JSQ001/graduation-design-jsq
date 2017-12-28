import PayWorkbench from 'containers/pay/pay-workbench/pay-workbench'
import PaymentDetail from 'containers/pay/pay-workbench/payment-detail'

//支付
const pay = {
  key:'pay',
  icon: 'pay-circle',
  subMenu: [
    //付款工作台
    {
      key: 'pay-workbench',
      url:'/main/pay/pay-workbench',
      components: PayWorkbench,
      parent: 'pay',
      children: {
        //支付流水详情
        paymentDetail: {
          key:'payment-detail',
          url:'/main/pay/pay-workbench/payment-detail/:tab/:subTab/:id',
          components: PaymentDetail,
          parent: 'pay-workbench'
        }
      }
    }
  ]
};

export default pay
