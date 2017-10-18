import  BeepTimer from 'containers/finance-setting/beep-timer/beep-timer.js'

//单据提醒管理
const beepTimer = {
  key:'beep-timer',
  url:'/main/finance-setting/beep-timer',
  components: BeepTimer,
  parent: 'finance-setting',
  children:{}
};

//财务设置
const financeSetting = {
  key:'finance-setting',
  subMenu: [beepTimer],
  icon: 'setting',
  admin: true
};

export default financeSetting
