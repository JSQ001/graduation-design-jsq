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

//财务管理
const financialManagement = {
  key:'financial-management',
  icon: 'pay-circle-o',
  subMenu: [
    //单据审核
    {
      key:'finance-review',
      url:'/main/financial-management/finance-review',
      components: FinanceReview,
      parent: 'financial-management',
      children: {
        //报销单详情
        expenseReportDetailReview: {
          key:'expense-report-detail-review',
          url:'/main/financial-management/finance-review/expense-report-detail-review/:id',
          components: ExpenseReportDetail,
          parent: 'finance-review'
        },
        //借款单详情
        loanRequestDetailReview: {
          key:'loan-request-detail-review',
          url:'/main/financial-management/finance-review/loan-request-detail-review/:id',
          components: LoanRequestDetail,
          parent: 'finance-review'
        }
      }
    },
    //确认付款
    {
      key:'confirm-payment',
      url:'/main/financial-management/confirm-payment',
      components: ConfirmManagement,
      parent: 'financial-management'
    },
    //付款批次
    {
      key:'payment-batch',
      url:'/main/financial-management/payment-batch',
      components: PaymentBatch,
      parent: 'financial-management'
    },
    //单据查看
    {
      key:'finance-view',
      url:'/main/financial-management/finance-view',
      components: FinanceView,
      parent: 'financial-management'
    },
    //对账中心
    {
      key: 'check-center',
      url: '/main/financial-management/check-center',
      components: CheckCenter,
      children:{
        //机票账单
        checkCenterTicket: {
          key: 'check-center-ticket',
          url: '/main/financial-management/check-center/check-center-ticket',
          components: CheckCenterTicket,
          parent: 'financial-management'
        },
        //酒店账单
        checkCenterHotel: {
          key: 'check-center-hotel',
          url: '/main/financial-management/check-center/check-center-hotel',
          components: CheckCenterHotel,
          parent: 'financial-management'
        },
        //火车账单
        checkCenterTrain: {
          key: 'check-center-train',
          url: '/main/financial-management/check-center/check-center-train',
          components: CheckCenterTrain,
          parent: 'financial-management'
        }
      },
      parent: 'financial-management'
    },
    //供应商管理
    {
      key: 'supplier-management',
      url: '/main/financial-management/supplier-management',
      components: SupplierManagement,
      icon: 'pay-circle-o',
      children:{
        //供应商管理-银行定义
        supplierBankAccount: {
          key: 'supplier-bank-account',
          url: '/main/financial-management/supplier-management/:id/supplier-bank-account',
          components: SupplierBankAccount,
          parent: 'supplier-management'
        },
        //供应商管理-公司分配
        supplierCompanyDelivery: {
          key: 'supplier-company-delivery',
          url: '/main/financial/management/supplier-management/:id/supplier-company-delivery',
          components: SupplierCompanyDelivery,
          parent: 'supplier-management'
        }
      },
      parent: 'financial-management'
    }
  ]
};

export default financialManagement;
