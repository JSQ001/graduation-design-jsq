import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'

import httpFetch from 'share/httpFetch'
import config from 'config'
import { Form, Table, Button } from 'antd'

import BasicInfo from 'components/basic-info'

class BudgetStrategyDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Loading: true,
      infoList: [
        {type: 'input', id: 'test', title: '预算控制策略代码：', value: 'code01'},
        {type: 'input', id: 'test', title: '预算控制策略描述：', value: 'description01'},
        {type: 'state', id: 'test', title: '状态：', value: true}
      ],
      columns: [
        {title: "序号", dataIndex: "detailSequence", key: "detailSequence"},
        {title: "规则代码", dataIndex: "detailCode", key: "detailCode"},
        {title: "描述", dataIndex: "detailName", key: "detailName"},
        {title: "消息", dataIndex: "messageCode", key: "messageCode"},
        {title: "事件", dataIndex: "expWfEvent", key: "expWfEvent"}
      ],
      data: [],
      pageSize: 10,
      page: 0,
    };
  }

  componentWillMount() {
    this.getList();
  }

  getList() {
    httpFetch.get(`${config.budgetUrl}/api/budget/control/strategy/details/query?size=${this.state.pageSize}&page=${this.state.page}&controlStrategyId=${this.props.params.id}`).then((response) => {
      this.setState({
        data: response.data,
        Loading: false
      })
    }).catch((e) => {

    })
  }

  render(){
    const { infoList, columns, data, Loading } = this.state;
    return (
      <div className="budget-strategy-detail">
        <BasicInfo infoList={infoList}/>
        <div className="table-header">
          <div className="table-header-title">共 0 条数据</div>
          <div className="table-header-buttons">
            <Button type="primary">新 建</Button>
          </div>
        </div>
        <Table columns={columns}
               dataSource={data}
               Loading={Loading}
               bordered
               size="middle"/>
      </div>
    )
  }

}

function mapStateToProps() {
  return {}
}

const WrappedBudgetStrategyDetail = Form.create()(BudgetStrategyDetail);

export default connect(mapStateToProps)(WrappedBudgetStrategyDetail);
