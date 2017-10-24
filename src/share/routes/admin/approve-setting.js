import AgencySetting from 'containers/approve-setting/agency-setting/agency-setting'
import NewAgency from 'containers/approve-setting/agency-setting/new-agency'
import AgencyDetail from 'containers/approve-setting/agency-setting/agency-detail'

//新建代理
const newAgency = {
  key:'new-agency',
  url:'/main/approve-setting/agency-setting/new-agency',
  components: NewAgency,
  parent: 'agency-setting'
};

//代理详情
const agencyDetail = {
  key:'agency-detail',
  url:'/main/approve-setting/agency-setting/agency-detail/:principalOID',
  components: AgencyDetail,
  parent: 'agency-setting'
};

//代理设置
const agencySetting = {
  key:'agency-setting',
  url:'/main/approve-setting/agency-setting',
  components: AgencySetting,
  parent: 'approve-setting',
  children: {
    newAgency, agencyDetail
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
