import React from 'react'
import { connect } from 'react-redux'
import { Form, Input, Switch, Button, Icon, Checkbox, Alert, message } from 'antd'
const FormItem = Form.Item;
const { TextArea } = Input;
import httpFetch from 'share/httpFetch'
import config from 'config'

import 'styles/budget/budget-organization/budget-scenarios/update-budget-scenarios.scss'

class UpdateBudgetScenarios extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      params: {},
      isEnabled: true,
      loading: false
    };
  }

  componentWillMount(){
    console.log(this.props.params);
    this.setState({
      params: this.props.params,
      isEnabled: this.props.params.isEnabled
    })
  }

  componentWillReceiveProps(nextProps){
    console.log(nextProps.params);
    this.setState({
      params: nextProps.params,
      isEnabled: nextProps.params.isEnabled
    })
  }

  handleSave = (e) =>{
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({loading: true});
        values.id = this.state.params.id;
        values.versionNumber = this.state.params.versionNumber;
        values.defaultFlag = (values.defaultFlag == null ? false : values.defaultFlag);
        httpFetch.put(`${config.budgetUrl}/api/budget/scenarios`, values).then((res)=>{
          this.setState({loading: false});
          if(res.status == 200){
            this.props.close(true);
            message.success('保存成功');
          }
        }).catch((e)=>{
          this.setState({loading: false});
          if(e.response.data.validationErrors){
            message.error(`保存失败, ${e.response.data.validationErrors[0].message}`);
          } else {
            message.error('呼，服务器出了点问题，请联系管理员或稍后再试:(');
          }
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
    const { params, isEnabled, loading } = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14, offset: 1 },
    };
    return (
      <div className="update-budget-scenarios">
        <Alert message="帮助提示" description="预算组织为当前用户所在账套下的生效的预算组织，同一账套下预算场景代码不允许重复，一个预算组织下允许多个预算场景同时生效。" type="info" showIcon />
        <Form onSubmit={this.handleSave}>
          <FormItem {...formItemLayout} label="预算组织">
            {getFieldDecorator('organizationName', {
              rules: [{
                required: true
              }],
              initialValue: params.organizationName
            })(
              <Input disabled className="input-disabled-color"/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="预算场景代码">
            {getFieldDecorator('scenarioCode', {
              rules: [{
                required: true
              }],
              initialValue: params.scenarioCode
            })(
              <Input disabled className="input-disabled-color"/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="预算场景描述">
            {getFieldDecorator('scenarioName', {
              rules: [{
                required: true,
                message: '请输入'
              }],
              initialValue: params.scenarioName
            })(
              <Input placeholder="请输入" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="备注">
            {getFieldDecorator('description', {
              initialValue: params.description
            })(
              <TextArea rows={4} placeholder="请输入"/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="状态">
            {getFieldDecorator('isEnabled', {
              initialValue: isEnabled
            })(
              <div>
                <Switch defaultChecked={params.isEnabled} checkedChildren={<Icon type="check"/>} unCheckedChildren={<Icon type="cross" />} onChange={this.switchChange}/>
                <span className="enabled-type">{ isEnabled ? '启用' : '禁用' }</span>
              </div>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="是否默认">
            {getFieldDecorator('defaultFlag', {
              initialValue: params.defaultFlag
            })(
              <Checkbox defaultChecked={params.defaultFlag}/>
            )}
          </FormItem>
          <div className="slide-footer">
            <Button type="primary" htmlType="submit" loading={loading}>保存</Button>
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

const WrappedUpdateBudgetScenarios = Form.create()(UpdateBudgetScenarios);

export default connect(mapStateToProps)(WrappedUpdateBudgetScenarios);
