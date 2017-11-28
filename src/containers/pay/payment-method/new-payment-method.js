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
import 'styles/pay/payment-method/new-payment-method.scss'

class NewPaymentMethod extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      params: {},
      isEnabled: true,
      isPut: false,
      loading: false,
      paymentMethodCategoryOptions:[],
    };
  }

  componentWillMount() {
    this.getPaymentMethodCategory();
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

  componentWillReceiveProps(nextProps){
    if(this.props.params !=nextProps.params && nextProps.params){
        this.state.params = this.props.params;
    }
  }




  //新建
  handleSave = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({loading: true});
        let toValue = {
          id:"",
          versionNumber:1,
          ...this.props.params,
          ...values
        }
        console.log(toValue);
        httpFetch.post(`http://rjfin.haasgz.hand-china.com:30498/payment/api/Cash/PaymentMethod`, toValue).then((res) => {
          this.setState({loading: false});
          this.props.form.resetFields();
          this.props.close(true);
          message.success(this.props.intl.formatMessage({id: "common.create.success"}, {name: `${this.props.intl.formatMessage({id: "budget.itemType"})}`}));
          console.log(this.props.id);
        }).catch((e) => {
          this.setState({loading: false});

          message.error(this.props.intl.formatMessage({id: "common.save.filed"}));
        })
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
          <FormItem {...formItemLayout}
                    label={this.props.intl.formatMessage({id: "budget.isEnabled"})}>
            {getFieldDecorator('isEnabled', {
              valuePropName: "defaultChecked",
              initialValue: isEnabled
            })(
              <div>
                <Switch defaultChecked={isEnabled} checkedChildren={<Icon type="check"/>}
                        unCheckedChildren={<Icon type="cross"/>} onChange={this.switchChange}/>
                <span className="enabled-type" style={{
                  marginLeft: 20,
                  width: 100
                }}>{ isEnabled ? this.props.intl.formatMessage({id: "common.enabled"}) : this.props.intl.formatMessage({id: "common.disabled"}) }</span>
              </div>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={this.props.intl.formatMessage({id: "paymentMethod.paymentMethodCategory"})}>
            {getFieldDecorator('paymentMethodCategory', {
              rules: [{}],

            })(
              <Select>
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
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={this.props.intl.formatMessage({id: "paymentMethod.description"})}>
            {getFieldDecorator('description', {
              rules: [{
                required: true,
                message: this.props.intl.formatMessage({id: "common.please.enter"})
              }],
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
