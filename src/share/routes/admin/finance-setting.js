import BeepTimer from 'containers/finance-setting/beep-timer/beep-timer'
import AccountPeriodDefine from 'containers/finance-setting/account-period-define/account-period-define'

//单据提醒管理
const beepTimer = {
  key:'beep-timer',
  url:'/main/finance-setting/beep-timer',
  components: BeepTimer,
  parent: 'finance-setting',
  children:{}
};

const accountPeriodDefine = {
  key:'account-period-define',
  url:'/main/finance-setting/account-period-define',
  components: AccountPeriodDefine,
  parent: 'finance-setting',
  children:{}
};

//财务设置
const financeSetting = {
  key:'finance-setting',
  subMenu: [beepTimer, accountPeriodDefine],
  icon: 'setting',
  admin: true
};

export default financeSetting
