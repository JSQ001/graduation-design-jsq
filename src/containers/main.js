/**
 * Created by zaranengap on 2017/7/4.
 */
import React from 'react'
import { connect } from 'react-redux'
import { Layout, Menu, Breadcrumb, Icon, Select, Dropdown, Button, Modal, message, Tooltip } from 'antd';
const { Option } = Select;
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
import { Link } from 'react-router'
import 'styles/main.scss'
import AdminContent from 'containers/admin/adminContent'
import UserCenter from 'containers/user-center/user-center'
import httpFetch from 'share/httpFetch'
import config from 'config'
import menuRoute from 'routes/menuRoute'
import configureStore from 'stores'

import { injectIntl } from 'react-intl';

import LogoImg from 'images/logo.png'
import UserImg from 'images/user.png'

class Main extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      menu: menuRoute.menu,
      selectedKeys: [],
      openKeys: [],
      flag: false,
      check: false,
      error: false,
      errorContent: {},
      adminMode: false,
      showListSelector: false
    };
  }

  componentWillMount(){
    //this.setMenuSelectedState();
  }

  setMenuSelectedState(){
    let nowMenuItem = menuRoute.getMenuItemByAttr(this.props.routes[this.props.routes.length - 1].path, 'url');
    this.setState({
      selectedKeys: [nowMenuItem.key],
      openKeys: nowMenuItem.parent ? [nowMenuItem.parent] : []
    });
  }

  componentWillReceiveProps(nextProps){
    console.log(nextProps.user)
    let flag = false;
    if(nextProps.user.authorities!=='undefined'){
      nextProps.user.authorities.map(item=>{
        if(item.id = 3)
          flag = true;
      })
      this.setState({flag})
    }
  }

  handleMenuClick = (e) => {
    if(e.key === this.state.openKeys[0])
      this.setState({openKeys: []});
    else
      this.setState({openKeys: [e.key]})
  };

  //检查菜单的显示与隐藏
  checkMenuAuth = (menuItem) => {

    return true
  };

/*  renderBreadcrumb(){
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
    baseService.changeLanguage(value).then();
  };

  //跳转至老中控，插入token
  skipToAdmin = () => {
    location.href = location.origin + config.oldHomepage;
  };

  logout = () => {
    // mainService.loginOut()
    //   .then((res)=>{
    //     this.context.router.push('/?logout_sso=true');
    //   })
    // 有了单点登陆之后
    mainService.loginOutSso()
      .then((res)=>{
        this.context.router.push('/?logout_sso=true');
      })
  };

  //渲染自定义logo
  renderLogo = () => {
    if(this.props.tenant.showCustomLogo && this.props.tenant.logoURL){
      return (
        <div className="icon-logo">
          <img src={this.props.tenant.logoURL}/>
        </div>
      )
    }else {
      return (
        <div className="icon-logo">
          <img src={LogoImg}/>
        </div>
      )
    }
  }*/

  logout = ()=>{};

  renderModeMenu(){}

  render(){
    const { check, error, showListSelector, adminMode, flag } = this.state;
    const { formatMessage } = this.props.intl;
    return (
      <div>
        {localStorage.getItem("role") === 'student' ?
          <UserCenter/>
          :
          <AdminContent/>
        }
      </div>
    )
  }
}

Main.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
  return {
    user: state.login.user,
  }
}

export default connect(mapStateToProps)(injectIntl(Main));
