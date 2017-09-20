import React from 'react'
import { connect } from 'react-redux'
import { Form, Input, Switch, Button, Icon, Checkbox, Alert } from 'antd'
const FormItem = Form.Item;
import httpFetch from 'share/httpFetch'
import config from 'config'

import 'styles/budget/budget-scenarios/new-value.scss'

class ValueList extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      item: {
        allChoice: false,
        common: false,
        corporationOIDs: [],
        customEnumerationOID: "",
        departmentOIDs: [],
        enabled: true,
        keyword: "",
        messageKey: "",
        patientia: false,
        remark: "",
        returnChoiceUserOIDs: [],
        userOIDs: [""],
        userSummaryDTOs: [],
        value: "",
      }
    };
  }

  componentWillMount(){

  }

  handleSave = (e) =>{
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let values = {
          "id": null,
          "isEnabled": true,
          "organizationId": 908139656192442369,
          "scenarioName": "大白白公司预算组织",
          "scenarioCode": "SHL_STR",
          "description": "大白白公司预算场景"
        };

        this.props.close(values);

        httpFetch.post(`${config.budgetUrl}/api/budget/scenarios`, values).then(()=>{

        }).catch((e)=>{

        })
      }
    });
  };

  onCancel = () =>{
    this.props.close();
  };

  render(){
    const { getFieldDecorator } = this.props.form;
    const { } = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14, offset: 1 },
    };
    return (
      <div className="new-value">
        <Alert message="帮助提示" description="预算组织为当前用户所在账套下的生效的预算组织，同一账套下预算场景代码不允许重复，一个预算组织下允许多个预算场景同时生效。" type="info" showIcon />
        <Form onSubmit={this.handleSave}>
          <FormItem {...formItemLayout} label="预算组织">
            {getFieldDecorator('organizationId', {
              rules: [{
                required: true
              }],
              initialValue: '甄汇预算组织'
            })(
              <Input disabled/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="预算场景代码" hasFeedback>
            {getFieldDecorator('scenarioCode', {
              rules: [{
                required: true,
                message: '请输入'
              }],
              initialValue: ''
            })(
              <Input placeholder="请输入" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="预算场景描述" hasFeedback>
            {getFieldDecorator('scenarioName', {
              rules: [{
                required: true,
                message: '请输入'
              }],
              initialValue: ''
            })(
              <Input placeholder="请输入" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="备注">
            {getFieldDecorator('description', {
              rules: [{
                max: 200,
                message: '请输入',
              }],
              initialValue: ''
            })(
              <Input placeholder="请输入" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="状态">
            {getFieldDecorator('isEnabled', {
              initialValue: true
            })(
              <Switch checkedChildren={<Icon type="check"/>} unCheckedChildren={<Icon type="cross" />}/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="是否默认">
            {getFieldDecorator('isDefault', {
              initialValue: true
            })(
              <Checkbox/>
            )}
          </FormItem>
          <div className="slide-footer">
            <Button type="primary" htmlType="submit">保存</Button>
            <Button onClick={this.onCancel}>取消</Button>
          </div>
        </Form>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {}
}

const WrappedValueList = Form.create()(ValueList);

export default connect(mapStateToProps)(WrappedValueList);
