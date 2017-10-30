/**
 * Created by zaranengap on 2017/7/4.
 */
import React from 'react'
import { connect } from 'react-redux'
import { Layout, Menu, Breadcrumb, Icon, Select, Dropdown, Button } from 'antd';
const { Option } = Select;
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
import { Link } from 'react-router'
import 'styles/main.scss'

import httpFetch from 'share/httpFetch'
import config from 'config'
import menuRoute from 'share/menuRoute'
import { setLanguage } from 'actions/main'
import { setCompany } from 'actions/login'
import { setOrganization, setOrganizationStrategyId } from 'actions/budget'
import Loading from 'components/loading'
import ListSelector from 'components/list-selector'

import { injectIntl } from 'react-intl';

import en from 'share/i18n/en_US'
import zh from 'share/i18n/zh_CN'

import LogoImg from 'images/logo.png'

class Main extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      menu: menuRoute.menu,
      selectedKeys: [],
      openKeys: [],
      collapsed: false,
      check: false,
      adminMode: false,
      companyMode: true,
      showListSelector: false,
      dashboardPage : menuRoute.getRouteItem('dashboard', 'key'),
      dashboardAdminPage: menuRoute.getRouteItem('dashboard-admin', 'key')
    };
  }

  componentWillMount(){
    this.checkParams();
    this.setMenuSelectedState();
  }

  setMenuSelectedState(){
    let nowMenuItem = menuRoute.getMenuItemByAttr(this.props.routes[this.props.routes.length - 1].path, 'url');
    this.setState({
      selectedKeys: [nowMenuItem.key],
      openKeys: nowMenuItem.parent ? [nowMenuItem.parent] : []
    });
  }

  shouldComponentUpdate(){
    this.checkParams();
    return true;
  }

  //切换模式
  handleModeChange = () => {
    const { adminMode, dashboardAdminPage,  dashboardPage} = this.state;
    this.context.router.replace(!adminMode ? dashboardAdminPage.url : dashboardPage.url);
    this.setState({ adminMode: !adminMode }, () => {
      this.setMenuSelectedState();
    });
  };

  handleModeMenuClick = (e) => {
    switch (e.key){
      case 'bloc':
        this.setState({ companyMode: false });
        break;
      case 'company':
        this.setState({ companyMode: true });
        break;
      case 'change':
        this.setState({ showListSelector: true })
    }
  }
  ;

  //渲染公司模式切换下拉选项
  renderModeMenu = () => {
    const { companyMode, collapsed } = this.state;
    let menu = (
      <Menu onClick={this.handleModeMenuClick}>
        {this.checkAuthorities('ROLE_TENANT_ADMIN') && companyMode ? <Menu.Item key="bloc">集团模式</Menu.Item> : null}
        {!companyMode ? <Menu.Item key="company">公司模式</Menu.Item> : null}
        <Menu.Item key="change">切换公司</Menu.Item>
      </Menu>
    );
    return <Dropdown overlay={menu}><span>{collapsed ? '' :  (this.props.company.name + ' ')}<Icon type="down" /></span></Dropdown>
  };

  //切换公司
  handleChangeCompany = (result) => {
    this.setState({ showListSelector: false });
    if(result && result.result.length > 0){
      this.props.dispatch(setCompany(result.result[0]));
    }
  };

  /**
   * 检查url时设置当前url及redux的值
   * @param sections  当前url路径分割数组
   * @param index  需要检查的url在sections内的位数
   * @param value  需要填入url及redux内的值
   * @param actions  redux操作函数
   * @param string  url内非值时的默认字符串
   * @param backKey  如果redux为空且进入了原始url时返回的页面key
   */
  setUrl = (sections, index, value, actions, string, backKey) => {
    if(sections[index] === string){
      if(value)
        this.context.router.replace(sections.join('/').replace(string, value));
      else
        this.context.router.replace(menuRoute.getRouteItem(backKey, 'key').url);
      this.setState({check: true});
    } else {
        actions(sections[index])
    }
  };

  /**
   * 参数检查方法，检查Url内是否含有需要保存在redux内的值，如果存在则根据url内参数进行对应的操作
   * 这样可以在进入一些特定url时自动检查状态从而更新redux
   */
  checkParams() {
    this.setState({check: false});
    const path = location.pathname;
    let section = path.split('/');
    if(path.indexOf('budget-organization-detail') > -1 && this.props.organization.id !== section[5]) {  //预算组织内部页面的组织id检查
      let actions = (value) => {
        httpFetch.get(`${config.budgetUrl}/api/budget/organizations/${value}`).then(res => {
          this.props.dispatch(setOrganization(res.data));
          this.setState({check: true});
        })
      };
      this.setUrl(section, 5, this.props.organization.id, actions, ":id", 'budget-organization');
    } else if(path.indexOf('budget-strategy-detail') > -1 && this.props.strategyId !== section[8]) {  //预算策略定义内部页面的策略id检查
      let actions = (value) => {
        this.props.dispatch(setOrganizationStrategyId(value));
        this.setState({check: true});
      };
      this.setUrl(section, 8, this.props.strategyId, actions, ":strategyId", 'budget-organization');
    } else {
      this.setState({check: true});
    }
  }

  renderMenu(){
    const { adminMode } = this.state;
    return (
      <Menu theme="dark" mode="inline" defaultSelectedKeys={this.state.selectedKeys} defaultOpenKeys={this.state.openKeys}>
        {this.state.menu.map(item =>
          item.subMenu ? (
            ((adminMode && item.admin) || (!adminMode && !item.admin)) ? <SubMenu
              key={item.key}
              title={<span><Icon type={item.icon} /><span className="nav-text">{this.props.intl.formatMessage({id: `menu.${item.key}`})}</span></span>}
            >
              {item.subMenu.map((subItem, j) =>
                <Menu.Item key={subItem.key}><Link to={subItem.url}>{this.props.intl.formatMessage({id: `menu.${subItem.key}`})}</Link></Menu.Item>
              )}
            </SubMenu> : null
          ) : (
            ((adminMode && item.admin) || (!adminMode && !item.admin)) ? <Menu.Item key={item.key}>
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

  handleChangeLanguage = (value) => {
    let language = {};
    switch(value){
      case 'en':
        language = {
          locale: 'en',
          messages: en
        };
        break;
      case 'zh':
        language = {
          locale: 'zh',
          messages: zh
        };
        break;
    }
    this.props.dispatch(setLanguage(language));
  };

  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  };

  render(){
    const { collapsed, check, showListSelector, adminMode } = this.state;
    return (
      <Layout className="helios-main">
        <Sider width={202} className="helios-sider" collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
          <div className="company-name">{this.renderModeMenu()}</div>
          {this.renderMenu()}
        </Sider>
        <Layout style={{ marginLeft: collapsed ? 64 : 202 }} className="content-layout">
          <Header className="helios-header">
            <div className="icon-logo">
              <img src={LogoImg}/>
            </div>
            <div className="user-area">
              <Button className="admin-button" onClick={this.handleModeChange}>{adminMode ? '退出管理员模式' : '管理员模式'}</Button>
              <Select defaultValue={this.props.language.locale} onChange={this.handleChangeLanguage} className="language-set">
                <Option value="zh">简体中文</Option>
                <Option value="en">English</Option>
              </Select>
              <div className="user-name">
                {this.props.intl.formatMessage({id: 'main.welcome'}, {name: this.props.user.fullName}) /*欢迎您, name*/}
              </div>
              <div className="user-avatar">
                <img src={this.props.user.filePath ? this.props.user.filePath : '../images/user.png'}/>
              </div>
            </div>
            {this.renderBreadcrumb()}
          </Header>
          <Content className="helios-content">
            {check ? menuRoute.MainRoute : <Loading/>}
          </Content>
        </Layout>

        <ListSelector type="available_company"
                      visible={showListSelector}
                      onOk={this.handleChangeCompany}
                      onCancel={() => { this.setState({showListSelector: false}) }}
                      single={true}/>

      </Layout>
    )
  }
}

Main.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
  return {
    language: state.main.language,
    currentPage: state.main.currentPage,
    user: state.login.user,
    profile: state.login.profile,
    company: state.login.company,
    organization: state.budget.organization,
    strategyId: state.budget.strategyId
  }
}

export default connect(mapStateToProps)(injectIntl(Main));
