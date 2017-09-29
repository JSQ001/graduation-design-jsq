/**
 * created by jsq on 2017/9/28
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

import { Form, Input, Switch, Button, Icon, Checkbox, Alert, message, DatePicker } from 'antd'

import httpFetch from 'share/httpFetch';
import config from 'config'
import menuRoute from 'share/menuRoute'

import "styles/budget-setting/budget-organization/budget-control-rules/new-budget-rules-detail.scss"

const FormItem = Form.Item;
class NewBudgetRulesDetail extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      ruleDetail: {},
    }
  }

  componentWillReceiveProps(nextprops){
    console.log(nextprops.params)
    this.setState({
      ruleDetail: nextprops.params,
    })
  }

  handleSubmit = (e)=>{
    console.log(123)
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log(values)
        this.state.operator.controlRuleId ? this.handleSave : this.handleUpdate
      }
    });
  };

  handleSave = () =>{
    this.setState({loading: true});
    values.controlRuleId = this.props.params.id;
    httpFetch.post(`${config.budgetUrl}/api/budget/control/rule/details`, values).then((res)=>{
      console.log(res);
      this.setState({loading: false});
      if(res.status == 200){
        this.props.close(true);
        message.success('操作成功');
      }
    }).catch((e)=>{
      if(e.response){
        message.error(`新建失败, ${e.response.data.validationErrors[0].message}`);
        this.setState({loading: false});
      } else {
        console.log(e)
      }
    })
  };

  handleUpdate = () =>{
    httpFetch.put(`${config.budgetUrl}/api/budget/control/rule/details`, values).then((res)=> {
      console.log(res);
    })
  };

  onCancel = () =>{
    this.props.close();
  };

  render(){
    const { getFieldDecorator } = this.props.form;
    const { isEnabled, organizationName } = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14, offset: 1 },
    };
    return(
      <div className="new-budget-control-rules-detail">
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label={this.props.intl.formatMessage({id:'budget.ruleParameterType'})  /*规则参数类型*/}>
            {getFieldDecorator('ruleParameterType', {
              rules: [{
                required: true
              }],
            })(
              <Input  className="input-disabled-color"/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={this.props.intl.formatMessage({id:'budget.ruleParameter'})  /*规则参数*/} hasFeedback>
            {getFieldDecorator('ruleParameter', {
              rules: [{
                required: true,
                message: '请输入'
              }],
              initialValue: ''
            })(
              <Input placeholder="请输入" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={this.props.intl.formatMessage({id:'budget.filtrateMethod'})  /*取值方式*/} hasFeedback>
            {getFieldDecorator('filtrateMethod', {
              rules: [{
                required: true,
                message: '请输入'
              }],
              initialValue: ''
            })(
              <Input placeholder="请输入" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={this.props.intl.formatMessage({id:'budget.summaryOrDetail'})  /*取值范围*/}>
            {getFieldDecorator('summaryOrDetail', {
              initialValue: ''
            })(
              <Input placeholder="请输入" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={this.props.intl.formatMessage({id:'budget.parameterLowerLimit'})  /*下限值*/}>
            {getFieldDecorator('parameterLowerLimit', {
              initialValue: isEnabled
            })(
              <Input placeholder="请输入" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={this.props.intl.formatMessage({id:'budget.parameterUpperLimit'})  /*上限值*/}>
            {getFieldDecorator('parameterUpperLimit', {
              initialValue: isEnabled
            })(
              <Input placeholder="请输入" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={this.props.intl.formatMessage({id:'budget.invalidDate'})  /*失效日期*/}>
            {getFieldDecorator('endDate', {
              initialValue: isEnabled
            })(
              <DatePicker placeholder="请输入" />
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
function mapStateToProps(state) {
  return {
    organization: state.budget.organization
  }
}

const WrappedNewBudgetRulesDetail = Form.create()(NewBudgetRulesDetail);
export default connect(mapStateToProps)(injectIntl(WrappedNewBudgetRulesDetail));
