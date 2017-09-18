/**
 * Created by zaranengap on 2017/7/3.
 */
import React from 'react'
import { connect } from 'react-redux'
import Button from 'antd/lib/button';
import { Input, Icon, message } from 'antd';
import httpFetch from 'share/httpFetch'
import menuRoute from 'share/menuRoute'
import { injectIntl } from 'react-intl';

import 'styles/login.scss'

class Login extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      loading: false,
      username: '',
      password: ''
    }
  }

  inputUsernameHandler = (evt) => {
    this.setState({username: evt.target.value});
  };

  inputPasswordHandler = (evt) => {
    this.setState({password: evt.target.value});
  };

  login = () => {
    this.setState({loading: true});
    httpFetch.login(this.state.username, this.state.password).then(()=>{
      this.setState({loading: false});
      this.context.router.push(menuRoute.indexUrl);
    }).catch((err)=>{
      this.setState({loading: false});
      if(err.response.status === 401)
        message.error(this.props.intl.formatMessage({id: 'login.wrong'})); //用户名或密码错误，请重新输入:)
      else
        message.error(this.props.intl.formatMessage({id: 'login.error'})); //呼，服务器出了点问题，请联系管理员或稍后再试:(
    })
  };

  render(){
    return (
      <div className="login">
        <div className="login-area">
          <img src="../images/logo-white.png" className="login-logo"/><br/>
          <div className="login-logo-text">{this.props.intl.formatMessage({id: 'helios'})}</div>
          <Input
            size="large"
            placeholder={this.props.intl.formatMessage({id: 'login.username'})} //用户名
            prefix={<Icon type="user" />}
            onChange={this.inputUsernameHandler}
          />
          <br/>
          <Input
            size="large"
            type="password"
            placeholder={this.props.intl.formatMessage({id: 'login.password'})}  //密码
            prefix={<Icon type="lock" />}
            onChange={this.inputPasswordHandler}
          />
          <br/>
          <span className="forget-password">{this.props.intl.formatMessage({id: 'login.forget'})}</span>
          <br/>
          <Button type="primary" shape="circle" icon="arrow-right" size="large" onClick={this.login} loading={this.state.loading}/>
        </div>
        <img src="../images/huilianyi.png" className="bottom-logo"/>
      </div>
    )
  }
}

Login.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
  return {}
}

export default connect(mapStateToProps)(injectIntl(Login));
