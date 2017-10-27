import BeepTimer from 'containers/finance-setting/beep-timer/beep-timer'
import AccountPeriodDefine from 'containers/finance-setting/account-period-define/account-period-define'
import SetOfBooks from 'containers/finance-setting/set-of-books/set-of-books'

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

//财务设置
const financeSetting = {
  key:'finance-setting',
  subMenu: [beepTimer, accountPeriodDefine, setOfBooks],
  icon: 'setting',
  admin: true
};

export default financeSetting
