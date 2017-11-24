/**
 *  crated by jsq on 2017/9/27
 */
import React from 'react';
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import httpFetch from 'share/httpFetch';
import config from 'config'
import moment from 'moment'
import menuRoute from 'share/menuRoute'

import { Form, Button, Select, Row, Col, Input, Switch, Icon, Badge, Tabs, Table, message, DatePicker, Popconfirm, Popover  } from 'antd'

import 'styles/budget-setting/budget-organization/budget-control-rules/budget-control-rules-detail.scss';
import SlideFrame from 'components/slide-frame'
import NewBudgetRulesDetail from 'containers/budget-setting/budget-organization/budget-control-rules/new-budget-rules-detail'
import UpdateBudgetRulesDetail from 'containers/budget-setting/budget-organization/budget-control-rules/update-budget-rules-detail'

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
      showSlideFrameCreate: false,
      showSlideFrameUpdate: false,
      ruleDetail: {},
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
        {type: 'items', id: 'effectiveDate',label: formatMessage({id:"budget.controlRule.effectiveDate"})+" :", items: [
          {type: 'date', id: 'startDate', label: formatMessage({id:"budget.controlRule.effectiveDate"})+" :", isRequired: true},
          {type: 'date', id: 'endDate', label: ' '}
        ]},
        {type: 'input', id: 'priority', required: true, disabled: true, label: formatMessage({id:"budget.controlRules.priority"}) /*优先级*/}
      ],
      columns: [
        {          /*规则参数类型*/
          title: formatMessage({id:"budget.ruleParameterType"}), key: "ruleParameterTypeDescription", dataIndex: 'ruleParameterTypeDescription',
          render: recode =>{
            return recode
          }
        },
        {          /*规则参数*/
          title: formatMessage({id:"budget.ruleParameter"}), key: "ruleParameterDescription", dataIndex: 'ruleParameterDescription'
        },
        {          /*取值方式*/
          title: formatMessage({id:"budget.filtrateMethod"}), key: "filtrateMethodDescription", dataIndex: 'filtrateMethodDescription'
        },
        {          /*取值范围*/
          title: formatMessage({id:"budget.summaryOrDetail"}), key: "summaryOrDetailDescription", dataIndex: 'summaryOrDetailDescription'
        },
        {          /*下限值*/
          title: formatMessage({id:"budget.parameterLowerLimit"}), key: "parameterLowerLimit", dataIndex: 'parameterLowerLimit'
        },
        {          /*上限值*/
          title: formatMessage({id:"budget.parameterUpperLimit"}), key: "parameterUpperLimit", dataIndex: 'parameterUpperLimit'
        },
        {          /*失效日期*/
          title: formatMessage({id:"budget.invalidDate"}), key: "invalidDate", dataIndex: 'invalidDate',
          render: description => (<span>{description === null ? "-" : description.substring(0,10)}</span>)
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
  editItem = (e, record) =>{
    console.log(record)

  };

  deleteItem = (e, record) => {
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
        console.log(response.data.startDate.substring(0,10))
        let endDate = response.data.endDate === null ? "" : response.data.endDate.substring(0,10);
        response.data.effectiveDate = response.data.startDate.substring(0,10) + " ~ " +endDate;
        response.data.strategyGroupName = {label:response.data.strategyGroupName,value:response.data.strategyGroupName,key:response.data.strategyGroupId}
        console.log(response.data)
        this.setState({
          controlRule: response.data,
          createParams: response.data
        })

      }
    }).catch((e)=>{
      //console.log(e)
    });
    //加载页面时，获取启用的控制策略
    httpFetch.get(`${config.budgetUrl}/api/budget/control/strategies/query?organizationId=${this.props.organization.id}&isEnabled=true`).then((response)=>{
      if(response.status === 200){
        response.data.map((item)=>{
          let strategy = {
            id: item.id,
            key: item.id,
            label: item.controlStrategyCode+" - "+item.controlStrategyName,
            value: item.controlStrategyName,
            title: item.controlStrategyName
          };
          strategyGroup.addIfNotExist(strategy)
        });
      }
    })
  }

  handleChange = (e)=>{
    console.log(123)
    this.setState({
      buttonLoading: false,
    })
  };

  //新建规则明细,左侧划出
  showSlideCreate = (flag) => {
    this.setState({
      showSlideFrameCreate: flag,
    })
  };

  //编辑规则明细,左侧划出
  showSlideUpdate = (flag) => {
    this.setState({
      showSlideFrameUpdate: flag,
    })
  };

  handleEdit = (record) =>{
    console.log(record)
    this.setState({
      ruleDetail: record,
      showSlideFrameUpdate: true
    })
  };

  handleCloseSlideCreate = (params) => {
    if(params) {
      this.setState({loading: true});
      this.getList();
    }
    this.setState({
      showSlideFrameCreate: false
    })
  };

  handleCloseSlideUpdate = ()=>{
    this.setState({
      showSlideFrameUpdate: false
    },this.getList())
  };

  //保存编辑后的预算规则
  handleUpdate = (values)=>{

    console.log(values.startDate.utc())
    let startTime = new Date(values.startDate);
    let endTime = new Date(values.endDate);
    startTime.setHours(startTime.getHours()+8);
    endTime.setHours(endTime.getHours()+8);

    values.startDate = startTime;
    values.endDate = endTime;
    values.organizationId = this.props.params.id;
    values.id = this.props.params.ruleId;
    values.versionNumber = this.state.controlRule.versionNumber;
    values.strategyGroupId = this.state.controlRule.strategyGroupId;
    values.isEnabled = this.state.controlRule.isEnabled;
    values.isDeleted = this.state.controlRule.isDeleted;
    values.createdBy = this.state.controlRule.createdBy;
    strategyGroup.map((item)=>{
      if(item.value === values.strategyGroupName){
        values.strategyGroupId = item.id;
      }
    });


    console.log(values)
    httpFetch.put(`${config.budgetUrl}/api/budget/control/rules`,values).then((response)=>{
      if(response) {
        console.log(response)
        let endDate = response.data.endDate === null ? "" : response.data.endDate.substring(0,10);
        response.data.effectiveDate = response.data.startDate.substring(0,10) + " ~ " +endDate;
        response.data.strategyGroupName = {label:values.strategyGroupName,value:values.strategyGroupName,key:values.strategyGroupId}
        console.log(response.data.startDate+8)
        console.log(moment(response.data.endDate))
        message.success(this.props.intl.formatMessage({id:"structure.saveSuccess"})); /*保存成功！*/
        this.setState({
          controlRule: response.data,
          updateState: true
        });
      }
    }).catch((e)=>{
      if(e.response){
        message.error(`${this.props.intl.formatMessage({id:"common.operate.filed"})}, ${e.response.data.message}`);
      }
      this.setState({loading: false});
    })
  };

  //获取规则明细
  getList(){
    httpFetch.get(`${config.budgetUrl}/api/budget/control/rule/details/query?controlRuleId=${this.props.params.ruleId}`).then((response)=>{
      console.log(response)
      if(response.status === 200){
        response.data.map((item)=>{
          item.key = item.id
        });
        let pagination = this.state.pagination;
        pagination.total = Number(response.headers['x-total-count']);
        this.setState({
          loading: false,
          data: response.data,
          pagination
        })
      }
    }).catch((e)=>{
      //console.log(e)
    })
  }


  //返回预算规则页面
  handleBack = () => {
    this.context.router.push(menuRoute.getMenuItemByAttr('budget-organization', 'key').children.budgetOrganizationDetail.url.replace(':id', this.props.params.id)+ '?tab=RULE');
  };

  render(){
    const { loading, slideFrameTitle, data, infoList, pagination, columns, showSlideFrameCreate,showSlideFrameUpdate, ruleDetail, controlRule, updateState } = this.state;
    return(
      <div className="budget-control-rules-detail">
        <BasicInfo
          infoList={infoList}
          infoData={controlRule}
          handelEvent={this.handleChange}
          updateHandle={this.handleUpdate}
          updateState={updateState}/>
        <div className="table-header">
          <div className="table-header-title">{this.props.intl.formatMessage({id:'common.total'},{total:`${pagination.total}`})}</div>  {/*共搜索到*条数据*/}
          <div className="table-header-buttons">
            <Button onClick={()=>this.showSlideCreate(true)} type="primary" >{this.props.intl.formatMessage({id: 'common.create'})}</Button>  {/*新建*/}
          </div>
        </div>
        <Table
          loading={loading}
          dataSource={data}
          columns={columns}
          onRowClick={this.handleEdit}
          pagination={pagination}
          size="middle"
          bordered/>
        <a style={{fontSize:'14px',paddingBottom:'20px'}} onClick={this.handleBack}><Icon type="rollback" style={{marginRight:'5px'}}/>返回</a>

        <SlideFrame title= {this.props.intl.formatMessage({id: 'budget.createRulesDetail'})}
                    show={showSlideFrameCreate}
                    content={NewBudgetRulesDetail}
                    afterClose={this.handleCloseSlideCreate}
                    onClose={() => this.showSlideCreate(false)}
                    params={{ruleId:this.props.params.ruleId}}/>

        <SlideFrame title= { this.props.intl.formatMessage({id: 'budget.editRulesDetail'})}
                    show={showSlideFrameUpdate}
                    content={UpdateBudgetRulesDetail}
                    afterClose={this.handleCloseSlideUpdate}
                    onClose={()=>this.showSlideUpdate(false)}
                    params={ruleDetail}/>
      </div>
    )
  }
}

BudgetControlRulesDetail.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
  return {
    organization: state.budget.organization
  }
}

const WrappedBudgetControlRulesDetail = Form.create()(BudgetControlRulesDetail);

export default connect(mapStateToProps)(injectIntl(WrappedBudgetControlRulesDetail));
