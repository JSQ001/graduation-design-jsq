import DashboardAdmin from 'containers/dashboard-admin'

const menuAdminIndexUrl = '/main/dashboard-admin';

//集团模式首页
const dashboardAdmin = {
  key:'dashboard-admin',
  url: menuAdminIndexUrl,
  components: DashboardAdmin,
  icon: 'home',
  admin: true
};

export default dashboardAdmin
