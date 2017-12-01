import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import config from 'config'
import httpFetch from 'share/httpFetch'
import { Breadcrumb, Badge, Radio, Table, Pagination, Alert, message } from 'antd'

import moment from 'moment'
import SearchArea from 'components/search-area'

class PaySuccess extends React.Component {
  constructor(props) {
    super(props);
    const {formatMessage} = this.props.intl;
    this.state = {
      radioValue: 'online',
      searchForm: [
        {type: 'input', id: 'documentNumber', label: formatMessage({id: "payWorkbench.receiptNumber"})}, //单据编号
        {type: 'value_list', id: 'documentCategory', label: formatMessage({id: "payWorkbench.receiptType"}), options: [], valueListCode: 2023}, //单据类型
        {type: 'select', id: 'employeeId', label: formatMessage({id: "payWorkbench.applicant"}), options: []}, //申请人
        {type: 'items', id: 'mountRange', items: [
          {type: 'input', id: 'mountFrom', label: '支付金额从'},
          {type: 'input', id: 'mountTo', label: '支付金额至'}
        ]},
        {type: 'items', id: 'payee', label: formatMessage({id: "payWorkbench.payee"}), items: [
          {type: 'value_list', id: 'partnerCategory', label: '类型', options: [], valueListCode: 2107},
          {type: 'select', id: 'partnerId', label: '收款方', options: []}
        ]},
        {type: 'input', id: 'billcode', label: '付款流水号'},
        {type: 'input', id: 'customerBatchNo', label: '付款批次号'},
        {type: 'items', id: 'dateRange', items: [
          {type: 'date', id: 'dateFrom', label: '支付日期从'},
          {type: 'date', id: 'dateTo', label: '支付日期至'}
        ]}
      ],
      searchParams: {},
      columns: [
        {title: '付款流水号', dataIndex: 'billcode'},
        {title: '付款批次号', dataIndex: 'customerBatchNo'},
        {title: '单据编号 | 单据类型', dataIndex: 'documentNumber', render: (value, record) => {
          return (
            <Breadcrumb separator="|">
              <Breadcrumb.Item><a>{value}</a></Breadcrumb.Item>
              <Breadcrumb.Item>{record.documentCategory}</Breadcrumb.Item>
            </Breadcrumb>
          )}
        },
        {title: '工号 | 申请人', dataIndex: 'employeeName'},
        {title: '币种', dataIndex: 'currency'},
        {title: '本次支付金额', dataIndex: 'currentPayAmount'},
        {title: '付款方式', dataIndex: 'paymentTypeName'},
        {title: '类型 | 收款方', dataIndex: 'partnerCategory', render: (value, record) => {
          return (
            <Breadcrumb separator="|">
              <Breadcrumb.Item>{value}</Breadcrumb.Item>
              <Breadcrumb.Item>{record.partnerName}</Breadcrumb.Item>
            </Breadcrumb>
          )}
        },
        {title: '收款方账号', dataIndex: 'accountNumber'},
        {title: '支付日期', dataIndex: 'requisitionDate111', render: value => moment(value).format('YYYY-MM-DD')},
        {title: '状态', dataIndex: 'state', render: (state) => <Badge status='default' text={state}/>},
      ],
      /* 线上 */
      onlineLoading: false,
      onlineData: [],
      onlinePage: 0,
      onlinePageSize: 10,
      onlinePagination: {
        total: 0
      },
      /* 线下 */
      offlineLoading: false,
      offlineData: [],
      offlinePage: 0,
      offlinePageSize: 10,
      offlinePagination: {
        total: 0
      },
      /* 落地文件 */
      fileLoading: false,
      fileData: [],
      filePage: 0,
      filePageSize: 10,
      filePagination: {
        total: 0
      },
    };
  }

  componentWillMount() {
    return new Promise((resolve, reject) => {
      this.getOnlineList(resolve, reject);
      this.getOfflineList(resolve, reject);
      this.getFileList(resolve, reject)
    }).catch(() => {
      message.error('数据加载失败，请重试')
    });
  }

