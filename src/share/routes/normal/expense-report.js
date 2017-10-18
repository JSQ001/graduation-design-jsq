import MyAccount from 'containers/expense-report/my-account'

//我的账本
const myAccount = {
  key: 'my-account',
  url:'/main/expense-report/my-account',
  components:MyAccount,
  parent:'expense-report'
};


//报销单
const expenseReport = {
  key: 'expense-report',
  subMenu: [myAccount],
  icon: 'file-text'
};

export default expenseReport
