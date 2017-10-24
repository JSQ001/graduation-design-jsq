import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

import { Table, Popconfirm } from 'antd'
import httpFetch from 'share/httpFetch'
import config from 'config'

class BudgetBalanceCondition extends React.Component {
  constructor(props) {
    super(props);
    const { formatMessage } = this.props.intl;
    this.state = {
      loading: true,
      data: [],
      columns: [
        {title: '方案代码', dataIndex: 'conditionCode', width: '35%'},
        {title: '方案名称', dataIndex: 'conditionName', width: '35%'},
        {title: '操作', dataIndex: 'operation', width: '30%', render: (text, record) => (
          <span>
            <a href="#" onClick={(e) => this.useCondition(e, record)}>应用方案</a>
            <span className="ant-divider" />
            <Popconfirm onConfirm={(e) => this.deleteCondition(e, record)} title="你确定要删除吗?">
              <a href="#" onClick={(e) => {e.preventDefault();e.stopPropagation();}}>{formatMessage({id: "common.delete"})}</a>
            </Popconfirm>
          </span>)}
      ]
    };
  }

  componentDidMount(){
    this.getList();
  };

  getList = () => {
    this.setState({ loading: true });
    return httpFetch.get(`${config.budgetUrl}/api/budget/balance/query/header/list`).then(res => {
      this.setState({ data: res.data, loading: false })
    })
  };

  useCondition = (e, record) => {
    this.setState({ loading: true });
    httpFetch.get(`${config.budgetUrl}/api/budget/balance/query/header/${record.id}`).then(res => {
      this.setState({ loading: false });
      this.props.close(res.data);
    })
  };

  deleteCondition = (e, record) => {

  };

  onCancel = () => {
    this.props.close();
  };

  render(){
    const { columns, data, loading } = this.state;
    return (
      <div>
        <Table columns={columns}
               loading={loading}
               dataSource={data}
               size="middle"
               bordered rowKey="id"/>
      </div>
    )
  }

}

function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps)(injectIntl(BudgetBalanceCondition));
