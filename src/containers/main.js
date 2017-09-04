/**
 * Created by zaranengap on 2017/7/4.
 */
import React from 'react'
import { connect } from 'react-redux'
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
import { Link } from 'react-router'
import 'styles/main.scss'

import menuRoute from 'share/menuRoute'
import {setCurrentPage} from 'actions/main'

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
    }, ()=>{
      let newCurrent = [];
      newCurrent.unshift(menuRoute.getMenuItemByAttr(this.state.selectedKeys[0], 'key'));
      this.state.openKeys.length > 0 && newCurrent.unshift(menuRoute.getMenuItemByAttr(this.state.openKeys[0], 'key'));
      this.props.dispatch(setCurrentPage(newCurrent))
    });
  }

  renderMenu(){
    return (
      <Menu theme="dark" mode="inline" defaultSelectedKeys={this.state.selectedKeys} defaultOpenKeys={this.state.openKeys}>
        {this.state.menu.map(item =>
          item.subMenu ? (
            <SubMenu
              key={item.key}
              title={<span><Icon type="user" /><span className="nav-text">{item.name}</span></span>}
            >
              {item.subMenu.map((subItem, j) =>
                <Menu.Item key={subItem.key}><Link to={subItem.url}>{subItem.name}</Link></Menu.Item>
              )}
            </SubMenu>
          ) : (
            <Menu.Item key={item.key}>
              <Link to={item.url}>
                <span>
                  <Icon type="file" />
                  <span className="nav-text">{item.name}</span>
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
              <Link to={item.url} className={i === this.props.currentPage.length - 1 ? 'last-breadcrumb' : null}>{item.name}</Link>
            </Breadcrumb.Item> :
            <Breadcrumb.Item key={item.name}>{item.name}</Breadcrumb.Item>
        )}
      </Breadcrumb>
    )
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
              <div className="user-name">
                欢迎你,{this.props.user.fullName}
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
    currentPage: state.main.currentPage,
    user: state.login.user,
    profile: state.login.profile,
    company: state.login.company
  }
}

export default connect(mapStateToProps)(Main);
