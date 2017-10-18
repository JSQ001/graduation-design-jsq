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
      defaultStatus: true,
      statusCode: this.props.intl.formatMessage({id:"common.enabled"}),
      isEnabled: true,
      bankTypeHelp: "",
      bank:{},
      isEditor: false,
    };
    this.validateBankCode = debounce(this.validateBankCode,1000)
  }

  componentWillMount(){
    console.log(this.props)
  }


  componentWillReceiveProps(nextprops){
    console.log(nextprops.params);
    this.setState({
      bank: nextprops.params.bank,
      isEditor: JSON.stringify(nextprops.params.bank) == "{}" ? false : true,
      defaultStatus: JSON.stringify(nextprops.params.bank) == "{}" ? true : nextprops.params.bank.isEnabled,
//      isEnabled: JSON.stringify(nextprops.params) == "{}" ? true : nextprops.params.isEnabled,
    })
  }

  /**
   * 验证银行（数字/字母）代码,不可重复,数字代码只能包含数字，字母代码只能包含字母，否则清空
   * @param item 输入项
   * @param value 输入的值
   */
  validateBankCode = (item,value,callback)=>{
    if(item.field === "bankCodeLong"){
      let re = /^[0-9]+$/;
      if(!re.test(value)) {
        this.props.form.setFieldsValue({"bankCodeLong":""});
      }else {
        httpFetch.get(`${config.payUrl}/api/cash/banks/query?bankCodeLong=${value}`).then((response)=>{
          let flag = false;
          response.data.map((item)=>{
            if(item.bankCodeLong === value)
              flag = true;
          });
          this.setState({                        /*该银行已存在*/
            bankCodeLongHelp: flag ? this.props.intl.formatMessage({id:"bank.validateExist"}) : null,
            bankCodeLongStatus: flag ? "error" : null,
          })
        })
      }
    }
    if(item.field === "bankCodeString"){
      let re = /^[a-z || A-Z]+$/;
      if(!re.test(value)) {
        this.props.form.setFieldsValue({"bankCodeString":""});
      }
      else{
        httpFetch.get(`${config.payUrl}/api/cash/banks/query?bankCodeString=${value}`).then((response)=>{
          let f = false;
          response.data.map((item)=>{
            if(item.bankCodeString === value)
              f = true;
          });
          this.setState({               /*该银行已存在*/
            bankCodeStringHelp: f ? this.props.intl.formatMessage({id:"bank.validateExist"}) : null,
            bankCodeLStringStatus: f ? "error" : null,
          })
        })
      }
    }
    callback()
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
            this.setState({loading: false});
          }
          else {
            console.log(e)
          }
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
        this.setState({loading: false});
      }
      else {
        console.log(e)
      }
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

    const { defaultStatus, loading, bankTypeHelp, bank, isEditor} = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14, offset: 1 },
    };

    console.log(this.state.defaultStatus)

    const bankType = [
      {id:"cashBank", value:"现金银行"},
      {id:"clearingBank", value:"清算银行"},
      {id:"innerBank", value:"内部银行"},
      {id:"commonBank", value:"一般银行"}
    ];
    const bankTypeOptions = bankType.map((item)=><Option key={item.id}>{item.value}</Option>)
    return(
      <div className="new-bank-definition">
        <Form onSubmit={this.handleSubmit} onChange={this.handleFormChange} >
          <FormItem {...formItemLayout}
                    label={formatMessage({id:"common.column.status"})+" :"}>
            {getFieldDecorator('isEnabled',{
              initialValue: defaultStatus,
              valuePropName: 'checked'
            })(
                <Switch checkedChildren={<Icon type="check"/>} unCheckedChildren={<Icon type="cross" />}
                onChange={(value)=>{
                  console.log(value)
                  this.setState({
                    flag: 'y',
                    isEnabled: value
                  })
                }}
                />
              )}
          </FormItem>
          <span className="enabled-type" style={{marginLeft:15,width:100}}>{(this.state.flag === 'y'? this.state.isEnabled : defaultStatus ) ? "启用" : "禁用"}</span>
          <FormItem {...formItemLayout}
            label={formatMessage({id:"bank.bankCodeLong"})}
            help={this.state.bankCodeLongHelp}
            validateStatus={this.state.bankCodeLongStatus}>
            {getFieldDecorator('bankCodeLong', {
              initialValue: bank.bankCodeLong,
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
            label={formatMessage({id:"bank.bankCodeString"})}
            validateStatus={this.state.bankCodeLStringStatus}
            help={this.state.bankCodeStringHelp}>
            {getFieldDecorator('bankCodeString', {
              initialValue: bank.bankCodeString,
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
            label={formatMessage({id:"bank.bankType"})}
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
                      bankTypeHelp: value === "innerBank" ? formatMessage({id:"bank.innerBankInfo"}) : null
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
