import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

import { Table, Popconfirm } from 'antd'

class BudgetBalanceScheme extends React.Component {
  constructor(props) {
    super(props);
    const { formatMessage } = this.props.intl;
    this.state = {
      loading: false,
      data: [],
      columns: [
        {title: '方案代码', dataIndex: 'schemeCode', width: '40%'},
        {title: '方案名称', dataIndex: 'schemeName', width: '40%'},
        {title: '操作', dataIndex: 'operation', width: '20%', render: (text, record) => (
          <span>
            <a href="#">应用方案</a>
            <span className="ant-divider" />
            <Popconfirm onConfirm={(e) => this.deleteScheme(e, record)} title="你确定要删除吗?">
              <a href="#" onClick={(e) => {e.preventDefault();e.stopPropagation();}}>{formatMessage({id: "common.delete"})}</a>
            </Popconfirm>
          </span>)}
      ]
    };
  }

  componentWillMount(){
    
  };

  deleteScheme = (e, record) => {

  };

  onCancel = () => {
    this.props.close();
  };

  render(){
    const { columns, data } = this.state;
    return (
      <div>
        <Table columns={columns}
               dataSource={data}
               size="middle"
               bordered/>
      </div>
    )
  }

}

function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps)(injectIntl(BudgetBalanceScheme));
