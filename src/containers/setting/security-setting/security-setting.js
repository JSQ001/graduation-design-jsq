/**
 * created by jsq on 2017/10/16
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

import { Button, Form, InputNumber, Checkbox, Row, Col} from 'antd'

import SearchArea from 'components/search-area.js';
import httpFetch from 'share/httpFetch';
import config from 'config'
import menuRoute from 'share/menuRoute'

import 'styles/setting/security-setting/security-setting.scss'

const FormItem = Form.Item;


class SecuritySetting extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      enterpriseKey: false
    };
  }

  handleEnterpriseKey = (flag)=>{
    this.setState({
      enterpriseKey: flag,
    })
  };

  renderEnterpriseKey(){
    return (
      this.state.enterpriseKey ?
        <span className="security-setting-display">
          fafadsfa<Button onClick={()=>this.handleEnterpriseKey(false)}>点击隐藏</Button>
        </span>
        :
        <span className="security-setting-hide">
          <Button onClick={()=>this.handleEnterpriseKey(true)}>查看</Button>
        </span>
    )
  }

  handleSubmit = (e)=>{
    e.preventDefault();
    let value = this.props.form.getFieldsValue();
    console.log(value)
  };

  render(){
    const { getFieldDecorator } = this.props.form;
    const { formatMessage } = this.props.intl;
    const { enterpriseKey} = this.state;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20, offset: 1 },
    };

    return(
      <div className="security-setting">
        <div className="security-setting-companyID">
          企业ID: 1231231231232
        </div>
        <div className="security-setting-companyKey">
          企业密钥：{this.renderEnterpriseKey()}
        </div>
        <hr className="security-setting-slid"/>
       {/* <div className="security-setting-slid"/>*/}
        <Form onSubmit={this.handleSubmit}>
          <div className="security-setting-basicRule">基础规则</div>
            <FormItem {...formItemLayout} label="密码长度为" className="security-setting-formItem-1">
              {getFieldDecorator('passwordLengthMin')(
                <div>
                <InputNumber max={20} placeholder={this.props.intl.formatMessage({id:"common.please.enter"})}/> 到20位
                </div>
                )
              }
            </FormItem>
            <FormItem {...{labelCol:{span:3},wrapperCol: { span: 10, offset: 1 }}} label="密码中必须包含" className="security-setting-formItem-2">
              {getFieldDecorator('passwordLength')(
                <div>
                  <Checkbox />小写字母 &nbsp;&nbsp;&nbsp;&nbsp;<Checkbox  />大写字母&nbsp;&nbsp;&nbsp;&nbsp; <Checkbox defaultChecked disabled /> 数字&nbsp;&nbsp;&nbsp;&nbsp; <Checkbox  /> 特殊字符
                </div>
              )
              }
            </FormItem>
            <FormItem {...formItemLayout} label="密码有效期" className="security-setting-formItem-1">
              {getFieldDecorator('passwordLength')(
                <div>
                  <InputNumber max={1095}  placeholder={this.props.intl.formatMessage({id:"common.please.enter"})}/> 天 (最多1095天，0表示永不过期，过期后不可以登录)

                </div>
              )
              }
            </FormItem>

            <FormItem {...{labelCol:{span:4},wrapperCol: { span: 40, offset:3 }}} label="历史密码检查" className="security-setting-formItem-4">
              {getFieldDecorator('passwordRepeatTimes')(
                <div>
                  禁止使用前&nbsp; <InputNumber max={24} placeholder={this.props.intl.formatMessage({id:"common.please.enter"})}/>次密码 (最大24，0表示不启用历史密码检查策略)
                </div>
              )
              }
            </FormItem>

          <hr className="security-setting-slid"/>
          <div className="security-setting-basicRule">其它规则</div>
          <FormItem {...{labelCol:{span:3},wrapperCol: { span: 10, offset: 1 }}} label="账号失效时间" className="security-setting-formItem-5">
            {getFieldDecorator('dimissionDelayDays')(
              <div>
                员工离职&nbsp; <InputNumber max={180} placeholder={this.props.intl.formatMessage({id:"common.please.enter"})}/>天后账号失效，将不能进行登录操作（最大180）
              </div>
            )
            }
          </FormItem>
          <FormItem {...{labelCol:{span:3},wrapperCol: { span: 20, offset: 1 }}} label="密码中必须包含" className="security-setting-formItem-2">
            {getFieldDecorator('passwordLength')(
              <div>
                <Checkbox defaultChecked disabled /> 邮箱（邮箱将用于含附件消息如报销单电子件的推送）
                <Checkbox />手机（海外手机不支持短消息推送）
              </div>
            )
            }
          </FormItem>
          <FormItem {...{labelCol:{span:4},wrapperCol: { span: 20, offset: 1 }}} label="员工和组织架构信息创建" className="security-setting-formItem-6">
            {getFieldDecorator('passwordLength')(
              <div>
                <div>为确保信息的准确性，信息的同步方式只能选择一种，切换后会覆盖相同账号的信息</div>
                <Checkbox  /> 手动创建（员工信息支持excel批量导入）
                <Checkbox />接口同步
              </div>
            )
            }
          </FormItem>
          <FormItem wrapperCol={{ offset: 7 }}>
            <Row gutter={1}>
              <Col span={3}><Button type="primary" htmlType="submit" loading={this.state.loading}>{formatMessage({id: 'common.save'})/* 保存 */}</Button></Col>
              <Col span={3}><Button>{formatMessage({id: 'common.cancel'})/* 取消 */}</Button></Col>
            </Row>
          </FormItem>
        </Form>
      </div>
    )
  }
}

SecuritySetting.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps() {
  return {}
}
const WrappedSecuritySetting = Form.create()(SecuritySetting);

export default connect(mapStateToProps)(injectIntl(WrappedSecuritySetting));
