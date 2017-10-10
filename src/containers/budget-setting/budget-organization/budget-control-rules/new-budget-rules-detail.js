/**
 * created by jsq on 2017/9/28
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

import { Form, Input, Switch, Button, Icon, Checkbox, Alert, message, DatePicker, Select } from 'antd'

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
    const ruleParamsType = [
      {id: "dimension", value: formatMessage({id:"ruleParamsType.dimension"})}, /*维度相关*/
      {id: "budget", value: formatMessage({id:"ruleParamsType.budget"})}, /*预算相关*/
      {id: "organization", value: formatMessage({id:"ruleParamsType.organization"})}, /*组织架构相关*/
    ];
    const paramsType = ruleParamsType.map((item)=><Option key={item.id}>{item.value}</Option>);

    const filtrateMethod = [
      {id: "contain", value: '包含'},
      {id: "exclude", value: '排除'}
    ];
    const filtrateMethodOption = filtrateMethod.map((item)=><Option key={item.id}>{item.value}</Option>)

    const summaryOrDetail = [
      {id: 'all', value: '全部'},
      {id: 'summary', value: '汇总'},
      {id: 'detail', value: '明细'}
    ];
    const summaryOrDetailOptions = summaryOrDetail.map((item)=><Option key={item.id}>{item.value}</Option>)

    return(
      <div className="new-budget-control-rules-detail">
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label={this.props.intl.formatMessage({id:'budget.ruleParameterType'})  /*规则参数类型*/}>
            {getFieldDecorator('ruleParameterType', {
              rules: [{
                required: true
              }],
              initialValue: ruleDetail.ruleParameterType
            })(
              <Select  className="input-disabled-color" placeholder={ formatMessage({id:"common.please.select"})}>
                {paramsType}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={formatMessage({id:'budget.ruleParameter'})  /*规则参数*/} hasFeedback>
            {getFieldDecorator('ruleParameter', {
              rules: [{
                required: true,
                message: formatMessage({id:"common.please.enter"})
              }],
              initialValue: ruleDetail.ruleParameter
            })(
              <Select
                labelInValue
                onFocus={this.handleFocus}
                placeholder={formatMessage({id:"common.please.select"})} /> /*请输入*/
            )}
          </FormItem>
          <FormItem {...formItemLayout}
            label={ formatMessage({id:'budget.filtrateMethod'})  /*取值方式*/}
            help={filtrateMethodHelp}>
            {getFieldDecorator('filtrateMethod', {
              rules: [{
                required: true,
                message: formatMessage({id:"common.please.select"})
              },
                {
                  validator: (item,value,callback)=>{
                    this.setState({
                      filtrateMethodHelp: value === "contain" ? formatMessage({id:"budget.filtrateMethodHelp.contain"}) /*值范围为闭区间，包含左右边界值*/
                        : formatMessage({id:"budget.filtrateMethodHelp.exclude"}) /*值范围为开区间，不包含左右边界值*/
                    })
                    callback();
                  }
                }
              ],
              initialValue: ruleDetail.filtrateMethod
            })(
              <Select placeholder={ formatMessage({id:"common.please.select"})}>
                {filtrateMethodOption}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout}
            label={formatMessage({id:'budget.summaryOrDetail'})  /*取值范围*/}
            help={summaryOrDetailHelp}
          >
            {getFieldDecorator('summaryOrDetail', {
              initialValue: ruleDetail.summaryOrDetail,
              rules: [
                {
                  required: true,
                  message: formatMessage({id:"common.please.select"})
                },
                {
                  validator: (item,value,callback)=>{
                    this.setState({
                      summaryOrDetailHelp: value === "all" ? formatMessage({id:"budget.summaryOrDetailHelp.all"}) /*在上下限值内的明细和汇总规则参数都包括在内*/
                        : value === "summary"? formatMessage({id:"budget.summaryOrDetailHelp.summary"})
                          /*只包括在上下限内的汇总规则参数*/ :
                          formatMessage({id:"budget.summaryOrDetailHelp.detail"}) /*只包括在上下限内的明细规则参数*/
                    })
                    callback();
                  }
                }
              ]
            })(
              <Select placeholder={formatMessage({id:"common.please.select"})} >
                {summaryOrDetailOptions}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={formatMessage({id:'budget.parameterLowerLimit'})  /*下限值*/}>
            {getFieldDecorator('parameterLowerLimit', {
              initialValue: ruleDetail.parameterLowerLimit
            })(
              <Input placeholder={ formatMessage({id:"common.please.enter"})} />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={formatMessage({id:'budget.parameterUpperLimit'})  /*上限值*/}>
            {getFieldDecorator('parameterUpperLimit', {
              initialValue: ruleDetail.parameterUpperLimit
            })(
              <Input placeholder={formatMessage({id:"common.please.enter"})} />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={formatMessage({id:'budget.invalidDate'})  /*失效日期*/}>
            {getFieldDecorator('endDate', {
              initialValue: ruleDetail.invalidDate
            })(
              <DatePicker placeholder={formatMessage({id:"common.please.enter"})} />
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
          type="ruleParams"
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
