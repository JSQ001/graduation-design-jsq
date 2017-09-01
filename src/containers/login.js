/**
 * Created by zaranengap on 2017/7/3.
 */
import React from 'react'
import { connect } from 'react-redux'
import {inputUsername, inputPassword, setUser} from 'actions/login'
import Button from 'antd/lib/button';
import { Input, Icon, message } from 'antd';
import httpFetch from 'share/httpFetch'

import 'styles/login.scss'

class Login extends React.Component{
  constructor(props){
    super(props);
    this.state = {loading: false}
  }
  inputUsernameHandler(evt){
    this.props.dispatch(inputUsername(evt.target.value))
  }
  inputPasswordHandler(evt){
    this.props.dispatch(inputPassword(evt.target.value))
  }
  login(){
    this.setState({loading: true});
    httpFetch.login(this.props.username, this.props.password).then((response)=>{
      this.setState({loading: false});
      this.props.history.push('/main/dashboard');
    }).catch((err)=>{
      this.setState({loading: false});
      if(err.response.status == 401)
        message.error('用户名或密码错误，请重新输入:)');
      else
        message.error('哦呼，服务器出了点问题，请联系管理员或稍后再试:(')
    })
  }

  render(){
    return (
      <div className="login">
        <div className="login-area">
          <img src="../images/logo-white.png" className="login-logo"/><br/>
          <div className="login-logo-text">汇联易</div>
          <Input
            size="large"
            placeholder="手机号"
            prefix={<Icon type="user" />}
            onChange={this.inputUsernameHandler.bind(this)}
          />
          <br/>
          <Input
            size="large"
            type="password"
            placeholder="密码"
            prefix={<Icon type="lock" />}
            onChange={this.inputPasswordHandler.bind(this)}
          />
          <br/>
          <span className="forget-password">找回密码</span>
          <br/>
          <Button type="primary" shape="circle" icon="arrow-right" size="large" onClick={this.login.bind(this)} loading={this.state.loading}/>
        </div>
        <img src="../images/huilianyi.png" className="bottom-logo"/>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    username: state.login.username,
    password: state.login.password,
    user: state.login.user
  }
}

export default connect(mapStateToProps)(Login);
