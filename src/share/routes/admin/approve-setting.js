import AgencySetting from 'containers/approve-setting/agency-setting/agency-setting'
import NewAgency from 'containers/approve-setting/agency-setting/new-agency'

//新建代理
const newAgency = {
  key:'new-agency',
  url:'/main/approve-setting/agency-setting/new-agency',
  components: NewAgency,
  parent: 'agency-setting'
};

//代理设置
const agencySetting = {
  key:'agency-setting',
  url:'/main/approve-setting/agency-setting',
  components: AgencySetting,
  parent: 'approve-setting',
  children: {
    newAgency
  }
};

//审批设置
const approveSetting = {
  key:'approve-setting',
  subMenu: [agencySetting],
  icon: 'global',
  admin: true
};

export default approveSetting
