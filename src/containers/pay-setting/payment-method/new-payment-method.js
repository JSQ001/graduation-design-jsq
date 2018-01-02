/**
 * Created by 13576 on 2017/11/25.
 */
import React from 'react';
import {connect} from 'react-redux';
import {injectIntl} from 'react-intl';
import {Button,Form,Switch, Input,message, Icon,Select} from 'antd';
const FormItem = Form.Item;
const Option =Select.Option;

import config from 'config';
import httpFetch from 'share/httpFetch';
import 'styles/pay-setting/payment-method/new-payment-method.scss'

class NewPaymentMethod extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      params: {},
      isEnabled: true,
      isPut: false,
      loading: false,
      paymentMethodCategoryOptions:[],
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
    if(params && JSON.stringify(params) != "{}"){
      this.setState({
        isEnabled:params.isEnabled
      },()=>{
      })
    }else {
      this.setState({
        isEnabled:true,
      })
    }

    this.getPaymentMethodCategory();
  }

  getPaymentMethodCategory(){
    let paymentMethodCategoryOptions = [];
    this.getSystemValueList(2105).then(res => {
      res.data.values.map(data => {
        paymentMethodCategoryOptions.push({label: data.messageKey, value: data.code,key:data.code})
      });
      this.setState({
        paymentMethodCategoryOptions
      })
    });
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.params && JSON.stringify(nextProps.params) != "{}" && this.props.params != nextProps.params) {
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



  //新建或者修改
  handleSave = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({loading: true});
        if (JSON.stringify(this.props.params) === "{}") {
          let toValue = {
            id: "",
            versionNumber: 1,
            ...this.props.params,
            ...values,
          }
          console.log(this.state.isEnabled);
          httpFetch.post(`${config.payUrl}/api/Cash/PaymentMethod`, toValue).then((res) => {
            this.setState({loading: false});
            this.props.form.resetFields();
            this.props.close(true);
            message.success(this.props.intl.formatMessage({id: "common.create.success"}, {name: `${this.props.intl.formatMessage({id: "budget.itemType"})}`}));
          }).catch((e) => {
            this.setState({loading: false});

            message.error(this.props.intl.formatMessage({id: "common.save.filed"})+`${e.response.data.message}`);
          })
        }else {
          let toValue ={
            ...this.props.params,
            ...values,
          }
          httpFetch.post(`${config.payUrl}/api/Cash/PaymentMethod`, toValue).then((res) => {
            this.setState({loading: false});
            this.props.form.resetFields();
            this.props.close(true);
            message.success(this.props.intl.formatMessage({id: "common.operate.success"}));
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

  switchChange = (value) => {
    console.log(value);
   this.setState({isEnabled:value})
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
          <FormItem {...formItemLayout}
                    label={this.props.intl.formatMessage({id: "budget.isEnabled"})}>
            {getFieldDecorator('isEnabled', {
              valuePropName: 'checked',
              initialValue: this.state.isEnabled
            })(
                <Switch  checkedChildren={<Icon type="check"/>}
                        unCheckedChildren={<Icon type="cross" />}
                        onChange={this.switchChange}
                />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={this.props.intl.formatMessage({id: "paymentMethod.paymentMethodCategory"})}>
            {getFieldDecorator('paymentMethodCategory', {
              rules: [{
                required: true,
                message: this.props.intl.formatMessage({id: "common.please.enter"})
              }],
              initialValue:this.props.params.paymentMethodCategory||''
            })(
              <Select disabled={JSON.stringify(this.props.params) === "{}"?false:true} placeholder={this.props.intl.formatMessage({id: "common.please.select"})}>
                {this.state.paymentMethodCategoryOptions.map((option)=>{
                  return <Option value={option.value} lable={option.label} >{option.label}</Option>
                })}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={this.props.intl.formatMessage({id: "paymentMethod.paymentMethodCode"})}>
            {getFieldDecorator('paymentMethodCode', {
              rules: [{
                required: true,
                message: this.props.intl.formatMessage({id: "common.please.enter"})
              }],
              initialValue:this.props.params.paymentMethodCode||''
            })(
              <Input placeholder={this.props.intl.formatMessage({id: "common.please.enter"})} disabled={JSON.stringify(this.props.params) === "{}"?false:true}/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={this.props.intl.formatMessage({id: "paymentMethod.description"})}>
            {getFieldDecorator('description', {
              rules: [{
                required: true,
                message: this.props.intl.formatMessage({id: "common.please.enter"})
              }],
              initialValue:this.props.params.description||''
            })(
              <Input placeholder={this.props.intl.formatMessage({id: "common.please.enter"})}/>
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



const WrappedPaymentMethod = Form.create()(NewPaymentMethod);
function mapStateToProps() {
  return {

  }
}
export default connect(mapStateToProps)(injectIntl(WrappedPaymentMethod));
