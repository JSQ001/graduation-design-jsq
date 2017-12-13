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
import Selput from 'components/selput'
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
      lov:{},
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
    let organizationIdParams = {organizationId : this.props.organization.id, isEnabled: true};
    let {lov, ruleParameterTypeArray, ruleParamsArray, summaryOrDetailArray, filtrateMethodArray,valueListMap} = this.state;

    let userSelectorItem = selectorData['user'];
    userSelectorItem.key = 'employeeID';

    let itemSelectorItem = selectorData['budget_item'];
    let key = itemSelectorItem.searchForm[1].getUrl.split("?").length
    if(key < 2){
      itemSelectorItem.searchForm[1].getUrl += `?organizationId=${this.props.organization.id}&isEnabled=${true}`;
      itemSelectorItem.searchForm[2].getUrl += `?organizationId=${this.props.organization.id}&isEnabled=${true}`;
    }

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
        selectorItem: itemSelectorItem
      },
      'CURRENCY': {
        listType: 'currency',
        labelKey: 'currencyName',
        valueKey: 'currency',
        codeKey: undefined,
        listExtraParams: {
          roleType: 'TENANT',
          language: 'chineseName'
        },
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
        codeKey: 'custDeptNumber',
        listExtraParams: {},
        selectorItem: undefined
      },
      'UNIT_GROUP': {
        listType: 'department_group',
        labelKey: 'id',
        valueKey: 'description',
        codeKey: 'deptGroupCode',
        listExtraParams: {},
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
      },
      'BUDGET_SCENARIO':{
        listType: 'budget_scenarios',
        labelKey: 'scenarioName',
        valueKey: 'id',
        codeKey: 'scenarioCode',
        listExtraParams: organizationIdParams,
        selectorItem: undefined
      },
      'BUDGET_VERSION':{
        listType: 'budget_versions',
        labelKey: 'versionName',
        valueKey: 'id',
        codeKey: 'versionCode',
        listExtraParams: organizationIdParams,
        selectorItem: undefined
      },
      'BUDGET_STRUCTURE':{
        listType: 'budget_structure',
        labelKey: 'structureName',
        valueKey: 'id',
        codeKey: 'structureCode',
        listExtraParams: organizationIdParams,
        selectorItem: undefined
      },
      'YEAR':{
        listType: 'year',
        labelKey: 'year',
        codeKey: 'year',
        listExtraParams: {setOfBooksId: this.props.company.setOfBooksId},
        selectorItem: undefined
      },
      'QUARTER':{
        listType: 'quarter',
        labelKey: 'messageKey',
        valueKey: 'id',
        codeKey: 'messageKey',
        listExtraParams: {systemCustomEnumerationType: 2021},
        selectorItem: undefined
      },
    };

    this.getValueList(valueListMap.ruleParamType, ruleParameterTypeArray);
    this.getValueList(valueListMap.filtrateMethod, filtrateMethodArray);
    this.getValueList(valueListMap.summaryOrDetail, summaryOrDetailArray);

    let param = this.props.params;
    if(typeof  param.ruleParameterType!=="undefined") {

      if(param.ruleParameterType === 'BGT_RULE_PARAMETER_DIM'){
        let temp = {
          listType: 'cost_center_item_by_id',
          listExtraParams: {costCenterId: param.ruleParameterId},
          codeKey: 'code'
        };
        lov = temp;
        this.getCostCenter(ruleParamsArray);
      }else{
        this.getValueList(valueListMap[this.props.params.ruleParameterType], ruleParamsArray);
        lov = paramValueMap[param.ruleParameter];
      }
      lov.disabled　= false;
      lov.type = param.ruleParameterType;
      this.setState({
        ruleParamDetail: param,
        paramValueMap: paramValueMap,
        lov
      });
    }
  }

  componentWillReceiveProps(nextprops){
    let {lov, ruleParamDetail, ruleParameterTypeArray, ruleParamsArray, summaryOrDetailArray, filtrateMethodArray,valueListMap, paramValueMap} = this.state;
    let param = nextprops;
    if(param.versionNumber !== ruleParamDetail.versionNumber){
      if(param.ruleParameterType === 'BGT_RULE_PARAMETER_DIM'){
        let temp = {
          listType: 'cost_center_item_by_id',
          listExtraParams: {costCenterId: param.ruleParameterId},
          codeKey: 'code'
        };
        this.getCostCenter(ruleParamsArray);
        lov = temp;
      }else{
        this.getValueList(valueListMap[this.props.params.ruleParameterType], ruleParamsArray);
        lov = paramValueMap[param.ruleParameter];
      }
      lov.disabled　= false;
      lov.type = param.ruleParameterType;
      this.setState({
        ruleParamDetail: param,
        paramValueMap: paramValueMap,
        lov
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
      response.data.map((item)=>{
        let option = {
          id: item.code + "+"+item.costCenterOID+"+"+item.id,
          value: item.name,
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
     this.setState({
     loading: true
     });
    this.props.form.validateFieldsAndScroll((err, values) => {
      console.log(ruleParamDetail)
      values.id = ruleParamDetail.id;
      values.controlRuleId = ruleParamDetail.controlRuleId;
      values.versionNumber = ruleParamDetail.versionNumber;
      values.isEnabled = ruleParamDetail.isEnabled;
      values.isDeleted = ruleParamDetail.isDeleted;
      values.createdBy = ruleParamDetail.createdBy;

      if(ruleParamDetail.ruleParameterDescription === values.ruleParameter){
        values.ruleParameter = ruleParamDetail.ruleParameter;
        values.ruleParameterOID = ruleParamDetail.ruleParameterOID
        console.log(ruleParamDetail.ruleParameterOID)

      }else {
        let str = values.ruleParameter.split("+");
        values.ruleParameter = str[0];
        values.ruleParameterOID = str[1];
      }
      if (!err) {
        httpFetch.put(`${config.budgetUrl}/api/budget/control/rule/details`, values).then((res)=> {
         if(res.status === 200){
           message.success(`${this.props.intl.formatMessage({id:"common.operate.success"})}`);
           this.props.form.resetFields();
           this.onCancel(true);
         }
       }).catch((e)=>{
       if(e.response){
       message.error(`${this.props.intl.formatMessage({id:"common.create.filed"})}, ${e.response.data.message}`);
       }
       this.setState({loading: false});
       })
      }
    });
  };

  onCancel = (flag) =>{
    this.setState({
      limitParam:{
        parameterLowerLimit: true,
        parameterUpperLimit: true
      },
      validateStatusMap: {},
      helpMap: {},
    });
    this.props.form.resetFields();
    this.props.close(flag);
  };

  handleSelectType = (value) =>{
    const {ruleParamsArray, lov} = this.state;
    let temp = {};
    temp.type = value;
    temp.disabled = true;
    this.setState({
      lov: temp
    });
    let ruleParameterCode;
    switch (value){
      case 'BGT_RULE_PARAMETER_BUDGET': ruleParameterCode= 2015; break;
      case 'BGT_RULE_PARAMETER_ORG': ruleParameterCode = 2016;break;
      case 'BGT_RULE_PARAMETER_DIM': ruleParameterCode = 2017;break
    }
    if(ruleParameterCode === 2017){
      ruleParamsArray.splice(0,ruleParamsArray.length);
      this.getCostCenter(ruleParamsArray);
    }
    else {
      this.getValueList(ruleParameterCode,ruleParamsArray);
    }
    this.props.form.setFieldsValue({"ruleParameter":"","parameterLowerLimit": "", "parameterUpperLimit": ""});

  };

  //选择规则参数
  handleChangeParam = (value)=>{
    console.log(value)
    const {paramValueMap,lov} = this.state;
    let temp={};
    if(lov.type === 'BGT_RULE_PARAMETER_DIM'){
      temp = {
        listType: 'cost_center_item_by_id',
        listExtraParams: {costCenterId: value.split("+")[2]},
        codeKey: 'code'
      }
    }else {
      temp = paramValueMap[value];
    }
    temp.type = lov.type;
    temp.disabled = false;
    let ruleParameterType = this.props.form.getFieldValue("ruleParameterType");
    this.props.form.setFieldsValue({"parameterLowerLimit": "", "parameterUpperLimit": ""});
    this.setState({
      lov: temp,
      loading:false
    })
  };

  handleMethodChange = (value)=>{
    this.setState({
      filtrateMethodHelp: value === "INCLUDE" ?
        this.props.intl.formatMessage({id: "budget.filtrateMethodHelp.contain"}) /*值范围为闭区间，包含左右边界值*/
        : value === "EXCLUDE" ? this.props.intl.formatMessage({id: "budget.filtrateMethodHelp.exclude"}) : "请选择", /*值范围为开区间，不包含左右边界值*/
      filtrateMethodStatus: typeof value === 'undefined' ? "error" : null
    });
  };

  render(){
    const { getFieldDecorator } = this.props.form;
    const { loading, lov, validateStatusMap, helpMap, ruleParam, valueListMap, paramValueMap, ruleParamDetail, ruleDetail, showParamsType, listSelectedData, filtrateMethodHelp, summaryOrDetailHelp, ruleParameterTypeArray, filtrateMethodArray, summaryOrDetailArray, ruleParamsArray } = this.state;
    const { formatMessage } = this.props.intl;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14, offset: 1 },
    };
    return(
      <div className="new-budget-control-rules-detail">
        <Form onSubmit={this.handleSubmit}>
          <Row gutter={30}>
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
                  onChange={this.handleSelectType}
                  >
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
                  initialValue: ruleParamDetail.ruleParameterType==='BGT_RULE_PARAMETER_DIM' ? ruleParamDetail.ruleParameterDescription : ruleParamDetail.ruleParameter,
                  rules: [{
                    required: true,
                    message: formatMessage({id:"common.please.select"})
                  },
                    {
                      validator: (item,value,callback)=> {
                        callback()
                      }
                    }
                  ],

                })(
                  <Select
                    onChange={this.handleChangeParam}
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
                    callback();
                  }
                }
              ],
            })(
              <Select
                onChange={this.handleMethodChange}
                placeholder={ formatMessage({id:"common.please.select"})}>
                {filtrateMethodArray.map((item)=><Option key={item.id}>{item.value}</Option>)}
              </Select>
            )}
          </FormItem>
            </Col>
          </Row>
          <Row gutter={30}>
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
          <Row gutter={30}>
            <Col span={20}>
              <FormItem {...formItemLayout} label={formatMessage({id:'budget.parameterUpperLimit'})  /*上限值*/}
                        validateStatus={validateStatusMap.parameterUpperLimit}
                        help={helpMap.parameterUpperLimit}>
                {getFieldDecorator('parameterUpperLimit', {
                  initialValue: ruleParamDetail.parameterUpperLimit,
                  rules: [
                    {
                      required: true, message: formatMessage({id:"common.please.select"})
                    },
                    {
                      validator:(item,value,callback)=>{
                        callback();
                      }
                    }
                  ]
                })(
                  <Selput type={lov.listType}
                          valueKey={ lov.codeKey}
                          listExtraParams={lov.listExtraParams}
                          disabled={lov.disabled}
                          onChange={()=>{}}/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={30}>
            <Col span={20}>
              <FormItem {...formItemLayout} label={formatMessage({id:'budget.parameterLowerLimit'})  /*下限值*/}
                        validateStatus={validateStatusMap.parameterLowerLimit}
                        help={helpMap.parameterLowerLimit}>
                {getFieldDecorator('parameterLowerLimit', {
                  initialValue: ruleParamDetail.parameterLowerLimit,
                  rules: [
                    {
                      required: true, message:formatMessage({id:"common.please.select"})
                    },
                    {
                      validator:(item,value,callback)=>{
                        callback();
                      }
                    }
                  ]
                })(

                  <Selput type={lov.listType}
                          valueKey={ lov.codeKey}
                          listExtraParams={lov.listExtraParams}
                          disabled={lov.disabled}
                          onChange={()=>{}}/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={30}>
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
            <Button type="primary" htmlType="submit" loading={loading}>{formatMessage({id:"common.save"})}</Button>
            <Button onClick={this.onCancel}>{formatMessage({id:"common.cancel"})}</Button>
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
