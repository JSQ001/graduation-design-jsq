/**
 * created by jsq on 2017/10/18
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

import { Form, Input, InputNumber, Switch, Button, Icon, Checkbox, Alert, message, DatePicker, Select } from 'antd'

import httpFetch from 'share/httpFetch';
import config from 'config'
import menuRoute from 'share/menuRoute'
import ListSelector from 'components/list-selector.js'

import "styles/budget-setting/budget-organization/budget-control-rules/new-budget-rules-detail.scss"

const FormItem = Form.Item;
const Option = Select.Option;

class NewBudgetRulesDetail extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      ruleDetail: {},
      isEnabled: true,
      loading: false,
      filtrateMethodHelp: '',
      summaryOrDetailHelp: '',
      showParamsType: false,
      listSelectedData: []
    }
  }

  componentWillMount(){
    //获取规则参数类型
  }

  componentWillReceiveProps(nextprops){
    console.log(nextprops.params)
    this.setState({
      ruleDetail: nextprops.params,
    })
  }
  handleFocus = () => {
    this.refs.blur.focus();
    this.showList(true)
  };

  showList = (flag) => {
    let listSelectedData = [];
    let values = this.props.form.getFieldValue("itemTypeName");
    if (values && values.length > 0) {
      values.map(value => {
        listSelectedData.push(value.value)
      });
    }
    this.setState({
      showItemType: flag,
      listSelectedData
    })
  };

  handleListOk = (result) => {
    console.log(result)
    let values = [];
    result.result.map(item => {
      values.push({
        key: item.id,
        label: item.itemTypeName,
        value: item,
      })
    });
    let value = {};
    value["itemTypeName"] = values;
    this.props.form.setFieldsValue(value);
    this.showList(false)
  };


  handleSubmit = (e)=>{
    e.preventDefault();
    this.setState({
      loading: true
    });
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log(values)
        console.log(this.state.ruleDetail)
        typeof this.state.ruleDetail.id === 'undefined' ? this.handleSave(values) : this.handleUpdate(values)
      }
    });
  };

  handleSave = (values) =>{
    this.setState({loading: true});
    values.controlRuleId = this.props.params.controlRuleId;
    httpFetch.post(`${config.budgetUrl}/api/budget/control/rule/details`, values).then((res)=>{
      console.log(res);
      this.setState({loading: false});
      if(res.status == 200){
        this.props.close(true);
        message.success('操作成功');
        this.props.form.resetFields();
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

  handleUpdate = (values) =>{
    values.controlRuleId = this.state.ruleDetail.controlRuleId;
    //values.id = this.state.ruleDetail.id;
    values.versionNumber = this.state.ruleDetail.versionNumber;
    httpFetch.put(`${config.budgetUrl}/api/budget/control/rule/details`, values).then((res)=> {
      console.log(res);
      if(res.status === 200){
        message.success('操作成功');
        this.props.form.resetFields();
        this.props.close(true);
      }
    }).catch((e)=>{
      if(e.response){
        message.error(`修改失败, ${e.response.data.validationErrors[0].message}`);
        this.setState({loading: false});
      }
      else {
        console.log(e)
      }
    })
  };

  onCancel = () =>{
    this.props.form.resetFields();
    this.props.close();
  };

  render(){
    const { getFieldDecorator } = this.props.form;
    const { isEnabled, loading, ruleDetail, showParamsType, listSelectedData, filtrateMethodHelp, summaryOrDetailHelp } = this.state;
    const { formatMessage } = this.props.intl;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14, offset: 1 },
    };

    return(
      <div className="new-budget-control-rules-detail">
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label="数据格式">
            {getFieldDecorator('ruleParameterType', {
            })(
             <div>
               JSON
             </div>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="encodingAeskey" >
            {getFieldDecorator('encodingAeskey', {
              rules: [{
                required: true,
                message: formatMessage({id:"common.please.enter"})
              }],
              initialValue: ruleDetail.ruleParameter
            })(
              <Input placeholder={formatMessage({id:"common.please.enter"})} /> /*请输入*/
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="encodingToken" >
            {getFieldDecorator('encodingToken', {
              rules: [{
                required: true,
                message: formatMessage({id:"common.please.enter"})
              }],
              initialValue: ruleDetail.ruleParameter
            })(
              <Input placeholder={formatMessage({id:"common.please.enter"})} /> /*请输入*/
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="系统名称" >
            {getFieldDecorator('systemName', {
              rules: [{
                required: true,
                message: formatMessage({id:"common.please.enter"})
              }],
              initialValue: ruleDetail.ruleParameter
            })(
              <Input placeholder={formatMessage({id:"common.please.enter"})} /> /*请输入*/
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="管理员名称" >
            {getFieldDecorator('administratorName', {
              rules: [{
                required: true,
                message: formatMessage({id:"common.please.enter"})
              }],
              initialValue: ruleDetail.ruleParameter
            })(
              <Input placeholder={formatMessage({id:"common.please.enter"})} /> /*请输入*/
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="管理员电话" >
            {getFieldDecorator('administratorPhone', {
              rules: [{
                required: true,
                message: formatMessage({id:"common.please.enter"})
              }],
              initialValue: ruleDetail.ruleParameter
            })(
              <Input placeholder={formatMessage({id:"common.please.enter"})} /> /*请输入*/
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="链接超时时间" >
            {getFieldDecorator('encodingToken', {
              rules: [{
                required: true,
                message: formatMessage({id:"common.please.enter"})
              }],
              initialValue: 0
            })(
              <InputNumber
                min={0}
                formatter={value => `${value}ms`}
                parser={value => value.replace('ms', '')}
                placeholder={formatMessage({id:"common.please.enter"})} /> /*请输入*/
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="链接获取超时时间" >
            {getFieldDecorator('encodingToken', {
              rules: [{
                required: true,
                message: formatMessage({id:"common.please.enter"})
              }],
              initialValue: 0
            })(
              <InputNumber
                min={0}
                formatter={value => `${value}ms`}
                parser={value => value.replace('ms', '')}
                placeholder={formatMessage({id:"common.please.enter"})} /> /*请输入*/
            )}
          </FormItem>
          <div className="slide-footer">
            <Button type="primary" htmlType="submit" loading={loading}>保存</Button>
            <Button onClick={this.onCancel}>取消</Button>
            <input ref="blur" style={{ position: 'absolute', top: '-100vh' }}/> {/* 隐藏的input标签，用来取消list控件的focus事件  */}
          </div>
        </Form>
        <ListSelector
          visible={showParamsType}
          type="rule_params"
          onCancel={()=>this.showList(false)}
          onOk={this.handleListOk}
          selectedData={listSelectedData}
          extraParams={{organizationId: this.props.params.id}}/>

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
