import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'

import menuRoute from 'share/menuRoute'
import httpFetch from 'share/httpFetch'
import config from 'config'
import { Form, Table, Button } from 'antd'

import BasicInfo from 'components/basic-info'

import 'styles/budget/budget-strategy/budget-strategy-detail.scss'

class BudgetStrategyDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      infoList: [
        {type: 'input', title: '预算控制策略代码：', id: 'controlStrategyCode', isDisabled: true},
        {type: 'input', title: '预算控制策略描述：', id: 'controlStrategyName'},
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
        {title: "消息", dataIndex: "messageCode", key: "messageCode"},
        {title: "事件", dataIndex: "expWfEvent", key: "expWfEvent"}
      ],
      data: [],
      pagination: {
        total: 0
      },
      pageSize: 10,
      page: 0,
      newBudgetStrategyDetail:  menuRoute.getRouteItem('new-budget-strategy-detail','key'),    //新建控制策略详情
    };
  }

  componentWillMount() {
    this.getBasicInfo();
    this.getList();
  }

  getBasicInfo() {
    httpFetch.get(`${config.budgetUrl}/api/budget/control/strategies/${this.props.params.id}`).then((response) => {
      if(response.status==200) {
        this.setState({
          infoData: response.data
        })
      }
    }).catch((e) => {

    })
  }

  getList() {
    httpFetch.get(`${config.budgetUrl}/api/budget/control/strategy/details/query?size=${this.state.pageSize}&page=${this.state.page}&controlStrategyId=${this.props.params.id}`).then((response) => {
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
    this.context.router.push(this.state.newBudgetStrategyDetail.url.replace(':id', this.props.params.id));
  };

  handleRowClick = (record) => {
    console.log(record);
    //this.context.router.push(this.state.budgetStrategyDetail.url.replace(':id', record.id));
  };

  render(){
    const { infoList, infoData, columns, data, loading, pagination } = this.state;
    return (
      <div className="budget-strategy-detail">
        <BasicInfo infoList={infoList}
                   infoData={infoData}/>
        <div className="table-header">
          <div className="table-header-title"><h5>策略明细</h5> {`共搜索到 ${this.state.pagination.total} 条数据`}</div>
          <div className="table-header-buttons">
            <Button type="primary" onClick={this.handleNew}>新 建</Button><span className="tip-notice">新建预算控制策略规则之前要先定义【<a>事件</a>】和【<a>消息代码</a>】</span>
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

function mapStateToProps() {
  return {}
}


export default connect(mapStateToProps)(injectIntl(BudgetStrategyDetail));
