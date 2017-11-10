/**
 * created by jsq on 2017/10/18
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

import { Form, Input, InputNumber, Radio , Switch, Button, Icon, Checkbox, message, DatePicker, Select, Row, Col } from 'antd'

import httpFetch from 'share/httpFetch';
import config from 'config'

import "styles/setting/callback-setting/create-api-callback-setting.scss"

const FormItem = Form.Item;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class CreateApiCallbackSetting extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      loading: false,
      callbackUrlHelp: "",
      callbackUrlStatus: "",
      apiId:0,
      api: {
        isEnabled: true
      },
    }
  }

  componentWillMount(){
    //点击回调设置的弹出新建的页面
    console.log(this.props)
    console.log(this.state.api)
    let api={
      isEnabled: true,
      apiId : this.props.params.id,
      companyOid: this.props.company.companyOID,
      callbackDatatype: "JSON",
      flag: true,
      apiCode: this.props.params.apiCode,
      apiVersion: this.props.params.apiVersion,
      callbackType: "ASY"
    };

    this.setState({
      apiId: this.props.params.id,
      api
    })
  }

  componentWillReceiveProps(nextprops){
    console.log(nextprops.params)
    //api详情
    if(nextprops.params.apiId){
      let api = nextprops.params;
      console.log(api)
      let f1 = new RegExp("Https://").test(nextprops.params.callbackUrl);
      let f2 = new RegExp("Http://").test(nextprops.params.callbackUrl);
      let contentValue = "";
      if(f1){
        contentValue=api.callbackUrl.substr(8)
      }else {
        if(f2)
          contentValue = api.callbackUrl.substr(7)
        else
          contentValue = api.callbackUrl
      }
      let selectAfterArray = [".com",".jp",".cn",".org"];
      let selectAfter="";
      selectAfterArray.map((item)=>{
        if(new RegExp(item).test(nextprops.params.callbackUrl)){
          selectAfter = item
        }
      });
      let callbackUrl  = {
        selectBefore: f1 ? "Https://" : f2 ? "Http://" : "",
        contentValue: contentValue,
        selectAfter: selectAfter
      };
      api.callbackUrl = callbackUrl;
      api.flag = true;
      api.apiCodeArray = [];
      this.setState({
        api: api,
      })
    }else {
      console.log(this.state.api)

     // let API = this.state.api;
      let api = this.props.params;
      api.isEnabled = true;
      //api.apiId = API.apiId;
      api.companyOid = this.props.company.companyOID;
      api.callbackDatatype = "JSON";
      api.flag = false;
      api.callbackType="ASY";
      let apiCodeArray = [];
      let array = [];
      httpFetch.get(`${config.baseUrl}/push/api/customizedApi?page=1&size=50`).then((response)=>{
        array = response.data;
      });
      httpFetch.get(`${config.baseUrl}/push/api/customizedApiCallback?companyOid=${this.props.company.companyOID}&page=1&size=50`).then((response)=>{
        console.log(response)
        let flag = true;
        array.map((item)=>{
          response.data.map((i)=>{
            if(item.id === i.apiId ){
              flag = false;
            }
          });
          if(flag){
            apiCodeArray.push(<Option label={item.id} key={item.id} title={item.apiVersion}  value={item.apiCode}>{item.apiDesc}</Option>)
          }
        });
      });
      console.log(apiCodeArray)
      api.apiCodeArray = apiCodeArray;
      this.setState({
        api: this.props.params
      })
    }
  }

  handleSubmit = (e)=>{
    e.preventDefault();
    this.setState({
      loading: true
    });
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log(values)
        console.log(this.state.api)
        values.callbackDatatype = this.state.api.callbackDatatype;
        values.apiId = typeof this.state.api.apiId === 'undefined' ? this.state.apiId : this.state.api.apiId ;
        values.companyOid = this.state.api.companyOid;
        console.log(this.state.api.apiDetailId)
        this.state.api.apiDetailId ?
          this.handleUpdate(values)
          :
          this.handleCreate(values)
      }
    });
  };

  //新建api回调设置
  handleCreate = (values)=>{
    console.log(values)
    httpFetch.post(`${config.baseUrl}/push/api/customizedApiCallback`,values).then((response)=>{
      if(response.status === 200){
        console.log(response);
        this.props.close(true);
        this.props.form.resetFields();
        this.setState({loading: false})
      }
    }).catch((e)=>{
      if(e.response){
        message.error(`保存失败, ${e.response.data.message}`);
        this.setState({loading: false});
      }
      else {
        console.log(e)
      }
    })
  };

  //修改api回调设置
  handleUpdate = (value)=>{
    value.id = this.state.api.id;
    httpFetch.put(`${config.baseUrl}/push/api/customizedApiCallback`,value).then((response)=>{
      if(response.status === 200){
        console.log(response)
        message.success("修改成功！")
        this.props.close(true);
        this.props.form.resetFields();
        this.setState({loading: false})
      }
    }).catch((e)=>{
      if(e.response){
        message.error(`修改失败, ${e.response.data.message}`);
        this.setState({loading: false});
      }
      else {
        console.log(e)
      }
    })

  };

  onCancel = () =>{
    this.props.form.resetFields();
    this.setState({
      callbackUrlHelp: "",
      callbackUrlStatus: "",
      api:{},
      loading: false
    });
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

    let api = this.state.api;
    api.companyOid = this.props.company.companyOid;
    api.isEnabled = this.props.form.getFieldValue("isEnabled");

    console.log(api)
    return string;
  };

  //校验地址是否可用
  handleValidateUrl = (e)=>{
    let api = this.state.api;
    api.callbackUrl.contentValue = e.target.value;
    let url = api.callbackUrl.selectBefore + api.callbackUrl.contentValue +api.callbackUrl.selectAfter;
    console.log(url);
    let value = {
      callbackDatatype: this.state.api.callbackDatatype,
      callbackUrl: url,
      companyOid: this.state.api.companyOid,
      encodingAeskey: this.props.form.getFieldValue("encodingAeskey")
    };
    console.log(value)
    httpFetch.post(`${config.baseUrl}/push/api/customizedApiCallback/validateCallbackUrl`,value).then((response)=>{
      if(response.status === 200){
        console.log(response.data)
        if(response.data.code==="ERROR"){
          this.setState({
            callbackUrlHelp: "校验失败！",
            callbackUrlStatus: "error"
          })
        }
      }
    }).catch((e)=>{
      if(e.response){
        message.error(`校验失败, ${e.response.data.validationErrors[0].message}`);
        this.setState({loading: false});
      }
      else {
        console.log(e)
      }
    })
  };

  //处理回调地址前缀
  handleSelectBefore = (value)=>{
    let api = this.state.api;
    api.callbackUrl.selectBefore = value;
    this.setState({api})
  };

  //处理回调地址后缀
  handleSelectAfter = (value)=>{
    let api = this.state.api;
    api.callbackUrl.selectAfter = value;
    this.setState({api})
  };

  //手动输入字符串
  handleInputString = (e)=>{
    console.log(e.target.value)
    let value = e.target.value;
    if(value.length!==22) {
      message.warning("encodingAeskey需要22位")
    }
  };

  handleSelectApiCode = (value,option)=>{
    this.props.form.setFieldsValue({"apiVersion": option.props.title});
    console.log(this.state.api)
    let api = this.state.api;
    api.apiId = parseInt(option.props.label);

    api.companyOid = this.props.company.companyOID;
    this.setState({
      api: api,
      apiId: parseInt(option.props.label)
    });
  };

  render(){
    const { getFieldDecorator } = this.props.form;
    const { loading, api, callbackUrlStatus, callbackUrlHelp } = this.state;
    const { formatMessage } = this.props.intl;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14, offset:0 },
    };

    let callbackUrl ={
      selectBefore: typeof api.callbackUrl === 'undefined'? "Http://" : api.callbackUrl.selectBefore,
      selectAfter: typeof api.callbackUrl === 'undefined'? "":api.callbackUrl.selectAfter,
      contentValue: typeof api.callbackUrl === 'undefined'? "":api.callbackUrl.contentValue,
    };
    const selectBefore = (
      <Select onSelect={this.handleSelectBefore} defaultValue={callbackUrl.selectBefore} style={{ width: 75 }}>
        <Option value="Http://">Http://</Option>
        <Option value="Https://">Https://</Option>
      </Select>
    );

    const selectAfter = (
      <Select onSelect={this.handleSelectAfter} defaultValue={callbackUrl.selectAfter} style={{ width: 60 }}>
        <Option value=".com">.com</Option>
        <Option value=".jp">.jp</Option>
        <Option value=".cn">.cn</Option>
        <Option value=".org">.org</Option>
        <Option value=""></Option>
      </Select>
    );
    console.log(api.apiCodeArray)

    let apiCodeArray = typeof api.apiCodeArray === 'undefined' ? [] : api.apiCodeArray;


    return(
      <div className="new-budget-control-rules-detail">
        <Form onSubmit={this.handleSubmit}>
          <Row gutter={30}>
            <Col span={15} className="form-item-1">
              <FormItem {...formItemLayout}
                label={formatMessage({id:"common.column.status"})+" :"}>
                {getFieldDecorator('isEnabled',{
                  initialValue: api.isEnabled,
                  valuePropName: 'checked'
                })(
                  <Switch checkedChildren={<Icon type="check"/>} unCheckedChildren={<Icon type="cross" />}
                          onChange={(value)=>{
                            console.log(value)
                            api.isEnabled = value
                            this.setState({api})
                          }}
                  />
                )}
              </FormItem>
            </Col>
            <Col span={4}>
              <span className="enabled-type">{api.isEnabled ? "启用" : "禁用"}</span>
            </Col>
          </Row>
          <FormItem {...formItemLayout} label="API_CODE">
            {getFieldDecorator('apiCode', {
              rules: [{
                required: true,
                message: formatMessage({id:"common.please.enter"})
              },
              ],
              initialValue: api.apiCode
            })(
              <Select onSelect={this.handleSelectApiCode} disabled={api.flag} placeholder={formatMessage({id:"common.please.select"})} >
                {apiCodeArray}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="API版本">
            {getFieldDecorator('apiVersion', {
              rules: [{
                required: true,
                message: formatMessage({id:"common.please.enter"})
              }],
              initialValue: api.apiVersion
            })(
              <Input disabled />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="数据格式">
            {getFieldDecorator('callbackDatatype', {
            })(
              <div className="form-item-callbackDatatype">
                <div className="callbackDatatype-context">
                  {api.callbackDatatype}
                </div>
              </div>
            )}
          </FormItem>
          <Row gutter={30}>
            <Col span={24}>
              <FormItem {...formItemLayout} label="encodingAeskey" >
                {getFieldDecorator('encodingAeskey', {
                  initialValue: api.encodingAeskey
                })(
                  <Input onBlur={this.handleInputString} className="call-back-setting-input" placeholder={formatMessage({id:"common.please.enter"})} />
                )}
              </FormItem>
            </Col>
            <Col>
              <Button onClick={this.handleRandomString} className="call-back-setting-btn">自动生成</Button>
            </Col>
          </Row>
          <FormItem {...formItemLayout} label="encodingToken" >
            {getFieldDecorator('encodingToken', {
              initialValue: api.encodingToken
            })(
              <Input placeholder={formatMessage({id:"common.please.enter"})} /> /*请输入*/
            )}
          </FormItem>
          <FormItem {...{labelCol: { span: 6 }, wrapperCol: { span: 17, offset:0 },}} label="回调地址"
            help={callbackUrlHelp}
            validateStatus={callbackUrlStatus}>
            {getFieldDecorator('callbackUrl', {
              rules: [
                {
                  required: true,
                  message: formatMessage({id:"common.please.enter"})
                },
              ],
              initialValue: callbackUrl.contentValue
            })(
              <Input onBlur={this.handleValidateUrl} addonBefore={selectBefore} addonAfter={selectAfter} defaultValue="mysite" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="回调类型" >
            {getFieldDecorator('callbackType', {
              initialValue: api.callbackType
            })(
              <RadioGroup defaultValue="ASY" size="large">
                <RadioButton value="SYNC">同步</RadioButton>
                <RadioButton value="ASY">异步</RadioButton>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="系统名称" >
            {getFieldDecorator('sysName', {
              initialValue: api.sysName
            })(
              <Input placeholder={formatMessage({id:"common.please.enter"})} /> /*请输入*/
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="管理员名称" >
            {getFieldDecorator('sysAdmin', {
              initialValue: api.sysAdmin
            })(
              <Input placeholder={formatMessage({id:"common.please.enter"})} /> /*请输入*/
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="管理员电话" >
            {getFieldDecorator('sysAdminTel', {
              initialValue: api.sysAdminTel
            })(
              <Input placeholder={formatMessage({id:"common.please.enter"})} /> /*请输入*/
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="链接超时时间" >
            {getFieldDecorator('connectTimeout', {
              initialValue: typeof api.connectTimeout === 'undefined' ? 0 : api.connectTimeout
            })(
              <InputNumber
                min={0}
                formatter={value => `${value}ms`}
                parser={value => value.replace('ms', '')}
                placeholder={formatMessage({id:"common.please.enter"})} /> /*请输入*/
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="链接获取超时时间" >
            {getFieldDecorator('connectionRequestTimeout', {
              initialValue: typeof api.connectionRequestTimeout === 'undefined'? 0 :api.connectionRequestTimeout
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
    organization: state.budget.organization,
    company: state.login.company
  }
}

const WrappedCreateApiCallbackSetting = Form.create()(CreateApiCallbackSetting);
export default connect(mapStateToProps)(injectIntl(WrappedCreateApiCallbackSetting));



/*
"id": 1,
  "apiID": 1,
  //"api_code":"api_code",
  //"api_version":"api_version",
  "callbackUrl": "",
  "callbackDatatype": "",
  "sysName": "",
  "sysAdmin": "",
  "sysAdminTel": "",
  "connectTimeout": 0,
  "connectionRequestTimeout": 0,
  "sysinfo_hide": false
  */
