/**
 * Created by jsq on 2018/1/6.
 */
import React from 'react'
import { connect } from 'react-redux'
import { Input, message ,Select, Form, Icon, Button} from 'antd';
import httpFetch from 'share/httpFetch'
import menuRoute from 'routes/menuRoute'
import { injectIntl } from 'react-intl'
import 'styles/register.scss'

const FormItem = Form.Item;
const Option = Select.Option;

class Register extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      loading: false,
      userName: '',
      password: '',
      identity:[
        {key: 'student', label: '学生'},
        {key: 'teacher', label: '老师'}
      ]
    }
  }

  componentWillMount(){
  }
  render(){
    const { getFieldDecorator } = this.props.form;
    const { formatMessage } = this.props.intl;
    const { identity, userName, validateCode} = this.state;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span:6, offset: 0 },
    };

    const suffix = userName ? <Icon type="close-circle" onClick={this.emitEmpty} /> : null;

    return (
      <div className="register">
        <div>
          账号注册页面
        </div>
          <Form className="register-form">
            <FormItem {...formItemLayout} label={formatMessage({id:'login.identity'})  /*身份*/}>
              {getFieldDecorator('identity',
                {
                  initialValue: 'student',
                  rules: [{
                    required: true,
                    message:  formatMessage({id:"common.please.select"})
                  }]
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
              {getFieldDecorator('account',
                {
                  // initialValue: 'student',
                  rules: [{
                    required: true,
                    message:  formatMessage({id:"common.please.select"})
                  }]
                }
              )(
                <Input
                  //style={{background:'#ffffff'}}
                  placeholder={ formatMessage({id:"register.account.tips"})}
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  suffix={suffix}
                  value={userName}
                  onChange={this.onChangeUserName}
                  ref={node => this.userNameInput = node}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label={formatMessage({id:'login.password'})  /*密码*/}>
              {getFieldDecorator('password',
                {
                  // initialValue: 'student',
                  rules: [{
                    required: true,
                    message:  formatMessage({id:"common.please.select"})
                  }]
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
            <FormItem {...formItemLayout} label={formatMessage({id:'login.confirmPassword'})  /*确认密码*/}>
              {getFieldDecorator('password',
                {
                  // initialValue: 'student',
                  rules: [{
                    required: true,
                    message:  formatMessage({id:"common.please.select"})
                  }]
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
            </FormItem>

            <Button type="primary" onClick={this.login} loading={this.state.loading}>登录</Button>
            <a className="login-register">{formatMessage({id: 'login.register'})}</a>{/*注册*/}
            <a className="forget-password">{formatMessage({id: 'login.forget'})}</a>
          </Form>

        <div className="footer">CopyRight  JSQ  |  沪ICP备16047366号</div>
      </div>
    )
  }
}

Register.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
  return {}
}
const WrappedRegister = Form.create()(Register);

export default connect(mapStateToProps)(injectIntl(WrappedRegister));
