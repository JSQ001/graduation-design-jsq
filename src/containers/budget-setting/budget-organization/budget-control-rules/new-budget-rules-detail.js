/**
 * created by jsq on 2017/9/28
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

import { Form, Input, Switch, Button, Icon, Row, Col, Alert, message, DatePicker, Select } from 'antd'

import httpFetch from 'share/httpFetch';
import config from 'config'
import Chooser from 'components/chooser.js'
import selectorData from 'share/selectorData'


import "styles/budget-setting/budget-organization/budget-control-rules/new-budget-rules-detail.scss"

const FormItem = Form.Item;
const Option = Select.Option;
class NewBudgetRulesDetail extends React.Component{
  constructor(props){
    super(props);
    this.detail = {};
    this.state = {
      ruleId: null,
      isEnabled: true,
      loading: false,
      ruleParameterTypeArray: [], //值列表：规则参数类型
      filtrateMethodArray: [],    //值列表：取值方式
      summaryOrDetailArray: [],   //值列表：取值范围
      ruleParamsArray: [],        //规则参数值列表
      organizationId: "",
      paramValueMap:{},
      ruleParamDetail:{},
      validateStatusMap: {},
      helpMap: {},
      costCenterId:null
    }
  }

  componentWillMount() {
    let organizationIdParams = {organizationId : this.state.organizationId};
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
    console.log(this.props.params)
    this.getValueList(2014, this.state.summaryOrDetailArray);
    this.setState({
      ruleDetail: this.props.params,
      paramValueMap: paramValueMap
    });
  }
  /**
   * 获取值列表
   * @param code :值列表代码
   * @param name :值列表名称
  */
  getValueList(code, name){
    name.splice(0,name.length);
    this.getSystemValueList(code).then((response)=>{
      response.data.values.map((item)=>{
        let option = {
          key: item.code,
          id: item.code,
          value: item.messageKey
        };
        name.addIfNotExist(option);
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

  componentWillReceiveProps(nextprops){
    this.setState({
      ruleId: nextprops.params,
      organizationId: this.props.organization.id
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
        values.controlRuleId = this.props.ruleId;
        if(values.ruleParameterType === "BGT_RULE_PARAMETER_DIM"){
          values.parameterLowerLimit = values.parameterLowerLimit[0].code;
          values.parameterUpperLimit = values.parameterUpperLimit[0].code;
        }else {
          values.parameterLowerLimit = values.parameterLowerLimit[0][this.state.paramValueMap[this.detail.name].codeKey];
          values.parameterUpperLimit = values.parameterUpperLimit[0][this.state.paramValueMap[this.detail.name].codeKey];
        }
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
            detail = {};
            let {validateStatusMap,helpMap} = this.state;
            validateStatusMap = {};
            helpMap = {};
            this.setState({
              loading: false,
              validateStatusMap,
              helpMap
            });
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
      ruleParameterTypeArray: [],
      ruleParamsArray: [],
      validateStatusMap: {},
      helpMap: {},
      loading: false
    });
    this.detail ={};
    this.props.close();
  };

  //选择规则参数
  handleSelectParam = (value)=>{
    let ruleParameterType = this.props.form.getFieldValue("ruleParameterType");
    //没有选择规则参数类型，提示：请先选择规则参数类型
    if(typeof ruleParameterType === 'undefined'){
      let { validateStatusMap, helpMap} = this.state;
      validateStatusMap.ruleParameter= "warning";
      helpMap.ruleParameter = "请先选择规则参数类型";
      this.setState({
        validateStatusMap,
        helpMap
      })
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

  handleValueChange = (value,key)=>{
    if(value.length!==0){
      this.detail[key] = value;
      let {validateStatusMap, helpMap} = this.state;
      if(key === "parameterLowerLimit"){
        this.props.form.setFieldsValue({"parameterLowerLimit":value});
        validateStatusMap.parameterLowerLimit = "";
        helpMap.parameterLowerLimit ="";
      }else {
        this.props.form.setFieldsValue({"parameterUpperLimit":value});
        validateStatusMap.parameterUpperLimit = "";
        helpMap.parameterUpperLimit ="";
      }
      this.setState({validateStatusMap,helpMap})
    }
  };


  render(){
    const { getFieldDecorator } = this.props.form;
    const { formatMessage } = this.props.intl;
    const { loading, costCenterId, paramValueMap, validateStatusMap, helpMap, ruleParameterTypeArray, filtrateMethodArray, summaryOrDetailArray, ruleParamsArray } = this.state;

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14, offset: 1 },
    };
    console.log(this.detail)

    return(
      <div className="new-budget-control-rules-detail">
        <Form onSubmit={this.handleSubmit}>
          <Row gutter={30}>
            <Col span={20}>
              <FormItem {...formItemLayout} label={formatMessage({id:'budget.ruleParameterType'})  /*规则参数类型*/}
            validateStatus={validateStatusMap.ruleParameterType}
            help={helpMap.ruleParameterType}>
            {getFieldDecorator('ruleParameterType', {
              rules: [{
                required: true,
                message:  formatMessage({id:"common.please.select"})
              },
                {
                  validator: (item,value,callback)=>{
                    console.log(value)
                    if(typeof value !== 'undefined'){
                      validateStatusMap.ruleParameter = "";
                      helpMap.ruleParameter = "";
                      validateStatusMap.ruleParameterType = "";
                      helpMap.ruleParameterType = "";

                      this.detail.type = value;
                      this.detail.name = undefined;
                      this.setState({
                        loading: false,
                        validateStatusMap,
                        helpMap,
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
                      //规则参数类型修改后，规则参数，上限值，下限值自动清空
                      this.props.form.setFieldsValue({"ruleParameter":""});
                      callback();
                    }else {
                      validateStatusMap.ruleParameterType = "error";
                      helpMap.ruleParameterType = formatMessage({id:"common.please.select"});
                      this.setState({validateStatusMap,helpMap})
                    }
                  }
                }
              ]
            })(
              <Select
                className="input-disabled-color" placeholder={ formatMessage({id:"common.please.select"})}
                onFocus={()=>this.getValueList(2012, ruleParameterTypeArray)}>
                {
                  ruleParameterTypeArray.map((item)=><Option key={item.id}>{item.value}</Option>)
                }
              </Select>
            )}
          </FormItem>
            </Col>
          </Row>
          <Row gutter={30}>
            <Col span={20}>
              <FormItem {...formItemLayout} label={formatMessage({id:'budget.ruleParameter'})  /*规则参数*/}
            validateStatus={validateStatusMap.ruleParameter}
            help={helpMap.ruleParameter}>
            {getFieldDecorator('ruleParameter', {
              rules: [{
                required: true,
              },
                {
                  validator: (item,value,callback)=>{
                    console.log(value)
                    if(typeof value === 'undefined'){
                      validateStatusMap.ruleParameter = "error";
                      helpMap.ruleParameter = formatMessage({id:"common.please.select"})
                    }else {
                      this.detail.name = value;
                      validateStatusMap.parameterLowerLimit = "";
                      validateStatusMap.parameterUpperLimit = "";
                      helpMap.parameterLowerLimit = "";
                      helpMap.parameterUpperLimit = "";
                      this.setState({
                        costCenterId: value,
                        detail: this.detail
                      });
                      //规则参数修改后，上限值，下限值自动清空
                      this.props.form.setFieldsValue({"parameterLowerLimit": [], "parameterUpperLimit": []});
                      callback();
                    }
                  }
                }
              ]
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
            </Col>
          </Row>
          <Row gutter={30}>
            <Col span={20}>
              <FormItem {...formItemLayout}
            label={ formatMessage({id:'budget.filtrateMethod'})  /*取值方式*/}
            validateStatus={validateStatusMap.filtrateMethod}
            help={helpMap.filtrateMethod}>
            {getFieldDecorator('filtrateMethod', {
              rules: [{
                required: true,
                message: formatMessage({id:"common.please.select"})
              },
                {
                  validator: (item,value,callback)=>{
                    helpMap.filtrateMethod =  value === "INCLUDE" ? formatMessage({id:"budget.filtrateMethodHelp.contain"}) /*值范围为闭区间，包含左右边界值*/
                      : value === "EXCLUDE" ? formatMessage({id:"budget.filtrateMethodHelp.exclude"}) : "请选择" ,/*值范围为开区间，不包含左右边界值*/
                    validateStatusMap.filtrateMethod = typeof value === 'undefined' ? "error" : "";
                    this.setState({
                      helpMap,
                      validateStatusMap
                    });
                    callback();
                  }
                }
              ],
            })(
              <Select
                placeholder={ formatMessage({id:"common.please.select"})}
                onFocus={()=>this.getValueList(2013, filtrateMethodArray)}
                >
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
            validateStatus={validateStatusMap.summaryOrDetail}
            help={helpMap.summaryOrDetail}>
            {getFieldDecorator('summaryOrDetail', {
              initialValue: "DETAIL",
              rules: [
                {
                  required: true,
                  message: formatMessage({id:"common.please.select"})
                },
                {
                  validator: (item,value,callback)=>{              /*在上下限值内的明细和汇总规则参数都包括在内*/                                     /*只包括在上下限内的汇总规则参数*/
                    helpMap.summaryOrDetail = value === "ALL" ? formatMessage({id:"budget.summaryOrDetailHelp.all"}) : value === "SUMMARY"? formatMessage({id:"budget.summaryOrDetailHelp.summary"})
                        : value === "DETAIL" ? formatMessage({id:"budget.summaryOrDetailHelp.detail"}) : formatMessage({id:"common.please.select"}),          /*只包括在上下限内的明细规则参数*/
                    validateStatusMap.summaryOrDetail = typeof value === 'undefined' ? "error" : "";
                    this.setState({
                      validateStatusMap,
                      helpMap
                    });
                    callback();
                  }
                }
              ]
            })(
              <Select
                disabled
                placeholder={formatMessage({id:"common.please.select"})}
                >
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
            {getFieldDecorator('parameterUpperLimit',{
              initialValue: this.detail.parameterUpperLimit,
              rules: [
                {
                  required: true,
                  message: formatMessage({id: "common.please.select"})
                },
                {
                  validator: (item,value,callback)=>{
                    console.log(value)
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
                      onChange={(value)=>this.handleValueChange(value,"parameterUpperLimit")}
                    />
                    :
                  <Chooser
                    placeholder={formatMessage({id:"common.please.select"})}
                    type={ paramValueMap[this.detail.name].listType}
                    listExtraParams= {{organizationId:this.state.organizationId}}
                    labelKey={ paramValueMap[this.detail.name].codeKey}
                    valueKey={ paramValueMap[this.detail.name].valueKey}
                    single={true}
                    value={this.detail.parameterUpperLimit}
                    onChange={(value)=>this.handleValueChange(value,"parameterUpperLimit")}
                  />}
              </div>
            )}
          </FormItem>
            </Col>
          </Row>
          <Row gutter={30}>
            <Col span={20}>
              <FormItem {...formItemLayout} label={formatMessage({id:'budget.parameterLowerLimit'})  /*下限值*/}
                    validateStatus={validateStatusMap.parameterLowerLimit}
                    help={helpMap.parameterLowerLimit}>
            {getFieldDecorator('parameterLowerLimit',
              {
                initialValue: this.detail.parameterLowerLimit,
                rules: [
                  {
                    required: true,
                    message: formatMessage({id: "common.please.select"})
                  },
                  {
                    validator: (item,value,callback)=>{
                      console.log(value)
                      if(typeof value === 'undefined'){
                        validateStatusMap.parameterLowerLimit = "error";
                        helpMap.parameterLowerLimit = formatMessage({id: "common.please.select"})
                      }
                      callback();
                    }
                  }
                ]
              })(
              <div>
                {typeof this.detail.name === 'undefined' ? <Select  placeholder={formatMessage({id:"common.please.select"})} onFocus={()=>this.handleSelectValue("parameterLowerLimit")}/> :
                  this.detail.type === 'BGT_RULE_PARAMETER_DIM' ?
                    <Chooser
                      placeholder={formatMessage({id:"common.please.select"})}
                      type='cost_center_item_by_id'
                      listExtraParams= {{costCenterId:costCenterId}}
                      labelKey= 'name'
                      valueKey= 'id'
                      single={true}
                      value={this.detail.parameterLowerLimit}
                      onChange={(value)=>this.handleValueChange(value,"parameterLowerLimit")}
                    />
                    :
                  <Chooser
                    placeholder={formatMessage({id:"common.please.select"})}
                    type={ paramValueMap[this.detail.name].listType}
                    listExtraParams= {{organizationId:this.state.organizationId}}
                    labelKey={  paramValueMap[this.detail.name].codeKey}
                    valueKey={  paramValueMap[this.detail.name].valueKey}
                    single={true}
                    value={this.detail.parameterLowerLimit}
                    onChange={(value)=> this.handleValueChange(value,"parameterLowerLimit")}
                  />}
              </div>
            )}
          </FormItem>
            </Col>
          </Row>
          <Row gutter={30}>
            <Col span={20}>
             <FormItem {...formItemLayout} label={formatMessage({id:'budget.invalidDate'})  /*失效日期*/}>
            {getFieldDecorator('invalidDate')(
              <DatePicker placeholder={formatMessage({id:"common.please.enter"})} />
            )}
          </FormItem>
            </Col>
          </Row>
          <div className="slide-footer">
            <Button type="primary" htmlType="submit" loading={loading}>{formatMessage({id:"common.save"})}</Button>
            <Button onClick={this.onCancel}>{formatMessage({id:"common.cancel"})}</Button>
            <input ref="blur" style={{ position: 'absolute', top: '-100vh' }}/>
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

const WrappedNewBudgetRulesDetail = Form.create()(NewBudgetRulesDetail);
export default connect(mapStateToProps)(injectIntl(WrappedNewBudgetRulesDetail));
