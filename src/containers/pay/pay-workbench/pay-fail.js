import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import config from 'config'
import httpFetch from 'share/httpFetch'
import { Radio, Badge, Breadcrumb, Table, Pagination, message } from 'antd'

import SearchArea from 'components/search-area'

class PayFail extends React.Component {
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
      this.getFileList(resolve, reject)
    }).catch(() => {
      message.error('数据加载失败，请重试')
    });
  }

  //线上 - 获取列表
  getOnlineList = (resolve, reject) => {
    const { onlinePage, onlinePageSize, searchParams } = this.state;
    let url = `${config.contractUrl}/payment/api/cash/transaction/details/payFailOrRefund/query?page=${onlinePage}&size=${onlinePageSize}&paymentMethodCategory=ONLINE_PAYMENT`;
    for(let paramsName in searchParams){
      url += searchParams[paramsName] ? `&${paramsName}=${searchParams[paramsName]}` : '';
    }
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

  //落地文件 - 获取列表
  getFileList = (resolve, reject) => {
    const { filePage, filePageSize, searchParams } = this.state;
    let url = `${config.contractUrl}/payment/api/cash/transaction/details/payFailOrRefund/query?page=${filePage}&size=${filePageSize}&paymentMethodCategory=EBANK_PAYMENT`;
    for(let paramsName in searchParams){
      url += searchParams[paramsName] ? `&${paramsName}=${searchParams[paramsName]}` : '';
    }
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

  search = () => {

  };

  clear = () => {

  };

  //线上 - 选择/取消选择某行的回调
  onOnlineSelectRow = () => {};

  //线上 - 选择/取消选择所有行的回调
  onOnlineSelectAllRow = () => {};

  //线上 - 修改每页显示数量
  onlinePaginationChange = (onlinePage, onlinePageSize) => {
    onlinePage = onlinePage - 1;
    this.setState({ onlinePage, onlinePageSize },() => {
      this.getOnlineList()
    })
  };

  //落地文件 - 选择/取消选择某行的回调
  onFileSelectRow = () => {};

  //落地文件 - 选择/取消选择所有行的回调
  onFileSelectAllRow = () => {};

  //落地文件 - 修改每页显示数量
  filePaginationChange = (filePage, filePageSize) => {
    filePage = filePage - 1;
    this.setState({ filePage, filePageSize },() => {
      this.getFileList()
    })
  };

  //线上 - 内容渲染
  renderOnlineContent = () => {
    const { columns, onlineData, onlineLoading, onlinePageSize, onlinePagination } = this.state;
    const rowSelection = {
      onSelect: this.onOnlineSelectRow,
      onSelectAll: this.onOnlineSelectAllRow
    };
    const tableTitle = (
      <Breadcrumb separator="|">
        <Breadcrumb.Item>等待付款结果</Breadcrumb.Item>
        <Breadcrumb.Item>金额：CNY <span className="num-style">250,000.00</span></Breadcrumb.Item>
        <Breadcrumb.Item>单据数：<span className="num-style">50,000笔</span></Breadcrumb.Item>
        <Breadcrumb.Item>金额：USD <span className="num-style">250,000.00</span></Breadcrumb.Item>
        <Breadcrumb.Item>单据数：<span className="num-style">100笔</span></Breadcrumb.Item>
      </Breadcrumb>
    );
    return (
      <div className="fail-online">
        <Table rowKey={record => record.id}
               columns={columns}
               dataSource={onlineData}
               pagination={false}
               loading={onlineLoading}
               rowSelection={rowSelection}
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

  //落地文件 - 内容渲染
  renderFileContent = () => {
    const { columns, fileData, fileLoading, filePageSize, filePagination } = this.state;
    const rowSelection = {
      onSelect: this.onFileSelectRow,
      onSelectAll: this.onFileSelectAllRow
    };
    const tableTitle = (
      <Breadcrumb separator="|">
        <Breadcrumb.Item>等待付款结果</Breadcrumb.Item>
        <Breadcrumb.Item>金额：CNY <span className="num-style">250,000.00</span></Breadcrumb.Item>
        <Breadcrumb.Item>单据数：<span className="num-style">50,000笔</span></Breadcrumb.Item>
        <Breadcrumb.Item>金额：USD <span className="num-style">250,000.00</span></Breadcrumb.Item>
        <Breadcrumb.Item>单据数：<span className="num-style">100笔</span></Breadcrumb.Item>
      </Breadcrumb>
    );
    return (
      <div className="fail-file">
        <Table rowKey={record => record.id}
               columns={columns}
               dataSource={fileData}
               pagination={false}
               loading={fileLoading}
               rowSelection={rowSelection}
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
      <div className="pay-fail">
        <SearchArea
          searchForm={searchForm}
          submitHandle={this.search}
          clearHandle={this.clear}/>
        <Radio.Group value={radioValue} style={{margin:'20px 0'}}
                     onChange={(e) => {this.setState({ radioValue: e.target.value })}}>
          <Radio.Button value="online">线上</Radio.Button>
          <Radio.Button value="offline" disabled>线下</Radio.Button>
          <Radio.Button value="file">落地文件</Radio.Button>
        </Radio.Group>
        {radioValue === 'online' && this.renderOnlineContent()}
        {radioValue === 'file' && this.renderFileContent()}
      </div>
    )
  }

}

function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps)(injectIntl(PayFail));
