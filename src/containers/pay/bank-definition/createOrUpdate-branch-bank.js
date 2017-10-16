/**
 * created by jsq on 2017/10/9
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

import { Button, Form, Input, Switch, Icon, Select, message, Cascader  } from 'antd';

import SearchArea from 'components/search-area.js';
import httpFetch from 'share/httpFetch';
import config from 'config'
import menuRoute from 'share/menuRoute'
import SlideFrame from 'components/slide-frame'
import 'styles/pay/bank-definition/createOrUpdate-branch-bank.scss'

const FormItem = Form.Item;

class NewBranchBank extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      loading: false,
      isEditor: false,
      defaultIsEnabled: true,
      belongsBank: {},
      branchBank: {}
    }
  }

  componentWillMount(){
    this.setState({
      branchBank: JSON.stringify(this.props.params) === "{}" ? {} : this.props.params.value
    })
  }

  componentWillReceiveProps(nextprops){
    console.log(nextprops.params)
    this.setState({
      isEditor: nextprops.params.key === "create" ? false : true,
      defaultIsEnabled: nextprops.params.key === "create" ? true : nextprops.params.values.isEnabled,
      //belongsBank: nextprops.params.key === "create" ? nextprops.params.value : {},
      branchBank: nextprops.params.value
    })
  }

  handleSubmit = (e)=>{
    e.preventDefault();
    this.setState({
      loading: true
    });
    this.props.form.validateFieldsAndScroll((err, values) => {
      this.setState({
        loading: true,
      });
      if (!err) {
        console.log(values)
        this.state.isEditor ?
          httpFetch.put(`${config.payUrl}/api/cash/bank/branches`,values).then((response)=>{
          if(response.status === 200){
            console.log(response)
            this.props.close(true);
            message.success(this.props.intl.formatMessage({id:"common.save.success"},{name:values.bankName}));
            this.setState({
              loading: false
            });
          }
        }).catch((e)=>{
          if(e.response){
            message.error(`保存失败, ${e.response.data.validationErrors[0].message}`);
            this.setState({loading: false});
          }
          else {
            console.log(e)
          }
        })
          :
          httpFetch.post(`${config.payUrl}/api/cash/bank/branches`,values).then((response)=>{
            if(response.status === 200){
              console.log(response)
              this.props.close(true);
              message.success(this.props.intl.formatMessage({id:"common.create.success"},{name:""}));
              this.setState({
                loading: false
              });
            }
          }).catch((e)=>{
            if(e.response){
              message.error(`保存失败, ${e.response.data.validationErrors[0].message}`);
              this.setState({loading: false});
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
    const { defaultIsEnabled, isEditor, loading, branchBank, operation} = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14, offset: 1 },
    };
    console.log(branchBank)
    return(
      <div className="create-or-update-branch-bank">
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout}
                    label={formatMessage({id:"common.column.status"})+" :"}>
            {getFieldDecorator('isEnabled', {
              valuePropName:"defaultChecked",
              initialValue: defaultIsEnabled
            })(
              <div>
                <Switch defaultChecked={defaultIsEnabled}  checkedChildren={<Icon type="check"/>} unCheckedChildren={<Icon type="cross" />} onChange={this.switchChange}/>
                <span className="enabled-type" style={{marginLeft:15,width:100}}>{ defaultIsEnabled ? formatMessage({id:"common.enabled"}) : formatMessage({id:"common.disabled"}) }</span>
              </div>
            )}
          </FormItem>                                          {/*所属银行*/}
          <FormItem {...formItemLayout} label={formatMessage({id:"bank.parentBank"})} >
            {getFieldDecorator('bankDigitalCode', {
              initialValue: branchBank.bankName,
            })(
              <Input disabled/>
            )}
          </FormItem>                          {/*分行行号*/}
          <FormItem {...formItemLayout} label={formatMessage({id:"bank.branchBankNumber"})} >
            {getFieldDecorator('bankBranchCode', {
              rules: [{
                required: true,
                message: formatMessage({id:"common.please.enter"})
              }],
            })(
              <Input disabled={isEditor} placeholder={formatMessage({id:"common.please.enter"})}/>
            )}
          </FormItem>                      {/*分行名称*/}
          <FormItem {...formItemLayout} label={formatMessage({id:"bank.branchBankName"})} >
            {getFieldDecorator('bankBranchName', {
              rules: [{
                required: true,
                message: formatMessage({id:"common.please.enter"})
              }],
            })(
              <Input disabled={isEditor} placeholder={formatMessage({id:"common.please.enter"})}/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="SwiftCode" >
            {getFieldDecorator('bankLetterCode', {
              rules: [{
                required: true,
                message: formatMessage({id:"common.please.enter"})
              }],
            })(
              <Input placeholder={formatMessage({id:"common.please.enter"})}/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="国家" >
            {getFieldDecorator('country', {
              rules: [{
                required: true,
                message: formatMessage({id:"common.please.select"})
              }],
            })(
              <Select placeholder={formatMessage({id:"common.please.select"})}/>
            )}
          </FormItem>
         {/* <FormItem {...formItemLayout} label="省" >
            {getFieldDecorator('provinceCode', {
              rules: [{
                required: true
              }],
            })(
              <Select/>
            )}
          </FormItem>*/}
          <FormItem {...formItemLayout} label="城市" >
            {getFieldDecorator('cityCode', {
              rules: [{
                required: true,
                message: formatMessage({id:"common.please.select"})
              }],
            })(
              <Cascader
                //options={options}
                //onChange={onChange}
                placeholder="Please select"
                showSearch
              />
              /*<Select  placeholder={formatMessage({id:"common.please.select"})}/>*/
            )}
          </FormItem>
        {/*  <FormItem {...formItemLayout} label="区/县" >
            {getFieldDecorator('city', {
              rules: [{
                required: true
              }],
            })(
              <Select/>
            )}
          </FormItem>*/}                                     {/*银行地址*/}
          <FormItem {...formItemLayout} label={formatMessage({id:"bank.bankAddress"})} >
            {getFieldDecorator('address', {
              rules: [{
                required: true
              }],
            })(
              <Select/>
            )}
          </FormItem>                           {/*联系人*/}
          <FormItem {...formItemLayout} label={formatMessage({id:"bank.contactName"})} >
            {getFieldDecorator('contactName', {
              rules: [{
                required: true
              }],
            })(
              <Input/>
            )}
          </FormItem>                       {/*联系人电话*/}
          <FormItem {...formItemLayout} label={formatMessage({id:"bank.phone"})} >
            {getFieldDecorator('phone', {
              rules: [{
                required: true
              }],
            })(
              <Input/>
            )}
          </FormItem>               {/*联系人Email*/}
          <FormItem {...formItemLayout} label={formatMessage({id:"bank.email"})}>
            {getFieldDecorator('email', {
              rules: [{
                required: true
              }],
            })(
              <Input/>
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
const WrappedNewBranchBank = Form.create()(NewBranchBank);

export default connect(mapStateToProps)(injectIntl(WrappedNewBranchBank));

