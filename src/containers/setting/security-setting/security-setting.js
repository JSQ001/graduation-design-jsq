/**
 * created by jsq on 2017/10/16
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

import { Button, Form, InputNumber, Checkbox, Radio, Row, Col, message} from 'antd'

import SearchArea from 'components/search-area.js';
import httpFetch from 'share/httpFetch';
import config from 'config'
import menuRoute from 'share/menuRoute'
import debounce from 'lodash.debounce';

import 'styles/setting/security-setting/security-setting.scss'

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;


class SecuritySetting extends React.Component{
  constructor(props){
    super(props);
    const {formatMessage} = this.props.intl;
    this.state = {
      loading: false,
      flag: true,
      enterpriseKey: false,
      selectedNoticeType: 0,
      createDataType: 1,
      securitySetting: {},
      passwordRule: [              //小写字母
        { label: formatMessage({id: "security.lowerCase"}), value: 'lowercase' },
        //大写字母
        { label: formatMessage({id: 'security.upperCase'}), value: 'uppercase' },
        //数字
        { label: formatMessage({id: 'security.digital'}), value: 'digital', disabled: true },
        //特殊字符
        { label: formatMessage({id: 'security.specialCharacters'}), value: 'specialCharacters' },
      ],
      noticeType: [                //邮箱（邮箱将用于含附件消息如报销单电子件的推送）
        { label: formatMessage({id:"security.mail.tips"}), value: '1001', disabled: true},
                                    //手机（海外手机不支持短消息推送）
        { label: formatMessage({id:"security.phone.tips"}), value: '1002'},
      ]
    };
    this.handlePasswordRule = debounce(this.handlePasswordRule,1000)
  }

  componentWillMount(){
    this.getList();
  }

  //获取安全设置数据
  getList(){
    httpFetch.get(`${config.baseUrl}/api/refactor/companies/${this.props.company.companyOID}`).then((response)=>{
      if(response.status === 200) {
        console.log(response.data);
        let selectedPasswordRule =[];
        let array = response.data.passwordRule.split("");
        for(let i = 0; i< array.length; i++){
          if(array[i]==="1"){
            selectedPasswordRule.push(this.state.passwordRule[i].value)
          }
        }
        let noticeType = ["1001"];
        if(response.data.noticeType===1003)
          noticeType.push("1002");
        let securitySetting = {
          passwordLengthMin: response.data.passwordLengthMin,
          passwordRule: response.data.passwordRule,
          selectedPasswordRule: selectedPasswordRule,
          passwordExpireDays: response.data.passwordExpireDays,
          passwordRepeatTimes: response.data.passwordRepeatTimes,
          dimissionDelayDays: response.data.dimissionDelayDays,
          noticeType: noticeType,
          defaultNoticeType: response.data.noticeType,
          createDataType: response.data.createDataType,
          companyOID: response.data.companyOID,
          name: response.data.name,
          taxId: response.data.taxId,
        };
        this.setState({
          flag: false,
          securitySetting
        })
      }
    })
  }

  //处理选择密码规则
  handlePasswordRule = (checkedValue)=>{
    console.log(checkedValue);
    let passwordRule = "";
    this.state.passwordRule.map((item)=>{
      if(this.isInArray(checkedValue,item.value)){
        passwordRule+="1"
      }else {
        passwordRule+="0"
      }
    });
    let securitySetting = this.state.securitySetting;
    securitySetting.passwordRule = passwordRule;
    this.setState({
      securitySetting
    })
  };

  //处理选择通知类型
  handleNoticeType = (checkedValue)=>{
    let flag = this.isInArray(checkedValue,1002);
    let securitySetting = this.state.securitySetting;

    securitySetting.defaultNoticeType = flag ? 1003 : 1001;
    securitySetting.noticeType = checkedValue;
    this.setState({
      securitySetting
    })
  };

  //处理创建类型
  handleDataType = (e) =>{
    let securitySetting = this.state.securitySetting;
    securitySetting.createDataType = e.target.value;
    this.setState({
      securitySetting
    })
  };

  //判断某个元素是否在数组中
  isInArray(arr,val){
    let testStr=','+arr.join(",")+",";
    return testStr.indexOf(","+val+",")!=-1;
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
          K2QzPPz3fqQNEnsbwupD1b1IDPPg0RfkdWalXysL7wd<Button onClick={()=>this.handleEnterpriseKey(false)}>{this.props.intl.formatMessage({id:"security.hides"})}</Button>
        </span>
        :
        <span className="security-setting-hide">
          <Button onClick={()=>this.handleEnterpriseKey(true)}>{this.props.intl.formatMessage({id: "security.view"})}</Button>
        </span>
    )
  }

  handleSubmit = (e)=>{
    const {securitySetting} = this.state;
    e.preventDefault();
    this.setState({
      loading:true
    });
    console.log(parseInt(this.props.form.getFieldValue("passwordLengthMin")))
    let value = {
      passwordLengthMin:typeof this.props.form.getFieldValue("passwordLengthMin") ==="undefined" ? securitySetting.passwordLengthMin : parseInt(this.props.form.getFieldValue("passwordLengthMin")),
      passwordLengthMax:20,
      passwordRule:typeof this.props.form.getFieldValue("passwordRule")=== "undefined" ? this.state.securitySetting.passwordRule : this.props.form.getFieldValue("passwordRule"),
      passwordExpireDays:typeof this.props.form.getFieldValue("passwordExpireDays")==="undefined" ? this.state.securitySetting.passwordExpireDays : this.props.form.getFieldValue("passwordExpireDays"),
      passwordRepeatTimes:typeof this.props.form.getFieldValue("passwordRepeatTimes")==="undefined" ? this.state.securitySetting.passwordRepeatTimes : this.props.form.getFieldValue("passwordRepeatTimes"),
      dimissionDelayDays:typeof this.props.form.getFieldValue("dimissionDelayDays")==="undefined" ? this.state.securitySetting.dimissionDelayDays : this.props.form.getFieldValue("dimissionDelayDays"),
      noticeType: this.state.securitySetting.defaultNoticeType,
      createDataType: this.state.securitySetting.createDataType,
      companyOID: this.state.securitySetting.companyOID,
      name: this.state.securitySetting.name,
      taxId: this.state.securitySetting.taxId
    };

    httpFetch.put(`${config.baseUrl}/api/refactor/companies`,value).then((response)=>{
      if(response.status === 200){
        console.log(response)
        message.success(this.props.intl({id: "common.operate.success"}));
        this.setState({
          loading: false
        },this.getList())
      }
    }).catch((e)=>{
      if(e.response){
        message.error(`${this.props.intl.formatMessage({id: "common.operate.filed"})}, ${e.response.data.validationErrors[0].message}`);
      }
      this.setState({loading: false});
    })
  };

  render(){
    const { getFieldDecorator } = this.props.form;
    const { formatMessage } = this.props.intl;
    const { loading, flag, enterpriseKey, passwordRule, noticeType, securitySetting} = this.state;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20, offset: 1 },
    };
    console.log(securitySetting.noticeType)
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };

    return(
      <div>
        { flag ? null :
          <div className="security-setting">
            <div id="3" className="security-setting-company">
              {formatMessage({id: "security.enterprise.id"})}： DING37484930239458493922-2-8472283  {/*企业id*/}
            </div>
            <div className="security-setting-company">
              {formatMessage({id:"security.enterprise.key"})}：{this.renderEnterpriseKey()}    {/*企业密钥*/}
            </div>
            <hr className="security-setting-slid"/>
            <Form onSubmit={this.handleSubmit}>
              <div className="security-setting-Rule">{formatMessage({id: "security.basic.rule"})}</div>  {/*基础规则*/}
              <FormItem {...formItemLayout}>
                {getFieldDecorator('passwordLengthMin')(
                  <div className="security-setting-formItem">
                    <span className="formItem-label">{formatMessage({id:"security.password.length"})}</span>       {/*密码长度*/}
                    <InputNumber className="formItem-value" defaultValue={securitySetting.passwordLengthMin} min={6} max={20} placeholder={this.props.intl.formatMessage({id:"common.please.enter"})}/> 到20位
                  </div>
                )}
              </FormItem>
              <FormItem {...formItemLayout}>
                {getFieldDecorator('passwordRule')(
                  <div className="security-setting-formItem">
                    <span className="formItem-label-2">{formatMessage({id: "security.password.rule"})}</span>   {/*密码中必须包含*/}
                    <CheckboxGroup onChange={this.handlePasswordRule} defaultValue={securitySetting.selectedPasswordRule} options={passwordRule} className="formItem-value-2"  />
                  </div>
                )}
              </FormItem>
              <FormItem {...formItemLayout}>
                {getFieldDecorator('passwordExpireDays')(
                  <div className="security-setting-formItem">
                    <span className="formItem-label">{formatMessage({id: "security.password.time"})}</span>        {/*密码有效期*/}
                    <InputNumber className="formItem-value" defaultValue={securitySetting.passwordExpireDays} min={0}  max={1095}  placeholder={this.props.intl.formatMessage({id:"common.please.enter"})}/><span> 天（最多1095天，0表示永不过期，过期后不可以登录）</span>
                  </div>
                )
                }
              </FormItem>
              <FormItem {...formItemLayout}>
                {getFieldDecorator('passwordRepeatTimes')(
                  <div className="security-setting-formItem">
                    <span className="formItem-label">{formatMessage({id: "security.history.password"})}</span>             {/*历史密码检查*/}
                    <span className="formItem-value">{formatMessage({id:"security.forbidden"})}&nbsp;&nbsp;<InputNumber defaultValue={securitySetting.passwordRepeatTimes} min={0} max={24} placeholder={formatMessage({id:"common.please.enter"})}/>{formatMessage({id:"security.forbidden.tips"})}</span>
                  </div>
                )
                }
              </FormItem>

              <hr className="security-setting-slid"/>
              <div className="security-setting-Rule">{formatMessage({id: "security.other.rule"})}</div>   {/*其它规则*/}
              <FormItem {...formItemLayout}>
                {getFieldDecorator('dimissionDelayDays')(
                  <div className="security-setting-formItem">
                    <span className="formItem-label">{formatMessage({id:"security.account.time"})}</span>   {/*账号失效时间*/}
                    <span className="formItem-value">{formatMessage({id:"security.departing.employees"})}&nbsp; <InputNumber defaultValue={securitySetting.dimissionDelayDays} min={1} max={180} placeholder={this.props.intl.formatMessage({id:"common.please.enter"})}/>{formatMessage({id:"security.departing.tips"})}</span>
                  </div>
                )}
              </FormItem>
              <FormItem {...formItemLayout}>
                {getFieldDecorator('noticeType')(
                  <div className="security-setting-formItem">
                    <span className="formItem-label-info">{formatMessage({id:"security.information.info"})}</span>    {/*信息通知渠道*/}
                    <span className="formItem-value-info">
                  <CheckboxGroup options={noticeType} onChange={this.handleNoticeType} defaultValue={securitySetting.noticeType}/>
                </span>
                  </div>
                )}
              </FormItem>
              <FormItem {...formItemLayout}>
                {getFieldDecorator('createDataType')(
                  <div className="security-setting-formItem">
                    <span className="formItem-label-group">{formatMessage({id:"security.create.info"})}</span>      {/*员工和组织架构信息创建*/}
                    <div className="formItem-value-group-tips">{formatMessage({id:"security.info.type"})}</div><br/>
                    <RadioGroup onChange={this.handleDataType} defaultValue={securitySetting.createDataType} className="formItem-value-group">
                      <Radio style={radioStyle} value={1001}>{formatMessage({id:"security.create.manually"})}</Radio>
                      <Radio style={radioStyle} value={1002}>{formatMessage({id:"security.interface"})}</Radio>
                    </RadioGroup>
                  </div>
                )
                }
              </FormItem>
              <FormItem wrapperCol={{ offset: 7 }}>
                <Row gutter={1}>
                  <Col span={3}><Button type="primary" htmlType="submit" loading={loading}>{formatMessage({id: 'common.save'})/* 保存 */}</Button></Col>
                  <Col span={3}><Button>{formatMessage({id: 'common.cancel'})/* 取消 */}</Button></Col>
                </Row>
              </FormItem>
            </Form>
          </div>
        }
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

function mapStateToProps(state) {
  return {
    organization: state.budget.organization,
    company: state.login.company
  }
}
const WrappedSecuritySetting = Form.create()(SecuritySetting);

export default connect(mapStateToProps)(injectIntl(WrappedSecuritySetting));
