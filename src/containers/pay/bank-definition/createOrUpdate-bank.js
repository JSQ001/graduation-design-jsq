/**
 * created by jsq on 2017/10/9
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

import { Button, Form, Input, Switch, Icon, Select } from 'antd';
import debounce from 'lodash.debounce';

import SearchArea from 'components/search-area.js';
import httpFetch from 'share/httpFetch';
import config from 'config'
import menuRoute from 'share/menuRoute'
import 'styles/pay/bank-definition/new-bank-definition.scss'
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
    }
    this.validateBankCode = debounce(this.validateBankCode,1000)
  }

  componentWillReceiveProps(nextprops){
    console.log(nextprops.params)
    this.setState({
      bank: nextprops.params,
      isEditor: JSON.stringify(nextprops.params) == "{}" ? false : true
    })
  }

  /**
   * 验证银行（数字/字母）代码,不可重复,数字代码只能包含数字，字母代码只能包含字母，否则清空
   * @param item 输入项
   * @param value 输入的值
   */
  validateBankCode = (item,value,callback)=>{
    console.log(item.field);
    console.log(value)
    if(item.field === "bankDigitalCode"){
      let re = /^[0-9]+$/;
      if(!re.test(value)) {
        this.props.form.setFieldsValue({"bankDigitalCode":""});
      }
    }
    if(item.field === "bankLetterCode"){
      let re = /^[a-z || A-Z]+$/;
      if(!re.test(value)) {
        this.props.form.setFieldsValue({"bankLetterCode":""});
      }
    }
    callback()
  };

  handleSubmit = (e)=>{
    e.preventDefault();
    this.setState({
      loading: true
    });
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log(values)
        this.state.isEditor ?
          httpFetch.put(`${config.baseUrl}/api/CompanyBank/insertOrUpdate`,values).then((response)=>{
            console.log(response)
            this.props.close(true);
            this.setState({
              loading: false
            })
          }).catch((e)=>{
            if(e.response){
              console.log(e)
            }
            else {
              console.log(e)
            }
          })
          :
           httpFetch.post(`${config.baseUrl}/api/CompanyBank/insertOrUpdate`,values).then((response)=>{
          console.log(response)
          this.props.close(true);
          this.setState({
            loading: false
          })
        }).catch((e)=>{
          if(e.response){
            console.log(e)
          }
          else {
            console.log(e)
          }
        })
      }
    })
  };

  onCancel = () =>{
    this.props.close();
  };

  render(){
    const { formatMessage } = this.props.intl;
    const { getFieldDecorator } = this.props.form;
    const { isEnabled, loading, bankTypeHelp, bank, isEditor} = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14, offset: 1 },
    };

    const bankType = [
      {id:"cashBank", value:"现金银行"},
      {id:"clearingBank", value:"清算银行"},
      {id:"innerBank", value:"内部银行"},
      {id:"commonBank", value:"一般银行"}
    ];
    const bankTypeOptions = bankType.map((item)=><Option key={item.id}>{item.value}</Option>)
    return(
      <div className="new-bank-definition">
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout}
                    label="状态:">
            {getFieldDecorator('isEnabled', {
              valuePropName:"defaultChecked",
              initialValue: bank.isEnabled
            })(
              <div>
                <Switch defaultChecked={isEnabled}  checkedChildren={<Icon type="check"/>} unCheckedChildren={<Icon type="cross" />} onChange={this.switchChange}/>
                <span className="enabled-type" style={{marginLeft:15,width:100}}>{ isEnabled ? '启用' : '禁用' }</span>
              </div>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="银行代码（数字）" >
            {getFieldDecorator('bankDigitalCode', {
              initialValue: bank.bankDigitalCode,
              rules: [
                {
                  required: true,
                  message: formatMessage({id:"common.please.select"})
                },
                {
                  validator:(item,value,callback)=>this.validateBankCode(item,value,callback)
                }
              ],
            })(
              <Input disabled={isEditor} placeholder={formatMessage({id:"common.please.enter"})} /> /*请输入*/
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="银行代码（字母）" >
            {getFieldDecorator('bankLetterCode', {
              initialValue: bank.bankLetterCode,
              rules: [{
                required: true,
                message: formatMessage({id:"common.please.select"})
              },
              {
                validator:(item,value,callback)=>this.validateBankCode(item,value,callback)
              }
              ],
            })(
              <Input disabled={isEditor} placeholder={formatMessage({id:"common.please.enter"})}/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="银行明称" >
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
            label="银行类型"
            help={bankTypeHelp}>
            {getFieldDecorator('bankType', {
              initialValue: bank.bankType,
              rules: [
                {
                  required: true,
                  message: formatMessage({id:"common.please.select"})
                },
                {
                  validator: (item,value,callback)=>{
                    this.setState({
                      bankTypeHelp: value === "innerBank" ? "供企业内部部门之间结算使用，非真实的银行" : null
                    });
                    callback()
                  }
                }
              ],
            })(
              <Select placeholder={ formatMessage({id:"common.please.select"})}>
                {bankTypeOptions}
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
    company: state.login.company
  }
}
const WrappedCreateOrUpdateBank = Form.create()(CreateOrUpdateBank);

export default connect(mapStateToProps)(injectIntl(WrappedCreateOrUpdateBank));

