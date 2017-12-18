import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import config from 'config'
import httpFetch from 'share/httpFetch'
import { Radio, Badge, Table, Pagination, message, Button, Alert } from 'antd'

import SearchArea from 'components/search-area'

class PayFail extends React.Component {
  constructor(props) {
    super(props);
    const {formatMessage} = this.props.intl;
    this.state = {
      radioValue: 'online',
      buttonDisabled: true,
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
            <div>
              <a>{value}</a>
              <span className="ant-divider"/>
              {record.documentCategory}
            </div>
          )}
        },
        {title: '工号 | 申请人', dataIndex: 'employeeName', render: (value, record) => {
          return (
            <div>
              {record.employeeId}
              <span className="ant-divider"/>
              {value}
            </div>
          )}
        },
        {title: '币种', dataIndex: 'currency'},
        {title: '本次支付金额', dataIndex: 'amount', render: this.filterMoney},
        {title: '付款方式', dataIndex: 'paymentTypeName'},
        {title: '类型 | 收款方', dataIndex: 'partnerCategory', render: (value, record) => {
          return (
            <div>
              {value}
              <span className="ant-divider"/>
              {record.partnerName}
            </div>
          )}
        },
        {title: '收款方账号', dataIndex: 'draweeAccountNumber'},
        {title: '状态', dataIndex: 'paymentStatus', render: (state) => <Badge status='error' text={state}/>},
      ],
      selectedRows: [],  //选中行
      noticeAlert: null, //提示
      errorAlert: null,  //错误
      currency: null,    //选中行的币种

      /* 线上 */
      onlineLoading: false,
      onlineData: [],
      onlinePage: 0,
      onlinePageSize: 10,
      onlinePagination: {
        total: 0
      },
      onlineCash: [],  //总金额

      /* 落地文件 */
      fileLoading: false,
      fileData: [],
      filePage: 0,
      filePageSize: 10,
      filePagination: {
        total: 0
      },
      fileCash: [],  //总金额
    };
  }

  componentWillMount() {
    this.getList()
  }

  //获取列表及总金额
  getList = () => {
    let online = new Promise((resolve, reject) => {
      this.getOnlineList(resolve, reject)
    });
    let file = new Promise((resolve, reject) => {
      this.getFileList(resolve, reject)
    });
    Promise.all([ online, file ]).then(() => {
      this.getOnlineCash();
      this.getFileCash();
    }).catch(() => {
      message.error('数据加载失败，请重试')
    })
  };

  //搜索
  search = (values) => {
    this.setState({ searchParams: values }, () => {
      this.getList()
    })
  };

  //清除搜索内容
  clear = () => {

  };

  //选择 线上／线下／落地文件
  onRadioChange = (e) => {
    this.setState({
      radioValue: e.target.value,
      selectedRows: []
    }, () => {
      this.noticeAlert(this.state.selectedRows)
    })
  };

  //选择/取消选择某行的回调
  handleSelectRow = (record, selected) => {
    let selectedRows = this.state.selectedRows;
    if(selected) {
      selectedRows.push(record)
    } else {
      selectedRows.map((item, index) => {
        item.id === record.id && (selectedRows[index] = 0)
      });
      selectedRows.delete(0)
    }
    this.setState({ selectedRows }, () => {
      this.noticeAlert(this.state.selectedRows)
    })
  };

  //选择/取消选择所有行的回调
  handleSelectAllRow = (selected, selectedRow, changeRows) => {
    let selectedRows = this.state.selectedRows;
    if(selected){
      changeRows.map(item => {
        selectedRows.push(item)
      })
    } else {
      selectedRows.map((row, index) => {
        changeRows.map(item => {
          row.id === item.id && (selectedRows[index] = 0)
        })
      });
      changeRows.map(() => {
        selectedRows.delete(0)
      })
    }
    this.setState({ selectedRows }, () => {
      this.noticeAlert(this.state.selectedRows)
    })
  };

  //提示框显示
  noticeAlert = (rows) => {
    let amount = 0;
    let errFlag = false;
    let currency = rows[0] ? rows[0].currency : null;
    this.setState({ currency });
    rows.forEach(item => {
      if (item.currency === currency) {
        amount += item.amount
      } else {
        errFlag = true
      }
    });
    if (!errFlag) {
      let noticeAlert = (
        <span>
          已选择<span style={{fontWeight:'bold',color:'#108EE9'}}> {rows.length} </span> 项
          <span className="ant-divider" />
          本次支付金额总计：{currency} <span style={{fontWeight:'bold',fontSize:'15px'}}> {this.filterMoney(amount)} </span>
        </span>
      );
      this.setState({
        noticeAlert: rows.length ? noticeAlert : null,
        errorAlert: null,
        buttonDisabled: !rows.length
      });
    } else {
      let errorAlert = (
        <span>
          已选择<span style={{fontWeight:'bold',color:'#108EE9'}}> {rows.length} </span> 项
          <span className="ant-divider" />
          不同币种不可同时支付
        </span>
      );
      this.setState({
        noticeAlert: null,
        errorAlert: errorAlert,
        buttonDisabled: true
      });
    }
  };

  //重新支付
  repay = () => {};

  //取消支付
  cancelPay = () => {};

  /*********************** 获取总金额 ***********************/

  //线上
  getOnlineCash = () => {
    let url = `${config.contractUrl}/payment/api/cash/transaction/details/select/totalAmountAndDocumentNum?paymentStatus=F&paymentTypeCode=ONLINE_PAYMENT`;
    httpFetch.get(url).then(res => {
      this.setState({ onlineCash: res.data })
    }).catch(() => {

    })
  };

  //落地文件
  getFileCash = () => {
    let url = `${config.contractUrl}/payment/api/cash/transaction/details/select/totalAmountAndDocumentNum?paymentStatus=F&paymentTypeCode=EBANK_PAYMENT`;
    httpFetch.get(url).then(res => {
      this.setState({ fileCash: res.data })
    }).catch(() => {

    })
  };

  /************************ 获取列表 ************************/

  //线上
  getOnlineList = (resolve, reject) => {
    const { onlinePage, onlinePageSize, searchParams } = this.state;
    let url = `${config.contractUrl}/payment/api/cash/transaction/details/payFailOrRefund/query?page=${onlinePage}&size=${onlinePageSize}&paymentTypeCode=ONLINE_PAYMENT`;
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

  //落地文件
  getFileList = (resolve, reject) => {
    const { filePage, filePageSize, searchParams } = this.state;
    let url = `${config.contractUrl}/payment/api/cash/transaction/details/payFailOrRefund/query?page=${filePage}&size=${filePageSize}&paymentTypeCode=EBANK_PAYMENT`;
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

  /********************* 修改每页显示数量 *********************/

  //线上
  onlinePaginationChange = (onlinePage, onlinePageSize) => {
    onlinePage = onlinePage - 1;
    this.setState({ onlinePage, onlinePageSize },() => {
      this.getOnlineList()
    })
  };

  //落地文件
  filePaginationChange = (filePage, filePageSize) => {
    filePage = filePage - 1;
    this.setState({ filePage, filePageSize },() => {
      this.getFileList()
    })
  };

  /************************ 内容渲染 ************************/

  //线上
  renderOnlineContent = () => {
    const { columns, onlineData, onlineLoading, onlinePageSize, onlinePagination, onlineCash } = this.state;
    const rowSelection = {
      onSelect: this.handleSelectRow,
      onSelectAll: this.handleSelectAllRow
    };
    const tableTitle = (
      <div>
        退票或失败
        {onlineCash.length > 0 && <span className="ant-divider"/>}
        {onlineCash.map((item, index) => {
          return (
            <div key={index} style={{display:'inline-block'}}>
              金额：{item.currency} <span className="num-style">{this.filterMoney(item.totalAmount)}</span>
              <span className="ant-divider"/>
              单据数：<span className="num-style">{item.documentNumber}笔</span>
              {index !== onlineCash.length - 1 && <span className="ant-divider"/>}
            </div>
          )
        })}
      </div>
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

  //落地文件
  renderFileContent = () => {
    const { columns, fileData, fileLoading, filePageSize, filePagination, fileCash } = this.state;
    const rowSelection = {
      onSelect: this.handleSelectRow,
      onSelectAll: this.handleSelectAllRow
    };
    const tableTitle = (
      <div>
        退票或失败
        {fileCash.length > 0 && <span className="ant-divider"/>}
        {fileCash.map((item, index) => {
          return (
            <div key={index} style={{display:'inline-block'}}>
              金额：{item.currency} <span className="num-style">{this.filterMoney(item.totalAmount)}</span>
              <span className="ant-divider"/>
              单据数：<span className="num-style">{item.documentNumber}笔</span>
              {index !== fileCash.length - 1 && <span className="ant-divider"/>}
            </div>
          )
        })}
      </div>
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

  /************************* End *************************/

  render(){
    const { searchForm, radioValue, buttonDisabled, noticeAlert, errorAlert } = this.state;
    return (
      <div className="pay-fail">
        <SearchArea
          searchForm={searchForm}
          submitHandle={this.search}
          clearHandle={this.clear}/>
        <Radio.Group value={radioValue} style={{margin:'20px 0'}}
                     onChange={this.onRadioChange}>
          <Radio.Button value="online">线上</Radio.Button>
          <Radio.Button value="offline" disabled>线下</Radio.Button>
          <Radio.Button value="file">落地文件</Radio.Button>
        </Radio.Group>
        <div style={{marginBottom:10}}>
            <Button type="primary"
                    disabled={buttonDisabled}
                    style={{marginRight:20}}
                    onClick={this.repay}>重新支付</Button>
            <Button type="primary"
                    disabled={buttonDisabled}
                    onClick={this.cancelPay}>取消支付</Button>
        </div>
        {noticeAlert ? <Alert message={noticeAlert} type="info" showIcon style={{marginBottom:'10px'}}/> : ''}
        {errorAlert ? <Alert message={errorAlert} type="error" showIcon style={{marginBottom:'10px'}}/> : ''}
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
