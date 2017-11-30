/**
 * Created by 13576 on 2017/11/25.
 */
import React from 'react';
import {connect} from 'react-redux';
import {injectIntl} from 'react-intl';
import {Button,Form,Switch, Input,message, Icon,Select,InputNumber} from 'antd';
const FormItem = Form.Item;
const Option =Select.Option;

import config from 'config';
import httpFetch from 'share/httpFetch';
import 'styles/pay/payment-method/new-payment-method.scss'

class NewPaymentCompanySetting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      params: {},
      isEnabled: true,
      isPut: false,
      loading: false,
      ducumentCategoryOptions:[],
      companyOptions:[],
    
    };



  }

  componentWillMount() {
    this.getPaymentMethodCategory();
    this.getCompany();
  }

  componentWillReceiveProps(nextProps){
    if(this.props.params != nextProps.params && nextProps.params.length>0) {
      this.setState({
        params:nextProps.params,
        isEnabled:nextProps.isEnabled
      })
      let fromData ={};
      const params = nextProps.params;
      const searchFrom =this.state.searchFrom;
      searchFrom.map((item)=>{
        fromData[item.id] = params[item.id]
      })
      this.props.form.setFieldsValue(fromData);
    }

  }



  getPaymentMethodCategory(){
    let ducumentCategoryOptions = [];
    this.getSystemValueList(2016).then(res => {
      res.data.values.map(data => {
        ducumentCategoryOptions.push({label: data.messageKey, value: data.code})
      });
      this.setState({
        ducumentCategoryOptions
      })
    });
  }

  getCompany(){
    let companyOptions = [];
    httpFetch.get(`${config.baseUrl}/api/company/by/condition?setOfBooksId=${this.props.company.setOfBooksId}&isEnabled=true`).then((res)=>{
        res.data.map(data =>{
          companyOptions.push({label:data.name,value:String(data.id)})
        })
        this.setState({
          companyOptions
        })
      }
    )
  }

  //新建
  handleSave = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({loading: true});
          let toValue = {
            ...values,
            setOfBooksId:this.props.company.setOfBooksId
          }
          httpFetch.post(`${config.baseUrl}/api/paymentCompanyConfig/insertOrUpdate`, toValue).then((res) => {
            this.setState({loading: false});
            this.props.form.resetFields();
            this.props.close(true);
            message.success(this.props.intl.formatMessage({id: "common.create.success"}, {name: `${this.props.intl.formatMessage({id: "budget.itemType"})}`}));
          }).catch((e) => {
            this.setState({loading: false});
            message.error(this.props.intl.formatMessage({id: "common.save.filed"}));
          })
      }
    });
  }

  onCancel = () => {
    this.props.form.resetFields();
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
          <FormItem
            {...formItemLayout}  label="优先级"
          >
            {getFieldDecorator('priorty', {  rules: [{ required: true, message: '请输入' }],initialValue: 1 })(
              <InputNumber min={1} max={10} />
            )}
          </FormItem>

          <FormItem {...formItemLayout} label={this.props.intl.formatMessage({id: "paymentCompanySetting.company"})}>
            {getFieldDecorator('companyId', {
              rules: [{ required: true, message: '请选择' }],
            })(
              <Select>
                {this.state.companyOptions.map((option)=>{
                  return <Option value={option.value} lable={option.label} >{option.label}</Option>
                })}
              </Select>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label={this.props.intl.formatMessage({id: "paymentCompanySetting.ducumentCategory"})}>
            {getFieldDecorator('ducumentCategory', {
              rules: [{ required: true, message: '请选择' }],
            })(
              <Select>
                {this.state.ducumentCategoryOptions.map((option)=>{
                  return <Option value={option.value} lable={option.label} >{option.label}</Option>
                })}
              </Select>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label={this.props.intl.formatMessage({id: "paymentCompanySetting.ducumentType"})}>
            {getFieldDecorator('ducumentType', {
              rules: [{}],

            })(
              <Select>
                {this.state.ducumentCategoryOptions.map((option)=>{
                  return <Option value={option.value} lable={option.label} >{option.label}</Option>
                })}
              </Select>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label={this.props.intl.formatMessage({id: "paymentCompanySetting.paymentCompany"})}>
            {getFieldDecorator('paymentCompanyId', {
              rules: [{ required: true, message: '请选择' }],
            })(
              <Select>
                {this.state.companyOptions.map((option)=>{
                  return <Option value={option.value} lable={option.label} >{option.label}</Option>
                })}
              </Select>
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



const WrappedNewPaymentCompanySetting = Form.create()(NewPaymentCompanySetting);
function mapStateToProps(state) {
  return {
    company: state.login.company,
  }
}
export default connect(mapStateToProps)(injectIntl(WrappedNewPaymentCompanySetting));