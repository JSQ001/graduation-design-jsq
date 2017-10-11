/**
 * created by jsq on 2017/10/9
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

import { Button, Form, Input, Switch, Icon, Select } from 'antd';

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
    this.setState = {
      loading: false,
      isEnabled: true
    }
  }

  handleSubmit = (e)=>{
    e.preventDefault();
    this.setState({
      loading: true
    });
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log(values)
      }
    })
  };

  onCancel = () =>{
    this.props.close();
  };

  render(){
    const { formatMessage } = this.props.intl;
    const { getFieldDecorator } = this.props.form;
    const { isEnabled, loading} = this.setState;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14, offset: 1 },
    };
    return(
      <div className="new-bank-definition">
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout}
                    label="状态:">
            {getFieldDecorator('isEnabled', {
              valuePropName:"defaultChecked",
              initialValue: isEnabled
            })(
              <div>
                <Switch defaultChecked={isEnabled}  checkedChildren={<Icon type="check"/>} unCheckedChildren={<Icon type="cross" />} onChange={this.switchChange}/>
                <span className="enabled-type" style={{marginLeft:15,width:100}}>{ isEnabled ? '启用' : '禁用' }</span>
              </div>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="所属银行" >
            {getFieldDecorator('bankDigitalCode', {
              initialValue: "中国银行",
              rules: [{
                required: true
              }],
            })(
              <Input disabled/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="分行行号" >
            {getFieldDecorator('bankDigitalCode', {
              rules: [{
                required: true
              }],
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="分行名称" >
            {getFieldDecorator('itemTypeCode', {
              rules: [{
                required: true
              }],
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="SwiftCode" >
            {getFieldDecorator('bankLetterCode', {
              rules: [{
                required: true
              }],
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="国家" >
            {getFieldDecorator('country', {
              rules: [{
                required: true
              }],
            })(
              <Select/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="省" >
            {getFieldDecorator('province', {
              rules: [{
                required: true
              }],
            })(
              <Select/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="市" >
            {getFieldDecorator('city', {
              rules: [{
                required: true
              }],
            })(
              <Select/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="区/县" >
            {getFieldDecorator('city', {
              rules: [{
                required: true
              }],
            })(
              <Select/>
            )}
          </FormItem>
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
            {getFieldDecorator('person', {
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
            <Button type="primary" htmlType="submit"  loading={loading}>保存</Button>
            <Button onClick={this.onCancel}>取消</Button>
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

