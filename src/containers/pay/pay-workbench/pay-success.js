import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import config from 'config'
import httpFetch from 'share/httpFetch'
import menuRoute from 'share/menuRoute'
import { Badge, Radio, Table, Pagination, Alert, message, Modal, Icon, Form, DatePicker } from 'antd'
const FormItem = Form.Item;

import moment from 'moment'
import SearchArea from 'components/search-area'

class PaySuccess extends React.Component {
  constructor(props) {
    super(props);
    const {formatMessage} = this.props.intl;
    this.state = {
      radioValue: 'online',
      searchForm: [
        {type: 'input', id: 'documentNumber', label: formatMessage({id: "pay.workbench.receiptNumber"})}, //单据编号
        {type: 'value_list', id: 'documentCategory', label: formatMessage({id: "pay.workbench.receiptType"}), options: [], valueListCode: 2023}, //单据类型
        {type: 'select', id: 'employeeId', label: formatMessage({id: "pay.workbench.applicant"}), options: []}, //申请人
        {type: 'items', id: 'mountRange', items: [
          {type: 'input', id: 'mountFrom', label: '支付金额从'},
          {type: 'input', id: 'mountTo', label: '支付金额至'}
        ]},
        {type: 'items', id: 'payee', label: formatMessage({id: "pay.workbench.payee"}), items: [
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
        {title: '付款流水号', dataIndex: 'billcode', render: (value, record) => <a onClick={() => {this.checkPaymentDetail(record)}}>{value}</a>},
        {title: '单据编号 | 单据类型', dataIndex: 'documentNumber', render: (value, record) => {
          return (
            <div>
              <a onClick={() => {this.checkPaymentDetail(record)}}>{value}</a>
              <span className="ant-divider"/>
              {record.documentTypeName}
            </div>
          )}
        },
        {title: '付款批次号', dataIndex: 'customerBatchNo'},
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
        {title: '类型 | 收款方', dataIndex: 'partnerCategoryName', render: (value, record) => {
          return (
            <div>
              {value}
              <span className="ant-divider"/>
              {record.partnerName}
            </div>
          )}
        },
        {title: '收款方账号', dataIndex: 'draweeAccountNumber'},
        {title: '支付日期', dataIndex: 'payDate', render: value => moment(value).format('YYYY-MM-DD')},
        {title: '状态', dataIndex: 'paymentStatusName', render: (state) => <Badge status='success' text={state}/>},
      ],
      pageSizeOptions: ['10', '20', '30', '50'],

      /* 线上 */
      onlineLoading: false,
      onlineData: [],
      onlinePage: 0,
      onlinePageSize: 10,
      onlinePagination: {
        total: 0
      },
      onlineCash: [],  //总金额
      modalVisible: false,
      refundRow: {},
      confirmLoading: false,

      /* 线下 */
      offlineLoading: false,
      offlineData: [],
      offlinePage: 0,
      offlinePageSize: 10,
      offlinePagination: {
        total: 0
      },
      offlineCash: [],  //总金额

      /* 落地文件 */
      fileLoading: false,
      fileData: [],
      filePage: 0,
      filePageSize: 10,
      filePagination: {
        total: 0
      },
      fileCash: [],  //总金额

      paymentDetail:  menuRoute.getRouteItem('payment-detail','key'),    //支付详情
    };
  }

  componentWillMount() {
    this.props.subTab && this.setState({ radioValue: this.props.subTab });
    this.getList()
  }

  getList = () => {
    let online = new Promise((resolve, reject) => {
      this.getOnlineList(resolve, reject)
    });
    let offline = new Promise((resolve, reject) => {
      this.getOfflineList(resolve, reject)
    });
    let file = new Promise((resolve, reject) => {
      this.getFileList(resolve, reject)
    });
    Promise.all([ online, offline, file ]).then(() => {
      this.getOnlineCash();
      this.getOfflineCash();
      this.getFileCash();
    }).catch(() => {
      message.error('数据加载失败，请重试')
    })
  };

  search = (values) => {
    this.setState({
      searchParams: values,
      onlineCash: [],
      offlineCash: [],
      fileCash: []
    }, () => {
      this.getList()
    })
  };

  clear = () => {};

  //退票
  handleRefund = (record) => {
    this.props.form.setFieldsValue({ refundDate: undefined });
    this.setState({ modalVisible: true, refundRow: record })
  };

  //确认退票
  confirmRefund = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({ confirmLoading: true });
        let url = `${config.contractUrl}/payment/api/cash/transaction/details/refund?refundDate=${moment(values.refundDate).format('YYYY-MM-DD')}`;
        httpFetch.post(url, this.state.refundRow).then(res => {
          if (res.status === 200) {
            this.setState({ modalVisible: false, confirmLoading: false });
            message.success('退票成功');
            this.getOnlineList();
            this.getOnlineCash()
          }
        }).catch(() => {
          this.setState({ confirmLoading: false });
          message.error('退票失败，请重试')
        })
      }
    });
  };

  //查看支付流水详情
  checkPaymentDetail = (record) => {
    this.context.router.push(this.state.paymentDetail.url.replace(':tab', 'Success').replace(':subTab', this.state.radioValue).replace(':id', record.id));
  };

  /*********************** 获取总金额 ***********************/

  //线上
  getOnlineCash = () => {
    const { searchParams } = this.state;
    let url = `${config.contractUrl}/payment/api/cash/transaction/details/select/totalAmountAndDocumentNum?paymentStatus=S&paymentTypeCode=ONLINE_PAYMENT`;
    for(let paramsName in searchParams){
      url += searchParams[paramsName] ? `&${paramsName}=${searchParams[paramsName]}` : '';
    }
    httpFetch.get(url).then(res => {
      this.setState({ onlineCash: res.data })
    })
  };

  //线下
  getOfflineCash = () => {
    const { searchParams } = this.state;
    let url = `${config.contractUrl}/payment/api/cash/transaction/details/select/totalAmountAndDocumentNum?paymentStatus=S&paymentTypeCode=OFFLINE_PAYMENT`;
    for(let paramsName in searchParams){
      url += searchParams[paramsName] ? `&${paramsName}=${searchParams[paramsName]}` : '';
    }
    httpFetch.get(url).then(res => {
      this.setState({ offlineCash: res.data })
    })
  };

  //落地文件
  getFileCash = () => {
    const { searchParams } = this.state;
    let url = `${config.contractUrl}/payment/api/cash/transaction/details/select/totalAmountAndDocumentNum?paymentStatus=S&paymentTypeCode=EBANK_PAYMENT`;
    for(let paramsName in searchParams){
      url += searchParams[paramsName] ? `&${paramsName}=${searchParams[paramsName]}` : '';
    }
    httpFetch.get(url).then(res => {
      this.setState({ fileCash: res.data })
    })
  };

  /************************ 获取列表 ************************/

  //线上
  getOnlineList = (resolve, reject) => {
    const { onlinePage, onlinePageSize, searchParams } = this.state;
    let url = `${config.contractUrl}/payment/api/cash/transaction/details/getAlreadyPaid?page=${onlinePage}&size=${onlinePageSize}&paymentTypeCode=ONLINE_PAYMENT`;
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
        resolve && resolve()
      }
    }).catch(() => {
      this.setState({ onlineLoading: false });
      reject && reject()
    })
  };

  //线下
  getOfflineList = (resolve, reject) => {
    const { offlinePage, offlinePageSize, searchParams } = this.state;
    let url = `${config.contractUrl}/payment/api/cash/transaction/details/getAlreadyPaid?page=${offlinePage}&size=${offlinePageSize}&paymentTypeCode=OFFLINE_PAYMENT`;
    for(let paramsName in searchParams){
      url += searchParams[paramsName] ? `&${paramsName}=${searchParams[paramsName]}` : '';
    }
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
        resolve && resolve()
      }
    }).catch(() => {
      this.setState({ offlineLoading: false });
      reject && reject()
    })
  };

  //落地文件
  getFileList = (resolve, reject) => {
    const { filePage, filePageSize, searchParams } = this.state;
    let url = `${config.contractUrl}/payment/api/cash/transaction/details/getAlreadyPaid?page=${filePage}&size=${filePageSize}&paymentTypeCode=EBANK_PAYMENT`;
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
        resolve && resolve()
      }
    }).catch(() => {
      this.setState({ fileLoading: false });
      reject && reject()
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

  //线下
  offlinePaginationChange = (offlinePage, offlinePageSize) => {
    offlinePage = offlinePage - 1;
    this.setState({ offlinePage, offlinePageSize },() => {
      this.getOfflineList()
    })
  };

  //落地文件
  filePaginationChange = (filePage, filePageSize) => {
    filePage = filePage - 1;
    this.setState({ filePage, filePageSize }, () => {
      this.getFileList()
    })
  };

  /************************ 内容渲染 ************************/

  //线上
  renderOnlineContent = () => {
    const { columns, onlineData, onlineLoading, onlinePageSize, onlinePagination, onlineCash, pageSizeOptions } = this.state;
    let onlineColumns = [].concat(columns);
    onlineColumns.push(
      {title: '操作', dataIndex: 'id', render: (id, record) => <a onClick={() => this.handleRefund(record)}>退票</a>}
    );
    const tableTitle = (
      <div>
        支付成功
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
      <div className="success-online">
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
                    pageSizeOptions={pageSizeOptions}
                    total={onlinePagination.total}
                    onChange={this.onlinePaginationChange}
                    onShowSizeChange={this.onlinePaginationChange}
                    style={{margin:'16px 0', textAlign:'right'}} />
      </div>
    )
  };

  //线下
  renderOfflineContent = () => {
    const { columns, offlineData, offlineLoading, offlinePageSize, offlinePagination, offlineCash, pageSizeOptions } = this.state;
    const tableTitle = (
      <div>
        支付成功
        {offlineCash.length > 0 && <span className="ant-divider"/>}
        {offlineCash.map((item, index) => {
          return (
            <div key={index} style={{display:'inline-block'}}>
              金额：{item.currency} <span className="num-style">{this.filterMoney(item.totalAmount)}</span>
              <span className="ant-divider"/>
              单据数：<span className="num-style">{item.documentNumber}笔</span>
              {index !== offlineCash.length - 1 && <span className="ant-divider"/>}
            </div>
          )
        })}
      </div>
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
                    pageSizeOptions={pageSizeOptions}
                    total={offlinePagination.total}
                    onChange={this.offlinePaginationChange}
                    onShowSizeChange={this.offlinePaginationChange}
                    style={{margin:'16px 0', textAlign:'right'}} />
      </div>
    )
  };

  //落地文件
  renderFileContent = () => {
    const { columns, fileData, fileLoading, filePageSize, filePagination, fileCash, pageSizeOptions } = this.state;
    const tableTitle = (
      <div>
        支付成功
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
                    pageSizeOptions={pageSizeOptions}
                    total={filePagination.total}
                    onChange={this.filePaginationChange}
                    onShowSizeChange={this.filePaginationChange}
                    style={{margin:'16px 0', textAlign:'right'}} />
      </div>
    )
  };

  /************************* End *************************/

  render(){
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 15, offset: 1 },
    };
    const { searchForm, radioValue, modalVisible, confirmLoading } = this.state;
    return (
      <div className="pay-success">
        <SearchArea searchForm={searchForm}
                    submitHandle={this.search}
                    clearHandle={this.clear}/>
        <Radio.Group value={radioValue} style={{margin:'20px 0'}}
                     onChange={(e) => {this.setState({ radioValue: e.target.value })}}>
          <Radio.Button value="online">线上</Radio.Button>
          <Radio.Button value="offline">线下</Radio.Button>
          <Radio.Button value="file">落地文件</Radio.Button>
        </Radio.Group>
        <Alert message="付款相关操作，请切换上方标签至【未支付】" type="info" showIcon style={{marginBottom:20}} />
        {radioValue === 'online' && this.renderOnlineContent()}
        {radioValue === 'offline' && this.renderOfflineContent()}
        {radioValue === 'file' && this.renderFileContent()}
        <Modal visible={modalVisible}
               confirmLoading={confirmLoading}
               onOk={this.confirmRefund}
               onCancel={() => this.setState({ modalVisible: false })}
               okText="确认退票"
               width={400}>
          <div style={{height:110}}>
            <span style={{marginRight:10,fontSize:14}}>
              <Icon type="exclamation-circle" style={{color:'#faad14', fontSize:22, marginRight:8, position:'relative', top:2}}/>
              将付款状态更改为
            </span>
            <Badge status="error" text="退票"/>
            <div style={{fontSize:12,color:'red',marginLeft:29}}>请务必向银行确认该付款已退票，以免产生重复支付</div>
            <Form style={{marginLeft:29}}>
              <FormItem {...formItemLayout}
                        label="退票日期"
                        style={{margin:'20px 0 10px'}}>
                {getFieldDecorator('refundDate', {
                  rules: [{
                    required: true,
                    message: '请选择'
                  }]
                })(
                  <DatePicker format="YYYY-MM-DD"
                              placeholder="请选择"
                              allowClear={false}/>
                )}
              </FormItem>
            </Form>
          </div>
        </Modal>
      </div>
    )
  }

}

PaySuccess.contextTypes = {
  router: React.PropTypes.object
};

PaySuccess.propTypes = {
  subTab: React.PropTypes.string,
};


function mapStateToProps() {
  return {}
}

const wrappedPaySuccess = Form.create()(injectIntl(PaySuccess));

export default connect(mapStateToProps)(wrappedPaySuccess);
