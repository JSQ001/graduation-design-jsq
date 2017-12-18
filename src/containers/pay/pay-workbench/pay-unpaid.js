import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import config from 'config'
import httpFetch from 'share/httpFetch'
import moment from 'moment'

import { Radio, Table, Badge, Modal, Form, Select, Input, Pagination, Button, Alert, message, Icon, Tooltip, DatePicker } from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
import SearchArea from 'components/search-area'
import menuRoute from 'share/menuRoute'

import EditableCell from 'containers/pay/pay-workbench/editable-cell'

class PayUnpaid extends React.Component {
  constructor(props) {
    super(props);
    const {formatMessage} = this.props.intl;
    this.state = {
      radioValue: 'online',
      editCellError: false,
      searchParams: {},
      searchForm: [
        {type: 'input', id: 'documentNumber', label: formatMessage({id: "payWorkbench.receiptNumber"})}, //单据编号
        {type: 'value_list', id: 'documentCategory', label: formatMessage({id: "payWorkbench.receiptType"}), options: [], valueListCode: 2023}, //单据类型
        {type: 'select', id: 'employeeId', label: formatMessage({id: "payWorkbench.applicant"}), options: []}, //申请人
        {type: 'items', id: 'dateRange', items: [
          {type: 'date', id: 'requisitionDateFrom', label: formatMessage({id: "payWorkbench.dateFrom"})}, //申请日期从
          {type: 'date', id: 'requisitionDateTo', label: formatMessage({id: "payWorkbench.dateTo"})} //申请日期至
        ]},
        {type: 'items', id: 'amountRange', items: [
          {type: 'input', id: 'amountFrom', label: formatMessage({id: "payWorkbench.mountFrom"})}, //总金额从
          {type: 'input', id: 'amountTo', label: formatMessage({id: "payWorkbench.mountTo"})} //总金额至
        ]},
        {type: 'items', id: 'partner', label: formatMessage({id: "payWorkbench.payee"}), items: [
          {type: 'value_list', id: 'partnerCategory', label: '类型', options: [], valueListCode: 2107},
          {type: 'select', id: 'partnerId', label: '收款方', options: []}  //收款方
        ]}
      ],
      columns: [
        {title: '单据编号 | 单据类型', dataIndex: 'documentNumber', render: (value, record) => {
          return (
            <div>
              <a onClick={() => {this.checkPaymentDetail(record)}}>{value}</a>
              <span className="ant-divider"/>
              {record.documentCategoryName}
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
        {title: '申请日期', dataIndex: 'requisitionDate', render: value => moment(value).format('YYYY-MM-DD')},
        {title: '币种', dataIndex: 'currency'},
        {title: '总金额', dataIndex: 'amount', render: this.filterMoney},
        {title: '可支付金额', dataIndex: 'payableAmount', render: (value, record) => {
          let numberString = Number(value || 0).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
          numberString += (numberString.indexOf('.') > -1 ? '' : '.00');
          return(
            value === record.amount ? this.filterMoney(value) :
              <div style={{textAlign:'right'}}>
                <Tooltip title="可支付金额不等于总金额"><Icon type="exclamation-circle-o" style={{color:'red',marginRight:5}} /></Tooltip>
                {numberString}
              </div>
          )}
        },
        {title: '本次支付金额', dataIndex: 'currentPayAmount', render: (value, record) => {
          return (
            <EditableCell type="number"
                          value={value}
                          message={formatMessage({id: "payWorkbench.payedAmount.tooltip"}/*点击修改本次支付金额*/)}
                          onChangeError={this.state.editCellError}
                          onChange={(editValue) => this.editCurrentPay(editValue, record)} />
          )}
        },
        {title: '付款方式', dataIndex: 'paymentMethodCategoryName'},
        {title: '类型 | 收款方', dataIndex: 'partnerCategoryName', render: (value, record) => {
          return (
            <div>
              {value}
              <span className="ant-divider"/>
              {record.partnerName}
            </div>
          )}
        },
        {title: '收款账号', dataIndex: 'accountNumber', render: (account, record) => (
          <EditableCell value={account}
                        message={formatMessage({id: "payWorkbench.accountNumber.tooltip"}/*点击修改收款账号*/)}
                        onChangeError={this.state.editCellError}
                        onChange={(value) => this.editAccount(value, record)}/>
        )},
        {title: '状态', dataIndex: 'paymentStatusName', render: (state) => <Badge status='default' text={state}/>}
      ],
      buttonDisabled: true,
      selectedRows: [],  //选中行
      noticeAlert: null, //提示
      errorAlert: null,  //错误
      currency: null,    //选中行的币种

      /* 线上 */
      onlineLoading: false,
      onlinePage: 0,
      onlinePageSize: 10,
      onlinePagination: { total: 0 },
      onlineData: [],
      onlineCash: [],                 //总金额
      payWayOptions: [],
      onlineModalVisible: false,

      /* 线下 */
      offlineLoading: false,
      offlinePage: 0,
      offlinePageSize: 10,
      offlinePagination: { total: 0 },
      offlineData: [],
      offlineCash: [],                //总金额
      offlineModalVisible: true,

      /* 落地文件 */
      fileLoading: false,
      filePage: 0,
      filePageSize: 10,
      filePagination: { total: 0 },
      fileData: [],
      fileCash: [],                   //总金额
      fileModalVisible: false,

      paymentDetail:  menuRoute.getRouteItem('payment-detail','key'),    //支付详情
    };
  }

  componentWillMount() {
    this.getList();
  }

  //获取列表及总金额
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

  //搜索
  search = (result) => {
    result.requisitionDateFrom = result.requisitionDateFrom ? moment(result.requisitionDateFrom).format('YYYY-MM-DD') : null;
    result.requisitionDateTo = result.requisitionDateTo ? moment(result.requisitionDateTo).format('YYYY-MM-DD') : null;
    this.setState({ searchParams: result },() => {
      this.getList()
    })
  };

  //清空搜索区域
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
        amount += item.currentPay || item.currentPayAmount
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

  //修改本次支付金额
  editCurrentPay = (value, record) => {
    if (!value || value <= 0) {
      message.error('本次支付金额必须大于0');
      this.setState({ editCellError: true });
      return
    }
    if (value > record.payableAmount) {
      message.error('本次支付金额不能大于可支付金额');
      this.setState({ editCellError: true });
      return
    }
    this.setState({ editCellError: false });
    this.state.onlineData.map(item => {
      item.id === record.id && (item.currentPay = value)
    });
    this.state.offlineData.map(item => {
      item.id === record.id && (item.currentPay = value)
    });
    this.state.fileData.map(item => {
      item.id === record.id && (item.currentPay = value)
    });
    this.noticeAlert(this.state.selectedRows);
    message.success('修改成功')
  };

  //修改收款账号
  editAccount = (value, record) => {
    let url = `${config.contractUrl}/payment/api/cash/transactionData`;
    let params = [{
      id: record.id,
      accountNumber: value,
      versionNumber: record.versionNumber
    }];
    httpFetch.put(url, params).then(res => {
      if (res.status === 200) {
        message.success('修改成功');
        this.setState({ editCellError: false });
        this.getOnlineList()
      }
    }).catch(e => {
      this.setState({ editCellError: true });
      message.error(`修改失败，${e.response.data.message}`);
    })
  };

  //点击支付按钮
  handlePayModal = () => {
    const { radioValue } = this.state;
    if (radioValue === 'online') {
      this.setState({ onlineModalVisible: true })
    } else if (radioValue === 'offline') {
      this.setState({ offlineModalVisible: true })
    } else {
      this.setState({ fileModalVisible: true })
    }
  };

  //查看支付流水详情
  checkPaymentDetail = (record) => {
    this.context.router.push(this.state.paymentDetail.url.replace(':tab', 'Unpaid').replace(':id', record.id));
  };

  /*********************** 获取总金额 ***********************/

  //线上
  getOnlineCash = () => {
    const { searchParams } = this.state;
    let url = `${config.contractUrl}/payment/api/cash/transactionData/select/totalAmountAndDocumentNum?paymentMethodCategory=ONLINE_PAYMENT`;
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
    let url = `${config.contractUrl}/payment/api/cash/transactionData/select/totalAmountAndDocumentNum?paymentMethodCategory=OFFLINE_PAYMENT`;
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
    let url = `${config.contractUrl}/payment/api/cash/transactionData/select/totalAmountAndDocumentNum?paymentMethodCategory=EBANK_PAYMENT`;
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
    let url = `${config.contractUrl}/payment/api/cash/transactionData/query?page=${onlinePage}&size=${onlinePageSize}&paymentMethodCategory=ONLINE_PAYMENT`;
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
    let url = `${config.contractUrl}/payment/api/cash/transactionData/query?page=${offlinePage}&size=${offlinePageSize}&paymentMethodCategory=OFFLINE_PAYMENT`;
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
    let url = `${config.contractUrl}/payment/api/cash/transactionData/query?page=${filePage}&size=${filePageSize}&paymentMethodCategory=EBANK_PAYMENT`;
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

  /********************** 弹框 - 确认支付 *********************/

  //线上
  handleOnlineModalOk = () => {
    this.setState({ onlineModalVisible: false });
  };

  //线下
  handleOfflineModalOk = () => {
    this.setState({ offlineModalVisible: false });
  };

  //落地文件
  handleFileModalOk = () => {
    this.setState({ fileModalVisible: false });
  };

  /********************* 修改每页显示数量 *********************/

  //线上
  onlinePaginationChange = (onlinePage, onlinePageSize) => {
    onlinePage = onlinePage - 1;
    this.setState({ onlinePage, onlinePageSize },() => {
      this.getOnlineList();
      this.getOnlineCash()
    })
  };

  //线下
  offlinePaginationChange = (offlinePage, offlinePageSize) => {
    offlinePage = offlinePage - 1;
    this.setState({ offlinePage, offlinePageSize },() => {
      this.getOfflineList();
      this.getOfflineCash()
    })
  };

  //落地文件
  filePaginationChange = (filePage, filePageSize) => {
    filePage = filePage - 1;
    this.setState({ filePage, filePageSize },() => {
      this.getFileList();
      this.getFileCash()
    })
  };

  /************************ 内容渲染 ************************/

  //线上
  renderOnlineContent = () => {
    const { onlineLoading, columns, onlineData, onlinePageSize, onlinePagination, onlineCash } = this.state;
    const rowSelection = {
      onSelect: this.handleSelectRow,
      onSelectAll: this.handleSelectAllRow
    };
    const tableTitle = (
      <div>
        {this.props.intl.formatMessage({id:"payWorkbench.Unpaid"})}
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
      <div className="unpaid-online">
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

  //线下
  renderOfflineContent = () => {
    const { offlineLoading, columns, offlineData, offlinePageSize, offlinePagination, offlineCash } = this.state;
    const rowSelection = {
      onSelect: this.handleSelectRow,
      onSelectAll: this.handleSelectAllRow
    };
    const tableTitle = (
      <div>
        {this.props.intl.formatMessage({id:"payWorkbench.Unpaid"})}
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
      <div className="unpaid-offline">
        <Table rowKey={record => record.id}
               columns={columns}
               dataSource={offlineData}
               pagination={false}
               loading={offlineLoading}
               rowSelection={rowSelection}
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

  //落地文件
  renderFileContent = () => {
    const { fileLoading, columns, fileData, filePageSize, filePagination, fileCash } = this.state;
    const rowSelection = {
      onSelect: this.handleSelectRow,
      onSelectAll: this.handleSelectAllRow
    };
    const tableTitle = (
      <div>
        {this.props.intl.formatMessage({id:"payWorkbench.Unpaid"})}
        {fileCash.length > 0 && <span className="ant-divider"/>}
        {fileCash.map((item, index) => {
          return (
            <div key={index}  style={{display:'inline-block'}}>
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
      <div className="unpaid-file">
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
    const { getFieldDecorator } = this.props.form;
    const { searchForm, onlineModalVisible, offlineModalVisible, fileModalVisible, radioValue, payWayOptions, currency, buttonDisabled, noticeAlert, errorAlert } = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14, offset: 1 },
    };
    return (
      <div className="pay-unpaid">
        <SearchArea searchForm={searchForm}
                    submitHandle={this.search}
                    clearHandle={this.clear}/>
        <Radio.Group value={radioValue} style={{margin:'20px 0'}}
                     onChange={this.onRadioChange}>
          <Radio.Button value="online">线上</Radio.Button>
          <Radio.Button value="offline">线下</Radio.Button>
          <Radio.Button value="file">落地文件</Radio.Button>
        </Radio.Group>
        <Button type="primary"
                style={{marginBottom:10, display:'block'}}
                disabled={buttonDisabled}
                onClick={this.handlePayModal}>
          {radioValue === 'online' && this.props.intl.formatMessage({id:"payWorkbench.payOnline"}/*线上支付*/)}
          {radioValue === 'offline' && '线下支付'}
          {radioValue === 'file' && '落地文件支付'}
        </Button>
        {noticeAlert ? <Alert message={noticeAlert} type="info" showIcon style={{marginBottom:'10px'}}/> : ''}
        {errorAlert ? <Alert message={errorAlert} type="error" showIcon style={{marginBottom:'10px'}}/> : ''}
        {radioValue === 'online' && this.renderOnlineContent()}
        {radioValue === 'offline' && this.renderOfflineContent()}
        {radioValue === 'file' && this.renderFileContent()}
        <Modal title="线上支付确认"
               visible={onlineModalVisible}
               onOk={this.handleOnlineModalOk}
               onCancel={() => this.setState({ onlineModalVisible: false })}>
          <Form>
            <FormItem  {...formItemLayout} label="付款账户">
              {getFieldDecorator('payAccount', {
                rules: [{
                  required: true,
                  message: '请选择'
                }]})(
                <Select placeholder="请选择">

                </Select>
              )}
            </FormItem>
            <FormItem  {...formItemLayout} label="币种">
              {getFieldDecorator('currency', {
                rules: [{
                  required: true
                }],
                initialValue: currency
              })(
                <Input disabled />
              )}
            </FormItem>
            <FormItem  {...formItemLayout} label="付款方式">
              {getFieldDecorator('payWay', {
                rules: [{
                  required: true,
                  message: '请选择'
                }]})(
                <Select placeholder="请选择">
                  {payWayOptions.map(option => {
                    return <Option key={option.value}>{option.messageKey}</Option>
                  })}
                </Select>
              )}
            </FormItem>
            <FormItem  {...formItemLayout} label="汇率">
              {getFieldDecorator('rate', {
                initialValue: ''
              })(
                <Input disabled />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="备注">
              {getFieldDecorator('description', {
                initialValue: ''
              })(
                <TextArea autosize={{minRows: 2}} style={{minWidth:'100%'}} placeholder="请输入"/>
              )}
            </FormItem>
          </Form>
        </Modal>
        <Modal title="线下支付确认"
               visible={offlineModalVisible}
               onOk={this.handleOfflineModalOk}
               onCancel={() => this.setState({ offlineModalVisible: false })}>
          <Form>
            <Alert message="线下支付，确认付款后，支付状态直接变为支付成功" type="info" showIcon style={{position:'relative',top:-10}} />
            <FormItem  {...formItemLayout} label="付款日期" style={{marginBottom:15}}>
              {getFieldDecorator('payDate', {
                rules: [{
                  required: true,
                  message: '请选择'
                }]})(
                <DatePicker/>
              )}
            </FormItem>
            <FormItem  {...formItemLayout} label="付款账户" style={{marginBottom:15}}>
              {getFieldDecorator('payAccount', {
                rules: [{
                  required: true,
                  message: '请选择'
                }]})(
                <Select placeholder="请选择">

                </Select>
              )}
            </FormItem>
            <FormItem  {...formItemLayout} label="币种" style={{marginBottom:15}}>
              {getFieldDecorator('currency', {
                rules: [{
                  required: true
                }],
                initialValue: currency
              })(
                <Input disabled />
              )}
            </FormItem>
            <FormItem  {...formItemLayout} label="付款方式" style={{marginBottom:15}}>
              {getFieldDecorator('payWay', {
                rules: [{
                  required: true,
                  message: '请选择'
                }]})(
                <Select placeholder="请选择">
                  {payWayOptions.map(option => {
                    return <Option key={option.value}>{option.messageKey}</Option>
                  })}
                </Select>
              )}
            </FormItem>
            <FormItem  {...formItemLayout} label="汇率" style={{marginBottom:15}}>
              {getFieldDecorator('rate', {
                initialValue: ''
              })(
                <Input disabled />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="备注" style={{marginBottom:15}}>
              {getFieldDecorator('description', {
                initialValue: ''
              })(
                <TextArea autosize={{minRows: 2}} style={{minWidth:'100%'}} placeholder="请输入"/>
              )}
            </FormItem>
          </Form>
        </Modal>
        <Modal title="落地文件支付"
               visible={fileModalVisible}
               onOk={this.handleFileModalOk}
               onCancel={() => this.setState({ fileModalVisible: false })}>
          <Form>
            <FormItem  {...formItemLayout} label="付款账户">
              {getFieldDecorator('payAccount', {
                rules: [{
                  required: true,
                  message: '请选择'
                }]})(
                <Select placeholder="请选择">

                </Select>
              )}
            </FormItem>
            <FormItem  {...formItemLayout} label="币种">
              {getFieldDecorator('currency', {
                rules: [{
                  required: true
                }],
                initialValue: currency
              })(
                <Input disabled />
              )}
            </FormItem>
            <FormItem  {...formItemLayout} label="付款方式">
              {getFieldDecorator('payWay', {
                rules: [{
                  required: true,
                  message: '请选择'
                }]})(
                <Select placeholder="请选择">
                  {payWayOptions.map(option => {
                    return <Option key={option.value}>{option.messageKey}</Option>
                  })}
                </Select>
              )}
            </FormItem>
            <FormItem  {...formItemLayout} label="汇率">
              {getFieldDecorator('rate', {
                initialValue: ''
              })(
                <Input disabled />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="备注">
              {getFieldDecorator('description', {
                initialValue: ''
              })(
                <TextArea autosize={{minRows: 2}} style={{minWidth:'100%'}} placeholder="请输入"/>
              )}
            </FormItem>
          </Form>
        </Modal>
      </div>
    )
  }

}

PayUnpaid.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps() {
  return {}
}

const WrappedPayUnpaid = Form.create()(PayUnpaid);

export default connect(mapStateToProps)(injectIntl(WrappedPayUnpaid));
