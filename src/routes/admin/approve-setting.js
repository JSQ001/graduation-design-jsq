import AgencySetting from 'containers/approve-setting/agency-setting/agency-setting'
import NewAgency from 'containers/approve-setting/agency-setting/new-agency'
import AgencyDetail from 'containers/approve-setting/agency-setting/agency-detail'

//审批设置
const approveSetting = {
  key:'approve-setting',
  icon: 'global',
  admin: true,
  subMenu: [
    //代理设置
    {
      key:'agency-setting',
      url:'/main/approve-setting/agency-setting',
      components: AgencySetting,
      parent: 'approve-setting',
      children: {
        //新建代理
        newAgency: {
          key:'new-agency',
          url:'/main/approve-setting/agency-setting/new-agency',
          components: NewAgency,
          parent: 'agency-setting'
        },
        //代理详情
        agencyDetail: {
          key:'agency-detail',
          url:'/main/approve-setting/agency-setting/agency-detail/:principalOID',
          components: AgencyDetail,
          parent: 'agency-setting'
        }
      }
    }
  ]
};

export default approveSetting
