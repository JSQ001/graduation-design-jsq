/**
 * Created by 13576 on 2017/11/25.
 */
import React from 'react';
import {connect} from 'react-redux';
import {injectIntl} from 'react-intl';
import {Button,Form,Switch, Input,message, Icon,Select,Radio} from 'antd';
const FormItem = Form.Item;
const Option =Select.Option;

import config from 'config';
import httpFetch from 'share/httpFetch';
import 'styles/pay/payment-method/new-payment-method.scss'

class NewPayRequisitionType extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      params: {},
      isEnabled: true,
      isPut: false,
      loading: false,
      paymentMethodCategoryOptions:[],
      setOfBooksOptions:[],
      searchFrom:[
        {id:"isEnabled"},
        {id:"paymentMethodCategory"},
        {id:"paymentMethodCode"},
        {id:"description"}
      ]
    };
  }

  componentWillMount() {
    let params = this.props.params;
    console.log(params);
    if(params && JSON.stringify(params) != "{}"){
      this.setState({
        isEnabled:params.isEnabled
      },()=>{
        console.log(this.state.isEnabled);
      })
    }else {
      this.setState({
        isEnabled:true,
      })
    }

    this.getPaymentMethodCategory();
    this.getSetOfBooksIdOptions();
  }

  getPaymentMethodCategory(){
    let paymentMethodCategoryOptions = [];
    this.getSystemValueList(2105).then(res => {
      console.log(res.data.values);
      res.data.values.map(data => {
        paymentMethodCategoryOptions.push({label: data.messageKey, value: data.code})
      });
      this.setState({
        paymentMethodCategoryOptions
      })
      console.log(paymentMethodCategoryOptions);
    });
  }

  getSetOfBooksIdOptions(){
    console.log(1234);
    let setOfBooksOptions =[];
    httpFetch.get(`${config.baseUrl}/api/setOfBooks/by/tenant?roleType=TENANT`).then((res)=>{
        console.log(res.data);
        console.log(1234);
        res.data.map(data =>{
          setOfBooksOptions.push({label:data.setOfBooksName,value:String(data.id)})
        })
        this.setState({
          setOfBooksOptions
        },()=>{
          this.props.form.setFieldsValue({
            setOfBooksId:this.props.company.setOfBooksId
          })
        })
      }
    )
  }

  componentWillReceiveProps(nextProps){
    console.log(nextProps.params);
    console.log("componentWillReceiveProps");
    if(nextProps.params && JSON.stringify(nextProps.params) != "{}" && this.props.params != nextProps.params) {
      console.log("params");
      console.log(nextProps.params.isEnabled);
      this.setState({
        isEnabled:nextProps.params.isEnabled
      },()=>{})
    }
    else {
      this.setState({
        isEnabled:true
      },()=>{})
    }
  }



  //新建
  handleSave = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({loading: true});
        if (JSON.stringify(this.props.params) === "{}") {
          let toValue = {
            ...this.props.params,
            ...values,
            "currencyCode":"RMB",
            "autoApproveFlag":false,
          }
          toValue.isEnabled =this.state.isEnabled;
          console.log(toValue);
          httpFetch.post(`${config.localUrl}/api/cash/setofbooks/pay/requisition/types`,toValue).then((res) => {
            this.setState({loading: false});
            this.props.form.resetFields();
            this.props.close(true);
            message.success(this.props.intl.formatMessage({id: "common.create.success"}, {name: `${this.props.intl.formatMessage({id: "budget.itemType"})}`}));
            console.log(this.props.id);
          }).catch((e) => {
            this.setState({loading: false});

            message.error(this.props.intl.formatMessage({id: "common.save.filed"})+`${e.response.data.message}`);
          })
        }else {
          console.log("编辑");
          let toValue ={
            ...this.props.params,
            ...values,
            isEnabled:this.state.isEnabled
          }
          toValue.isEnabled = this.state.isEnabled;
          console.log(toValue);
          httpFetch.post(`http://rjfin.haasgz.hand-china.com:30498/payment/api/Cash/PaymentMethod`, toValue).then((res) => {
            this.setState({loading: false});
            this.props.form.resetFields();
            this.props.close(true);
            message.success("编辑成功");
            console.log(this.props.id);
          }).catch((e) => {
            this.setState({loading: false});
            message.error(this.props.intl.formatMessage({id: "common.save.filed"})+`${e.response.data.message}`);
          })

        }
      }
    });
  }

  onCancel = () => {
    this.props.close();
  };

  switchChange = () => {
    this.setState((prevState) => ({
      isEnabled: !prevState.isEnabled
    }))
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    const {params, isEnabled, isPut} = this.state;
    const formItemLayout = {
      labelCol: {span: 6, offset: 1},
      wrapperCol: {span: 14, offset: 1},
    };
    return (


      <div className="new-payment-method">
        <Form onSubmit={this.handleSave}>
          <FormItem {...formItemLayout} label="账套">
            {getFieldDecorator('setOfBookId', {
              rules: [{
                required: true,
                message:"请选择",
              }],
              initialValue:this.props.params.setOfBooksId||''
            })(
              <Select>
                {this.state.setOfBooksOptions.map((option)=>{
                  return <Option value={option.value} lable={option.label} >{option.label}</Option>
                })}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="预付款单类型代码">
            {getFieldDecorator('typeCode', {
              rules: [{
                required: true,
                message: this.props.intl.formatMessage({id: "common.please.enter"})
              }],
              initialValue:this.props.params.typeCode||''
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="预付款单类型名称">
            {getFieldDecorator('typeName', {
              rules: [{
                required: true,
                message: this.props.intl.formatMessage({id: "common.please.enter"})
              }],
              initialValue:this.props.params.typeName||''
            })(
              <Input placeholder={this.props.intl.formatMessage({id: "common.please.enter"})}/>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="付款方式">
            {getFieldDecorator('paymentMethodCategory', {
              rules: [{
                required: true,
                message:"请选择",
              }],
              initialValue:this.props.params.paymentMethodCategory||''
            })(
              <Select>
                {this.state.paymentMethodCategoryOptions.map((option)=>{
                  return <Option value={option.value} lable={option.label} >{option.label}</Option>
                })}
              </Select>
            )}
          </FormItem>

          <FormItem
            label="必须关联申请"
            {...formItemLayout}
          >

            {getFieldDecorator('reqRequiredFlag', {
              rules: [{
                required: true,
                message: this.props.intl.formatMessage({id: "common.please.enter"})
              }],
              valuePropName:"defaultValue",
              initialValue:"true",
            })(
              <Radio.Group>
                <Radio.Button value="true">必须</Radio.Button>
                <Radio.Button value="false">非必须</Radio.Button>
              </Radio.Group>
            )}
          </FormItem>
          <FormItem {...formItemLayout}
                    label={this.props.intl.formatMessage({id: "budget.isEnabled"})}>
            {getFieldDecorator('isEnabled', {
              rules: [{
                required: true,
                message: this.props.intl.formatMessage({id: "common.please.enter"})
              }],
              valuePropName:"checked",
              initialValue:"true",
            })(
              <div>
                <Switch defaultChecked={this.state.isEnabled===true?true:false} checkedChildren={<Icon type="check"/>}
                        unCheckedChildren={<Icon type="cross"/>} onChange={this.switchChange}/>
                <span className="enabled-type" style={{
                  marginLeft: 20,
                  width: 100
                }}>{ isEnabled ? this.props.intl.formatMessage({id: "common.enabled"}) : this.props.intl.formatMessage({id: "common.disabled"}) }</span>
              </div>
            )}
          </FormItem>

          <div className="slide-footer">
            <Button type="primary" htmlType="submit"
                    loading={this.state.loading}>{this.props.intl.formatMessage({id: "common.save"})}</Button>
            <Button onClick={this.onCancel}>{this.props.intl.formatMessage({id: "common.cancel"})}</Button>
          </div>
        </Form>
      </div>
    )
  }
}



const WrappedNewPayRequisitionType = Form.create()(NewPayRequisitionType);
function mapStateToProps(state) {
  return {
    company: state.login.company,
  }
}
export default connect(mapStateToProps)(injectIntl(WrappedNewPayRequisitionType));
