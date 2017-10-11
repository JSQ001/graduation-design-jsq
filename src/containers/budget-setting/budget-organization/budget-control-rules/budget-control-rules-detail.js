/**
 *  crated by jsq on 2017/9/27
 */
import React from 'react';
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import httpFetch from 'share/httpFetch';
import config from 'config'
import menuRoute from 'share/menuRoute'

import { Form, Button, Select, Row, Col, Input, Switch, Icon, Badge, Tabs, Table, message, DatePicker, Popconfirm, Popover  } from 'antd'

import 'styles/budget-setting/budget-organization/budget-control-rules/budget-control-rules-detail.scss';
import SlideFrame from 'components/slide-frame'
import NewBudgetRulesDetail from 'containers/budget-setting/budget-organization/budget-control-rules/new-budget-rules-detail'
import BasicInfo from 'components/basic-info'


const FormItem = Form.Item;
const Option = Select.Option;
const strategyGroup = [];
class BudgetControlRulesDetail extends React.Component{
  constructor(props){
    super(props);
    const { formatMessage } = this.props.intl;
    this.state = {
      loading: true,
      buttonLoading: false,
      data: [],
      edit: false,
      updateState: false,
      controlRule: {},
      startValue: null,
      endValue: null,
      slideFrameTitle: "",
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
        {type: 'input', id: 'controlRuleCode', required: true, disabled: true, label: this.props.intl.formatMessage({id: 'budget.controlRuleCode'})+" :" /*业务规则代码*/},
        {type: 'input', id: 'controlRuleName', label: formatMessage({id: 'budget.controlRuleName'})+" :" /*业务规则名称*/},
        {type: 'select', options: strategyGroup, id: 'strategyGroupName', label: "控制策略 :"},
        {type: 'date', id: 'startDate', label: formatMessage({id:"budget.controlRule.effectiveDate"})+" :" /*有效日期*/},
        {type: 'date', id: 'endDate', label: " "},
        {type: 'input', id: 'priority', required: true, disabled: true, label: formatMessage({id:"budget.controlRules.priority"}) /*优先级*/}
      ],
      columns: [
        {          /*规则参数类型*/
          title: formatMessage({id:"budget.ruleParameterType"}), key: "ruleParameterType", dataIndex: 'ruleParameterType'
        },
        {          /*规则参数*/
          title: formatMessage({id:"budget.ruleParameter"}), key: "ruleParameter", dataIndex: 'ruleParameter'
        },
        {          /*取值方式*/
          title: formatMessage({id:"budget.filtrateMethod"}), key: "filtrateMethod", dataIndex: 'filtrateMethod'
        },
        {          /*取值范围*/
          title: formatMessage({id:"budget.summaryOrDetail"}), key: "summaryOrDetail", dataIndex: 'summaryOrDetail'
        },
        {          /*下限值*/
          title: formatMessage({id:"budget.parameterLowerLimit"}), key: "parameterLowerLimit", dataIndex: 'parameterLowerLimit'
        },
        {          /*上限值*/
          title: formatMessage({id:"budget.parameterUpperLimit"}), key: "parameterUpperLimit", dataIndex: 'parameterUpperLimit'
        },
        {          /*失效日期*/
          title: formatMessage({id:"budget.invalidDate"}), key: "invalidDate", dataIndex: 'invalidDate',
          render: description => (
            <span>
              {description ? description : '-'}
              <Popover content={description}>
                {description}
              </Popover>
            </span>)
        },
        {title: formatMessage({id:"common.operation"}), key: 'operation', width: '15%', render: (text, record) => (
          <span>
            <a href="#" onClick={(e) => this.editItem(e, record)}>{formatMessage({id: "common.edit"})}</a>
            <span className="ant-divider" />
            <Popconfirm onConfirm={(e) => this.deleteItem(e, record)} title={formatMessage({id:"budget.are.you.sure.to.delete.rule"}, {controlRule: record.controlRuleName})}>{/* 你确定要删除organizationName吗 */}
              <a href="#" onClick={(e) => {e.preventDefault();e.stopPropagation();}}>{formatMessage({id: "common.delete"})}</a>
            </Popconfirm>
          </span>)},  //操作
      ]
    }
  }
  deleteItem = (e, record) => {
    console.log(record)
    httpFetch.delete(`${config.budgetUrl}/api/budget/control/rule/details/${record.id}`).then(response => {
      message.success(this.props.intl.formatMessage({id:"common.delete.success"}, {name: record.organizationName})); // name删除成功
      this.getList();
    })
  };
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
        console.log(response)
        response.data.map((item)=>{
          let strategy = {
            id: item.id,
            label: item.controlStrategyCode+" - "+item.controlStrategyName,
            value: item.controlStrategyCode,
            title: item.controlStrategyName
          };
          strategyGroup.addIfNotExist(strategy)
        });
        console.log(strategyGroup)
      }
    })
  }

  //保存编辑后的预算规则
  handleSave = (e) =>{
    e.preventDefault();
    this.setState({
      buttonLoading: true
    });
    console.log(123)
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
  showSlide = (flag,title,params) => {
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

  handleUpdate = (values)=>{
    values.organizationId = this.props.params.id;
    values.controlRuleId = this.props.params.ruleId;
    values.strategyGroupId = this.state.controlRule.strategyGroupId;
    console.log(this.state.controlRule)
    strategyGroup.map((item)=>{
      if(item.title === values.strategyGroupName){
        values.strategyGroupId = item.id;
      }
    });
    console.log(values)
    httpFetch.put(`${config.budgetUrl}/api/budget/control/rules`,values).then((response)=>{
      if(response) {
        message.success(this.props.intl.formatMessage({id:"structure.saveSuccess"})); /*保存成功！*/
        this.setState({
          controlRule: response.data,
          updateState: true
        });
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
    const { loading, slideFrameTitle, data, infoList, pagination, columns, showSlideFrame, params, controlRule, updateState } = this.state;
    return(
      <div className="budget-control-rules-detail">
        <BasicInfo
          infoList={infoList}
          infoData={controlRule}
          updateHandle={this.handleUpdate}
          updateState={updateState}/>
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
