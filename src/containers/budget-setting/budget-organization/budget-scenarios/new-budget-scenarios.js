import React from 'react'
import { connect } from 'react-redux'
import { Form, Input, Switch, Button, Icon, Checkbox, Alert, message } from 'antd'
const FormItem = Form.Item;
const { TextArea } = Input;
import httpFetch from 'share/httpFetch'
import config from 'config'

import 'styles/budget-setting/budget-organization/budget-scenarios/new-budget-scenarios.scss'

class NewBudgetScenarios extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      isEnabled: true,
      organizationName: '',
      loading: false
    };
  }

  componentWillMount(){
    this.setState({
      organizationName: this.props.params.organizationName
    })
  }

  handleSave = (e) =>{
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.organizationId = this.props.params.organizationId;
        if (values.defaultFlag && !values.isEnabled) {
          message.error('默认预算场景的状态必须为启用');
          return false;
        }
        this.setState({loading: true});
        httpFetch.post(`${config.budgetUrl}/api/budget/scenarios`, values).then((res)=>{
          this.setState({loading: false});
          if(res.status === 200){
            this.props.close(true);
            message.success('操作成功');
          }
        }).catch((e)=>{
          if(e.response){
            message.error(`保存失败, ${e.response.data.message}`);
          }
          this.setState({loading: false});
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
  };

  render(){
    const { getFieldDecorator } = this.props.form;
    const { isEnabled, organizationName } = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14, offset: 1 },
    };
    return (
      <div className="new-budget-scenarios">
        <Alert message="帮助提示"
               description="预算组织为当前用户所在账套下的生效的预算组织，同一账套下预算场景代码不允许重复，一个预算组织下允许多个预算场景同时生效。"
               type="info"
               showIcon />
        <Form onSubmit={this.handleSave}>
          <FormItem {...formItemLayout} label="预算组织">
            {getFieldDecorator('organizationName', {
              rules: [{
                required: true
              }],
              initialValue: organizationName
            })(
              <Input disabled className="input-disabled-color"/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="预算场景代码">
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
          <FormItem {...formItemLayout} label="预算场景名称">
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
              initialValue: ''
            })(
              <TextArea autosize={{minRows: 2}} style={{minWidth:'100%'}} placeholder="请输入"/>
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
          <FormItem {...formItemLayout} label="是否默认">
            {getFieldDecorator('defaultFlag', {
              initialValue: false
            })(
              <Checkbox/>
            )}
          </FormItem>
          <div className="slide-footer">
            <Button type="primary" htmlType="submit" loading={this.state.loading}>保 存</Button>
            <Button onClick={this.onCancel}>取 消</Button>
          </div>
        </Form>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {}
}

const WrappedNewBudgetScenarios = Form.create()(NewBudgetScenarios);

export default connect(mapStateToProps)(WrappedNewBudgetScenarios);
