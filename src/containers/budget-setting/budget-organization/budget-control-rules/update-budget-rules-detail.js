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
let detail = {};

class UpdateBudgetRulesDetail extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      lower: true,
      upper: true,
      isEnabled: true,
      loading: false,
      ruleParameterTypeArray: [], //值列表：规则参数类型
      filtrateMethodArray: [], //值列表：取值方式
      summaryOrDetailArray: [], //值列表：取值范围
      ruleParamsArray: [], //规则参数值列表
      filtrateMethodHelp: '',
      summaryOrDetailHelp: '',
      showParamsType: false,
      listSelectedData: [],
      formItem:{
        changed: false,
        ruleParameterType: false,
        filtrateMethod: false,
      },
      valueListMap:{
        ruleParamType: 2012,
        filtrateMethod: 2013,
        summaryOrDetail: 2014,
        'BGT_RULE_PARAMETER_BUDGET': 2015,
        'BGT_RULE_PARAMETER_ORG': 2016,
        'BGT_RULE_PARAMETER_DIM': 2017
      },
      ruleParamDetail: {}, //规则明初始值
      ruleParam: {},
      paramValueMap: {},
    }
  }
  componentWillMount() {
    let organizationIdParams = {organizationId : this.props.organization.id};
    let { ruleParameterTypeArray, ruleParamsArray, summaryOrDetailArray, filtrateMethodArray,valueListMap} = this.state;
    let paramValueMap = {
      'BUDGET_ITEM_TYPE': {
        listType: 'budget_item_type',
        labelKey: 'id',
        valueKey: 'itemTypeName',
        codeKey: 'itemTypeCode',
        listExtraParams: organizationIdParams,
        selectorItem: undefined
      },
      'BUDGET_ITEM_GROUP': {
        listType: 'budget_item_group',
        labelKey: 'id',
        valueKey: 'itemGroupName',
        codeKey: 'itemGroupCode',
        listExtraParams: organizationIdParams,
        selectorItem: undefined
      },
      'BUDGET_ITEM': {},
      'CURRENCY': {},
      'COMPANY': {},
      'COMPANY_GROUP': {},
      'UNIT': {},
      'UNIT_GROUP': {},
      'EMPLOYEE': {},
      'EMPLOYEE_GROUP': {}
    };

    this.getValueList(valueListMap.ruleParamType, ruleParameterTypeArray);
    this.getValueList(valueListMap.filtrateMethod, filtrateMethodArray);
    this.getValueList(valueListMap.summaryOrDetail, summaryOrDetailArray);

    console.log(this.props.params)
    if(typeof  this.props.params.ruleParameterType!=="undefined") {
      this.getValueList(valueListMap[this.props.params.ruleParameterType], ruleParamsArray);

      this.setState({
        ruleParamDetail: this.props.params,
        paramValueMap: paramValueMap,
        ruleParam: {
          type: this.props.params.ruleParameterType,
          name: this.props.params.ruleParameter,
          parameterLowerLimit: this.props.params.parameterLowerLimit,
          parameterUpperLimit: this.props.params.parameterUpperLimit
        }
      });
    }
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
  handleSubmit = (e)=>{
    e.preventDefault();
    /* this.setState({
     loading: true
     });*/
    this.props.form.validateFieldsAndScroll((err, values) => {
      const {ruleParamDetail, ruleParam, paramValueMap} = this.state;
      console.log(values)
      if (!err) {
        console.log(values)
        console.log(ruleParam)
        console.log(detail)
        console.log(ruleParamDetail)
        values.controlRuleId = ruleParamDetail.controlRuleId;
        values.id = ruleParamDetail.id;

        values.parameterLowerLimit = typeof detail.parameterLowerLimit === 'undefined' ? ruleParam.parameterLowerLimit : detail.parameterLowerLimit[0][paramValueMap[ruleParam.name].codeKey];
        values.parameterUpperLimit = typeof detail.parameterUpperLimit === 'undefined' ? ruleParam.parameterUpperLimit : detail.parameterUpperLimit[0][paramValueMap[ruleParam.name].codeKey];
        console.log(values)
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
      }
    });
  };
  handleUpdate = (values) =>{
  };
  onCancel = () =>{
    this.setState({
    });
    this.props.form.resetFields();
    this.props.close();
  };

  ruleParamsChange = (values)=>{
    console.log(values)
  };

  handleValueChange = (value,key)=>{
    if(value.length!==0){
      console.log(value)
      console.log(key)
      detail[key ] = value;
      this.props.form.setFieldsValue({"parameterLowerLimit": detail.parameterLowerLimit,"parameterUpperLimit":detail.parameterUpperLimit})
    }
    /*if(typeof value !== 'undefined'){
      console.log(value)

      this.setState({
        ruleParam:{
          type: this.state.ruleParam.type,
          name: this.state.ruleParam.name,
          lowerValue: key === "lower" ? value : this.state.ruleParam.lowerValue,
          upperValue: key === "upper" ? value : this.state.ruleParam.upperValue
        }
      })
    }*/

  };

  //验证上下限值
  handleSelectValue = (key) =>{
    let { validateStatusMap, helpMap} = this.state;
    validateStatusMap[key] = "warning";
    helpMap[key] = "请先选择规则参数";
    this.setState({
      validateStatusMap,
      helpMap
    })
  };

  handleSelectType = () =>{
    let ruleParameterType = this.props.form.getFieldValue("ruleParameterType");
    //规则参数类型修改后，规则参数，上限值，下限值自动清空
    /* this.props.form.setFieldsValue({
     "ruleParameter": "",
     "parameterLowerLimit": "",
     "parameterUpperLimit": ""
     });*/
  };

  render(){
    const { getFieldDecorator } = this.props.form;
    const { loading, formItem, ruleParam, valueListMap, paramValueMap, ruleParamDetail, ruleDetail,upperLimitStatus, upperLimitHelp, lowerLimitStatus, lowerLimitHelp, showParamsType, listSelectedData, filtrateMethodHelp, summaryOrDetailHelp, ruleParameterTypeArray, filtrateMethodArray, summaryOrDetailArray, ruleParamsArray } = this.state;
    const { formatMessage } = this.props.intl;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14, offset: 1 },
    };
    return(
      <div className="new-budget-control-rules-detail">
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label={this.props.intl.formatMessage({id:'budget.ruleParameterType'})  /*规则参数类型*/}>
            {getFieldDecorator('ruleParameterType', {
              initialValue: ruleParamDetail.ruleParameterType,
              rules: [{
                required: true,
                message: formatMessage({id:"common.please.select"})
              },
                {
                  validator: (item,value,callback)=> {
                    console.log(value)
                    if(ruleParam.type !== value){
                      formItem.changed = true;
                      formItem.ruleParameterType = true;
                    }
                    if (formItem.ruleParameterType) {
                      console.log(23456789)
                      let temp = {};
                      detail = {};
                      temp.type = value;
                      this.props.form.setFieldsValue({"ruleParameter": ""});
                      this.setState({
                        ruleParam: temp,
                        upper: false,
                        lower: false,
                        formItem
                      });
                    }
                    let ruleParameterCode;
                    switch (value) {
                      case 'BGT_RULE_PARAMETER_BUDGET':
                        ruleParameterCode = valueListMap.BGT_RULE_PARAMETER_BUDGET;
                        break;
                      case 'BGT_RULE_PARAMETER_ORG':
                        ruleParameterCode = valueListMap.BGT_RULE_PARAMETER_ORG;
                        break;
                      case 'BGT_RULE_PARAMETER_DIM':
                        ruleParameterCode = valueListMap.BGT_RULE_PARAMETER_DIM;
                        break
                    }
                    this.getValueList(ruleParameterCode, ruleParamsArray);
                    callback();
                  }
                }
              ]
            })(
              <Select
                className="input-disabled-color" placeholder={ formatMessage({id:"common.please.select"})}
                onFocus={this.handleSelectType}>
                {
                  ruleParameterTypeArray.map((item)=><Option key={item.id}>{item.value}</Option>)
                }
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
              },
                {
                  validator: (item,value,callback)=> {
                    console.log(ruleParam)
                    console.log(value)
                    if (formItem.ruleParameter) {
                      if (typeof value !== 'undefined') {
                        let temp = {};
                        detail = {};
                        temp.type = value;
                        this.setState({
                          ruleParam: temp,
                        });
                        this.props.form.setFieldsValue({"ruleParameter": ""});
                      }
                      let ruleParameterCode;
                      switch (value) {
                        case 'BGT_RULE_PARAMETER_BUDGET':
                          ruleParameterCode = valueListMap.BGT_RULE_PARAMETER_BUDGET;
                          break;
                        case 'BGT_RULE_PARAMETER_ORG':
                          ruleParameterCode = valueListMap.BGT_RULE_PARAMETER_ORG;
                          break;
                        case 'BGT_RULE_PARAMETER_DIM':
                          ruleParameterCode = valueListMap.BGT_RULE_PARAMETER_DIM;
                          break
                      }
                      this.getValueList(ruleParameterCode, ruleParamsArray);
                      callback();
                    }
                    callback()
                  }
                }
              ],
              initialValue: ruleParamDetail.ruleParameter
            })(
              <Select
                onFocus={this.handleSelectParam}
                className="input-disabled-color" placeholder={ formatMessage({id:"common.please.select"})}>
                {
                  ruleParamsArray.map((item)=><Option key={item.id}>{item.value}</Option>)
                }
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout}
            label={ formatMessage({id:'budget.filtrateMethod'})  /*取值方式*/}
            help={filtrateMethodHelp}>
            {getFieldDecorator('filtrateMethod', {
              initialValue: ruleParamDetail.filtrateMethod,
              rules: [{
                required: true,
                message: formatMessage({id:"common.please.select"})
              },
                {
                  validator: (item,value,callback)=>{
                    console.log(value)
                    if(formItem.filtrateMethod) {
                      this.setState({
                        filtrateMethodHelp: value === "INCLUDE" ?
                          formatMessage({id: "budget.filtrateMethodHelp.contain"}) /*值范围为闭区间，包含左右边界值*/
                          : value === "EXCLUDE" ? formatMessage({id: "budget.filtrateMethodHelp.exclude"}) : "请选择", /*值范围为开区间，不包含左右边界值*/
                        filtrateMethodStatus: typeof value === 'undefined' ? "error" : null
                      });
                      callback();
                    }
                    callback();
                  }
                }
              ],
            })(
              <Select placeholder={ formatMessage({id:"common.please.select"})}>
                {filtrateMethodArray.map((item)=><Option key={item.id}>{item.value}</Option>)}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout}
          label={formatMessage({id:'budget.summaryOrDetail'})  /*取值范围*/}
          help={summaryOrDetailHelp}>
            {getFieldDecorator('summaryOrDetail', {
              initialValue: ruleParamDetail.summaryOrDetail,
              rules: [
                {
                  required: true,
                  message: formatMessage({id:"common.please.select"})
                },
                {
                  validator: (item,value,callback)=> {
                    console.log(value)
                    if (formItem.summaryOrDetail) {
                      this.setState({
                        summaryOrDetailHelp: value === "ALL" ? formatMessage({id: "budget.summaryOrDetailHelp.all"}) /*在上下限值内的明细和汇总规则参数都包括在内*/
                          : value === "SUMMARY" ? formatMessage({id: "budget.summaryOrDetailHelp.summary"})
                            /*只包括在上下限内的汇总规则参数*/ :
                            value === "DETAIL" ? formatMessage({id: "budget.summaryOrDetailHelp.detail"}) : "请选择", /*只包括在上下限内的明细规则参数*/
                        summaryOrDetailStatus: typeof value === 'undefined' ? "error" : null
                      });
                      callback();
                    }
                    callback();
                  }
                }
              ]
            })(
              <Select placeholder={formatMessage({id:"common.please.select"})}>
                {summaryOrDetailArray.map((item)=><Option key={item.id}>{item.value}</Option>)}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={formatMessage({id:'budget.parameterLowerLimit'})  /*下限值*/}
            validateStatus={lowerLimitStatus}
            help={lowerLimitHelp}>
            {getFieldDecorator('parameterLowerLimit', {
              rules: [
                {
                  validator:(item,value,callback)=>{
                    if(typeof value !== 'undefined'){
                      this.props.form.setFieldsValue({"parameterLowerLimit": detail.parameterLowerLimit});
                      ruleParam.parameterLowerLimit = value;
                      this.setState({
                        changed: true,
                        ruleParam
                      })
                    }
                    callback();
                  }
                }
              ]
            })(
              <div>
                { !formItem.changed ?
                 <Select defaultValue ={ ruleParamDetail.parameterLowerLimit} placeholder={formatMessage({id:"common.please.select"})}/>:
                  ( typeof ruleParam.name === 'undefined' ? <Select  placeholder={formatMessage({id:"common.please.select"})} onFocus={()=>this.handleSelectValue("parameterLowerLimit")}/> :
                    <Chooser
                      type={typeof ruleParam.name === 'undefined' ? "aa" : paramValueMap[ruleParam.name].listType}
                      listExtraParams= {{organizationId : this.props.organization.id}}
                      labelKey={typeof ruleParam.name === 'undefined' ? "aa" : paramValueMap[ruleParam.name].codeKey}
                      valueKey={typeof ruleParam.name === 'undefined' ? "aa" : paramValueMap[ruleParam.name].valueKey}
                      single={true}
                      onChange={(value)=>this.handleValueChange(value,"parameterLowerLimit")}
                      value={detail.parameterLowerLimit}/>
                  )

                }
              </div>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={formatMessage({id:'budget.parameterUpperLimit'})  /*上限值*/}
            validateStatus={upperLimitStatus}
            help={upperLimitHelp}>
            {getFieldDecorator('parameterUpperLimit', {
              rules: [
                {
                  validator:(item,value,callback)=>{
                    console.log(value)
                    console.log(ruleParam)
                    if(typeof value !== 'undefined'){
                      ruleParam.parameterUpperLimit = value;
                      this.setState({
                        changed: true,
                        ruleParam
                      })
                    }
                    callback();
                  }
                }
              ]
            })(
              <div>
                { !formItem.changed ? <Select defaultValue={ ruleParamDetail.parameterUpperLimit}/> :
                  typeof ruleParam.name === 'undefined' ? <Select  placeholder={formatMessage({id:"common.please.select"})} onFocus={()=>this.handleSelectValue("parameterLowerLimit")}/> :
                  <Chooser
                    type={typeof ruleParam.name === 'undefined' ? "aa" : paramValueMap[ruleParam.name].listType}
                    listExtraParams= {{organizationId : this.props.organization.id}}
                    labelKey={typeof ruleParam.name === 'undefined' ? "aa" : paramValueMap[ruleParam.name].codeKey}
                    valueKey={typeof ruleParam.name === 'undefined' ? "aa" : paramValueMap[ruleParam.name].valueKey}
                    single={true}
                    onChange={(value)=>this.handleValueChange(value,"parameterUpperLimit")}
                    value={detail.parameterUpperLimit}
                  />
                }
              </div>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={formatMessage({id:'budget.invalidDate'})  /*失效日期*/}>
            {getFieldDecorator('invalidDate', {
              initialValue: ruleParamDetail.invalidDate ? moment( ruleParamDetail.invalidDate, 'YYYY-MM-DD') : null
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
