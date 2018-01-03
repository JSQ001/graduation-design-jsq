import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import config from 'config'
import httpFetch from 'share/httpFetch'
import menuRoute from 'share/menuRoute'
import { paymentService } from 'service'
import { Form, Radio, Badge, Table, Pagination, message, Button, Alert, Modal, Select, Input, Popconfirm, Spin } from 'antd'
const Option = Select.Option;
const FormItem = Form.Item;
const { TextArea } = Input;

import SearchArea from 'components/search-area'

class PayFail extends React.Component {
  constructor(props) {
    super(props);
    const {formatMessage} = this.props.intl;
    this.state = {
      radioValue: 'online',
      buttonDisabled: true,
      searchForm: [
        {type: 'input', id: 'documentNumber', label: formatMessage({id: "pay.workbench.receiptNumber"})}, //单据编号
        {type: 'value_list', id: 'documentCategory', label: formatMessage({id: "pay.workbench.receiptType"}), options: [], valueListCode: 2023}, //单据类型
        {type: 'select', id: 'employeeId', label: formatMessage({id: "pay.workbench.applicant"}), options: []}, //申请人
        {type: 'items', id: 'amountRange', items: [
          {type: 'input', id: 'amountFrom', label: '支付金额从'},
          {type: 'input', id: 'amountTo', label: '支付金额至'}
        ]},
        {type: 'items', id: 'payee', label: formatMessage({id: "pay.workbench.payee"}), items: [
          {type: 'value_list', id: 'partnerCategory', label: '类型', options: [], valueListCode: 2107},
          {type: 'select', id: 'partnerId', label: '收款方', options: []}
        ]},
        {type: 'input', id: 'billcode', label: '付款流水号'},
        {type: 'input', id: 'customerBatchNo', label: '付款批次号'},
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
        {title: '状态', dataIndex: 'paymentStatusName', render: (state) => <Badge status='error' text={state}/>},
      ],
      selectedRowKeys: [], //选中行key
      selectedRows: [],  //选中行
      noticeAlert: null, //提示
      errorAlert: null,  //错误
      currency: null,    //选中行的币种
      modalVisible: false,
      modalLoading: false,
      payAccountFetching: false,
      payWayFetching: false,
      payAccountOptions: [],
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
      payWayOptions: [],

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
    this.setState({
      searchParams: values,
      onlineCash: [],
      fileCash: []
    }, () => {
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
      selectedRowKeys: [],
      selectedRows: []
    }, () => {
      let values = this.props.form.getFieldsValue();
      Object.keys(values).map(key => {
        this.props.form.setFieldsValue({ [key]: undefined })
      });
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

  //选中行的key
  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys })
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

  //获取汇率
  getExchangeRate = () => {
    let url = `${config.baseUrl}/api/standardCurrency/selectStandardCurrency?base=CNY&otherCurrency=${this.state.currency}`;
    httpFetch.get(url).then(res => {
      this.props.form.setFieldsValue({ exchangeRate: res.data.rate });
    })
  };

  //点击重新支付按钮
  repay = () => {
    this.setState({ payWayOptions: [], payAccountOptions: [], modalVisible: true });
    let values = this.props.form.getFieldsValue();
    Object.keys(values).map(key => {
      this.props.form.setFieldsValue({ [key]: undefined });
    });
    this.props.form.setFieldsValue({ currency: this.state.currency });
    this.getExchangeRate()
  };

  //点击取消支付按钮
  cancelPay = () => {
    paymentService.cancelPay(this.state.selectedRows).then(res => {
      if (res.status === 200) {
        message.success('取消支付成功');
        this.getList();
        this.setState({ selectedRows: [] }, () => {
          this.noticeAlert(this.state.selectedRows)
        })
      }
    }).catch(() => {
      message.error('取消支付失败，请重试');
    })
  };

  //获取付款账户
  getPayAccount = () => {
    if (this.state.payAccountOptions.length > 0) return;
    this.setState({ payAccountFetching: true });
    let url = `${config.baseUrl}/api/companyBankAuth/selectAuthBank?empId=${this.props.user.userOID}`;
    httpFetch.get(url).then(res => {
      res.status === 200 && this.setState({ payAccountOptions: res.data, payAccountFetching: false })
    }).catch(() => {
      this.setState({ payAccountFetching: false })
    })
  };

  //获取付款方式
  getPayWay = () => {
    const { radioValue } = this.state;
    if (this.state.payWayOptions.length > 0) return;
    this.setState({ payWayFetching: true });
    let paymentType = radioValue === 'online' ? 'ONLINE_PAYMENT' : 'EBANK_PAYMENT';
    paymentService.getPayWay(paymentType).then(res => {
      res.status === 200 && this.setState({ payWayOptions: res.data, payWayFetching: false })
    }).catch(() => {
      message.error('付款方式获取失败');
      this.setState({ payWayFetching: false })
    })
  };

  //查看支付流水详情
  checkPaymentDetail = (record) => {
    this.context.router.push(this.state.paymentDetail.url.replace(':tab', 'Fail').replace(':subTab', this.state.radioValue).replace(':id', record.id));
  };

  /*********************** 获取总金额 ***********************/

  //线上
  getOnlineCash = () => {
    paymentService.getAmount('ONLINE_PAYMENT', 'F', this.state.searchParams).then(res => {
      this.setState({ onlineCash: res.data })
    })
  };

  //落地文件
  getFileCash = () => {
    paymentService.getAmount('EBANK_PAYMENT', 'F', this.state.searchParams).then(res => {
      this.setState({ fileCash: res.data })
    })
  };

  /************************ 获取列表 ************************/

  //线上
  getOnlineList = (resolve, reject) => {
    const { onlinePage, onlinePageSize, searchParams } = this.state;
    this.setState({ onlineLoading: true });
    paymentService.getFailList(onlinePage, onlinePageSize, 'ONLINE_PAYMENT', searchParams).then(res => {
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

  //落地文件
  getFileList = (resolve, reject) => {
    const { filePage, filePageSize, searchParams } = this.state;
    this.setState({ fileLoading: true });
    paymentService.getFailList(filePage, filePageSize, 'EBANK_PAYMENT', searchParams).then(res => {
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

  //落地文件
  filePaginationChange = (filePage, filePageSize) => {
    filePage = filePage - 1;
    this.setState({ filePage, filePageSize },() => {
      this.getFileList()
    })
  };

  /********************** 弹框 - 确认支付 *********************/

  //线上
  handleOnlineModalOk = () => {
    let params = {};
    params.details = this.state.selectedRows;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.paymentMethodCategory = "ONLINE_PAYMENT";
        values.payCompanyBankName = values.payCompanyBankNumber.label;
        values.payCompanyBankNumber = values.payCompanyBankNumber.key;
        values.paymentDescription = values.paymentTypeId.label;
        values.paymentTypeId = values.paymentTypeId.key;
        params.payDTO = values;
        this.setState({ modalLoading: true });
        paymentService.rePay(params).then(res => {
          if (res.status === 200) {
            message.success('操作成功');
            this.getOnlineList();
            this.getOnlineCash();
            this.setState({
              modalVisible: false,
              modalLoading: false,
              selectedRowKeys: [],
              selectedRows: []
            },() => {
              this.noticeAlert(this.state.selectedRows)
            })
          }
        }).catch(e => {
          message.error(`操作失败，${e.response.data.message}`);
          this.setState({ modalLoading: false })
        })
      }
    })
  };

  //落地文件
  handleFileModalOk = () => {
    this.setState({ modalVisible: false });
  };

  /************************ 内容渲染 ************************/

  //线上
  renderOnlineContent = () => {
    const { columns, onlineData, onlineLoading, onlinePageSize, onlinePagination, onlineCash, pageSizeOptions, selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys: selectedRowKeys,
      onChange: this.onSelectChange,
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
                    pageSizeOptions={pageSizeOptions}
                    total={onlinePagination.total}
                    onChange={this.onlinePaginationChange}
                    onShowSizeChange={this.onlinePaginationChange}
                    style={{margin:'16px 0', textAlign:'right'}} />
      </div>
    )
  };

  //落地文件
  renderFileContent = () => {
    const { columns, fileData, fileLoading, filePageSize, filePagination, fileCash, pageSizeOptions } = this.state;
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
    const { searchForm, radioValue, buttonDisabled, noticeAlert, errorAlert, modalVisible, modalLoading, currency, payWayOptions, payAccountFetching, payWayFetching, payAccountOptions } = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14, offset: 1 },
    };
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
          <Popconfirm title="确定取消支付吗" onConfirm={this.cancelPay}>
            <Button type="primary"
                    disabled={buttonDisabled}>取消支付</Button>
          </Popconfirm>
        </div>
        {noticeAlert ? <Alert message={noticeAlert} type="info" showIcon style={{marginBottom:'10px'}}/> : ''}
        {errorAlert ? <Alert message={errorAlert} type="error" showIcon style={{marginBottom:'10px'}}/> : ''}
        {radioValue === 'online' && this.renderOnlineContent()}
        {radioValue === 'file' && this.renderFileContent()}
        {radioValue === 'online' ? (
          <Modal title="线上重新支付确认"
                 visible={modalVisible}
                 confirmLoading={modalLoading}
                 okText="确认支付"
                 onOk={this.handleOnlineModalOk}
                 onCancel={() => this.setState({ modalVisible: false })}>
            <Form>
              <FormItem  {...formItemLayout} label="付款账户">
                {getFieldDecorator('payCompanyBankNumber', {
                  rules: [{
                    required: true,
                    message: '请选择'
                  }]
                })(
                  <Select placeholder="请选择"
                          onFocus={this.getPayAccount}
                          notFoundContent={payAccountFetching ? <Spin size="small" /> : '无匹配结果'}
                          labelInValue>
                    {payAccountOptions.map(option => {
                      return <Option key={option.bankAccountNumber}>{option.bankAccountName}</Option>
                    })}
                  </Select>
                )}
              </FormItem>
              <FormItem  {...formItemLayout} label="币种">
                {getFieldDecorator('currency', {
                  rules: [{ required: true }]
                })(
                  <Input disabled />
                )}
              </FormItem>
              <FormItem  {...formItemLayout} label="付款方式">
                {getFieldDecorator('paymentTypeId', {
                  rules: [{
                    required: true,
                    message: '请选择'
                  }]
                })(
                  <Select placeholder="请选择"
                          onFocus={this.getPayWay}
                          notFoundContent={payWayFetching ? <Spin size="small" /> : '无匹配结果'}
                          labelInValue>
                    {payWayOptions.map(option => {
                      return <Option key={option.id}>{option.description}</Option>
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
        ) : (
          <Modal title="落地文件重新支付"
                 visible={modalVisible}
                 confirmLoading={modalLoading}
                 okText="导出报盘文件"
                 onOk={this.handleFileModalOk}
                 onCancel={() => this.setState({ modalVisible: false })}>
            <Form>
              <div style={{marginBottom:15}}>01. 选择付款账号</div>
              <FormItem  {...formItemLayout} label="付款账户">
                {getFieldDecorator('payCompanyBankNumber', {
                  rules: [{
                    required: true,
                    message: '请选择'
                  }]
                })(
                  <Select placeholder="请选择"
                          onFocus={this.getPayAccount}
                          notFoundContent={payAccountFetching ? <Spin size="small" /> : '无匹配结果'}
                          labelInValue>
                    {payAccountOptions.map(option => {
                      return <Option key={option.bankAccountNumber}>{option.bankAccountName}</Option>
                    })}
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
              <FormItem  {...formItemLayout} label="汇率" style={{marginBottom:15}}>
                {getFieldDecorator('rate', {
                  initialValue: ''
                })(
                  <Input disabled />
                )}
              </FormItem>
              <div style={{marginBottom:15}}>02. 选择付款方式</div>
              <FormItem  {...formItemLayout} label="付款方式">
                {getFieldDecorator('paymentTypeId', {
                  rules: [{
                    required: true,
                    message: '请选择'
                  }]
                })(
                  <Select placeholder="请选择"
                          onFocus={this.getPayWay}
                          notFoundContent={payWayFetching ? <Spin size="small" /> : '无匹配结果'}
                          labelInValue>
                    {payWayOptions.map(option => {
                      return <Option key={option.id}>{option.description}</Option>
                    })}
                  </Select>
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="备注" style={{marginBottom:15}}>
                {getFieldDecorator('description', {
                  initialValue: ''
                })(
                  <TextArea autosize={{minRows: 2}} style={{minWidth:'100%'}} placeholder="请输入"/>
                )}
              </FormItem>
              <div style={{marginBottom:15}}>03. 点击下方【导出报盘文件】按钮</div>
              <FormItem  {...formItemLayout} style={{marginBottom:15}}>
                <div>1.导出报盘文件后，单据状态变为【支付中】</div>
                <div>2.可通过报盘文件，在网银中进行支付</div>
                <div>3.支付成功后，在【等待付款结果】标签下确认支付状态</div>
              </FormItem>
            </Form>
          </Modal>
        )}
      </div>
    )
  }

}

PayFail.contextTypes = {
  router: React.PropTypes.object
};

PayFail.propTypes = {
  subTab: React.PropTypes.string,
};

function mapStateToProps(state) {
  return {
    user: state.login.user
  }
}

const wrappedPayFail = Form.create()(injectIntl(PayFail));

export default connect(mapStateToProps)(wrappedPayFail);
