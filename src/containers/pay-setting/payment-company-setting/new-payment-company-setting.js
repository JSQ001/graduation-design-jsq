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
import Chooser from  'components/Chooser';
import 'styles/pay-setting/payment-method/new-payment-method.scss'

class NewPaymentCompanySetting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      params: {},
      isEnabled: true,
      isPut: false,
      loading: false,
      ducumentCategoryOptions:[],
      ducumentTypeOptions:[],
      companyOptions:[],
      setOfBooksOption:[],
    };
  }

  componentWillMount() {
    this.getPaymentMethodCategory();
    this.getCompany();
    this.getSetOfBooks();
    if( JSON.stringify(this.props.params)!="{}" ){
      this.getducumentType(this.props.params.ducumentCategory);
    }
  }


  componentWillReceiveProps(nextProps){
    if(this.props.params != nextProps.params && JSON.stringify(nextProps.params)!="{}" ){
      if(this.props.params.ducumentCategory != nextProps.params.ducumentCategory){
          this.getducumentType(nextProps.params.ducumentCategory);
      }
    }
  }

  getSetOfBooks(){
    let setOfBooksOption = [];
    httpFetch.get(`${config.baseUrl}/api/setOfBooks/by/tenant`).then((res)=>{
        res.data.map(data =>{
          setOfBooksOption.push({"label":data.setOfBooksCode+"----"+data.setOfBooksName,"value":String(data.id)})
        })
       console.log(setOfBooksOption);
        this.setState({
          setOfBooksOption
        })
      }
    )
  }


  getPaymentMethodCategory(){
    let ducumentCategoryOptions = [];
    this.getSystemValueList(2106).then(res => {
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

  //新建或者编辑
  handleSave = (e) => {
    e.preventDefault();
    console.log(123);
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if(JSON.stringify(this.props.params)==="{}"){
        this.setState({loading: true});
          let toValue = {
            ...values,
            companyId:values["companyId"][0].id,
            paymentCompanyId:values["paymentCompanyId"][0].id,

          }
          httpFetch.post(`${config.baseUrl}/api/paymentCompanyConfig/insertOrUpdate`, toValue).then((res) => {
            this.setState({loading: false});
            this.props.form.resetFields();
            this.props.close(true);
            message.success(this.props.intl.formatMessage({id: "common.create.success"}, {name: `${this.props.intl.formatMessage({id: "budget.itemType"})}`}));
          }).catch((e) => {
            this.setState({loading: false});
            message.error(this.props.intl.formatMessage({id: "common.save.filed"})+e.required.data.message);
          })
      }else {
          console.log(values);
          this.setState({loading: true});
          console.log(this.props.params);
          let toValue = {
            ...this.props.params,
            ...values,
            companyId:values["companyId"][0].id,
            paymentCompanyId:values["paymentCompanyId"][0].id,

          }
          httpFetch.post(`${config.baseUrl}/api/paymentCompanyConfig/insertOrUpdate`, toValue).then((res) => {
            this.setState({loading: false});
            this.props.form.resetFields();
            this.props.close(true);
            message.success(this.props.intl.formatMessage({id: "common.operate.filed"}));
          }).catch((e) => {
            this.setState({loading: false});
            message.error(e.required.data.message);
          })
        }
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

  handleDucumentCategory =(value)=>{
    console.log(value);
    this.props.form.setFieldsValue({
      ducumentTypeId:''
    })
    this.getducumentType(value);
  }

  //获取单据类别
  getducumentType(value){
    let ducumentTypeOptions = [];
    httpFetch.get(`${config.baseUrl}/api/expense/type/by/setOfBooks?setOfBooksId=${this.props.company.setOfBooksId}&roleType=${value}`).then((res)=>{
        console.log(res.data);
        console.log(33);
        const data =res.data;
        data.map(item =>{
          ducumentTypeOptions.push({label: item.name,value:String(item.id)})
        })
        console.log(ducumentTypeOptions);
        console.log(8888888888);
        this.setState({
            ducumentTypeOptions
          },()=>{
            console.log(44)
            console.log(this.state.ducumentCategoryOptions)
          }
        )
      }
    )
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
                    label={this.props.intl.formatMessage({id:"paymentCompanySetting.setOfBooks"})}>
            {getFieldDecorator('setOfBooksId', {
              initialValue: this.props.params.setOfBooksId||this.props.company.setOfBooksId,
              rules: [
                {
                  required: true,
                  message: this.props.intl.formatMessage({id:"common.please.select"})
                },
              ],
            })(
              <Select placeholder={this.props.intl.formatMessage({id:"common.please.select"})}>
                {this.state.setOfBooksOption.map((option)=>{
                  return <Option value={option.value} lable={option.label} >{option.label}</Option>
                })}
              </Select>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}  label={this.props.intl.formatMessage({id:"common.please.select"})}
          >
            {getFieldDecorator('priorty', {
              rules: [{ required: true,   message: this.props.intl.formatMessage({id: "common.please.enter"}) }],
              initialValue:this.props.params.priorty||''
            })(
              <InputNumber min={1} placeholder={this.props.intl.formatMessage({id:"common.please.enter"})}/>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label={this.props.intl.formatMessage({id: "paymentCompanySetting.company"})}>
            {getFieldDecorator('companyId', {
              rules: [{ required: true, message: this.props.intl.formatMessage({id: "common.please.elect"}) }],
              initialValue:this.props.params.companyId||''
            })(
              <Chooser
                type='company'
                labelKey='name'
                valueKey='id'
                single={true}
                listExtraParams={{"setOfBooksId":this.props.company.setOfBooksId,"isEnabled":true}}
              />
            )}
          </FormItem>

          <FormItem {...formItemLayout} label={this.props.intl.formatMessage({id: "paymentCompanySetting.ducumentCategory"})}>
            {getFieldDecorator('ducumentCategory', {
              rules: [{ required: true,message: this.props.intl.formatMessage({id: "common.please.elect"}) }],
              initialValue:this.props.params.ducumentCategory||''
            })(
              <Select onSelect={this.handleDucumentCategory} placeholder={this.props.intl.formatMessage({id:"common.please.elect"})}>
                {this.state.ducumentCategoryOptions.map((option)=>{
                  return <Option value={option.value} lable={option.label} >{option.label}</Option>
                })}
              </Select>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label={this.props.intl.formatMessage({id: "paymentCompanySetting.ducumentType"})}>
            {getFieldDecorator('ducumentTypeId', {
              rules: [{ required: true,   message: this.props.intl.formatMessage({id: "common.please.select"}) }],
              initialValue:this.props.params.ducumentTypeId||''
            })(
              <Select placeholder={this.props.intl.formatMessage({id:"common.please.elect"})}>
                {this.state.ducumentTypeOptions.map((option)=>{
                  return <Option value={option.value} lable={option.label} >{option.label}</Option>
                })}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={this.props.intl.formatMessage({id: "paymentCompanySetting.paymentCompany"})}>
            {getFieldDecorator('paymentCompanyId', {
              rules: [{ required: true,  message: this.props.intl.formatMessage({id: "common.please.select"}) }],
              initialValue:this.props.params.paymentCompanyId||''
            })(
              <Chooser
                type='company'
                labelKey='name'
                valueKey='id'
                single={true}
                listExtraParams={{"setOfBooksId":this.props.company.setOfBooksId,"isEnabled":true}}
              />
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
