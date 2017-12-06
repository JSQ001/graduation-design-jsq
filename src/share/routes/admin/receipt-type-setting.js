import PrePaymentType from 'containers/receipt-type-setting/pre-payment-type'

//预付款类型定义
const prePaymentType = {
  key:'pre-payment-type',
  url:'/main/receipt-type-setting/pre-payment-type',
  components: PrePaymentType,
  parent: 'receipt-type-setting'
};

//单据类型设置
const receiptTypeSetting = {
  key:'receipt-type-setting',
  subMenu: [prePaymentType],
  icon: 'pay-circle',
  admin: true
};

export default receiptTypeSetting
