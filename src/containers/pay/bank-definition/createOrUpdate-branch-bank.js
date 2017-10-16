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
            message.success('操作成功');
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
              message.success('操作成功');
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
    const { defaultIsEnabled, isEditor, loading, belongsBank, branchBank, operation} = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14, offset: 1 },
    };
    return(
      <div className="create-or-update-branch-bank">
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout}
                    label="状态:">
            {getFieldDecorator('isEnabled', {
              valuePropName:"defaultChecked",
              initialValue: defaultIsEnabled
            })(
              <div>
                <Switch defaultChecked={defaultIsEnabled}  checkedChildren={<Icon type="check"/>} unCheckedChildren={<Icon type="cross" />} onChange={this.switchChange}/>
                <span className="enabled-type" style={{marginLeft:15,width:100}}>{ defaultIsEnabled ? '启用' : '禁用' }</span>
              </div>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="所属银行" >
            {getFieldDecorator('bankDigitalCode', {
              initialValue: belongsBank.bankName,
            })(
              <Input disabled/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="分行行号" >
            {getFieldDecorator('bankBranchCode', {
              rules: [{
                required: true,
                message: formatMessage({id:"common.please.enter"})
              }],
            })(
              <Input disabled={isEditor} placeholder={formatMessage({id:"common.please.enter"})}/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="分行名称" >
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
          </FormItem>*/}
          <FormItem {...formItemLayout} label="银行地址" >
            {getFieldDecorator('address', {
              rules: [{
                required: true
              }],
            })(
              <Select/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="联系人" >
            {getFieldDecorator('contactName', {
              rules: [{
                required: true
              }],
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="联系人电话" >
            {getFieldDecorator('phone', {
              rules: [{
                required: true
              }],
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="联系人Email" >
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