  //线上 - 获取列表
  getOnlineList = (resolve, reject) => {
    const { onlinePage, onlinePageSize } = this.state;
    let url = `${config.contractUrl}/payment/api/cash/transaction/details/getAlreadyPaid?page=${onlinePage}&size=${onlinePageSize}&paymentTypeCode=ONLINE_PAYMENT`;
    this.setState({ onlineLoading: true });
    httpFetch.get(url).then(res => {
      if (res.status === 200) {
        this.setState({
          onlineData: res.data,
          onlineLoading: false,
          onlinePagination: {
            total: Number(res.headers['x-total-count']) ? Number(res.headers['x-total-count']) : 0
          }
        });
        resolve()
      }
    }).catch(() => {
      this.setState({ onlineLoading: false });
      reject()
    })
  };

  //线下 - 获取列表
  getOfflineList = (resolve, reject) => {
    const { offlinePage, offlinePageSize } = this.state;
    let url = `${config.contractUrl}/payment/api/cash/transaction/details/getAlreadyPaid?page=${offlinePage}&size=${offlinePageSize}&paymentTypeCode=OFFLINE_PAYMENT`;
    this.setState({ offlineLoading: true });
    httpFetch.get(url).then(res => {
      if (res.status === 200) {
        this.setState({
          offlineData: res.data,
          offlineLoading: false,
          offlinePagination: {
            total: Number(res.headers['x-total-count']) ? Number(res.headers['x-total-count']) : 0
          }
        });
        resolve()
      }
    }).catch(() => {
      this.setState({ offlineLoading: false });
      reject()
    })
  };

  //落地文件 - 获取列表
  getFileList = (resolve, reject) => {
    const { filePage, filePageSize } = this.state;
    let url = `${config.contractUrl}/payment/api/cash/transaction/details/getAlreadyPaid?page=${filePage}&size=${filePageSize}&paymentTypeCode=EBANK_PAYMENT`;
    this.setState({ fileLoading: true });
    httpFetch.get(url).then(res => {
      if (res.status === 200) {
        this.setState({
          fileData: res.data,
          fileLoading: false,
          filePagination: {
            total: Number(res.headers['x-total-count']) ? Number(res.headers['x-total-count']) : 0
          }
        });
        resolve()
      }
    }).catch(() => {
      this.setState({ fileLoading: false });
      reject()
    })
  };

  search = () => {};

  clear = () => {};

  //线上 - 修改每页显示数量
  onlinePaginationChange = (onlinePage, onlinePageSize) => {
    onlinePage = onlinePage - 1;
    this.setState({ onlinePage, onlinePageSize },() => {
      this.getOnlineList()
    })
  };

  //线下 - 修改每页显示数量
  offlinePaginationChange = (offlinePage, offlinePageSize) => {
    offlinePage = offlinePage - 1;
    this.setState({ offlinePage, offlinePageSize },() => {
      this.getOfflineList()
    })
  };

  //落地文件 - 修改每页显示数量
  filePaginationChange = (filePage, filePageSize) => {
    filePage = filePage - 1;
    this.setState({ filePage, filePageSize }, () => {
      this.getFileList()
    })
  };

  //线上 - 内容渲染
  renderOnlineContent = () => {
    const { columns, onlineData, onlineLoading, onlinePageSize, onlinePagination } = this.state;
    let onlineColumns = [].concat(columns);
    onlineColumns.push(
      {title: '操作', dataIndex: 'id'}
    );
    const tableTitle = (
      <Breadcrumb separator="|">
        <Breadcrumb.Item>成功</Breadcrumb.Item>
        <Breadcrumb.Item>金额：CNY <span className="num-style">250,000.00</span></Breadcrumb.Item>
        <Breadcrumb.Item>单据数：<span className="num-style">50,000笔</span></Breadcrumb.Item>
        <Breadcrumb.Item>金额：USD <span className="num-style">250,000.00</span></Breadcrumb.Item>
        <Breadcrumb.Item>单据数：<span className="num-style">100笔</span></Breadcrumb.Item>
      </Breadcrumb>
    );
    return (
      <div className="success-online">
        <Alert message="付款相关操作，请切换上方标签至【未支付】" type="info" showIcon style={{marginBottom:20}} />
        <Table rowKey={record => record.id}
               columns={onlineColumns}
               dataSource={onlineData}
               pagination={false}
               loading={onlineLoading}
               title={()=>{return tableTitle}}
               scroll={{x: true, y: false}}
               bordered
               size="middle"/>
        <Pagination size="small"
                    defaultPageSize={onlinePageSize}
                    showSizeChanger
                    pageSizeOptions={['1','2','5','10']}
                    total={onlinePagination.total}
                    onChange={this.onlinePaginationChange}
                    onShowSizeChange={this.onlinePaginationChange}
                    style={{margin:'16px 0', textAlign:'right'}} />
      </div>
    )
  };

