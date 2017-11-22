/**
 * created by jsq on 2017/10/18
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

import { Form, Input, InputNumber, Row, Col, Button, Alert, message, DatePicker, Select } from 'antd'

import httpFetch from 'share/httpFetch';
import config from 'config'
import menuRoute from 'share/menuRoute'
import ListSelector from 'components/list-selector.js'

import "styles/setting/callback-setting/update-callback-setting.scss"


const FormItem = Form.Item;
const Option = Select.Option;

class UpdateCallbackSetting extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      loading: false,
      globalSetting: {},
      showParamsType: false,
      listSelectedData: []
    }
  }

  componentWillMount(){

  }

  componentWillReceiveProps(nextprops){
    console.log(nextprops.params)
    this.setState({
      globalSetting: nextprops.params,
    })
  }
  handleFocus = () => {
    this.refs.blur.focus();
    this.showList(true)
  };

  showList = (flag) => {
    let listSelectedData = [];
    let values = this.props.form.getFieldValue("itemTypeName");
    if (values && values.length > 0) {
      values.map(value => {
        listSelectedData.push(value.value)
      });
    }
    this.setState({
      showItemType: flag,
      listSelectedData
    })
  };

  handleListOk = (result) => {
    console.log(result)
    let values = [];
    result.result.map(item => {
      values.push({
        key: item.id,
        label: item.itemTypeName,
        value: item,
      })
    });
    let value = {};
    value["itemTypeName"] = values;
    this.props.form.setFieldsValue(value);
    this.showList(false)
  };


  handleSubmit = (e)=>{
    e.preventDefault();
    this.setState({
      loading: true
    });
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.callbackDatatype = this.state.globalSetting.callbackDatatype;
        values.companyOid = this.state.globalSetting.companyOid;
        values.id = this.state.globalSetting.id;
        console.log(values)
        httpFetch.put(`${config.baseUrl}/push/api/customizedApiCallback/company`,values).then((response)=>{
          if(response.status === 200){
            message.success(`修改成功!`);
            this.props.form.resetFields();
            this.props.close(true);
          }
        }).catch((e)=>{
          if(e.response){
            message.error(`修改失败, ${e.response.data.validationErrors[0].message}`);
          }
          this.setState({loading: false});
        });
      }
    });
  };

  handleSave = (values) =>{
    this.setState({loading: true});
    values.controlRuleId = this.props.params.controlRuleId;
    httpFetch.post(`${config.budgetUrl}/api/budget/control/rule/details`, values).then((res)=>{
      console.log(res);
      this.setState({loading: false});
      if(res.status == 200){
        this.props.close(true);
        message.success('操作成功');
        this.props.form.resetFields();
      }
    }).catch((e)=>{
      if(e.response){
        message.error(`新建失败, ${e.response.data.validationErrors[0].message}`);
      }
      this.setState({loading: false});
    })
  };

  handleUpdate = (values) =>{
    values.controlRuleId = this.state.ruleDetail.controlRuleId;
    //values.id = this.state.ruleDetail.id;
    values.versionNumber = this.state.ruleDetail.versionNumber;
    httpFetch.put(`${config.budgetUrl}/api/budget/control/rule/details`, values).then((res)=> {
      console.log(res);
      if(res.status === 200){
        message.success('操作成功');
        this.props.form.resetFields();
        this.props.close(true);
      }
    }).catch((e)=>{
      if(e.response){
        message.error(`修改失败, ${e.response.data.validationErrors[0].message}`);
      }
      this.setState({loading: false});
    })
  };

  onCancel = () =>{
    this.props.form.resetFields();
    this.props.close();
  };

  //获取22位随机字符串
  handleRandomString = ()=>{
    let charsArray = '1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';
    let maxPos = charsArray.length;
    let string = '';
    for (let i = 0; i < 22; i++) {
      string += charsArray.charAt(Math.floor(Math.random() * maxPos));
    }
    this.props.form.setFieldsValue({"encodingAeskey":string})
    return string;
  };

  //手动输入字符串
  handleInputString = (e)=>{
    console.log(e.target.value)
    let value = e.target.value;
    if(value.length!==22) {
      message.warning("encodingAeskey需要22位")
    }
  };

  render(){
    const { getFieldDecorator } = this.props.form;
    const { loading, globalSetting } = this.state;
    const { formatMessage } = this.props.intl;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 13, offset: 1 },
    };
    return(
      <div className="update-callback-setting">
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label="数据格式">
            {getFieldDecorator('callbackDatatype', {
            })(
              <div className="form-item-1">{globalSetting.callbackDatatype}</div>
            )}
          </FormItem>
          <Row gutter={30}>
            <Col span={24}>
              <FormItem {...formItemLayout} label="encodingAeskey" >
                {getFieldDecorator('encodingAeskey', {
                  initialValue: globalSetting.encodingAeskey
                })(
                  <Input onBlur={this.handleInputString} className="call-back-setting-input" placeholder={formatMessage({id:"common.please.enter"})} />
                )}
              </FormItem>
            </Col>
            <Col>
              <Button onClick={this.handleRandomString} className="call-back-setting-btn">自动生成</Button>
            </Col>
          </Row>
          <Row gutter={30}>
            <Col span={24}>
              <FormItem {...formItemLayout} label="encodingToken" >
                {getFieldDecorator('encodingToken', {
                  initialValue: globalSetting.encodingToken
                })(
                  <Input className="call-back-setting-input1" placeholder={formatMessage({id:"common.please.enter"})} /> /*请输入*/
                )}
              </FormItem>
            </Col>
          </Row>
            <FormItem {...formItemLayout} label="系统名称" >
            {getFieldDecorator('sysName', {
              initialValue: globalSetting.sysName
            })(
              <Input placeholder={formatMessage({id:"common.please.enter"})} /> /*请输入*/
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="管理员名称" >
            {getFieldDecorator('sysAdmin', {
              initialValue: globalSetting.sysAdmin
            })(
              <Input placeholder={formatMessage({id:"common.please.enter"})} /> /*请输入*/
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="管理员电话" >
            {getFieldDecorator('sysAdminTel', {
              initialValue: globalSetting.sysAdminTel
            })(
              <Input placeholder={formatMessage({id:"common.please.enter"})} /> /*请输入*/
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="获取超链接时间" >
            {getFieldDecorator('connectionRequestTimeout', {
              initialValue: globalSetting.connectionRequestTimeout
            })(
              <InputNumber
                min={0}
                formatter={value => `${value}ms`}
                parser={value => value.replace('ms', '')}
                placeholder={formatMessage({id:"common.please.enter"})} /> /*请输入*/
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="获取超时时间" >
            {getFieldDecorator('connectTimeout', {
              initialValue: globalSetting.connectTimeout
            })(
              <InputNumber
                min={0}
                formatter={value => `${value}ms`}
                parser={value => value.replace('ms', '')}
                placeholder={formatMessage({id:"common.please.enter"})} /> /*请输入*/
            )}
          </FormItem>
          <div className="slide-footer">
            <Button type="primary" htmlType="submit" loading={loading}>保存</Button>
            <Button onClick={this.onCancel}>取消</Button>
            <input ref="blur" style={{ position: 'absolute', top: '-100vh' }}/> {/* 隐藏的input标签，用来取消list控件的focus事件  */}
          </div>
        </Form>
      </div>
    )
  }
}
function mapStateToProps(state) {
  return {
    organization: state.budget.organization
  }
}

const WrappedUpdateCallbackSetting = Form.create()(UpdateCallbackSetting);
export default connect(mapStateToProps)(injectIntl(WrappedUpdateCallbackSetting));
