/**
 * Created by 13576 on 2017/12/4.
 */
import MyPrePayment from 'containers/pre-payment/my-pre-payment/me-pre-payment'
import NewPrePayment from 'containers/pre-payment/my-pre-payment/new-pre-payment'
import PrePaymentDetail from 'containers/pre-payment/my-pre-payment/pre-payment-detail'


//预付款单详情
const prePaymentDetail = {
  key:'pre-payment-detail',
  url:'/main/pre-payment/me-pre-payment/pre-payment-detail/:id',
  components: PrePaymentDetail ,
  parent: 'me-pre-payment',
};

//新建预付款单
const newPrePayment = {
  key:'new-pre-payment',
  url:'/main/pre-payment/me-pre-payment/new-pre-payment/:id/:prePaymentTypeId',
  components: NewPrePayment ,
  parent: 'me-pre-payment',
};

//我的预付款
const myPrePayment = {
  key:'me-pre-payment',
  url:'/main/pre-payment/me-pre-payment',
  components: MyPrePayment ,
  parent: 'pre-payment',
  children: {
    prePaymentDetail,
    newPrePayment
  }
};

//预付款
const prePayment = {
  key:'pre-payment',
  subMenu: [myPrePayment],
  icon: 'book'
};

export default prePayment
