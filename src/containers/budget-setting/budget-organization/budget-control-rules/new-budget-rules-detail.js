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
      filtrateMethodHelp: '',
      filtrateMethodStatus: '',
      summaryOrDetailStatus:'',
      summaryOrDetailHelp: '',    //
      ruleParamsStatus: "",       //规则参数验证状态
      ruleParamsHelp: "",         //规则参数验证提示
      UpperLimitStatus:"",        //上限值验证状态
      UpperLimitHelp:"",          //上限值验证提示
      LowerLimitStatus:"",        //下限值验证状态
      LowerLimitHelp:"",           //下限值验证提示
    }
  }

  componentWillMount() {
    this.getValueList(2012, this.state.ruleParameterTypeArray);
    this.getValueList(2013, this.state.filtrateMethodArray);
    this.getValueList(2014, this.state.summaryOrDetailArray)

    //编辑时接收的参数
    console.log(this.props.params)
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

  componentWillReceiveProps(nextprops){
    this.setState({
      ruleId: nextprops.params,
    })
  }

  handleSubmit = (e)=>{
    e.preventDefault();
    if(typeof this.props.form.getFieldValue("ruleParameterType") === 'undefined' || typeof this.props.form.getFieldValue("ruleParameter") === 'undefined' || typeof this.props.form.getFieldValue("filtrateMethod") === 'undefined'  || typeof this.props.form.getFieldValue("summaryOrDetail") === 'undefined')
    this.setState({
      loading: true,
    });

   /* let values = this.props.form.getFieldsValue();
    console.log(values)
    values.controlRuleId = this.props.params.ruleId;
    if(!this.state.loading)
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
    });*/
    /*this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log(values)
        values.controlRuleId = this.props.params.ruleId;
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
    });*/
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

  handleFormChange =()=>{
    this.setState({
      loading: false
    })
  };

  render(){
    const { getFieldDecorator } = this.props.form;
    const { loading, ruleDetail,ruleParamsTypeStatus, ruleParamsTypeHelp, ruleParamsStatus, ruleParamsHelp, filtrateMethodHelp, filtrateMethodStatus, summaryOrDetailHelp, summaryOrDetailStatus, UpperLimitStatus, UpperLimitHelp,LowerLimitStatus, LowerLimitHelp, ruleParameterTypeArray, filtrateMethodArray, summaryOrDetailArray, ruleParamsArray } = this.state;
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
        <Form onSubmit={this.handleSubmit} onChange={this.handleFormChange}>
          <FormItem {...formItemLayout} label={this.props.intl.formatMessage({id:'budget.ruleParameterType'})  /*规则参数类型*/}
            validateStatus={ruleParamsTypeStatus}
            help={ruleParamsTypeHelp}>
            {getFieldDecorator('ruleParameterType', {
              rules: [{
                required: true,
                message: "请选择规则参数类型"
              },
                {
                  validator: (item,value,callback)=>{
                    if(typeof value != 'undefined'){
                      this.setState({
                        ruleParamsHelp: null,
                        ruleParamsStatus: null,
                        ruleParamsTypeStatus: null,
                        ruleParamsTypeHelp: null
                      })
                    }else {
                      this.setState({
                        ruleParamsTypeStatus: "error",
                        ruleParamsTypeHelp: "请选择规则参数类型"
                      })
                    }
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
              <Select className="input-disabled-color" placeholder={ formatMessage({id:"common.please.select"})}>
                {paramsType}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={formatMessage({id:'budget.ruleParameter'})  /*规则参数*/}
             validateStatus={ruleParamsStatus}
             help={ruleParamsHelp}>
            {getFieldDecorator('ruleParameter', {
              rules: [{
                required: true,
              },
                {
                  validator:(item,value,callback)=>{
                    if(typeof value != "undefined"){
                      this.setState({
                        UpperLimitStatus: null,
                        UpperLimitHelp: null,
                        LowerLimitStatus: null,
                        LowerLimitHelp: null,
                      })
                    }
                  }
                }
              ],
            })(
              <Select
                  onFocus={()=>{
                    this.setState({
                      ruleParamsStatus: typeof this.props.form.getFieldValue("ruleParameterType") === "undefined" ? "warning": null,
                      ruleParamsHelp: typeof this.props.form.getFieldValue("ruleParameterType") === "undefined" ? "请先选择规则参数类型" : null
                    })
                  }}
                  className="input-disabled-color" placeholder={ formatMessage({id:"common.please.select"})}>
                { typeof this.props.form.getFieldValue("ruleParameterType") === 'undefined' ? [] : ruleParams}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout}
            label={ formatMessage({id:'budget.filtrateMethod'})  /*取值方式*/}
            help={filtrateMethodHelp}
            validateStatus={filtrateMethodStatus}>
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
                        : value === "INCLUDE" ? formatMessage({id:"budget.filtrateMethodHelp.exclude"}) : "请选择" ,/*值范围为开区间，不包含左右边界值*/
                      filtrateMethodStatus: typeof value === 'undefined' ? "error" : null
                    });
                    callback();
                  }
                }
              ],
            })(
              <Select placeholder={ formatMessage({id:"common.please.select"})}>
                {filtrateMethodOption}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout}
            label={formatMessage({id:'budget.summaryOrDetail'})  /*取值范围*/}
            help={summaryOrDetailHelp}
            validateStatus={summaryOrDetailStatus}>
            {getFieldDecorator('summaryOrDetail', {
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
          <FormItem {...formItemLayout} label={formatMessage({id:'budget.parameterLowerLimit'})  /*下限值*/}
              validateStatus={LowerLimitStatus}
              help={LowerLimitHelp}>
            {getFieldDecorator('parameterLowerLimit', {
              rules:[
                {
                  validator:(item,value,callback)=>{
                    if(typeof this.props.form.getFieldValue("ruleParameter") === 'undefined'){
                      this.setState({
                        UpperLimitStatus:"warning",
                        UpperLimitHelp:"请先选择规则参数",
                        LowerLimitStatus:"warning",
                        LowerLimitHelp:"请先选择规则参数",
                      });
                    }
                    if(typeof this.props.form.getFieldValue("parameterUpperLimit") != 'undefined' ){
                      if(value> this.props.form.getFieldValue("parameterUpperLimit")){
                        this.setState({
                          LowerLimitStatus:"error",
                          LowerLimitHelp:"下限值不能高于上限值",
                        })
                      }
                    }
                    callback();
                  }
                }
              ]
            })(
              <Input placeholder={ formatMessage({id:"common.please.enter"})} />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={formatMessage({id:'budget.parameterUpperLimit'})  /*上限值*/}
              validateStatus={UpperLimitStatus}
              help={UpperLimitHelp}>
            {getFieldDecorator('parameterUpperLimit', {
              rules:[
                {
                  validator:(item,value,callback)=>{

                    if(typeof this.props.form.getFieldValue("ruleParameter") === 'undefined'){
                      this.setState({
                        UpperLimitStatus:"warning",
                        UpperLimitHelp:"请先选择规则参数",
                        LowerLimitStatus:"warning",
                        LowerLimitHelp:"请先选择规则参数",
                      });
                    }
                    if(typeof this.props.form.getFieldValue("parameterLowerLimit") != 'undefined' ){
                      console.log(this.props.form.getFieldValue("parameterLowerLimit"))
                      if(value < this.props.form.getFieldValue("parameterLowerLimit")){
                        this.setState({
                          UpperLimitStatus:"error",
                          UpperLimitHelp:"上限值不能低于下限值",
                        })
                      }
                    }
                    callback();
                  }
                }
              ]
            })(
              <Input placeholder={formatMessage({id:"common.please.enter"})} />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={formatMessage({id:'budget.invalidDate'})  /*失效日期*/}>
            {getFieldDecorator('invalidDate', {
            })(
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
