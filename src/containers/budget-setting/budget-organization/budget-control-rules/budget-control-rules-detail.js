/**
 *  crated by jsq on 2017/9/27
 */
import React from 'react';
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import httpFetch from 'share/httpFetch';
import config from 'config'
import menuRoute from 'share/menuRoute'

import { Form, Button, Select, Row, Col, Input, Switch, Icon, Badge, Tabs, Table, message, DatePicker  } from 'antd'

import 'styles/budget-setting/budget-organization/budget-control-rules/budget-control-rules-detail.scss';
import SlideFrame from 'components/slide-frame'
import NewBudgetRulesDetail from 'containers/budget-setting/budget-organization/budget-control-rules/new-budget-rules-detail'
const FormItem = Form.Item;
const Option = Select.Option;

class BudgetControlRulesDetail extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      loading: true,
      buttonLoading: false,
      data: [],
      edit: false,
      controlRule: {},
      startValue: null,
      endValue: null,
      strategyGroup:[],
      showSlideFrame: false,
      createParams: {},
      pagination: {
        current:0,
        page: 0,
        total: 0,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
      },
      columns: [
        {          /*规则参数类型*/
          title: this.props.intl.formatMessage({id:"budget.ruleParameterType"}), key: "ruleParameterType", dataIndex: 'ruleParameterType'
        },
        {          /*规则参数*/
          title: this.props.intl.formatMessage({id:"budget.ruleParameter"}), key: "ruleParameter", dataIndex: 'ruleParameter'
        },
        {          /*取值方式*/
          title: this.props.intl.formatMessage({id:"budget.filtrateMethod"}), key: "filtrateMethod", dataIndex: 'filtrateMethod'
        },
        {          /*取值范围*/
          title: this.props.intl.formatMessage({id:"budget.summaryOrDetail"}), key: "summaryOrDetail", dataIndex: 'summaryOrDetail'
        },
        {          /*下限值*/
          title: this.props.intl.formatMessage({id:"budget.parameterLowerLimit"}), key: "parameterLowerLimit", dataIndex: 'parameterLowerLimit'
        },
        {          /*上限值*/
          title: this.props.intl.formatMessage({id:"budget.parameterUpperLimit"}), key: "parameterUpperLimit", dataIndex: 'parameterUpperLimit'
        },
        {          /*失效日期*/
          title: this.props.intl.formatMessage({id:"budget.invalidDate"}), key: "invalidDate", dataIndex: 'invalidDate'
        },
      ]
    }
  }

  //时间转化
  handleTimeTransmutation (startDate,endDate){
    let format = 'yyyy-MM-dd';
    let start = new Date(startDate);
    let end = new Date(endDate);
    let tf = function(i){
      return (i < 10 ? '0' :'') + i
    };
     let timeFormat = (date)=>{
       return format.replace(/yyyy|MM|dd/g, function (a) {
          switch (a) {
         case 'yyyy':
           return tf(date.getFullYear());
           break;
         case 'MM':
           return tf(date.getMonth() + 1);
           break;
         case 'dd':
           return tf(date.getDate());
           break;
       };
     })};

     if(endDate === "undefined" || endDate === null){
       return timeFormat(new Date(startDate))+" ~ --";
     }
    return timeFormat(new Date(startDate)) + " ~ " + timeFormat(new Date(endDate));
  }

  componentWillMount(){
    this.getList();
    //根据路径上的预算规则id查出完整数据
    httpFetch.get(`${config.budgetUrl}/api/budget/control/rules/${this.props.params.id[1]}`).then((response)=>{
      if(response.status === 200){
        this.setState({
          controlRule: response.data,
          createParams: response.data
        })
      }
    }).catch((e)=>{
      //console.log(e)
    })
    //加载页面时，获取启用的控制策略
    httpFetch.get(`${config.budgetUrl}/api/budget/control/strategies/query?isEnabled=true`).then((response)=>{
      if(response.status === 200){
        let strategyGroup = [];
        response.data.map((item)=>{
          let strategy = {
            id: item.id,
            key: item.controlStrategyCode,
            value: item.controlStrategyCode+" - "+item.controlStrategyName
          };
          strategyGroup.push(strategy);
        });
        this.setState({
          strategyGroup: strategyGroup
        })
      }
    })
  }

  //保存编辑后的预算规则
  handleSave = (e) =>{
    e.preventDefault();
    this.setState({
      buttonLoading: true
    });
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.organizationId = this.props.params.id[0];
        this.state.strategyGroup.map((item)=>{
          if(item.key === values.controlStrategy){
            values.strategyGroupId = item.id;
            return
          }
        });
        console.log(values)
        httpFetch.put(`${config.budgetUrl}/api/budget/control/rules`,values).then((response)=>{
          if(response.status === 200) {
            this.setState({
              buttonLoading: false,
              edit: false,
            })
          }
        }).catch((e)=>{
          console.log(e)
        })
      }
    })
  }

  handleChange = (e)=>{
    console.log(e.target.value)
    this.setState({
      buttonLoading: false,
    })
  };

  renderForm(){
    const { getFieldDecorator } = this.props.form;
    const { controlRule, edit, statusCode, strategyGroup, startValue, endValue, buttonLoading } = this.state;

    let strategyOptions = strategyGroup.map((item)=><Option key={item.key} >{item.value}</Option>);

    return(
      edit ?
        <div className="structure-detail-form">
          <Form onSubmit={this.handleSave}>
            <Row gutter={60}>
              <Col span={8}>
                <FormItem
                  label={this.props.intl.formatMessage({id:"budget.controlRuleCode"}) /*业务规则代码*/}
                  colon={true}>
                  {getFieldDecorator('controlRuleCode', {
                    initialValue: controlRule.controlRuleCode,
                  })(
                    <Input disabled/>)
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  label={this.props.intl.formatMessage({id:"budget.controlRuleName"}) /*业务规则名称*/}
                  colon={true}
                  required={true}>
                  {getFieldDecorator('controlRuleName', {
                    initialValue: controlRule.controlRuleName,
                  })(
                    <Input onChange={this.handleChange} placeholder={this.props.intl.formatMessage({id:"common.please.enter"})}/>)
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  label= "控制策略"
                  colon={true}>
                  {getFieldDecorator('controlStrategy', {
                    initialValue: controlRule.controlStrategy,
                    rules:[
                      {required:true,message:this.props.intl.formatMessage({id:"common.please.enter"})},
                    ],
                  })(
                    <Select selectedIndex={controlRule.controlStrategy} placeholder={this.props.intl.formatMessage({id:"common.please.select"})}>
                      {strategyOptions}
                    </Select>)
                  }
                </FormItem>
              </Col>
            </Row>
            <Row gutter={60}>
              <Col span={8}>
                <Col span={11}>
                  <FormItem
                    label={this.props.intl.formatMessage({id:"budget.controlRule.effectiveDate"}) /*有效日期*/}
                    colon={true}>
                    {getFieldDecorator('startDate', {
                      initialValue: controlRule.startValue,
                      rules:[
                        {required:true,message:this.props.intl.formatMessage({id:"common.please.enter"})},
                        {
                          validator:(item,value,callback)=>{
                            if(value === "undefined" || value === ""){
                              callback("请选择开始时间");
                              return
                            }
                            callback();
                          }
                        }
                      ]
                    })(
                      <DatePicker
                        placeholder={this.props.intl.formatMessage({id:"budget.controlRule.startDate"})}
                        setFieldsValue={controlRule.startValue}
                        onChange={this.HandleStartChange}
                        disabledDate={this.handleDisabledStartDate}/>)
                    }
                  </FormItem>
                </Col>
                <Col span={11} offset={2}>
                  <FormItem
                    label=" "
                    colon={false}>
                    {getFieldDecorator('endDate', {
                     initialValue: controlRule.endValue
                    })(
                      <DatePicker
                        placeholder={this.props.intl.formatMessage({id:"budget.controlRule.endDate"})}
                        setFieldsValue={endValue}
                        onChange={this.HandleEndChange}
                        disabledDate={this.handleDisabledEndDate}/>)
                    }
                  </FormItem>
                </Col>
              </Col>
              <Col span={4}>
                <FormItem
                  label={this.props.intl.formatMessage({id:"budget.controlRules.priority"}) /*优先级*/}
                  colon={true}>
                  {getFieldDecorator('priority', {
                    initialValue: controlRule.priority
                  })(
                    <Input disabled/>)
                  }
                </FormItem>
              </Col>
            </Row>
            <Button type="primary" htmlType="submit" loading={buttonLoading}>{this.props.intl.formatMessage({id:"common.save"}) /*保存*/}</Button>
            <Button onClick={()=>this.handleEdit(false)} style={{ marginLeft: 8 }}> {this.props.intl.formatMessage({id:"common.cancel"}) /*取消*/}</Button>
          </Form>
        </div>
        :
        <div className="structure-detail-div">
          <Row gutter={40} align="top">
            <Col span={8}>
              <div className="form-title">{this.props.intl.formatMessage({id:"budget.controlRuleCode"}) /*业务规则代码*/}:</div>
              <div>{controlRule.controlRuleCode}</div>
            </Col>
            <Col span={8}>
              <div className="form-title">{this.props.intl.formatMessage({id:"budget.controlRuleName"}) /*业务规则名称*/}:</div>
              <div>{controlRule.controlRuleName}</div>
            </Col >
            <Col span={8}>
              <div className="form-title">控制策略:</div>
              <div>{controlRule.strategyGroupName}</div>
            </Col>
          </Row>
          <br/>
          <Row gutter={40} align="top">
            <Col span={8}>
              <div className="form-title">{this.props.intl.formatMessage({id:"budget.controlRule.effectiveDate"})}:</div>
              <div>{this.handleTimeTransmutation(this.state.controlRule.startDate,this.state.controlRule.endDate)}</div>
            </Col>
            <Col span={8}>
              <div className="form-title">{this.props.intl.formatMessage({id:"budget.controlRules.priority"}) /*优先级*/}:</div>
              <div className="structure-detail-description">{controlRule.priority}</div>
            </Col>
          </Row>
        </div>
    )
  }

  //控制是否编辑
  handleEdit = (flag) => {
    this.setState({edit: flag})
  };

  //新建规则明细,左侧划出
  showSlide = (flag) => {
    this.setState({
      showSlideFrame: flag
    })
  };

  handleCloseSlide = (params) => {
    if(params) {
      this.getList();
    }
    this.setState({
      showSlideFrame: false
    })
  };

  //获取规则明细
  getList(){
    httpFetch.get(`${config.budgetUrl}/api/budget/control/rule/details/query`).then((response)=>{
      console.log(response)
      if(response.status === 200){
        this.setState({
          data: response.data
        })
      }
    }).catch((e)=>{
      //console.log(e)
    })
  }

  render(){
    const { loading, data, edit, pagination, columns, showSlideFrame, createParams } = this.state;
    return(
      <div className="budget-control-rules-detail">
        <div className="common-top-area">
          <div className="common-top-area-title">
            {this.props.intl.formatMessage({id:"budget.basicInformation"}) /*基本信息*/}
            {!edit ? <span className="title-edit" onClick={()=>this.handleEdit(true)}>{this.props.intl.formatMessage({id:"budget.edit"}) /*编辑*/}</span> : null}
          </div>
          <div className="common-top-area-content form-title-area ">
            {this.renderForm()}
          </div>
        </div>
        <div className="table-header">
          <div className="table-header-title">规则明细   {this.props.intl.formatMessage({id:'common.total'},{total:`${pagination.total}`})}</div>  {/*共搜索到*条数据*/}
          <div className="table-header-buttons">
            <Button type="primary" onClick={() => this.showSlide(true)}>{this.props.intl.formatMessage({id: 'common.create'})}</Button>
          </div>
        </div>
        <Table
          dataSource={data}
          columns={columns}
          pagination={pagination}
          size="middle"
          bordered/>

        <SlideFrame title= {this.props.intl.formatMessage({id: 'budget.createRulesDetail'})}
                    show={showSlideFrame}
                    content={NewBudgetRulesDetail}
                    afterClose={this.handleCloseSlide}
                    onClose={() => this.showSlide(false)}
                    params={createParams}/>
      </div>
    )
  }
}

BudgetControlRulesDetail.contextTypes = {
  router: React.PropTypes.object
}

function mapStateToProps(state) {
  return {
    organization: state.budget.organization
  }
}

const WrappedBudgetControlRulesDetail = Form.create()(BudgetControlRulesDetail);

export default connect(mapStateToProps)(injectIntl(WrappedBudgetControlRulesDetail));
