/**
 * created by jsq on 2017/10/9
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

import { Button, Form, Input, Switch, Icon, Select, message } from 'antd';
import debounce from 'lodash.debounce';

import SearchArea from 'components/search-area.js';
import httpFetch from 'share/httpFetch';
import config from 'config'
import CitySelector from 'components/city-selector'
import menuRoute from 'share/menuRoute'
import 'styles/pay/bank-definition/createOrUpdate-bank-definition.scss'
import SlideFrame from 'components/slide-frame'

const FormItem = Form.Item;
const Option = Select.Option;

class CreateOrUpdateBank extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      loading: false,
      isEnabled: true,
      bankTypeHelp: "",
      bank:{},
      isEditor: false,
      countryCode:null,
      country:[],
    };
    this.validateBankCode = debounce(this.validateBankCode,1000)
  }

  componentWillMount(){
    console.log(this.props)
    //获取国家
    httpFetch.get(`http://192.168.1.77:13001/location-service/api/localization/query/county?language=${this.props.language.locale ==='zh' ? "zh_cn" : "en_us"}`).then((response)=>{
      console.log(response)
      let country = [];
      response.data.map((item)=>{
        let option = {
          label: item.country,
          key: item.code
        }
        country.push(option)
      });
      this.setState({
        country
      })
    });

  }


  componentWillReceiveProps(nextprops){
    console.log(nextprops.params);
  }

  /**
   * 验证银行（数字/字母）代码,不可重复,数字代码只能包含数字，字母代码只能包含字母，否则清空
   * @param item 输入项
   * @param value 输入的值
   */
  validateBankCode = (item,value,callback)=>{
  };

  handleCreate = ()=>{
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log(values)
        httpFetch.post(`${config.payUrl}/api/cash/banks`,values).then((response)=>{
          message.success(this.props.intl.formatMessage({id:"common.create.success"},{name:values.bankName}));
          this.props.close(true);
          this.setState({
            loading: false
          })
        }).catch((e)=>{
          if(e.response){
            message.error(`${this.props.intl.formatMessage({id:"common.create.filed"})}, ${e.response.data.validationErrors[0].message}`);
          }
          this.setState({loading: false});
        })
      }
    })
  };

  handleUpdate = ()=>{
    let values = this.props.form.getFieldsValue();
    values.id = this.state.bank.id;
    if(values.bankName === ""){
      return
    }
    httpFetch.put(`${config.payUrl}/api/cash/banks`,values).then((response)=>{
      console.log(response)
      message.success(this.props.intl.formatMessage({id:"common.save.success"},{name:values.bankName}));
      this.setState({
        loading: false
      });
      this.props.close(true);
    }).catch((e)=>{
      if(e.response){
        message.error(`${this.props.intl.formatMessage({id:"common.save.filed"})}, ${e.response.data.validationErrors[0].message}`);
      }
      this.setState({loading: false});
    })
  };


  //选择国家
  countryChange = (value)=>{
    console.log(value)
    this.setState({
      countryCode: value
    })
  };

  handleSubmit = (e)=>{
    e.preventDefault();
    this.setState({
      loading: true
    });
    this.state.isEditor ?
      this.handleUpdate()
      :
      this.handleCreate();
  };

  onCancel = () =>{
    this.props.form.resetFields();
    this.props.close();
  };

  handleFormChange =()=>{
    this.setState({
      loading: false
    })
  };

  render(){
    const { formatMessage } = this.props.intl;
    const { getFieldDecorator } = this.props.form;

    const { defaultStatus, loading, bankTypeHelp, bank, country, countryCode, isEditor} = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14, offset: 1 },
    };

    const bankTypeOptions = country.map((item)=><Option key={item.id}>{item.value}</Option>)
    return(
      <div className="new-bank-definition">
        <Form onSubmit={this.handleSubmit} onChange={this.handleFormChange} >
          <FormItem {...formItemLayout}
            label={formatMessage({id:"bank.bankCode"})}>
            {getFieldDecorator('bankCode', {
              initialValue: bank.bankCode,
              rules: [
                {
                  required: true,
                  message: formatMessage({id:"common.please.enter"})
                },
                {
                  validator:(item,value,callback)=>this.validateBankCode(item,value,callback)
                }
              ],
            })(
              <Input disabled={isEditor} placeholder={formatMessage({id:"common.please.enter"})} /> /*请输入*/
            )}
          </FormItem>
          <FormItem {...formItemLayout}
            label='Swift Code'>
            {getFieldDecorator('Swift Code', {
              initialValue: bank.swiftCode,
              rules: [{
                required: true,
                message: formatMessage({id:"common.please.select"})
              }],
            })(
              <Input disabled={isEditor} placeholder={formatMessage({id:"common.please.enter"})}/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={formatMessage({id:"bank.bankName"})} >
            {getFieldDecorator('bankName', {
              initialValue: bank.bankName,
              rules: [
                {
                  required: true,
                  message: formatMessage({id:"common.please.enter"})
                },

              ],
            })(
              <Input placeholder={formatMessage({id:"common.please.enter"})} />
            )}
          </FormItem>
          <FormItem {...formItemLayout}
            label={formatMessage({id:"bank.country"})} //国家
            help={bankTypeHelp}>
            {getFieldDecorator('country', {
              initialValue: bank.country,
              rules: [
                {
                  required: true,
                  message: formatMessage({id:"common.please.select"})
                }
              ],
            })(
              <Select onChange={this.countryChange} placeholder={ formatMessage({id:"common.please.select"})}>
                {
                  country.map((item)=><Option key={item.key}>{item.label}</Option>)
                }
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout}
                    label={formatMessage({id:"bank.address"})}
                    help={bankTypeHelp}>
            {getFieldDecorator('address', {
              initialValue: bank.address,
              rules: [
                {
                  required: true,
                  message: formatMessage({id:"common.please.select"})
                }
              ],
            })(
             <CitySelector countryCode={countryCode}/>
            )}
          </FormItem>
          <FormItem {...formItemLayout}
                    label={formatMessage({id:"bank.detailAddress"})}
                    help={bankTypeHelp}>
            {getFieldDecorator('address', {
              initialValue: bank.address,
              rules: [
                {
                  required: true,
                  message: formatMessage({id:"common.please.select"})
                }
              ],
            })(
              <Select placeholder={ formatMessage({id:"common.please.select"})}>
                {
                  country.map((item)=><Option key={item.key}>{item.label}</Option>)
                }
              </Select>
            )}
          </FormItem>
          <div className="slide-footer">
            <Button type="primary" htmlType="submit"  loading={loading}>{formatMessage({id:"common.save"})}</Button>
            <Button onClick={this.onCancel}>{formatMessage({id:"common.cancel"})}</Button>
          </div>
        </Form>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    organization: state.budget.organization,
    company: state.login.company,
    language: state.main.language,
  }
}
const WrappedCreateOrUpdateBank = Form.create()(CreateOrUpdateBank);

export default connect(mapStateToProps)(injectIntl(WrappedCreateOrUpdateBank));

