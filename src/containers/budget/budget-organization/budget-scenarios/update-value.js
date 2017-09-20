import React from 'react'
import { connect } from 'react-redux'
import { Form, Input, Switch, Button, Icon, Checkbox, Alert, message } from 'antd'
const FormItem = Form.Item;
import httpFetch from 'share/httpFetch'
import config from 'config'

import 'styles/budget/budget-scenarios/new-value.scss'

class ValueList extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      isEnabled: true,
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
        httpFetch.post(`${config.budgetUrl}/api/budget/scenarios`, values).then((res)=>{
          console.log(res);
          if(res.status == 200){
            this.props.close(values);
            message.success('操作成功');
          }
        }).catch((e)=>{

        })
      }
    });
  };

  onCancel = () =>{
    this.props.close();
  };

  switchChange = () => {
    this.setState((prevState) => ({
      isEnabled: !prevState.isEnabled
    }))
  }

  render(){
    const { getFieldDecorator } = this.props.form;
    const { isEnabled } = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14, offset: 1 },
    };
    return (
      <div className="new-value">
        <Alert message="帮助提示" description="预算组织为当前用户所在账套下的生效的预算组织，同一账套下预算场景代码不允许重复，一个预算组织下允许多个预算场景同时生效。" type="info" showIcon />
        <Form onSubmit={this.handleSave}>
          <FormItem {...formItemLayout} label="预算组织">
            {getFieldDecorator('scenarioName', {
              rules: [{
                required: true
              }],
              initialValue: ''
            })(
              <Input disabled/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="预算场景代码">
            {getFieldDecorator('scenarioCode', {
              rules: [{
                required: true
              }],
              initialValue: ''
            })(
              <Input disabled/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="预算场景描述" hasFeedback>
            {getFieldDecorator('description', {
              rules: [{
                required: true,
                message: '请输入'
              }],
              initialValue: ''
            })(
              <Input placeholder="请输入" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="状态">
            {getFieldDecorator('isEnabled', {
              initialValue: isEnabled
            })(
              <div>
                <Switch defaultChecked={true} checkedChildren={<Icon type="check"/>} unCheckedChildren={<Icon type="cross" />} onChange={this.switchChange}/>
                <span className="enabled-type">{ isEnabled ? '启用' : '禁用' }</span>
              </div>
            )}
          </FormItem>
          {/*<FormItem {...formItemLayout} label="是否默认">
            {getFieldDecorator('isDefault', {
              initialValue: true
            })(
              <Checkbox/>
            )}
          </FormItem>*/}
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
