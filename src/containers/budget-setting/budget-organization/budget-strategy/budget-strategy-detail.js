import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'

import menuRoute from 'share/menuRoute'
import httpFetch from 'share/httpFetch'
import config from 'config'
import { Table, Button, Input } from 'antd'
const Search = Input.Search;

import BasicInfo from 'components/basic-info'

import 'styles/budget/budget-strategy/budget-strategy-detail.scss'

class BudgetStrategyDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      infoList: [
        {type: 'input', title: '预算控制策略代码：', id: 'controlStrategyCode', message: '请输入', isDisabled: true},
        {type: 'input', title: '预算控制策略描述：', id: 'controlStrategyName', message: '请输入'},
        {type: 'state', title: '状态：', id: 'isEnabled'}
      ],
      infoData: {
        controlStrategyName: 'description01',
        controlStrategyCode: 'code01',
        isEnabled: false
      },
      columns: [
        {title: "序号", dataIndex: "detailSequence", key: "detailSequence"},
        {title: "规则代码", dataIndex: "detailCode", key: "detailCode"},
        {title: "描述", dataIndex: "detailName", key: "detailName"},
        {title: "消息", dataIndex: "messageCode", key: "messageCode", render: message => <span>{message ? message : '-'}</span>},
        {title: "事件", dataIndex: "expWfEvent", key: "expWfEvent", render: event => <span>{event ? event : '-'}</span>}
      ],
      data: [],
      pagination: {
        total: 0
      },
      pageSize: 10,
      page: 0,
      keyWords: '',
      newBudgetStrategyDetail:  menuRoute.getRouteItem('new-budget-strategy-detail','key'),    //新建控制策略详情
      strategyControlDetail:  menuRoute.getRouteItem('strategy-control-detail','key'),    //策略明细
      budgetStrategyDetail:  menuRoute.getRouteItem('budget-strategy-detail','key'),    //预算控制策略详情
    };
  }

  componentWillMount() {
    if(this.props.organization.id && this.props.strategyId){
      this.context.router.replace(this.state.budgetStrategyDetail.url.replace(':id', this.props.organization.id).replace(':strategyId', this.props.strategyId));
      this.getBasicInfo();
      this.getList();
    }
  }

  getBasicInfo() {
    httpFetch.get(`${config.budgetUrl}/api/budget/control/strategies/${this.props.strategyId}`).then((response) => {
      if(response.status==200) {
        this.setState({
          infoData: response.data
        })
      }
    }).catch((e) => {

    })
  }

  //分页点击
  onChangePager = (page) => {
    if(page - 1 !== this.state.page)
      this.setState({
        page: page - 1,
        loading: true
      }, ()=>{
        this.getList();
      })
  };

  getList() {
    httpFetch.get(`${config.budgetUrl}/api/budget/control/strategy/details/query?size=${this.state.pageSize}&page=${this.state.page}&controlStrategyId=${this.props.strategyId}&keyWords=${this.state.keyWords}`).then((response) => {
      this.setState({
        data: response.data,
        loading: false,
        pagination: {
          total: Number(response.headers['x-total-count']),
          onChange: this.onChangePager,
          pageSize: this.state.pageSize
        }
      })
    }).catch((e) => {

    })
  }

  handleNew = () => {
    this.context.router.push(this.state.newBudgetStrategyDetail.url.replace(':id', this.props.params.id).replace(':strategyId', this.props.strategyId));
  };

  handleRowClick = (record) => {
    this.context.router.push(this.state.strategyControlDetail.url.replace(':id', this.props.params.id).replace(':strategyId', this.props.strategyId).replace(':strategyControlId', record.id));
  };

  handleSearch= (value) => {
    this.setState({
      keyWords: value
    }, () => {
      this.getList();
    })
  }

  render(){
    const { infoList, infoData, columns, data, loading, pagination } = this.state;
    return (
      <div className="budget-strategy-detail">
        <BasicInfo infoList={infoList}
                   infoData={infoData}/>
        <div className="table-header">
          <div className="table-header-title"><h5>策略明细</h5> {`共搜索到 ${this.state.pagination.total} 条数据`}</div>
          <div className="table-header-buttons">
            <Button type="primary" onClick={this.handleNew}>新 建</Button>
            <span className="tip-notice">新建预算控制策略规则之前要先定义【<a>事件</a>】和【<a>消息代码</a>】</span>
            <Search
              placeholder="请输入策略明细描述/代码"
              style={{ width:200,position:'absolute',right:0,bottom:0 }}
              onSearch={this.handleSearch}
            />
          </div>
        </div>
        <Table columns={columns}
               dataSource={data}
               pagination={pagination}
               loading={loading}
               onRowClick={this.handleRowClick}
               bordered
               size="middle"/>
      </div>
    )
  }

}

BudgetStrategyDetail.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
  return {
    organization: state.budget.organization,
    strategyId: state.budget.strategyId
  }
}

export default connect(mapStateToProps)(injectIntl(BudgetStrategyDetail));
