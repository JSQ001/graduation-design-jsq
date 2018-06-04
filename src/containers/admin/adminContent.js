/**
 * created by jsq on 2018/5/1
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { Button, Table, Layout,Menu, Icon, Tooltip, Breadcrumb } from 'antd'
import SearchArea from 'components/search-area';
import config from 'config'
import { Link } from 'react-router'
import menuRoute from 'routes/menuRoute'
const { Header, Content, Sider } = Layout;
import 'styles/main.scss'
import LogoImg from 'images/logo.png'
import UserImg from 'images/user.png'

const { SubMenu } = Menu;


class AdminContent extends React.Component {
  constructor(props) {
    super(props);
    const { formatMessage } = this.props.intl;
    this.state = {
      loading: true,
      menu: menuRoute.menu,
      selectedKeys: [],
      openKeys: [],
      check: false,
      adminMode: true,
      role: '',
      data: [],
    };
  }

  componentWillMount(){
    this.setState({
      role: localStorage.getItem('role')
    })
  }
//点击行，进入该行详情页面
  handleRowClick = (record, index, event) =>{
    this.context.router.push(menuRoute.getMenuItemByAttr('budget-organization', 'key').children.budgetControlRulesDetail.url.replace(':id', this.props.id).replace(':ruleId', record.id));
  };

  //检查菜单的显示与隐藏
  checkMenuAuth = (menuItem) => {
    const {role} = this.state;
    let flag = false;
    if(!menuItem.role || menuItem.role == role){
      flag = true;
    }
    return flag;
  };

  renderModeMenu(){}

  //切换模式
  handleModeChange = () => {
    const { adminMode } = this.state;
    const { tenantMode } = this.props;
    this.context.router.replace(!adminMode ? (tenantMode ? menuRoute.adminTenantIndexUrl : menuRoute.adminCompanyIndexUrl) : menuRoute.indexUrl);
    this.setState({ adminMode: !adminMode }, () => {
      this.setMenuSelectedState();
    });
  };


  setMenuSelectedState(){
    console.log(this.props.routes)
    let nowMenuItem = menuRoute.getMenuItemByAttr(this.props.routes[this.props.routes.length - 1].path, 'url');
    this.setState({
      selectedKeys: [nowMenuItem.key],
      openKeys: nowMenuItem.parent ? [nowMenuItem.parent] : []
    });
  }

  handleMenuClick = (e) => {
    if(e.key === this.state.openKeys[0])
      this.setState({openKeys: []});
    else
      this.setState({openKeys: [e.key]})
  };

  renderMenu(){
    return (
      <Menu theme="dark" mode="inline"
            selectedKeys={this.state.selectedKeys}
            openKeys={this.state.openKeys}
            onClick={(e) => {this.setState({selectedKeys: [e.key]})}}>
        {this.state.menu.map(item =>
          item.subMenu ? (
            this.checkMenuAuth(item) ? <SubMenu
              key={item.key} onTitleClick={this.handleMenuClick}
              title={<span><Icon type={item.icon} /><span className="nav-text">{this.props.intl.formatMessage({id: `menu.${item.key}`})}</span></span>}
            >
              {item.subMenu.map((subItem, j) =>
                this.checkMenuAuth(subItem) ? <Menu.Item key={subItem.key}><Link to={subItem.url}>{this.props.intl.formatMessage({id: `menu.${subItem.key}`})}</Link></Menu.Item> : null
              )}
            </SubMenu> : null
          ) : (
            this.checkMenuAuth(item) ? <Menu.Item key={item.key}>
              <Link to={item.url}>
                <span>
                  <Icon type={item.icon} />
                  <span className="nav-text">{this.props.intl.formatMessage({id: `menu.${item.key}`})}</span>
                </span>
              </Link>
            </Menu.Item> : null
          )
        )}
      </Menu>
    )
  }

  renderBreadcrumb(){
    return (
      <Breadcrumb className="breadcrumb">
        {this.props.currentPage.map((item,i) =>
          item.url ?
            <Breadcrumb.Item key={item.key}>
              <Link to={item.url} className={i === this.props.currentPage.length - 1 ? 'last-breadcrumb' : null}>{this.props.intl.formatMessage({id: `menu.${item.key}`})}</Link>
            </Breadcrumb.Item> :
            <Breadcrumb.Item key={item.key}>{this.props.intl.formatMessage({id: `menu.${item.key}`})}</Breadcrumb.Item>
        )}
      </Breadcrumb>
    )
  }

  render(){
    const { formatMessage } = this.props.intl;
    const { searchForm, loading, columns, pagination, data, adminMode} = this.state;
    return (
      <Layout className="helios-main">
        <Sider width={202} className="helios-sider">
          <div className="company-name">{this.renderModeMenu()}</div>
          <div className="menu-container">
            {this.renderMenu()}
          </div>
        </Sider>
        <Layout style={{ marginLeft: 202 }} className="content-layout">
          <Header className="helios-header">

            <div className="user-area">
              {this.hasAnyAuthorities(['ROLE_TENANT_ADMIN', 'ROLE_COMPANY_ADMIN', 'ROLE_COMPANY_BOOK_ADMIN', 'ROLE_COMPANY_FINANCE_ADMIN']) ?
                <Button className="admin-button"
                        onClick={this.handleModeChange}>
                  {adminMode ? "退出管理员模式" : "管理员模式"}
                </Button>
                : null}
              <div className="user-name">
                {formatMessage({id: 'main.welcome'}, {name: this.props.user.fullName}) /*欢迎您, name*/}
              </div>
              <div className="user-avatar">
                <img src={this.props.user.filePath ? this.props.user.filePath : UserImg}/>
              </div>
              <Tooltip placement="bottom" title={<span style={{whiteSpace: 'nowrap'}}>{formatMessage({id: 'main.logout'})}</span>}>
                <Icon type="logout"
                      style={{marginLeft: 20, cursor: 'pointer'}}
                      onClick={this.logout}/>
              </Tooltip>
            </div>
            {this.renderBreadcrumb()}
          </Header>
          <Content className="helios-content">
            {menuRoute.MainRoute}
          </Content>
        </Layout>

      </Layout>
    )
  }
}
AdminContent.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
  return {
    user: state.login.user,
    currentPage: state.main.currentPage,
  }
}

export default connect(mapStateToProps)(injectIntl(AdminContent));
