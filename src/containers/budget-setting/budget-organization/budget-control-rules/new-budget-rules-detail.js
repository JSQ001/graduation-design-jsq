/**
 * created by jsq on 2017/9/28
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

import { Form, Input, Switch, Button, Icon, Checkbox, Alert, message, DatePicker, Select } from 'antd'

import httpFetch from 'share/httpFetch';
import config from 'config'
import Chooser from 'components/chooser.js'

import "styles/budget-setting/budget-organization/budget-control-rules/new-budget-rules-detail.scss"

const FormItem = Form.Item;
const Option = Select.Option;
class NewBudgetRulesDetail extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      ruleId: null,
      isEnabled: true,
      loading: false,
      ruleParameterTypeArray: [], //值列表：规则参数类型
      filtrateMethodArray: [],    //值列表：取值方式
      summaryOrDetailArray: [],   //值列表：取值范围
      ruleParamsArray: [],        //规则参数值列表
      organizationId: '908139656192442369', //TODO:默认组织ID
      valueListMap:{
        ruleParamType: 2012,
        filtrateMethod: 2013,
        summaryOrDetail: 2014,
        'BGT_RULE_PARAMETER_BUDGET': 2015,
        'BGT_RULE_PARAMETER_ORG': 2016,
        'BGT_RULE_PARAMETER_DIM': 2017
      },
      paramValueMap:{},

      ruleParam:{}
    }
  }

  componentWillMount() {
    console.log(this.props.params)
    let organizationIdParams = {organizationId : this.state.organizationId};
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
    this.setState({
      ruleDetail: this.props.params,
      paramValueMap: paramValueMap
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
          key: item.code,
          label: item.messageKey
        };
        name.push(option);
      });
      this.setState({
        name
      })
    });
    return
  }

  componentWillReceiveProps(nextprops){
    this.setState({
      ruleId: nextprops.params,
    })
  }

  handleSubmit = (e)=>{
    e.preventDefault();

    this.setState({
      loading: true,
    });
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log(values)
        values.controlRuleId = this.props.params.ruleId;
        values.parameterLowerLimit = this.state.ruleParam.lowerValue[0].id;
        values.parameterUpperLimit = this.state.ruleParam.upperValue[0].id
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
      }
    });
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

  //选择规则参数
  handleSelectParam = ()=>{
    let ruleParameterType = this.props.form.getFieldValue("ruleParameterType");
    //没有选择规则参数类型，提示：请先选择规则参数类型
    if(typeof ruleParameterType === 'undefined'){
      this.setState({
        ruleParamsStatus:"warning",
        ruleParamsHelp:  "请先选择规则参数类型"
      })
    }
  };

  handleValueChange = (value,key)=>{
    console.log(value)
    if(typeof value === 'undefined'){
      this.setState({
        lowerLimitHelp: "请先选择规则参数",
        lowerLimitStatus: "warning",
        upperLimitHelp: "请先选择规则参数",
        upperLimitStatus: "warning",
      })
    }
    this.setState({
      ruleParam:{
        type: this.state.ruleParam.type,
        name: this.state.ruleParam.name,
        lowerValue: key === "lower" ? value : this.state.ruleParam.lowerValue,
        upperValue: key === "upper" ? value : this.state.ruleParam.upperValue
      }
    })
  };

  render(){
    const { getFieldDecorator } = this.props.form;
    const { loading, ruleParam, valueListMap, ruleDetail, paramValueMap, ruleParamsTypeHelp, ruleParamsStatus, ruleParamsHelp, filtrateMethodHelp, filtrateMethodStatus, summaryOrDetailHelp, summaryOrDetailStatus, upperLimitStatus, upperLimitHelp, lowerLimitStatus, lowerLimitHelp, ruleParameterTypeArray, filtrateMethodArray, summaryOrDetailArray, ruleParamsArray } = this.state;
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
              rules: [{
                required: true,
                message: "请选择"
              },
                {
                  validator: (item,value,callback)=>{
                    console.log(value)
                    if(typeof value != 'undefined'){
                      this.setState({
                        loading: false
                      })
                    }
                    if(typeof value != 'undefined' && ruleParamsStatus === "warning"){
                      this.setState({
                        ruleParamsStatus: null,
                        ruleParamsHelp: null,
                      });
                    }

                    //规则参数类型修改后，规则参数，上限值，下限值自动清空
                    this.props.form.setFieldsValue({"ruleParameter":"","parameterLowerLimit":"","parameterUpperLimit":""});
                    let ruleParameterCode;
                    switch (value){
                      case 'BGT_RULE_PARAMETER_BUDGET': ruleParameterCode = valueListMap.BGT_RULE_PARAMETER_BUDGET; break;
                      case 'BGT_RULE_PARAMETER_ORG': ruleParameterCode = valueListMap.BGT_RULE_PARAMETER_ORG;break;
                      case 'BGT_RULE_PARAMETER_DIM': ruleParameterCode = valueListMap.BGT_RULE_PARAMETER_DIM;break
                    }
                    this.getValueList(ruleParameterCode,ruleParamsArray);
                    callback();
                  }
                }
              ]
            })(
              <Select
                className="input-disabled-color" placeholder={ formatMessage({id:"common.please.select"})}
                onFocus={()=>this.getValueList(valueListMap.ruleParamType, ruleParameterTypeArray)}>
                {
                  ruleParameterTypeArray.map((item)=><Option key={item.key}>{item.label}</Option>)
                }
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={this.props.intl.formatMessage({id:'budget.ruleParameter'})  /*规则参数*/}
            validateStatus={ruleParamsStatus}
            help={ruleParamsHelp}>
            {getFieldDecorator('ruleParameter', {
              rules: [{
                required: true,
              },
                {
                  validator: (item,value,callback)=>{
                    console.log(value)
                    this.setState({
                      ruleParamsStatus: typeof value === 'undefined' ? "error" : "",
                      ruleParamsHelp: typeof value === 'undefined' ?  "请选择"  : "",
                      upperLimitHelp: typeof value ==='undefined' ? upperLimitHelp : "",
                      upperLimitStatus: typeof value ==='undefined' ? upperLimitStatus : "",
                      lowerLimitHelp: typeof value ==='undefined' ? lowerLimitHelp : "",
                      lowerLimitStatus: typeof value ==='undefined' ? lowerLimitStatus : "",
                      ruleParam: {
                        type: this.props.form.getFieldValue("ruleParameterType"),
                        name: value,
                      }
                    });
                    //规则参数修改后，上限值，下限值自动清空
                    this.props.form.setFieldsValue({"parameterLowerLimit":"","parameterUpperLimit":""});
                    callback();
                  }
                }
              ]
            })(
              <Select
                onFocus={this.handleSelectParam}
                className="input-disabled-color" placeholder={ formatMessage({id:"common.please.select"})}>
                {
                  ruleParamsArray.map((item)=><Option key={item.key}>{item.label}</Option>)
                }
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
              <Select
                placeholder={ formatMessage({id:"common.please.select"})}
                onFocus={()=>this.getValueList(valueListMap.filtrateMethod, filtrateMethodArray)}>
                {filtrateMethodArray.map((item)=><Option key={item.key}>{item.label}</Option>)}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout}
            label={formatMessage({id:'budget.summaryOrDetail'})  /*取值范围*/}
            help={summaryOrDetailHelp}>
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
              <Select
                placeholder={formatMessage({id:"common.please.select"})}
                onFocus={()=>this.getValueList(valueListMap.summaryOrDetail, summaryOrDetailArray)}>
                {summaryOrDetailArray.map((item)=><Option key={item.key}>{item.label}</Option>)}
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
                    console.log(value);
                    if(typeof value !== 'undefined'){
                      this.setState({
                        ruleParam:{
                          type: this.state.ruleParam.type,
                          name: this.state.ruleParam.name,
                          lowerValue: value,
                        }
                      })
                    }
                    callback();
                  }
                }
              ]
            })(
              <div>
                {typeof ruleParam.name === 'undefined' ? <Select onFocus={this.handleValueChange}/> :
                  <Chooser
                    type={typeof ruleParam.name === 'undefined' ? "aa" : paramValueMap[ruleParam.name].listType}
                    listExtraParams= {{organizationId:this.state.organizationId}}
                    labelKey={typeof ruleParam.name === 'undefined' ? "aa" : paramValueMap[ruleParam.name].codeKey}
                    valueKey={typeof ruleParam.name === 'undefined' ? "aa" : paramValueMap[ruleParam.name].valueKey}
                    single={true}
                    onChange={(value)=>this.handleValueChange(value,"lower")}
                  />}
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
                    if(typeof value !== 'undefined'){
                      this.setState({
                        ruleParam:{
                          type: this.state.ruleParam.type,
                          name: this.state.ruleParam.name,
                          lowerValue: this.state.ruleParam.lowerValue,
                          upperValue: value,
                        }
                      })
                    }
                    callback();
                  }
                }
              ]
            })(
              <div>
                {typeof ruleParam.name === 'undefined' ? <Select onFocus={this.handleValueChange}/> :
                  <Chooser
                    type={typeof ruleParam.name === 'undefined' ? "aa" : paramValueMap[ruleParam.name].listType}
                    listExtraParams= {{organizationId:this.state.organizationId}}
                    labelKey={typeof ruleParam.name === 'undefined' ? "aa" : paramValueMap[ruleParam.name].codeKey}
                    valueKey={typeof ruleParam.name === 'undefined' ? "aa" : paramValueMap[ruleParam.name].valueKey}
                    single={true}
                    onChange={(value)=>this.handleValueChange(value,"upper")}
                  />}
              </div>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={formatMessage({id:'budget.invalidDate'})  /*失效日期*/}>
            {getFieldDecorator('invalidDate')(
              <DatePicker placeholder={formatMessage({id:"common.please.enter"})} />
            )}
          </FormItem>
          <div className="slide-footer">
            <Button type="primary" htmlType="submit" loading={loading}>保存</Button>
            <Button onClick={this.onCancel}>取消</Button>
            <input ref="blur" style={{ position: 'absolute', top: '-100vh' }}/>  隐藏的input标签，用来取消list控件的focus事件
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
