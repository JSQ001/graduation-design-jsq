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
    this.state = {
      loading: false,
      flag: true,
      enterpriseKey: false,
      selectedNoticeType: 0,
      createDataType: 1,
      securitySetting: {},
      passwordRule: [
        { label: '小写字母', value: 'lowercase' },
        { label: '大写字母', value: 'uppercase' },
        { label: '数字', value: 'digital', disabled: true },
        { label: '特殊字符', value: 'specialCharacters' },
      ],
      noticeType: [
        { label: '邮箱（邮箱将用于含附件消息如报销单电子件的推送）', value: '1001', disabled: true},
        { label: '手机（海外手机不支持短消息推送）', value: '1002'},
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
          fafadsfa<Button onClick={()=>this.handleEnterpriseKey(false)}>点击隐藏</Button>
        </span>
        :
        <span className="security-setting-hide">
          <Button onClick={()=>this.handleEnterpriseKey(true)}>查看</Button>
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

    console.log(value);


    httpFetch.put(`${config.baseUrl}/api/refactor/companies`,value).then((response)=>{
      if(response.status === 200){
        console.log(response)
        message.success("修改成功！");
        this.setState({
          loading: false
        },this.getList())
      }
    }).catch((e)=>{
        if(e.response){
          message.error(`保存失败, ${e.response.data.validationErrors[0].message}`);
          this.setState({loading: false});
        }else {
          console.log(e)
    }})
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
            企业ID： 1231231231232
          </div>
        <div className="security-setting-company">
          企业密钥：{this.renderEnterpriseKey()}
        </div>
        <hr className="security-setting-slid"/>
        <Form onSubmit={this.handleSubmit}>
          <div className="security-setting-Rule">基础规则</div>
            <FormItem {...formItemLayout} >
              {getFieldDecorator('passwordLengthMin')(
                <div className="security-setting-formItem">
                  <span className="formItem-label">密码长度：</span>
                  <InputNumber className="formItem-value" defaultValue={securitySetting.passwordLengthMin} min={6} max={20} placeholder={this.props.intl.formatMessage({id:"common.please.enter"})}/> 到20位
                </div>
                )
              }
            </FormItem>
            <FormItem {...formItemLayout}>
              {getFieldDecorator('passwordRule')(
                <div className="security-setting-formItem">
                  <span className="formItem-label-2">密码中必须包含：</span>
                  <CheckboxGroup onChange={this.handlePasswordRule} defaultValue={securitySetting.selectedPasswordRule} options={passwordRule} className="formItem-value-2"  />
                </div>
              )}
            </FormItem>
            <FormItem {...formItemLayout}>
              {getFieldDecorator('passwordExpireDays')(
                <div className="security-setting-formItem">
                  <span className="formItem-label">密码有效期：</span>
                  <InputNumber className="formItem-value" defaultValue={securitySetting.passwordExpireDays} min={0}  max={1095}  placeholder={this.props.intl.formatMessage({id:"common.please.enter"})}/><span> 天（最多1095天，0表示永不过期，过期后不可以登录）</span>
                </div>
              )
              }
            </FormItem>
            <FormItem {...formItemLayout}>
              {getFieldDecorator('passwordRepeatTimes')(
                <div className="security-setting-formItem">
                  <span className="formItem-label">历史密码检查：</span>
                  <span className="formItem-value">禁止使用前&nbsp;&nbsp;<InputNumber defaultValue={securitySetting.passwordRepeatTimes} min={0} max={24} placeholder={this.props.intl.formatMessage({id:"common.please.enter"})}/>次密码 （最大24，0表示不启用历史密码检查策略</span>
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
                <span className="formItem-value">员工离职&nbsp; <InputNumber defaultValue={securitySetting.dimissionDelayDays} min={1} max={180} placeholder={this.props.intl.formatMessage({id:"common.please.enter"})}/>天后账号失效，将不能进行登录操作（最大180）</span>
              </div>
            )}
          </FormItem>
            <FormItem {...formItemLayout}>
            {getFieldDecorator('noticeType')(
              <div className="security-setting-formItem">
                <span className="formItem-label-info">信息通知渠道：</span>
                <span className="formItem-value-info">
                  <CheckboxGroup options={noticeType} onChange={this.handleNoticeType} defaultValue={securitySetting.noticeType}/>
                </span>
              </div>
            )}
          </FormItem>
            <FormItem {...formItemLayout}>
            {getFieldDecorator('createDataType')(
              <div className="security-setting-formItem">
                <span className="formItem-label-group">员工和组织架构信息创建：</span>
                <div className="formItem-value-group-tips">为确保信息的准确性，信息的同步方式只能选择一种，切换后会覆盖相同账号的信息</div><br/>
                <RadioGroup onChange={this.handleDataType} defaultValue={securitySetting.createDataType} className="formItem-value-group">
                  <Radio style={radioStyle} value={1001}>手动创建（员工信息支持excel批量导入）</Radio>
                  <Radio style={radioStyle} value={1002}>接口同步</Radio>
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
