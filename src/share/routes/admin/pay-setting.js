/**
 * Created by 13576 on 2017/12/6.
 */
import PaymentMethod from 'containers/pay-setting/payment-method/payment-method'
import PaymentCompanySetting from 'containers/pay-setting/payment-company-setting/payment-company-setting'
import CashFlowItem from 'containers/pay-setting/cash-flow-item/cash-flow-item'
import CreateOrUpdateCashFlowItem from 'containers/pay-setting/cash-flow-item/createOrUpdate-item'
import CashTransactionClass from 'containers/pay-setting/cash-transaction-class/cash-transaction-class'
import NewCashTransactionClass from 'containers/pay-setting/cash-transaction-class/new-cash-transaction-class'
import CashTransactionClassDetail from 'containers/pay-setting/cash-transaction-class/cash-transaction-class-detail'

//支付
const paySetting = {
  key:'pay-setting',
  icon: 'pay-circle',
  admin: true,
  subMenu: [
    //付款方式定义
    {
      key:'payment-method',
      url:'/main/pay-setting/payment-method',
      components: PaymentMethod ,
      parent: 'pay-setting',
      children: {}
    },
    //付款公司配置
    {
      key:'payment-company-setting',
      url:'/main/pay-setting/payment-company-setting',
      components: PaymentCompanySetting ,
      parent: 'pay-setting',
      children: {}
    },
    //现金流量项
    {
      key:'cash-flow-item',
      url:'/main/pay-setting/cash-flow-item',
      components: CashFlowItem ,
      parent: 'pay-setting',
      children: {
        //写入现金流量项
        createOrUpdateCashFlowItem: {
          key:'create-cash-flow-item',
          url:'/main/pay-setting/cash-flow-item/create-cash-flow-item',
          components: CreateOrUpdateCashFlowItem ,
          parent: 'cash-flow-item',
        }
      }
    },
    //现金事务定义
    {
      key:'cash-transaction-class',
      url:'/main/pay-setting/cash-transaction-class',
      components: CashTransactionClass ,
      parent: 'pay-setting',
      children: {
        //新建现金事务
        newCashTransactionClass: {
          key:'new-cash-transaction-class',
          url:'/main/pay-setting/cash-transaction-class/new-cash-transaction-class',
          components: NewCashTransactionClass ,
          parent: 'cash-transaction-class',
        },
        //现金事务分类详情
        cashTransactionClassDetail: {
          key:'cash-transaction-class-detail',
          url:'/main/pay/cash-transaction-class/:classId/cash-transaction-class-detail',
          components: CashTransactionClassDetail ,
          parent: 'cash-transaction-class',
        }
      }
    }
  ]
};

export default paySetting
