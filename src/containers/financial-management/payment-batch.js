import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

import { Table, message, Icon } from 'antd'
import FileSaver from 'file-saver'

import httpFetch from 'share/httpFetch'
import config from 'config'


class PaymentBatch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      page: 0,
      pageSize: 10,
      data: [],
      pagination: {
        total: 0
      },
      columns: [
        {title: "序号", dataIndex: "index", width: '10%'},
        {title: "放款批次", dataIndex: "batchNumber", width: '20%'},
        {title: "放款日期", dataIndex: "createdDate", width: '30%', render: date => new Date(date).format('yyyy-MM-dd hh:mm')},
        {title: "总金额", dataIndex: "totalAmount", render: this.filterMoney, width: '20%'},
        {title: "报盘文件", dataIndex: "reimbursementBatchOID", width: '10%', className: 'center-icon',
          render: (id, record) => id ? <Icon type="download" onClick={() => {this.download(record, 'nacha')}}/> : null},
        {title: "报销单明细", dataIndex: "batchType", key: 1001, width: '10%', className: 'center-icon',
          render: (batchType, record) => batchType === 1001 ? <Icon type="download" onClick={() => {this.download(record, 'detail', 1001)}}/> : null},
        {title: "借款单明细", dataIndex: "batchType", key: 1002, width: '10%', className: 'center-icon',
          render: (batchType, record) => batchType === 1002 ? <Icon type="download" onClick={() => {this.download(record, 'detail', 1002)}}/> : null}
      ]
    };
  }

  //下载文件
  //1001 报销单
  //1002 申请单
  download = (record, type, batchType) => {
    let hide = message.loading('正在生成文件..');
    httpFetch.get(`${config.baseUrl}/api/reimbursement/batch/${type}/export?reimbursementBatchOID=${record.reimbursementBatchOID}`, {}, {}, {responseType: 'arraybuffer'}).then(res => {
      let b = new Blob([res.data], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
      let name = (type === 'nacha' ? '报盘文件' : '');
      name += (typeof batchType === 'number' ? (batchType === 1001 ? '报销单明细' : '借款单明细') : '');
      FileSaver.saveAs(b, `${name}-${record.batchNumber}-${type}.xlsx`);
      hide();
    })
  };

  componentWillMount(){
    this.getList();
  }

  onChangePager = (page) => {
    if(page - 1 !== this.state.page)
      this.setState({
        page: page - 1,
        loading: true
      }, ()=>{
        this.getList();
      })
  };

  getList = () => {
    this.setState({ loading: true });
    httpFetch.get(`${config.baseUrl}/api/reimbursement/batch/get?page=${this.state.page}&size=${this.state.pageSize}`).then(res => {
      let data = res.data.map((item, index) => {
        item.index = this.state.page * this.state.pageSize + index + 1;
        return item;
      });
      this.setState({
        loading: false,
        data,
        pagination: {
          total: Number(res.headers['x-total-count']),
          onChange: this.onChangePager,
          current: this.state.page + 1
        }});
    })
  };


  render(){
    const { data, loading, columns, pagination } = this.state;
    return (
      <div>
        <h3 className="header-title">付款批次</h3>
        <div className="table-header">
          <div className="table-header-title">共 {pagination.total} 条数据</div>
        </div>
        <Table columns={columns}
               dataSource={data}
               bordered
               pagination={pagination}
               loading={loading}
               size="middle"
               rowKey="reimbursementBatchOID"/>
      </div>
    )
  }

}

function mapStateToProps(state) {
  return {}
}

export default connect(mapStateToProps)(injectIntl(PaymentBatch));
