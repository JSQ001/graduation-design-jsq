/**
 * created by jsq on 2017/9/28
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import moment from 'moment'
import { Form, Input, Switch, Button, Icon, Row, Col, Checkbox, Alert, message, DatePicker, Select } from 'antd'
import httpFetch from 'share/httpFetch';
import config from 'config'
import selectorData from 'share/selectorData'
import Chooser from 'components/chooser.js'
import "styles/budget-setting/budget-organization/budget-control-rules/new-budget-rules-detail.scss"
const FormItem = Form.Item;
const Option = Select.Option;


class UpdateBudgetRulesDetail extends React.Component{
  constructor(props){
    super(props);
    this.detail = {};
    this.state = {
      changed: false,
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
      costCenterId: null,
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
      validateStatusMap:{},
      helpMap:{},
      defaultLimitValue:{
        parameterLowerLimit: [],
        parameterUpperLimit: [],
      },
    }
  }
  componentWillMount() {
    let organizationIdParams = {organizationId : this.props.organization.id};
    let { ruleParameterTypeArray, ruleParamsArray, summaryOrDetailArray, filtrateMethodArray,valueListMap} = this.state;

    let userSelectorItem = selectorData['user'];
    userSelectorItem.key = 'employeeID';
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
      'BUDGET_ITEM': {
        listType: 'budget_item',
        labelKey: 'id',
        valueKey: 'itemName',
        codeKey: 'itemCode',
        listExtraParams: organizationIdParams,
        selectorItem: undefined
      },
      'CURRENCY': {
        listType: 'currency',
        labelKey: 'id',
        valueKey: 'currencyName',
        codeKey: 'currency',
        listExtraParams: organizationIdParams,
        selectorItem: undefined
      },
      'COMPANY': {
        listType: 'company',
        labelKey: 'id',
        valueKey: 'name',
        codeKey: 'companyCode',
        listExtraParams: {setOfBooksId: this.props.company.setOfBooksId},
        selectorItem: undefined
      },
      'COMPANY_GROUP': {
        listType: 'company_group',
        labelKey: 'id',
        valueKey: 'companyGroupName',
        codeKey: 'companyGroupCode',
        listExtraParams: organizationIdParams,
        selectorItem: undefined
      },
      'UNIT': {
        listType: 'department',
        labelKey: 'id',
        valueKey: 'custDeptNumber',
        codeKey: 'name',
        listExtraParams: organizationIdParams,
        selectorItem: undefined
      },
      'UNIT_GROUP': {
        listType: 'department_group',
        labelKey: 'id',
        valueKey: 'description',
        codeKey: 'deptGroupCode',
        listExtraParams: organizationIdParams,
        selectorItem: undefined
      },
      'EMPLOYEE': {
        listType: 'user',
        labelKey: 'fullName',
        valueKey: 'employeeID',
        codeKey: 'employeeID',
        listExtraParams: {},
        selectorItem: userSelectorItem
      },
      'EMPLOYEE_GROUP': {
        listType: 'user_group',
        labelKey: 'name',
        valueKey: 'id',
        codeKey: 'id',
        listExtraParams: {},
        selectorItem: undefined
      }
    };

    this.getValueList(valueListMap.ruleParamType, ruleParameterTypeArray);
    this.getValueList(valueListMap.filtrateMethod, filtrateMethodArray);
    this.getValueList(valueListMap.summaryOrDetail, summaryOrDetailArray);

    let param = this.props.params;
    console.log(param)
    if(typeof  param.ruleParameterType!=="undefined") {
      this.getValueList(valueListMap[this.props.params.ruleParameterType], ruleParamsArray);

      this.detail.name = param.ruleParameter;
      this.detail.type = param.ruleParameterType;

      switch (param.ruleParameterType) {
        case 'BGT_RULE_PARAMETER_BUDGET':
          this.detail.ruleParameterCode = valueListMap.BGT_RULE_PARAMETER_BUDGET;
          break;
        case 'BGT_RULE_PARAMETER_ORG':
          this.detail.ruleParameterCode = valueListMap.BGT_RULE_PARAMETER_ORG;
          break;
        case 'BGT_RULE_PARAMETER_DIM':
          this.detail.ruleParameterCode = valueListMap.BGT_RULE_PARAMETER_DIM;
          break
      }

      let parameterLowerLimit = [];
      let lowerValue = {};
      lowerValue[paramValueMap[param.ruleParameter].codeKey] = param.parameterLowerLimit;
      parameterLowerLimit.push(lowerValue);
      this.detail.parameterLowerLimit = parameterLowerLimit;

      let parameterUpperLimit = [];
      let upperValue = {};
      upperValue[paramValueMap[param.ruleParameter].codeKey] = param.parameterUpperLimit;
      parameterUpperLimit.push(upperValue);
      this.detail.parameterUpperLimit = parameterUpperLimit;
      this.setState({
        ruleParamDetail: param,
        paramValueMap: paramValueMap,
      });
    }
  }

  componentWillReceiveProps(nextprops){
    let { ruleParameterTypeArray, ruleParamsArray, summaryOrDetailArray, filtrateMethodArray,valueListMap, paramValueMap} = this.state;
    let param = nextprops;
    console.log(param)
    if(typeof  param.ruleParameterType!=="undefined") {
      this.getValueList(valueListMap[this.props.params.ruleParameterType], ruleParamsArray);

      this.detail.name = param.ruleParameter;
      this.detail.type = param.ruleParameterType;

      switch (param.ruleParameterType) {
        case 'BGT_RULE_PARAMETER_BUDGET':
          this.detail.ruleParameterCode = valueListMap.BGT_RULE_PARAMETER_BUDGET;
          break;
        case 'BGT_RULE_PARAMETER_ORG':
          this.detail.ruleParameterCode = valueListMap.BGT_RULE_PARAMETER_ORG;
          break;
        case 'BGT_RULE_PARAMETER_DIM':
          this.detail.ruleParameterCode = valueListMap.BGT_RULE_PARAMETER_DIM;
          break
      }

      let parameterLowerLimit = [];
      let lowerValue = {};
      lowerValue[paramValueMap[param.ruleParameter].codeKey] = param.parameterLowerLimit;
      parameterLowerLimit.push(lowerValue);
      this.detail.parameterLowerLimit = parameterLowerLimit;

      let parameterUpperLimit = [];
      let upperValue = {};
      upperValue[paramValueMap[param.ruleParameter].codeKey] = param.parameterUpperLimit;
      parameterUpperLimit.push(upperValue);
      this.detail.parameterUpperLimit = parameterUpperLimit;

      this.setState({
        ruleParamDetail: param,
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
          key: item.code,
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

  //获取成本中心
  getCostCenter(array){
    httpFetch.get(`${config.baseUrl}/api/cost/center/company`).then((response)=>{
      console.log(response)
      response.data.map((item)=>{
        let option = {
          id: item.id,
          value: item.name,
          label: item.name
        };
        array.addIfNotExist(option)
        this.setState({
          array
        })
      });
    })
  }

  handleSubmit = (e)=>{
    e.preventDefault();
    const { loading, formItem, ruleParamDetail, validateStatusMap, helpMap, defaultLimit, ruleParam, paramValueMap,} = this.state;
    /* this.setState({
     loading: true
     });*/
    this.props.form.validateFieldsAndScroll((err, values) => {
      console.log(values)
      console.log(ruleParamDetail)
      values.controlRuleId = ruleParamDetail.controlRuleId;
      values.id = ruleParamDetail.id;
      values.versionNumber = ruleParamDetail.versionNumber;
      values.isEnabled = ruleParamDetail.isEnabled;
      values.isDeleted = ruleParamDetail.isDeleted;
      values.createdBy = ruleParamDetail.createdBy;

      if (!err) {
        if( this.detail.type ==="BGT_RULE_PARAMETER_DIM"){
          values.parameterUpperLimit = values.parameterLowerLimit[0].code;
          values.parameterUpperLimit = values.parameterUpperLimit[0].code;
        }else {
          values.parameterLowerLimit = values.parameterLowerLimit[0][paramValueMap[this.detail.name].codeKey];
          values.parameterUpperLimit = values.parameterUpperLimit[0][paramValueMap[this.detail.name].codeKey];
        }
        console.log(values)
        httpFetch.put(`${config.budgetUrl}/api/budget/control/rule/details`, values).then((res)=> {
          console.log(res);
          if(res.status === 200){
            message.success('操作成功');
            this.props.form.resetFields();
            this.onCancel();

          }
        }).catch((e)=>{
          if(e.response){
            message.error(`修改失败, ${e.response.data.message}`);
          }
          this.setState({loading: false});
        })
      }
    });
  };

  onCancel = () =>{
    this.setState({
      limitParam:{
        parameterLowerLimit: true,
        parameterUpperLimit: true
      },
      validateStatusMap: {},
      helpMap: {},
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
      this.detail[key] = value;
    }
  };

  //选择上下限值
  handleSelectValue = (key) =>{
    let { validateStatusMap, helpMap} = this.state;
    validateStatusMap[key] = "warning";
    helpMap[key] = "请先选择规则参数";
    this.setState({
      validateStatusMap,
      helpMap
    })
  };

  handleSelectType = (value) =>{
    const { valueListMap} = this.state;
    this.props.form.setFieldsValue({"ruleParameter": ""});
    this.detail.type = value;
    this.detail.parameterUpperLimit = [];
    this.detail.parameterLowerLimit = [];
    switch (value) {
      case 'BGT_RULE_PARAMETER_BUDGET':
        this.detail.ruleParameterCode  = valueListMap.BGT_RULE_PARAMETER_BUDGET;
        break;
      case 'BGT_RULE_PARAMETER_ORG':
        this.detail.ruleParameterCode  = valueListMap.BGT_RULE_PARAMETER_ORG;
        break;
      case 'BGT_RULE_PARAMETER_DIM':
        this.detail.ruleParameterCode  = valueListMap.BGT_RULE_PARAMETER_DIM;
        break
    }
    this.setState({changed: true})
  };

  //选择规则参数
  handleSelectParam = (value)=>{
    console.log(this.detail)
    if(this.detail.ruleParameterCode === 2017){
      this.state.ruleParamsArray.splice(0,this.state.ruleParamsArray.length);
      this.getCostCenter(this.state.ruleParamsArray);
    }
    else {
      this.getValueList(this.detail.ruleParameterCode,this.state.ruleParamsArray);
    }
    let ruleParameterType = this.props.form.getFieldValue("ruleParameterType");

  };

  handleChangeParam = (value)=>{
    console.log(value)
    this.detail.parameterUpperLimit = [];
    this.detail.parameterLowerLimit = [];
    this.setState({
      changed: true
    })
  };

  render(){
    const { getFieldDecorator } = this.props.form;
    const { loading, changed, costCenterId, defaultLimitValue, limitParam, validateStatusMap, helpMap,formItem, ruleParam, valueListMap, paramValueMap, ruleParamDetail, ruleDetail, showParamsType, listSelectedData, filtrateMethodHelp, summaryOrDetailHelp, ruleParameterTypeArray, filtrateMethodArray, summaryOrDetailArray, ruleParamsArray } = this.state;
    const { formatMessage } = this.props.intl;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14, offset: 1 },
    };

    return(
      <div className="new-budget-control-rules-detail">
        <Form onSubmit={this.handleSubmit}>
          <Row span={30}>
            <Col span={20}>
             <FormItem {...formItemLayout} label={this.props.intl.formatMessage({id:'budget.ruleParameterType'})  /*规则参数类型*/}>
            {getFieldDecorator('ruleParameterType', {
              initialValue: ruleParamDetail.ruleParameterType,
              rules: [{
                required: true,
                message: formatMessage({id:"common.please.select"})
              },
                {
                  validator: (item,value,callback)=> {
                    callback();
                  }
                }
              ]
            })(
              <Select
                className="input-disabled-color" placeholder={ formatMessage({id:"common.please.select"})}
                onChange={this.handleSelectType}>
                {
                  ruleParameterTypeArray.map((item)=><Option key={item.id}>{item.value}</Option>)
                }
              </Select>
            )}
          </FormItem>
            </Col>
          </Row>
          <Row span={30}>
            <Col span={20}>
               <FormItem {...formItemLayout} label={formatMessage({id:'budget.ruleParameter'})  /*规则参数*/}
            validateStatus={validateStatusMap.ruleParameter}
            help={helpMap.ruleParameter}>
            {getFieldDecorator('ruleParameter', {
              initialValue: ruleParamDetail.ruleParameter,
              rules: [{
                required: true,
                message: formatMessage({id:"common.please.select"})
              },
                {
                  validator: (item,value,callback)=> {
                    console.log(value)
                    this.setState({
                      costCenterId: value
                    });
                    this.detail.name = value
                    callback()
                  }
                }
              ],

            })(
              <Select
                onChange={this.handleChangeParam}
                onFocus={this.handleSelectParam}
                className="input-disabled-color" placeholder={ formatMessage({id:"common.please.select"})}>
                {
                  ruleParamsArray.map((item)=><Option key={item.id}>{item.value}</Option>)
                }
              </Select>
            )}
          </FormItem>
            </Col>
          </Row>
          <Row span={30}>
            <Col span={20}>
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

                    this.setState({
                      filtrateMethodHelp: value === "INCLUDE" ?
                        formatMessage({id: "budget.filtrateMethodHelp.contain"}) /*值范围为闭区间，包含左右边界值*/
                        : value === "EXCLUDE" ? formatMessage({id: "budget.filtrateMethodHelp.exclude"}) : "请选择", /*值范围为开区间，不包含左右边界值*/
                      filtrateMethodStatus: typeof value === 'undefined' ? "error" : null
                    });
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
            </Col>
          </Row>
          <Row span={30}>
            <Col span={20}>
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
              ]
            })(
              <Select disabled placeholder={formatMessage({id:"common.please.select"})}>
                {summaryOrDetailArray.map((item)=><Option key={item.id}>{item.value}</Option>)}
              </Select>
            )}
          </FormItem>
            </Col>
          </Row>
          <Row span={30}>
            <Col span={20}>
              <FormItem {...formItemLayout} label={formatMessage({id:'budget.parameterUpperLimit'})  /*上限值*/}
            validateStatus={validateStatusMap.parameterUpperLimit}
            help={helpMap.parameterUpperLimit}>
            {getFieldDecorator('parameterUpperLimit', {
              initialValue: this.detail.parameterUpperLimit,
              rules: [
                {
                  required: true, message: formatMessage({id:"common.please.select"})
                },
                {
                  validator:(item,value,callback)=>{
                    if(!changed)
                      this.props.form.setFieldsValue({"parameterUpperLimit":this.detail.parameterUpperLimit})
                    else
                      this.props.form.setFieldsValue({"parameterUpperLimit":value})
                    callback();
                  }
                }
              ]
            })(
                typeof this.detail.name === 'undefined' ? <Select  placeholder={formatMessage({id:"common.please.select"})} onFocus={()=>this.handleSelectValue("parameterUpperLimit")}/> :
                  this.detail.type === 'BGT_RULE_PARAMETER_DIM' ?
                    <Chooser
                      placeholder={formatMessage({id:"common.please.select"})}
                      type='cost_center_item_by_id'
                      listExtraParams= {{costCenterId:costCenterId}}
                      labelKey= 'name'
                      valueKey= 'id'
                      single={true}
                      onChange={(value)=>this.handleValueChange(value,"parameterUpperLimit")}
                    />
                    :
                  <Chooser
                    placeholder={formatMessage({id:"common.please.select"})}
                    type={paramValueMap[this.detail.name].listType}
                    listExtraParams= {paramValueMap[this.detail.name].listExtraParams}
                    labelKey={ paramValueMap[this.detail.name].valueKey}
                    valueKey={ paramValueMap[this.detail.name].codeKey}
                    single={true}
                    onChange={(value)=>this.handleValueChange(value,"parameterUpperLimit")}
                  />

            )}
          </FormItem>
            </Col>
          </Row>
          <Row span={30}>
            <Col span={20}>
               <FormItem {...formItemLayout} label={formatMessage({id:'budget.parameterLowerLimit'})  /*下限值*/}
            validateStatus={validateStatusMap.parameterLowerLimit}
            help={helpMap.parameterLowerLimit}>
            {getFieldDecorator('parameterLowerLimit', {
              initialValue: this.detail.parameterLowerLimit,
              rules: [
                {
                  required: true, message:formatMessage({id:"common.please.select"})
                },
                {
                  validator:(item,value,callback)=>{
                    console.log(value)
                    if(!changed)
                     this.props.form.setFieldsValue({"parameterLowerLimit":this.detail.parameterLowerLimit})
                    else
                      this.props.form.setFieldsValue({"parameterLowerLimit":value})
                    callback();
                  }
                }
              ]
            })(
              <div>
                {typeof this.detail.name === 'undefined' ? <Select  placeholder={formatMessage({id:"common.please.select"})} onFocus={()=>this.handleSelectValue("parameterUpperLimit")}/> :
                  this.detail.type === 'BGT_RULE_PARAMETER_DIM' ?
                    <Chooser
                      placeholder={formatMessage({id:"common.please.select"})}
                      type='cost_center_item_by_id'
                      listExtraParams= {{costCenterId:costCenterId}}
                      labelKey= 'name'
                      valueKey= 'id'
                      single={true}
                      value={this.detail.parameterUpperLimit}
                      onChange={(value)=>this.handleValueChange(value,"parameterLowerLimit")}
                    />
                    :
                  <Chooser
                    placeholder={formatMessage({id:"common.please.select"})}
                    type={ paramValueMap[this.detail.name].listType}
                    listExtraParams= {paramValueMap[this.detail.name].listExtraParams}
                    labelKey={ paramValueMap[this.detail.name].valueKey}
                    valueKey={ paramValueMap[this.detail.name].codeKey}
                    single={true}
                    value={this.detail.parameterLowerLimit}
                    onChange={(value)=>this.handleValueChange(value,"parameterLowerLimit")}
                  />}
              </div>
            )}
          </FormItem>
            </Col>
          </Row>
          <Row span={30}>
            <Col span={20}>
              <FormItem {...formItemLayout} label={formatMessage({id:'budget.invalidDate'})  /*失效日期*/}>
            {getFieldDecorator('invalidDate', {
              initialValue: ruleParamDetail.invalidDate ? moment( ruleParamDetail.invalidDate, 'YYYY-MM-DD') : null
            })(
              <DatePicker placeholder={formatMessage({id:"common.please.enter"})} />
            )}
          </FormItem>
            </Col>
          </Row>
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
    organization: state.budget.organization,
    company: state.login.company,
  }
}
const WrappedUpdateBudgetRulesDetail = Form.create()(UpdateBudgetRulesDetail);
export default connect(mapStateToProps)(injectIntl(WrappedUpdateBudgetRulesDetail));
