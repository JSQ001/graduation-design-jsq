/**
 * Created by zaranengap on 2017/7/11.
 */
import React from 'react'
import { connect } from 'react-redux';
import { message } from 'antd'
import configureStore from 'stores'
import httpFetch from 'share/httpFetch'
/**
 * 检查用户权限组件，如果有token则可以进行对应的操作，如果没有token则跳转到登录页面
 * 当redux内没有用户信息时也能进行自动更新
 * @param Component
 * @return {*}
 */

function requireAuthentication(Component) {
  // 组件有已登陆的模块 直接返回 (防止从新渲染)
  console.log(Component)
  if (Component.AuthenticatedComponent) {
    return Component.AuthenticatedComponent
  }

  // 创建验证组件
  class AuthenticatedComponent extends React.Component {

    constructor(){
      super();
      this.state = {
        login: false,
        checking: false
      }
    }

    componentWillMount() {
      this.checkAuth();
    }

    componentWillReceiveProps() {
      this.checkAuth();
    }

    checkAuth() {
      //新老中控的共享token检查
      const login = !!localStorage.getItem('jsq.token');
      console.log(login)
      if (!login) {
        location.href = '/';
      } else {
        if(this.state.checking){
          alert("checking")
          console.log(123)
          return;
        }
        console.log(configureStore.store.getState().login.user)
        console.log(Object.keys(configureStore.store.getState().login.user))
        if(Object.keys(configureStore.store.getState().login.user).length === 0){
          this.setState({ checking: true });
          httpFetch.getUser().then(() => {
            this.setState({login: true, checking: false});
          }).catch(err => {
            console.log(err)
            location.href = '/';
            message.error(this.props.intl.formatMessage({id: 'login.error'})); //呼，服务器出了点问题，请联系管理员或稍后再试:(
          });
        } else {
          this.setState({login: true, checking: false});
        }
      }
    }

    render() {
      console.log(this.state.login)
      if (this.state.login) {
        return <Component {...this.props}/>
      }
      return <Component {...this.props}/>
    /*  return (
        <div className="base">
          <div className="cube"/><div className="cube"/><div className="cube"/>
          <div className="cube"/><div className="cube"/><div className="cube"/>
          <div className="cube"/><div className="cube"/><div className="cube"/>
        </div>
      )*/
    }
  }

  function mapStateToProps(state) {
    return {};
  }

  function mapDispatchToProps(dispatch) {
    return {};
  }

  Component.AuthenticatedComponent = connect(mapStateToProps, mapDispatchToProps)(AuthenticatedComponent);
  return Component.AuthenticatedComponent
}

export default requireAuthentication
