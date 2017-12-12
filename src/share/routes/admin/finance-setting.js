import BeepTimer from 'containers/finance-setting/beep-timer/beep-timer'
import AccountPeriodDefine from 'containers/finance-setting/account-period-define/account-period-define'
import SetOfBooks from 'containers/finance-setting/set-of-books/set-of-books'
import AccountPeriodControl from 'containers/finance-setting/account-period-control/account-period-control'
import AccountPeriodDetail from 'containers/finance-setting/account-period-control/account-period-detail'

//单据提醒管理
const beepTimer = {
  key:'beep-timer',
  url:'/main/finance-setting/beep-timer',
  components: BeepTimer,
  parent: 'finance-setting',
  children:{}
};

//会计期间定义
const accountPeriodDefine = {
  key:'account-period-define',
  url:'/main/finance-setting/account-period-define',
  components: AccountPeriodDefine,
  parent: 'finance-setting',
  children:{}
};

//帐套定义
const setOfBooks = {
  key:'set-of-books',
  url:'/main/finance-setting/set-of-books',
  components: SetOfBooks,
  parent: 'finance-setting',
  children:{}
};

//会计期间信息详情
const accountPeriodDetail = {
  key:'account-period-detail',
  url:'/main/finance-setting/account-period-control/account-period-detail/:periodSetId/:setOfBooksId',
  components: AccountPeriodDetail,
  parent: 'account-period-control'
};

//会计期间控制
const accountPeriodControl = {
  key:'account-period-control',
  url:'/main/finance-setting/account-period-control',
  components: AccountPeriodControl,
  parent: 'finance-setting',
  children:{accountPeriodDetail}
};

//财务设置
const financeSetting = {
  key:'finance-setting',
  subMenu: [beepTimer, accountPeriodDefine, setOfBooks, accountPeriodControl],
  icon: 'setting',
  admin: true
};

export default financeSetting