  //线下 - 内容渲染
  renderOfflineContent = () => {
    const { columns, offlineData, offlineLoading, offlinePageSize, offlinePagination } = this.state;
    const tableTitle = (
      <Breadcrumb separator="|">
        <Breadcrumb.Item>成功</Breadcrumb.Item>
        <Breadcrumb.Item>金额：CNY <span className="num-style">250,000.00</span></Breadcrumb.Item>
        <Breadcrumb.Item>单据数：<span className="num-style">50,000笔</span></Breadcrumb.Item>
        <Breadcrumb.Item>金额：USD <span className="num-style">250,000.00</span></Breadcrumb.Item>
        <Breadcrumb.Item>单据数：<span className="num-style">100笔</span></Breadcrumb.Item>
      </Breadcrumb>
    );
    return (
      <div className="success-offline">
        <Table rowKey={record => record.id}
               columns={columns}
               dataSource={offlineData}
               pagination={false}
               loading={offlineLoading}
               title={()=>{return tableTitle}}
               scroll={{x: true, y: false}}
               bordered
               size="middle"/>
        <Pagination size="small"
                    defaultPageSize={offlinePageSize}
                    showSizeChanger
                    pageSizeOptions={['1','2','5','10']}
                    total={offlinePagination.total}
                    onChange={this.offlinePaginationChange}
                    onShowSizeChange={this.offlinePaginationChange}
                    style={{margin:'16px 0', textAlign:'right'}} />
      </div>
    )
  };

  //落地文件 - 内容渲染
  renderFileContent = () => {
    const { columns, fileData, fileLoading, filePageSize, filePagination } = this.state;
    const tableTitle = (
      <Breadcrumb separator="|">
        <Breadcrumb.Item>成功</Breadcrumb.Item>
        <Breadcrumb.Item>金额：CNY <span className="num-style">250,000.00</span></Breadcrumb.Item>
        <Breadcrumb.Item>单据数：<span className="num-style">50,000笔</span></Breadcrumb.Item>
        <Breadcrumb.Item>金额：USD <span className="num-style">250,000.00</span></Breadcrumb.Item>
        <Breadcrumb.Item>单据数：<span className="num-style">100笔</span></Breadcrumb.Item>
      </Breadcrumb>
    );
    return (
      <div className="success-file">
        <Table rowKey={record => record.id}
               columns={columns}
               dataSource={fileData}
               pagination={false}
               loading={fileLoading}
               title={()=>{return tableTitle}}
               scroll={{x: true, y: false}}
               bordered
               size="middle"/>
        <Pagination size="small"
                    defaultPageSize={filePageSize}
                    showSizeChanger
                    pageSizeOptions={['1','2','5','10']}
                    total={filePagination.total}
                    onChange={this.filePaginationChange}
                    onShowSizeChange={this.filePaginationChange}
                    style={{margin:'16px 0', textAlign:'right'}} />
      </div>
    )
  };

  render(){
    const { searchForm, radioValue } = this.state;
    return (
      <div className="pay-success">
        <SearchArea
          searchForm={searchForm}
          submitHandle={this.search}
          clearHandle={this.clear}/>
        <Radio.Group value={radioValue} style={{margin:'20px 0'}}
                     onChange={(e) => {this.setState({ radioValue: e.target.value })}}>
          <Radio.Button value="online">线上</Radio.Button>
          <Radio.Button value="offline">线下</Radio.Button>
          <Radio.Button value="file">落地文件</Radio.Button>
        </Radio.Group>
        {radioValue === 'online' && this.renderOnlineContent()}
        {radioValue === 'offline' && this.renderOfflineContent()}
        {radioValue === 'file' && this.renderFileContent()}
      </div>
    )
  }

}

function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps)(injectIntl(PaySuccess));
