/**
 * created by jsq on 2017/10/16
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

import { Button, Form, InputNumber, Checkbox, Radio, Row, Col} from 'antd'

import SearchArea from 'components/search-area.js';
import httpFetch from 'share/httpFetch';
import config from 'config'
import menuRoute from 'share/menuRoute'

import 'styles/setting/security-setting/security-setting.scss'

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;

let passwordRule = [
  { label: '小写字母', value: 'lowercase' },
  { label: '大写字母', value: 'uppercase' },
  { label: '数字', value: 'digital', },
  { label: '特殊字符', value: 'specialCharacters' },
];


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

    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };

    return(
      <div className="security-setting">
        <div className="security-setting-company">
          企业ID： 1231231231232
        </div>
        <div className="security-setting-company">
          企业密钥：{this.renderEnterpriseKey()}
        </div>
        <hr className="security-setting-slid"/>
        <Form onSubmit={this.handleSubmit}>
          <div className="security-setting-Rule">基础规则</div>
            <FormItem {...formItemLayout} >
              {getFieldDecorator('passwordMinLengthArr')(
                <div className="security-setting-formItem">
                  <span className="formItem-label">密码长度：</span>
                  <InputNumber className="formItem-value" min={6} max={20} placeholder={this.props.intl.formatMessage({id:"common.please.enter"})}/> 到20位
                </div>
                )
              }
            </FormItem>
            <FormItem {...formItemLayout}>
              {getFieldDecorator('passwordRule')(
                <div className="security-setting-formItem">
                  <span className="formItem-label-2">密码中必须包含：</span>
                  <CheckboxGroup  options={passwordRule} className="formItem-value-2" defaultValue={['digital']} />
                </div>
              )
              }
            </FormItem>
            <FormItem {...formItemLayout}>
              {getFieldDecorator('passwordExpireDays')(
                <div className="security-setting-formItem">
                  <span className="formItem-label">密码有效期：</span>
                  <InputNumber className="formItem-value" min={0}  max={1095}  placeholder={this.props.intl.formatMessage({id:"common.please.enter"})}/><span> 天（最多1095天，0表示永不过期，过期后不可以登录）</span>
                </div>
              )
              }
            </FormItem>

            <FormItem {...formItemLayout}>
              {getFieldDecorator('passwordRepeatTimes')(
                <div className="security-setting-formItem">
                  <span className="formItem-label">历史密码检查：</span>
                  <span className="formItem-value">禁止使用前&nbsp;&nbsp;<InputNumber min={0} max={24} placeholder={this.props.intl.formatMessage({id:"common.please.enter"})}/>次密码 （最大24，0表示不启用历史密码检查策略</span>
                </div>
              )
              }
            </FormItem>

          <hr className="security-setting-slid"/>
          <div className="security-setting-Rule">其它规则</div>
            <FormItem {...formItemLayout}>
            {getFieldDecorator('dimissionDelayDays')(
              <div className="security-setting-formItem">
                <span className="formItem-label">账号失效时间：</span>
                <span className="formItem-value">员工离职&nbsp; <InputNumber min={1} max={180} placeholder={this.props.intl.formatMessage({id:"common.please.enter"})}/>天后账号失效，将不能进行登录操作（最大180）</span>
              </div>
            )}
          </FormItem>
            <FormItem {...formItemLayout}>
            {getFieldDecorator('noticeType')(
              <div className="security-setting-formItem">
                <span className="formItem-label-info">信息通知渠道：</span>
                <span className="formItem-value-info">
                  <Checkbox defaultChecked disabled /> 邮箱（邮箱将用于含附件消息如报销单电子件的推送）<br/>
                  <Checkbox />&nbsp;&nbsp;&nbsp;手机（海外手机不支持短消息推送）
                </span>
              </div>
            )}
          </FormItem>
            <FormItem {...formItemLayout}>
            {getFieldDecorator('createDataType')(
              <div className="security-setting-formItem">
                <span className="formItem-label-group">员工和组织架构信息创建：</span>
                <div className="formItem-value-group-tips">为确保信息的准确性，信息的同步方式只能选择一种，切换后会覆盖相同账号的信息</div><br/>
                <RadioGroup className="formItem-value-group">
                  <Radio style={radioStyle} value={1}>手动创建（员工信息支持excel批量导入）</Radio>
                  <Radio style={radioStyle} value={2}>接口同步</Radio>
                </RadioGroup>
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

/*
 * noticeType：绑定类型:1001-邮箱,1002-手机,1003-手机+邮箱(目前暂时没有1002,因为邮箱是必选)
 dimissionDelayDays：延迟离职天数
 passwordExpireDays：密码有效期
 passwordRule：密码规则:小写字母，大写字母，数字，特殊字符，包含为1，不包含为0
 passwordLengthMin：密码最小长度
 passwordLengthMax：密码最大长度
 passwordRepeatTimes：禁止使用前几次密码
 createDataType：1001 手工创建和excle导入 1002 接口导入
 * */

SecuritySetting.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps() {
  return {}
}
const WrappedSecuritySetting = Form.create()(SecuritySetting);

export default connect(mapStateToProps)(injectIntl(WrappedSecuritySetting));
