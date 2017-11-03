/**
 * Created by zaranengap on 2017/7/3.
 */
import React from 'react'
import { connect } from 'react-redux'
import Button from 'antd/lib/button';
import { Input, message } from 'antd';
import httpFetch from 'share/httpFetch'
import menuRoute from 'share/menuRoute'
import { injectIntl } from 'react-intl';
//import Parallax from 'parallax-js'

import 'styles/login.scss'

import BG from 'images/login/BG.jpg'
import logo from 'images/login/logo.png'
import layer1 from 'images/login/layer01.png'
import layer2 from 'images/login/layer02.png'
import layer3 from 'images/login/layer03.png'

class Login extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      loading: false,
      username: '',
      password: ''
    }
  }

  componentDidMount(){
    let scene = document.getElementById('scene');
    let parallaxInstance = new Parallax(scene, {
      calibrateX: true
    });
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
        <img src={BG} className="background-img"/>
        <div className="login-area">
          <div className="login-logo-text">汇联易管理系统</div>
          <Input
            size="large"
            placeholder={this.props.intl.formatMessage({id: 'login.username'})} //用户名
            onChange={this.inputUsernameHandler}
          />
          <br/>
          <Input
            size="large"
            type="password"
            placeholder={this.props.intl.formatMessage({id: 'login.password'})}  //密码
            onChange={this.inputPasswordHandler}
          />
          <br/>
          <div className="forget-password">{this.props.intl.formatMessage({id: 'login.forget'})}</div>
          <br/>
          <Button type="primary" size="large" onClick={this.login} loading={this.state.loading}>登录</Button>
        </div>
        <div className="message">
          <div className="no-account">还没有账号？请联系客服</div>
          <div className="phone-number">400-202-2020</div>
        </div>

        <div id="scene">
          <img src={logo} className="img-logo"/>
          <div data-depth="0.2"><img src={layer1}/></div>
          <div data-depth="0.4"><img src={layer2}/></div>
          <div data-depth="0.6"><img src={layer3}/></div>
        </div>
        <div className="description">
          <div className="description-title">重新定义报销</div>
          <div className="description-content">引领差旅报销云时代, 实现自动化管理</div>
        </div>
        <div className="footer">CopyRight  汇联易  |  沪ICP备16047366号</div>

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
