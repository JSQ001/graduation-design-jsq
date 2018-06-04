/**
 * Created by jsq on 2018/1/4.
 */
import React from 'react'
import { connect } from 'react-redux'
import Button from 'antd/lib/button';
import { Input, message ,Select, Form, Icon} from 'antd';
import httpFetch from 'share/httpFetch'
import menuRoute from 'routes/menuRoute'
import { injectIntl } from 'react-intl';
import Parallax from 'parallax-js'
import {setRole} from 'actions/login'
import 'styles/login.scss'

const FormItem = Form.Item;
const Option = Select.Option;
import configureStore from 'stores'
class Login extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      loading: false,
      userNumber: '',
      password: '',
      identity:[
        {key: 'student', label: '学生'},
        {key: 'teacher', label: '老师'},
        {key: 'admin', label: '管理员'}
      ]
    }
  }

  componentWillMount(){
    this.validateCode()
    console.log(this.state.userNumber==="")
    if(this.state.userNumber!=="")
      this.props.form.setFieldsValue({"userNumber": this.state.userNumber})
  }

  componentDidMount(){
    let scene = document.getElementById('scene');
    let parallaxInstance = new Parallax(scene, {
      calibrateX: true
    });
  }

  //生成四位验证码
  validateCode = ()=>{
    let str = '1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';
    let validateCode = "";
    for(let i=0;i<4;i++){
      validateCode += str[parseInt(Math.random()*str.length)]
    }
    this.setState({validateCode})
  };

  inputUsernameHandler = (evt) => {
    this.setState({username: evt.target.value});
  };

  inputPasswordHandler = (evt) => {
    this.setState({password: evt.target.value});
  };

  login = () => {
    this.setState({loading: true});
    let role = this.props.form.getFieldValue("identity");
    httpFetch.login(this.state.userNumber, this.state.password).then(()=>{
      this.setState({loading: false});
      localStorage.setItem("role",role);
      httpFetch.getUser().then(()=>{
        this.context.router.push(menuRoute.indexUrl);
        console.log(configureStore.store.getState().login.user)
        console.log(configureStore.store.getState().login.role)
      });
    }).catch((err)=>{
      this.setState({loading: false});
      console.log(err)
      if(err.response.status === 401 || err.response.status === 400)
        message.error(this.props.intl.formatMessage({id: 'login.wrong'})); //用户名或密码错误，请重新输入:)
      else
        message.error(this.props.intl.formatMessage({id: 'login.error'})); //呼，服务器出了点问题，请联系管理员或稍后再试:(
    })
  };

  emitEmpty = () => {
    this.userNameInput.focus();
    this.setState({ userNumber: '' });
  };
  onChangeUserName = (e) => {
    this.setState({ userNumber: e.target.value });
  };

  //跳转注册页面
  handleRegister = ()=>{
    this.context.router.push(menuRoute.getMenuItemByAttr('register', 'key').url)
    console.log(menuRoute.getMenuItemByAttr('register', 'key'))
    console.log(menuRoute.menu)

  };

  render(){
    const { getFieldDecorator } = this.props.form;
    const { formatMessage } = this.props.intl;
    const { identity, userName, validateCode} = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14, offset: 1 },
    };

    const suffix = userName ? <Icon type="close-circle" onClick={this.emitEmpty} /> : null;

    return (
      <div className="login">
        <div className="login-header">
          {formatMessage({id:"login.welcome"})}
        </div>
        <div className="login-content">XXXX</div>
        <div className="login-content-label">在线考试系统</div>
        <div className="login-area">
          <div className="login-logo-text">{formatMessage({id:"login.system"})}</div>
          <Form>
            <FormItem {...formItemLayout} label={formatMessage({id:'login.identity'})  /*身份*/}>
            {getFieldDecorator('identity',
              {
                initialValue: 'student',
              }
            )(
              <Select
                className="input-disabled-color" placeholder={ formatMessage({id:"common.please.select"})}
                onFocus={()=>{}}>
                {
                  identity.map((item)=><Option key={item.key}>{item.label}</Option>)
                }
              </Select>
            )}
            </FormItem>
            <FormItem {...formItemLayout} label={formatMessage({id:'login.account'})  /*账号*/}>
            {getFieldDecorator('userNumber',
              {
               // initialValue: 'student',
              }
             )(
                <Input
                  //style={{background:'#ffffff'}}
                  placeholder={ formatMessage({id:"common.please.enter"})}
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  suffix={suffix}
                  //value={userName}
                  onChange={this.onChangeUserName}
                  ref={node => this.userNameInput = node}
                />
            )}
            </FormItem>
            <FormItem {...formItemLayout} label={formatMessage({id:'login.password'})  /*密码*/}>
              {getFieldDecorator('password',
                {
                  // initialValue: 'student',
                }
              )(
                  <Input
                    type='password'
                    placeholder={ formatMessage({id:"common.please.enter"})}
                    onChange={this.inputPasswordHandler}
                    onPressEnter={this.login}
                  />
              )}
            </FormItem>
            <FormItem {...{labelCol: { span: 6 }, wrapperCol: { span: 5, offset: 1 },}}
              label={formatMessage({id:'login.validateCode'})  /*验证码*/}>
              {getFieldDecorator('validateCode')(
                <div>
                  <Input
                    style={{width:73}}
                    placeholder={ formatMessage({id:"common.please.enter"})}
                    onChange={this.inputPasswordHandler}
                    onPressEnter={this.login}
                  />
                  <div className="login-validate-code" onClick={this.validateCode}>{validateCode}</div>
                </div>
              )}
              {/* <a className="forget-password">{formatMessage({id: 'login.forget'})}</a>*/}
            </FormItem>

            <Button type="primary" onClick={this.login} loading={this.state.loading}>登录</Button>
            <a onClick={this.handleRegister} className="login-register">{formatMessage({id: 'login.register'})}</a>{/*注册*/}
            <a className="forget-password">{formatMessage({id: 'login.forget'})}</a>
          </Form>
        </div>
      {/*  <div className="message">
          <div className="no-account">还没有账号？请联系客服</div>
          <div className="phone-number">400-829-7878</div>
        </div>*/}
        <div className="footer">CopyRight  JSQ  |  沪ICP备16047366号</div>

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
const WrappedLogin = Form.create()(Login);

export default connect(mapStateToProps)(injectIntl(WrappedLogin));
