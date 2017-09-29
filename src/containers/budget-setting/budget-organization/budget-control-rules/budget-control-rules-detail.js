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
import BasicInfo from 'components/basic-info'


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
      slideFrameTitle: "",
      strategyGroup:[],
      showSlideFrame: false,
      params: {},
      pagination: {
        current:0,
        page: 1,
        total: 0,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
      },
      infoList: [
        {type: 'input', id: 'controlRuleCode', label: this.props.intl.formatMessage({id: 'budget.controlRuleCode'})+" :" /*业务规则代码*/},
        {type: 'input', id: 'controlRuleName', label: this.props.intl.formatMessage({id: 'budget.controlRuleName'})+" :" /*业务规则名称*/},
        {type: 'input', id: 'strategyGroupName', label: "控制策略 :"},
        {type: 'date', id: 'startDate', label: this.props.intl.formatMessage({id:"budget.controlRule.effectiveDate"})+" :" /*有效日期*/},
        {type: 'date', id: 'endDate', label: " "},
        {type: 'input', id: 'priority', label: this.props.intl.formatMessage({id:"budget.controlRules.priority"}) /*优先级*/}
      ],
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

  componentWillMount(){
    this.getList();
    //根据路径上的预算规则id查出完整数据
    httpFetch.get(`${config.budgetUrl}/api/budget/control/rules/${this.props.params.ruleId}`).then((response)=>{
      if(response.status === 200){
        console.log(response)
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

  //新建规则明细,左侧划出
  showSlide = (flag, title,params) => {
    this.setState({
      showSlideFrame: flag,
      slideFrameTitle: title,
      params: params
    })
  };

  handleCreate = () =>{
    let title =  this.props.intl.formatMessage({id: 'budget.createRulesDetail'});
    this.showSlide(true,title,{controlRuleId: this.props.params.ruleId});
  };

  handleEdit = (record) =>{
    let title = this.props.intl.formatMessage({id: 'budget.editRulesDetail'});
    this.showSlide(true,title,record);
  };

  handleCloseSlide = (params) => {
    if(params) {
      this.getList();
    }
    this.setState({
      showSlideFrame: false
    })
  };

  handleUpdate = (value)=>{
    console.log(value)
  };

  //获取规则明细
  getList(){
    httpFetch.get(`${config.budgetUrl}/api/budget/control/rule/details/query?controlRuleId=${this.props.params.ruleId}`).then((response)=>{
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
    const { loading, slideFrameTitle, data, infoList, pagination, columns, showSlideFrame, params, controlRule } = this.state;
    return(
      <div className="budget-control-rules-detail">
        <BasicInfo
          infoList={infoList}
          infoData={controlRule}
          updateHandle={this.handleUpdate}
          updateState={true}sssss/>
        <div className="table-header">
          <div className="table-header-title">{this.props.intl.formatMessage({id:'common.total'},{total:`${pagination.total}`})}</div>  {/*共搜索到*条数据*/}
          <div className="table-header-buttons">
            <Button onClick={this.handleCreate} type="primary" >{this.props.intl.formatMessage({id: 'common.create'})}</Button>  {/*新建*/}
          </div>
        </div>
        <Table
          dataSource={data}
          columns={columns}
          onRowClick={this.handleEdit}
          pagination={pagination}
          size="middle"
          bordered/>

        <SlideFrame title= {slideFrameTitle}
                    show={showSlideFrame}
                    content={NewBudgetRulesDetail}
                    afterClose={this.handleCloseSlide}
                    onClose={() => this.showSlide(false)}
                    params={params}/>
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
