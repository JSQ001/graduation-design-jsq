/**
 * created by jsq on 2017/9/28
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import moment from 'moment'

import { Form, Input, Switch, Button, Icon, Checkbox, Alert, message, DatePicker, Select } from 'antd'

import httpFetch from 'share/httpFetch';
import config from 'config'
import menuRoute from 'share/menuRoute'
import ListSelector from 'components/list-selector.js'
import Chooser from 'components/chooser.js'

import "styles/budget-setting/budget-organization/budget-control-rules/new-budget-rules-detail.scss"

const FormItem = Form.Item;
const Option = Select.Option;
class UpdateBudgetRulesDetail extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      ruleDetail: {},
      isEnabled: true,
      loading: false,
      ruleParameterTypeArray: [], //值列表：规则参数类型
      filtrateMethodArray: [], //值列表：取值方式
      summaryOrDetailArray: [], //值列表：取值范围
      ruleParamsArray: [], //规则参数值列表
      filtrateMethodHelp: '',
      summaryOrDetailHelp: '',
      showParamsType: false,
      listSelectedData: []
    }
  }

  componentWillMount() {
    this.getValueList(2012, this.state.ruleParameterTypeArray);
    this.getValueList(2013, this.state.filtrateMethodArray);
    this.getValueList(2014, this.state.summaryOrDetailArray)

    console.log(this.props)
    //编辑时接收的参数
    this.setState({
      ruleDetail: this.props.params,
    })

  }
  /**
   * 获取值列表
   * @param code :值列表代码
   * @param name :值列表名称
   */
  getValueList(code, name){
    name.splice(0,name.length)
    this.getSystemValueList(code).then((response)=>{
      response.data.values.map((item)=>{
        let option = {
          id: item.code,
          value: item.messageKey
        };
        name.push(option);
      });
      this.setState({
        name
      })
    });
    return
  }

 /* componentWillReceiveProps(nextprops){
    console.log(nextprops.params)
    this.setState({
      ruleDetail: nextprops.params,
    })
  }*/

  handleSubmit = (e)=>{
    e.preventDefault();
    /* this.setState({
     loading: true
     });*/
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log(values)
        console.log(this.state.ruleDetail)
        console.log(this.state.flag)
        //typeof this.state.ruleDetail.id === 'undefined' ? this.handleSave(values) : this.handleUpdate(values)
      }
    });
  };

  handleSave = (values) =>{
    this.setState({loading: true});
    values.controlRuleId = this.props.params.controlRuleId;
    httpFetch.post(`${config.budgetUrl}/api/budget/control/rule/details`, values).then((res)=>{
      console.log(res);
      this.setState({
        loading: false,
        filtrateMethodHelp:'',
        summaryOrDetailHelp:''
      });
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
    this.setState({
      filtrateMethodHelp:'',
      summaryOrDetailHelp:'',
      filtrateMethodStatus:'',
      summaryOrDetailStatus:'',
      ruleParamsStatus: null,
      ruleParamsHelp: null,
      UpperLimitStatus: null,
      UpperLimitHelp: null,
      LowerLimitStatus: null,
      LowerLimitHelp: null,
      ruleParamsTypeStatus: null,
      ruleParamsTypeHelp: null
    });
    this.props.close();
  };

  ruleParamsChange = (values)=>{
    console.log(values)
  };

  render(){
    const { getFieldDecorator } = this.props.form;
    const { loading, ruleDetail, showParamsType, listSelectedData, filtrateMethodHelp, summaryOrDetailHelp, ruleParameterTypeArray, filtrateMethodArray, summaryOrDetailArray, ruleParamsArray } = this.state;
    const { formatMessage } = this.props.intl;

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14, offset: 1 },
    };
    const paramsType = ruleParameterTypeArray.map((item)=><Option key={item.id}>{item.value}</Option>);

    const filtrateMethodOption = filtrateMethodArray.map((item)=><Option key={item.id}>{item.value}</Option>);

    const summaryOrDetailOptions = summaryOrDetailArray.map((item)=><Option key={item.id}>{item.value}</Option>);

    const ruleParams = ruleParamsArray.map((item)=><Option key={item.id}>{item.value}</Option>);
    return(
      <div className="new-budget-control-rules-detail">
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label={this.props.intl.formatMessage({id:'budget.ruleParameterType'})  /*规则参数类型*/}>
            {getFieldDecorator('ruleParameterType', {
              initialValue: ruleDetail.ruleParameterType,
              rules: [{
                required: true,
                message: "请选择规则参数类型"
              },
                {
                  validator: (item,value,callback)=>{
                    this.setState({
                      ruleParamsStatus: null,
                      ruleParamsHelp: null
                    });
                    //规则参数类型修改后，规则参数，上限值，下限值自动清空
                    this.props.form.setFieldsValue({"ruleParameter":"","parameterLowerLimit":"","parameterUpperLimit":""});
                    let ruleParameterCode;
                    switch (value){
                      case 'BGT_RULE_PARAMETER_BUDGET': ruleParameterCode = 2015; break;
                      case 'BGT_RULE_PARAMETER_ORG': ruleParameterCode = 2016;break;
                      case 'BGT_RULE_PARAMETER_DIM': ruleParameterCode = 2017;break
                    }
                    this.getValueList(ruleParameterCode,ruleParamsArray);
                    callback();
                  }
                }
              ]
            })(
              <Select  className="input-disabled-color" placeholder={ formatMessage({id:"common.please.select"})}>
                {paramsType}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={formatMessage({id:'budget.ruleParameter'})  /*规则参数*/}
                    validateStatus={this.state.ruleParamsStatus}
                    help={this.state.ruleParamsHelp}>
            {getFieldDecorator('ruleParameter', {
              rules: [{
                required: true,
                message: formatMessage({id:"common.please.enter"})
              }],
              initialValue: ruleDetail.ruleParameter
            })(
              <Select
                onFocus={()=>{
                  this.setState({
                    ruleParamsStatus: typeof this.props.form.getFieldValue("ruleParameterType") === "undefined" ? "warning": null,
                    ruleParamsHelp: typeof this.props.form.getFieldValue("ruleParameterType") === "undefined" ? "请先选择规则参数类型" : null
                  })
                }}
                className="input-disabled-color" placeholder={ formatMessage({id:"common.please.select"})}>
                {ruleParams}
              </Select>
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
                    console.log(value)
                    this.setState({
                      filtrateMethodHelp: value === "INCLUDE" ?
                        formatMessage({id:"budget.filtrateMethodHelp.contain"}) /*值范围为闭区间，包含左右边界值*/
                        : value === "EXCLUDE" ? formatMessage({id:"budget.filtrateMethodHelp.exclude"}) : "请选择" ,/*值范围为开区间，不包含左右边界值*/
                      filtrateMethodStatus: typeof value === 'undefined' ? "error" : null
                    });
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
                    console.log(value)
                    this.setState({
                      summaryOrDetailHelp: value === "ALL" ? formatMessage({id:"budget.summaryOrDetailHelp.all"}) /*在上下限值内的明细和汇总规则参数都包括在内*/
                        : value === "SUMMARY"? formatMessage({id:"budget.summaryOrDetailHelp.summary"})
                          /*只包括在上下限内的汇总规则参数*/ :
                          value === "DETAIL" ? formatMessage({id:"budget.summaryOrDetailHelp.detail"}) : "请选择", /*只包括在上下限内的明细规则参数*/
                      summaryOrDetailStatus: typeof value === 'undefined' ? "error" : null
                    });
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
            {getFieldDecorator('invalidDate', {
              initialValue: ruleDetail.invalidDate ? moment( ruleDetail.invalidDate, 'YYYY-MM-DD') : null
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
      </div>
    )
  }
}
function mapStateToProps(state) {
  return {
    organization: state.budget.organization
  }
}

const WrappedUpdateBudgetRulesDetail = Form.create()(UpdateBudgetRulesDetail);
export default connect(mapStateToProps)(injectIntl(WrappedUpdateBudgetRulesDetail));
