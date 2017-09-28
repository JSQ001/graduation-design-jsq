import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

import { Alert, Form, Switch, Icon, Input, Select, Button, Row, Col, message } from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;

import httpFetch from 'share/httpFetch'
import menuRoute from 'share/menuRoute'
import config from 'config'

import 'styles/budget/budget-organization/new-budget-organization.scss'

class UpdateBudgetOrganization extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }

  onCancel = () => {
    this.props.close();
  };

  handleSave = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({loading: true});
        httpFetch.put(`${config.budgetUrl}/api/budget/organizations`, Object.assign(this.props.params, values)).then((res)=>{
          this.setState({loading: false});
          message.success(`组织定义${values.organizationName}保存成功`);
          this.props.close(true);
        }).catch((e)=>{
          if(e.response){
            message.error(`新建失败, ${e.response.data.validationErrors[0].message}`);
            this.setState({loading: false});
          } else {
            console.log(e)
          }
        })
      }
    });
  };

  render(){
    const { getFieldDecorator } = this.props.form;
    const {} = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 10, offset: 1 },
    };
    return (
      <div className="new-budget-organization">
        <Alert
          message="帮助提示"
          description="同一账套下只能有一个生效的预算组织代码，且同一租户下预算组织代码不允许重复。保存后不可修改。"
          type="info"
          showIcon
        />
        <Form onSubmit={this.handleSave}>
          <FormItem {...formItemLayout} label="帐套">
            {getFieldDecorator('setOfBooksId', {
              rules: [{
                required: true,
                message: '请选择帐套'
              }],
              initialValue: this.props.params.setOfBooksId
            })(
              <Select placeholder="请选择帐套" disabled>
                <Option value="1" key='HEC_TEST_DATA_002'>HEC_TEST_DATA_002</Option>
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="预算组织代码">
            {getFieldDecorator('organizationCode', {
              rules: [{
                required: true,
                message: '请输入预算组织代码',
              }],
              initialValue: this.props.params.organizationCode
            })(
              <Input placeholder="请输入预算组织代码" disabled/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="预算组织名称">
            {getFieldDecorator('organizationName', {
              rules: [{
                required: true,
                message: '请输入预算组织名称',
              }],
              initialValue: this.props.params.organizationName
            })(
              <Input placeholder="请输入预算组织名称" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="状态">
            {getFieldDecorator('isEnabled', {
              initialValue: this.props.params.isEnabled
            })(
              <Switch defaultChecked={this.props.params.isEnabled} checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="cross" />}/>
            )}
          </FormItem>
          <div className="slide-footer">
            <Button type="primary" htmlType="submit" loading={this.state.loading}>保存</Button>
            <Button onClick={this.onCancel}>取消</Button>
          </div>
        </Form>
      </div>
    )
  }

}

function mapStateToProps() {
  return {}
}
const WrappedUpdateBudgetOrganization = Form.create()(UpdateBudgetOrganization);

export default connect(mapStateToProps)(injectIntl(WrappedUpdateBudgetOrganization));
