/**
 * Created by jsq on 2018/4/26.
 */
import React from 'react'
import { connect } from 'react-redux'
import { Input, message ,Select, Form, Icon, Button, Row, Col} from 'antd';
import { injectIntl } from 'react-intl'
import 'styles/user-center/change-password.scss'
import httpFetch from 'share/httpFetch'
import config from 'config'
const FormItem = Form.Item;

class ChangePassword extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    }
  }

  componentWillMount(){
    //获取用户信息
    console.log(this.props.params)
  }

  handleSubmit = (e)=> {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log(values)
        let params = {
          id: this.props.user.id,
          password: values.newPassword
        };
        httpFetch.put(`${config.baseUrl}/api/user/update`,params).then(response=>{
          console.log(response)
          message.success("修改成功");
          this.props.form.resetFields()
        })
      }
    })
  };


  onCancel = ()=>{
    this.props.form.resetFields()
  };

  render(){
    const { formatMessage } = this.props.intl;
    const { getFieldDecorator } = this.props.form;
    const { loading} = this.state;
    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 4, offset: 0 },
    };
    return (
      <div className="change-password">
        <Form>
          <FormItem {...formItemLayout} label="原始密码">
            {getFieldDecorator('password', {
              rules: [{
                required: true,
                message:  formatMessage({id:"common.please.enter"})
              },
                {
                  validator: (item,value,callback)=>{
                    if(!!value){
                      let str = /^[0-9a-zA-z-_]*$/;
                      if(!str.test(value)||value.length >20){
                        callback("不超过20个字符，只能包含字母数字下划线")
                      }
                    }
                    callback();
                  }
                }
              ]
            })(
              <Input type="password"/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="新的密码">
            {getFieldDecorator('newPassword', {
              rules: [{
                required: true,
                message:  formatMessage({id:"common.please.enter"})
              },
                {
                  validator: (item,value,callback)=>{
                    if(!!value){
                      this.setState({newPwd: value});
                      let str = /^[0-9a-zA-z-_]*$/;
                      if(!str.test(value)||value.length >20){
                        callback("不超过20个字符，只能包含字母数字下划线")
                      }
                    }
                    callback();
                  }
                }
              ]
            })(
              <Input type="password"/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="确认密码">
            {getFieldDecorator('filtrateMethod', {
              rules: [{
                required: true,
                message: formatMessage({id:"common.please.select"})
              },
                {
                  validator: (item,value,callback)=>{
                    if(!!value){
                      if(value !== this.state.newPwd){
                        this.setState({loading: false});
                        callback("两次输入不一致")
                      }
                      let str = /^[0-9a-zA-z-_]*$/;
                      if(!str.test(value)||value.length >20){
                        callback("不超过20个字符，只能包含字母数字下划线")
                      }
                    }
                    callback();
                  }
                }
              ],
            })(
              <Input type="password"/>
            )}
          </FormItem>
        </Form>
        <div className="change-password-save">
          <Button type="primary" onClick={this.handleSubmit} loading={loading}>{formatMessage({id:"common.save"})}</Button>
          {/*<Button className="btn-cancel" onClick={this.onCancel}>{formatMessage({id:"common.cancel"})}</Button>*/}
        </div>
      </div>)
  }
}
ChangePassword.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
  return {
    user: state.login.user,
  }
}
const WrappedChangePassword = Form.create()(ChangePassword);

export default connect(mapStateToProps)(injectIntl(WrappedChangePassword));
