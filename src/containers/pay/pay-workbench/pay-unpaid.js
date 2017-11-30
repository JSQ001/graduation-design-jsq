import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import config from 'config'
import httpFetch from 'share/httpFetch'
import moment from 'moment'

import { Radio, Table, Breadcrumb, Badge, Modal, Form, Select, Input, Pagination, Button, Alert, message } from 'antd'
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
      searchForm: [
        {type: 'input', id: 'receiptNumber', label: formatMessage({id: "payWorkbench.receiptNumber"})}, //单据编号
        {type: 'select', id: 'receiptType', label: formatMessage({id: "payWorkbench.receiptType"}), options: []}, //单据类型
        {type: 'select', id: 'applicant', label: formatMessage({id: "payWorkbench.applicant"}), options: []}, //申请人
        {type: 'items', id: 'dateRange', items: [
          {type: 'date', id: 'dateFrom', label: formatMessage({id: "payWorkbench.dateFrom"})}, //申请日期从
          {type: 'date', id: 'dateTo', label: formatMessage({id: "payWorkbench.dateTo"})} //申请日期至
        ]},
        {type: 'items', id: 'mountRange', items: [
          {type: 'input', id: 'mountFrom', label: formatMessage({id: "payWorkbench.mountFrom"})}, //总金额从
          {type: 'input', id: 'mountTo', label: formatMessage({id: "payWorkbench.mountTo"})} //总金额至
        ]},
        {type: 'items', id: 'payee', label: formatMessage({id: "payWorkbench.payee"}), items: [
          {type: 'value_list', id: 'partnerCategory', label: '类型', options: [], valueListCode: 2107},
          {type: 'select', id: 'partnerName', label: '收款方', options: []}  //收款方
        ]}
      ],
      columns: [
        {title: '单据编号 | 单据类型', dataIndex: 'documentNumber', render: (value, record) => {
          return (
            <Breadcrumb separator="|">
              <Breadcrumb.Item><a onClick={() => {this.checkPaymentDetail(record)}}>{value}</a></Breadcrumb.Item>
              <Breadcrumb.Item>{record.documentCategory}</Breadcrumb.Item>
            </Breadcrumb>
          )}
        },
        {title: '工号 | 申请人', dataIndex: 'employeeName'},
        {title: '申请日期', dataIndex: 'requisitionDate', render: value => moment(value).format('YYYY-MM-DD')},
        {title: '币种', dataIndex: 'currency'},
        {title: '总金额', dataIndex: 'amount', render: this.filterMoney},
        {title: '可支付金额', dataIndex: 'payableAmount', render: this.filterMoney},
        {title: '本次支付金额', dataIndex: 'currentPayAmount', render: (value, record) => {
          return (
            <EditableCell type="number"
                          value={value}
                          message={formatMessage({id: "payWorkbench.payedAmount.tooltip"}/*点击修改本次支付金额*/)}
                          onChangeError={this.state.editCellError}
                          onChange={(editValue) => this.editCurrentPay(editValue, record)} />
          )}
        },
        {title: '付款方式', dataIndex: 'paymentMethodCategory'},
        {title: '类型 | 收款方', dataIndex: 'partnerCategory', render: (value, record) => {
          return (
            <Breadcrumb separator="|">
              <Breadcrumb.Item>{value}</Breadcrumb.Item>
              <Breadcrumb.Item>{record.partnerName}</Breadcrumb.Item>
            </Breadcrumb>
          )}
        },
        {title: '收款账号', dataIndex: 'accountNumber', render: (account, record) => (
          <EditableCell value={account}
                        message={formatMessage({id: "payWorkbench.accountNumber.tooltip"}/*点击修改收款账号*/)}
                        onChangeError={this.state.editCellError}
                        onChange={(value) => this.editAccount(value, record)}/>
        )},
        {title: '状态', dataIndex: 'state', render: (state) => <Badge status='default' text={state}/>}
      ],

      /* 线上 */
      onlineLoading: false,
      onlinePage: 0,
      onlinePageSize: 10,
      onlinePagination: {
        total: 0,
      },
      onlineData: [],
      onlineSelectedRows: [],         //选中行
      onlineNotice: null,             //提示
      onlineError: null,              //错误
      payOnlineAble: false,           //支付按钮是否可用

      /* 线下 */
      offlineLoading: false,
      offlinePage: 0,
      offlinePageSize: 10,
      offlinePagination: {
        total: 0,
      },
      offlineData: [],
      offlineSelectedRowKeys: [],     //选中行
      offlineNotice: null,            //提示
      offlineError: null,             //错误
      payOfflineAble: false,          //支付按钮是否可用

      /* 落地文件 */
      fileLoading: false,
      filePage: 0,
      filePageSize: 10,
      filePagination: {
        total: 0,
      },
      fileData: [],
      failSelectedRowKeys: [],        //选中行
      fileNotice: null,               //提示
      fileError: null,                //错误
      payFileAble: false,             //支付按钮是否可用

      payModalVisible: false,
      confirmSuccessDate: null,
      partnerCategoryOptions: [],
      paymentDetail:  menuRoute.getRouteItem('payment-detail','key'),    //支付详情
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

  //搜索
  search = (result) => {
    console.log(result)
  };

  //清空搜索区域
  clear = () => {

  };

  //选择 线上／线下／落地文件
  onRadioChange = (e) => {
    this.setState({
      radioValue: e.target.value,
      onlineSelectedRows: []
    }, () => {
      this.onlineNotice(this.state.onlineSelectedRows)
    })
  };

  //查看支付流水详情
  checkPaymentDetail = (record) => {
    this.context.router.push(this.state.paymentDetail.url.replace(':id', record.id));
  };

  /************************ 获取列表 ************************/

  //线上 - 获取列表
  getOnlineList = (resolve, reject) => {
    const { onlinePage, onlinePageSize } = this.state;
    let url = `${config.contractUrl}/payment/api/cash/transactionData/query?page=${onlinePage}&size=${onlinePageSize}&paymentMethodCategory=ONLINE_PAYMENT`;
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
    let url = `${config.contractUrl}/payment/api/cash/transactionData/query?page=${offlinePage}&size=${offlinePageSize}&paymentMethodCategory=OFFLINE_PAYMENT`;
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
    let url = `${config.contractUrl}/payment/api/cash/transactionData/query?page=${filePage}&size=${filePageSize}&paymentMethodCategory=EBANK_PAYMENT`;
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

  /************************** 线上 **************************/

  //修改本次支付金额
  editCurrentPay = (value, record) => {
    if (value > record.payableAmount) {
      message.error('本次支付金额不能大于可支付金额');
      this.setState({ editCellError: true });
      return
    }
    if (value <= 0) {
      message.error('本次支付金额必须大于0');
      this.setState({ editCellError: true });
      return
    }
    this.setState({ editCellError: false });
    this.state.onlineData.map(item => {
      if (item.id === record.id) {
        item.currentPay = value;
        this.onlineNotice(this.state.onlineSelectedRows);
        message.success('修改成功')
      }
    })
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

  //选择/取消选择某行的回调
  onOnlineSelectRow = (record, selected) => {
    let onlineSelectedRows = this.state.onlineSelectedRows;
    if(selected) {
      onlineSelectedRows.push(record)
    } else {
      onlineSelectedRows.map((item, index) => {
        item.id === record.id && (onlineSelectedRows[index] = 0)
      });
      onlineSelectedRows.delete(0)
    }
    this.setState({ onlineSelectedRows }, () => {
      this.onlineNotice(this.state.onlineSelectedRows)
    })
  };

  //选择/取消选择所有行的回调
  onOnlineSelectAllRow = (selected, selectedRows, changeRows) => {
    let onlineSelectedRows = this.state.onlineSelectedRows;
    if(selected){
      changeRows.map(item => {
        onlineSelectedRows.push(item)
      })
    } else {
      onlineSelectedRows.map((row, index) => {
        changeRows.map(item => {
          row.id === item.id && (onlineSelectedRows[index] = 0)
        })
      });
      changeRows.map(() => {
        onlineSelectedRows.delete(0)
      })
    }
    this.setState({ onlineSelectedRows }, () => {
      this.onlineNotice(this.state.onlineSelectedRows)
    })
  };

  //提示框显示
  onlineNotice = (rows) => {
    let amount = 0;
    rows.forEach(item => { amount += item.currentPay || item.currentPayAmount });
    let onlineNotice = (
      <span>
        已选择<span style={{fontWeight:'bold',color:'#108EE9'}}> {rows.length} </span> 项
        <span className="ant-divider" />
        本次支付金额总计：CNY <span style={{fontWeight:'bold',fontSize:'15px'}}> {this.filterMoney(amount)} </span>
      </span>
    );
    this.setState({
      onlineNotice: rows.length ? onlineNotice : '',
      payOnlineAble: rows.length
    });
  };

  //弹框支付确认
  handleOk = (e) => {
    this.setState({ payModalVisible: false });
  };

  //修改每页显示数量
  onlinePaginationChange = (onlinePage, onlinePageSize) => {
    onlinePage = onlinePage - 1;
    this.setState({ onlinePage, onlinePageSize },() => {
      this.getOnlineList()
    })
  };

  /************************** 线下 **************************/


  /************************ 落地文件 ************************/

  //落地文件 - 修改每页显示数量
  filePaginationChange = () => {};

  /************************ 内容渲染 ************************/

  //线上
  renderOnlineContent = () => {
    const { onlineLoading, columns, onlineData, onlinePageSize, onlinePagination, onlineNotice, onlineError } = this.state;
    const rowSelection = {
      onSelect: this.onOnlineSelectRow,
      onSelectAll: this.onOnlineSelectAllRow
    };
    const tableTitle = (
      <Breadcrumb separator="|">
        <Breadcrumb.Item>{this.props.intl.formatMessage({id:"payWorkbench.Unpaid"})}</Breadcrumb.Item>
        <Breadcrumb.Item>金额：CNY <span className="num-style">250,000.00</span></Breadcrumb.Item>
        <Breadcrumb.Item>单据数：<span className="num-style">50,000笔</span></Breadcrumb.Item>
        <Breadcrumb.Item>金额：USD <span className="num-style">250,000.00</span></Breadcrumb.Item>
        <Breadcrumb.Item>单据数：<span className="num-style">100笔</span></Breadcrumb.Item>
      </Breadcrumb>
    );
    return (
      <div className="unpaid-online">
        <Button type="primary"
                style={{marginBottom:10}}
                disabled={!this.state.payOnlineAble}
                onClick={() => this.setState({ payModalVisible: true })}>
          {this.props.intl.formatMessage({id:"payWorkbench.payOnline"}/*线上支付*/)}
        </Button>
        {onlineNotice ? <Alert message={onlineNotice} type="info" showIcon style={{marginBottom:'10px'}}/> : ''}
        {onlineError ? <Alert message={onlineError} type="error" showIcon style={{marginBottom:'10px'}}/> : ''}
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
    const { offlineLoading, columns, offlineData, offlinePageSize, offlinePagination, offlineNotice, offlineError, payOfflineAble } = this.state;
    const rowSelection = {
      onSelect: this.onOnlineSelectRow,
      onSelectAll: this.onOnlineSelectAllRow
    };
    const tableTitle = (
      <Breadcrumb separator="|">
        <Breadcrumb.Item>{this.props.intl.formatMessage({id:"payWorkbench.Unpaid"})}</Breadcrumb.Item>
        <Breadcrumb.Item>金额：CNY <span className="num-style">250,000.00</span></Breadcrumb.Item>
        <Breadcrumb.Item>单据数：<span className="num-style">50,000笔</span></Breadcrumb.Item>
        <Breadcrumb.Item>金额：USD <span className="num-style">250,000.00</span></Breadcrumb.Item>
        <Breadcrumb.Item>单据数：<span className="num-style">100笔</span></Breadcrumb.Item>
      </Breadcrumb>
    );
    return (
      <div className="unpaid-offline">
        <Button type="primary"
                style={{marginBottom:10}}
                disabled={!payOfflineAble}
                onClick={() => this.setState({ payModalVisible: true })}>
          线下支付
        </Button>
        {offlineNotice ? <Alert message={offlineNotice} type="info" showIcon style={{marginBottom:'10px'}}/> : ''}
        {offlineError ? <Alert message={offlineError} type="error" showIcon style={{marginBottom:'10px'}}/> : ''}
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
                    onChange={this.onlinePaginationChange}
                    onShowSizeChange={this.onlinePaginationChange}
                    style={{margin:'16px 0', textAlign:'right'}} />
      </div>
    )
  };

  //落地文件
  renderFileContent = () => {
    const { fileLoading, columns, fileData, filePageSize, filePagination, fileNotice, fileError, payFileAble } = this.state;
    const rowSelection = {
      onSelect: this.onOnlineSelectRow,
      onSelectAll: this.onOnlineSelectAllRow
    };
    const tableTitle = (
      <Breadcrumb separator="|">
        <Breadcrumb.Item>{this.props.intl.formatMessage({id:"payWorkbench.Unpaid"})}</Breadcrumb.Item>
        <Breadcrumb.Item>金额：CNY <span className="num-style">250,000.00</span></Breadcrumb.Item>
        <Breadcrumb.Item>单据数：<span className="num-style">50,000笔</span></Breadcrumb.Item>
        <Breadcrumb.Item>金额：USD <span className="num-style">250,000.00</span></Breadcrumb.Item>
        <Breadcrumb.Item>单据数：<span className="num-style">100笔</span></Breadcrumb.Item>
      </Breadcrumb>
    );
    return (
      <div className="unpaid-file">
        <Button type="primary"
                style={{marginBottom:10}}
                disabled={!payFileAble}
                onClick={() => this.setState({ payModalVisible: true })}>
          落地文件支付
        </Button>
        {fileNotice ? <Alert message={fileNotice} type="info" showIcon style={{marginBottom:'10px'}}/> : ''}
        {fileError ? <Alert message={fileError} type="error" showIcon style={{marginBottom:'10px'}}/> : ''}
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
    const { searchForm, payModalVisible, radioValue } = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14, offset: 1 },
    };
    return (
      <div className="pay-online">
        <SearchArea
          searchForm={searchForm}
          submitHandle={this.search}
          clearHandle={this.clear}/>
        <Radio.Group value={radioValue} style={{margin:'20px 0'}}
                     onChange={this.onRadioChange}>
          <Radio.Button value="online">线上</Radio.Button>
          <Radio.Button value="offline">线下</Radio.Button>
          <Radio.Button value="file">落地文件</Radio.Button>
        </Radio.Group>
        {radioValue === 'online' && this.renderOnlineContent()}
        {radioValue === 'offline' && this.renderOfflineContent()}
        {radioValue === 'file' && this.renderFileContent()}
        <Modal
          title="线上支付确认"
          visible={payModalVisible}
          onOk={this.handleOk}
          onCancel={() => this.setState({ payModalVisible: false })}>
          <Form>
            <FormItem  {...formItemLayout} label="付款账户">
              {getFieldDecorator('payAccount', {
                rules: [{
                  required: true,
                  message: '请选择'
                }]})(
                <Select placeholder="请选择"></Select>
              )}
            </FormItem>
            <FormItem  {...formItemLayout} label="币种">
              {getFieldDecorator('currency', {
                rules: [{
                  required: true
                }],
                initialValue: ''
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
                <Select placeholder="请选择"></Select>
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
