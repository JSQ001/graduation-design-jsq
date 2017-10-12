/**
 * created by jsq on 2017/9/26
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

import { Button, Table} from 'antd'

import SearchArea from 'components/search-area.js';
import httpFetch from 'share/httpFetch';
import config from 'config'
import menuRoute from 'share/menuRoute'


let controlRules = [];
let priority = [];
class BudgetControlRules extends React.Component {
  constructor(props) {
    super(props);
    const { formatMessage } = this.props.intl;
    this.state = {
      loading: true,
      data: [],
      searchParams: {
        controlRuleFrom: "",
        controlRuleTo: "",
        priority: "",
      },
      pagination: {
        current:0,
        page:0,
        total:0,
        pageSize:10,
        showSizeChanger:true,
        showQuickJumper:true,
      },
      searchForm: [
        /*控制规则从*/
        { type: 'select', id: 'controlRulesFrom',
          label:formatMessage({id: 'budget.controlRulesFrom'}),
          options: controlRules
        },
        /*控制规则到*/
        { type: 'select', id: 'controlRulesTo',
          label: formatMessage({id: 'budget.controlRulesTo'}),
          options: controlRules
        },
                                                                                            /*优先级*/
        { type: 'select', id: 'priority',
          label: formatMessage({id: 'budget.controlRules.priority'}),
          options: priority
        }
      ],
      columns: [
        {          /*优先级*/
          title: formatMessage({id:"budget.controlRules.priority"}), key: "priority", dataIndex: 'priority'
        },
        {          /*控制规则代码*/
          title: formatMessage({id:"budget.controlRuleCode"}), key: "controlRuleCode", dataIndex: 'controlRuleCode'
        },
        {          /*控制规则名称*/
          title: formatMessage({id:"budget.controlRuleName"}), key: "controlRuleName", dataIndex: 'controlRuleName'
        },
        {          /*控制策略*/
          title: "控制策略", key: "strategyGroupName", dataIndex: 'strategyGroupName'
        },
        {          /*有效日期*/
          title: formatMessage({id:"budget.controlRule.effectiveDate"}), key: "effectiveDate", dataIndex: 'effectiveDate',
          render:(recode,record)=>{
            return record.startDate.substring(0,10)+ " ~ " +
              record.endDate === "undefined" || record.endDate === '' ? '' :record.endDate.substring(0,10)
          }
        },
      ]
    }
    ;
  }

  componentWillMount(){
    this.getList();
  }

  handleSearch = (values) =>{
    console.log(values)
    let searchParams = {
      controlRulesFrom: values.controlRulesFrom,
      controlRuleTo: values.controlRuleTo,
      priority: values.priority
    };
    this.setState({
      searchParams:searchParams,
      loading: true,
      page: 1
    }, ()=>{
      this.getList();
    })
  };

  //获取控制规则数据
  getList(){
    let params = this.state.searchParams;
    console.log(params)
    let url = `${config.budgetUrl}/api/budget/control/rules/query?organizationId=${this.props.id}&page=${this.state.pagination.page}&size=${this.state.pagination.pageSize}`;
    for(let paramsName in params){
      url += params[paramsName] ? `&${paramsName}=${params[paramsName]}` : '';
    }
    httpFetch.get(url).then((response)=>{
      if(response.status === 200){
        console.log(response);
        response.data.map((item)=>{
          item.key = item.id;
          let control = {
            label: item.controlRuleName,
            value: item.controlRuleCode
          };
          let pop = {
            label: item.priority,
            value: item.priority
          };
          controlRules.push(control);
          priority.push(pop);
        });
        this.setState({
          loading: false,
          data: response.data,
          pagination: {
            page: this.state.pagination.page,
            current: this.state.pagination.current,
            pageSize:this.state.pagination.pageSize,
            showSizeChanger:true,
            showQuickJumper:true,
            total: Number(response.headers['x-total-count']),
          }
        },()=>{
          //this.refreshRowSelection()
        })
      }
    })
  }

  //分页点击
  onChangePager = (pagination,filters, sorter) =>{
    this.setState({
      pagination:{
        page: pagination.current-1,
        current: pagination.current,
        pageSize: pagination.pageSize
      }
    }, ()=>{
      this.getList();
    })
  };

  //新建
  handleCreate = () =>{
    this.context.router.push(menuRoute.getMenuItemByAttr('budget-organization', 'key').children.newBudgetControlRules.url.replace(':id', this.props.id));
  };

//点击行，进入该行详情页面
  handleRowClick = (record, index, event) =>{
    this.context.router.push(menuRoute.getMenuItemByAttr('budget-organization', 'key').children.
    budgetControlRulesDetail.url.replace(':id', this.props.id).replace(':ruleId', record.id));
  }

  render(){
    const { searchForm, loading, columns, pagination, data} = this.state;
    return (
      <div className="budget-control-rule">
        <SearchArea searchForm={searchForm} submitHandle={this.handleSearch}/>
        <div className="table-header">
          <div className="table-header-title">{this.props.intl.formatMessage({id:'common.total'},{total:`${pagination.total}`})}</div>  {/*共搜索到*条数据*/}
          <div className="table-header-buttons">
            <Button type="primary" onClick={this.handleCreate}>{this.props.intl.formatMessage({id: 'common.create'})}</Button>  {/*新 建*/}
          </div>
        </div>
        <Table
          loading={loading}
          dataSource={data}
          columns={columns}
          onRowClick={this.handleRowClick}
          pagination={pagination}
          onChange={this.onChangePager}
          size="middle"
          bordered/>
      </div>
    )
  }
}
BudgetControlRules.contextTypes = {
  router: React.PropTypes.object
}

function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps)(injectIntl(BudgetControlRules));
