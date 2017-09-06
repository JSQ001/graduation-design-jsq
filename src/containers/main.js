/**
 * Created by zaranengap on 2017/7/4.
 */
import React from 'react'
import { connect } from 'react-redux'
import { Layout, Menu, Breadcrumb, Icon, Select } from 'antd';
const { Option } = Select;
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
import { Link } from 'react-router'
import 'styles/main.scss'

import menuRoute from 'share/menuRoute'
import {setLanguage} from 'actions/main'

import { injectIntl } from 'react-intl';

import en from 'static/i18n/en_US'
import zh from 'static/i18n/zh_CN'

class Main extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      menu: menuRoute.menu,
      selectedKeys: [],
      openKeys: []
    };
  }

  componentWillMount(){
    let nowMenuItem = menuRoute.getMenuItemByAttr(this.props.routes[this.props.routes.length - 1].path, 'url');
    this.setState({
      selectedKeys: [nowMenuItem.key],
      openKeys: nowMenuItem.parent ? [nowMenuItem.parent] : []
    });
  }

  renderMenu(){
    return (
      <Menu theme="dark" mode="inline" defaultSelectedKeys={this.state.selectedKeys} defaultOpenKeys={this.state.openKeys}>
        {this.state.menu.map(item =>
          item.subMenu ? (
            <SubMenu
              key={item.key}
              title={<span><Icon type="user" /><span className="nav-text">{this.props.intl.formatMessage({id: `menu.${item.key}`})}</span></span>}
            >
              {item.subMenu.map((subItem, j) =>
                <Menu.Item key={subItem.key}><Link to={subItem.url}>{this.props.intl.formatMessage({id: `menu.${item.key}`})}</Link></Menu.Item>
              )}
            </SubMenu>
          ) : (
            <Menu.Item key={item.key}>
              <Link to={item.url}>
                <span>
                  <Icon type="file" />
                  <span className="nav-text">{this.props.intl.formatMessage({id: `menu.${item.key}`})}</span>
                </span>
              </Link>
            </Menu.Item>
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
            <Breadcrumb.Item key={item.name}>
              <Link to={item.url} className={i === this.props.currentPage.length - 1 ? 'last-breadcrumb' : null}>{this.props.intl.formatMessage({id: `menu.${item.key}`})}</Link>
            </Breadcrumb.Item> :
            <Breadcrumb.Item key={item.name}>{this.props.intl.formatMessage({id: `menu.${item.key}`})}</Breadcrumb.Item>
        )}
      </Breadcrumb>
    )
  }

  handleChangeLanguage(value){
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
  }

  render(){
    return (
      <Layout className="helios-main">
        <Sider width={202} className="helios-sider">
          <div className="company-name">{this.props.company.name}</div>
          {this.renderMenu()}
        </Sider>
        <Layout>
          <Header className="helios-header">
            <div className="icon-logo">
              <img src='../images/logo.png'/>
            </div>

            <div className="user-area">
              <Select defaultValue={this.props.language.locale} onChange={this.handleChangeLanguage.bind(this)} className="language-set">
                <Option value="zh">简体中文</Option>
                <Option value="en">English</Option>
              </Select>
              <div className="user-name">
                {this.props.intl.formatMessage({id: 'main.welcome'}, {name: this.props.user.fullName}) /*欢迎您, name*/}
              </div>
              <div className="user-avatar">
                <img src={this.props.user.filePath}/>
              </div>
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

function mapStateToProps(state) {
  return {
    language: state.main.language,
    currentPage: state.main.currentPage,
    user: state.login.user,
    profile: state.login.profile,
    company: state.login.company
  }
}

export default connect(mapStateToProps)(injectIntl(Main));
