import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import menuRoute from 'share/menuRoute'
import { Radio, Badge, Table, Pagination, message, Alert, Icon, Dropdown, Menu, Modal, Form, DatePicker } from 'antd'
const FormItem = Form.Item;
import { paymentService } from 'service'

import moment from 'moment';
import SearchArea from 'components/search-area'

class PayPaying extends React.Component {
  constructor(props) {
    super(props);
    const {formatMessage} = this.props.intl;
    this.state = {
      radioValue: 'online',
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
        {type: 'items', id: 'dateRange', items: [
          {type: 'date', id: 'payDateFrom', label: '支付日期从'},
          {type: 'date', id: 'payDateTo', label: '支付日期至'}
        ]},
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
        {title: '状态', dataIndex: 'paymentStatusName', render: (state) => <Badge status='processing' text={state}/>},
        {title: '操作', dataIndex: 'id', render: (id, record) => {
          const menu = (
            <Menu>
              <Menu.Item>
                <a onClick={() => this.handleSuccess(record)}>确认成功</a>
              </Menu.Item>
              <Menu.Item>
                <a onClick={() => this.handleFail(record)}>确认失败</a>
              </Menu.Item>
            </Menu>
          );
          return (
            <div>
              <a onClick={() => {this.checkPaymentDetail(record)}}>查看</a>
              <span className="ant-divider"/>
              <Dropdown overlay={menu} placement="bottomRight"><a>更多<Icon type="down" /></a></Dropdown>
            </div>
          )}
        }
      ],
      okModalVisible: false, //确认成功modal
      failModalVisible: false, //确认失败modal
      record: {}, //点击行信息
      confirmSuccessLoading: false,
      confirmFailLoading: false,
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
      onlineWarningRows: [],  //超过12小时未更新状态行

      /* 落地文件 */
      fileLoading: false,
      fileData: [],
      filePage: 0,
      filePageSize: 10,
      filePagination: {
        total: 0
      },
      fileCash: [],  //总金额
      fileWarningRows: [],  //超过12小时未更新状态行
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

  search = (values) => {
    values.payDateFrom && (values.payDateFrom = moment(values.payDateFrom).format('YYYY-MM-DD'));
    values.payDateTo && (values.payDateTo = moment(values.payDateTo).format('YYYY-MM-DD'));
    this.setState({
      searchParams: values,
      onlineCash: [],
      fileCash: []
    }, () => {
      this.getList()
    })
  };

  clear = () => {

  };

  //查看支付流水详情
  checkPaymentDetail = (record) => {
    this.context.router.push(this.state.paymentDetail.url.replace(':tab', 'Paying').replace(':subTab', this.state.radioValue).replace(':id', record.id));
  };

  //确认成功弹框
  handleSuccess = (record) => {
    this.props.form.setFieldsValue({ date: undefined });
    this.setState({ record, okModalVisible: true })
  };

  //确认成功操作
  confirmSuccess = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let date = moment(values.date).format('YYYY-MM-DD');
        let params = {
          detailIds: [this.state.record.id],
          versionNumbers: [this.state.record.versionNumber]
        };
        this.setState({ confirmSuccessLoading: true });
        paymentService.confirmSuccess(params, date).then(res => {
          if (res.status === 200) {
            message.success('操作成功');
            this.setState({ confirmSuccessLoading: false, okModalVisible: false });
            this.getList()
          }
        }).catch(() => {
          this.setState({ confirmSuccessLoading: false });
          message.error('操作失败，请重试')
        })
      }
    })
  };

  //确认失败弹框
  handleFail = (record) => {
    this.setState({ record, failModalVisible: true })
  };

  //确认失败操作
  confirmFail = () => {
    let params = {
      detailIds: [this.state.record.id],
      versionNumbers: [this.state.record.versionNumber]
    };
    this.setState({ confirmFailLoading: true });
    paymentService.confirmFail(params).then(res => {
      if (res.status === 200) {
        message.success('操作成功');
        this.setState({ failModalVisible: false, confirmFailLoading: false });
        this.getList()
      }
    }).catch(() => {
      this.setState({ confirmFailLoading: false });
      message.success('操作失败，请重试')
    })
  };

  /*********************** 获取总金额 ***********************/

  //线上
  getOnlineCash = () => {
    paymentService.getAmount('ONLINE_PAYMENT', 'P', this.state.searchParams).then(res => {
      this.setState({ onlineCash: res.data })
    })
  };

  //落地文件
  getFileCash = () => {
    paymentService.getAmount('EBANK_PAYMENT', 'P', this.state.searchParams).then(res => {
      this.setState({ fileCash: res.data })
    })
  };

  /************************ 获取列表 ************************/

  //线上
  getOnlineList = (resolve, reject) => {
    const { onlinePage, onlinePageSize, searchParams } = this.state;
    this.setState({ onlineLoading: true });
    paymentService.getPayingList(onlinePage, onlinePageSize, 'ONLINE_PAYMENT', searchParams).then(res => {
      if (res.status === 200) {
        let onlineWarningRows = [];
        res.data.map(item => {
          if ((new Date().getTime() - new Date(item.payDate).getTime())/1000/60/60 > 12) {  //付款时间超过12小时
            onlineWarningRows.push(item)
          }
        });
        this.setState({
          onlineData: res.data,
          onlineLoading: false,
          onlineWarningRows,
          onlinePagination: {
            total: Number(res.headers['x-total-count']) ? Number(res.headers['x-total-count']) : 0
          }
        });
        reject && resolve()
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
    paymentService.getPayingList(filePage, filePageSize, 'ONLINE_PAYMENT', searchParams).then(res => {
      if (res.status === 200) {
        let fileWarningRows = [];
        res.data.map(item => {
          if ((new Date().getTime() - new Date(item.payDate).getTime())/1000/60/60 > 12) {  //付款时间超过12小时
            fileWarningRows.push(item)
          }
        });
        this.setState({
          fileData: res.data,
          fileLoading: false,
          fileWarningRows,
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

  /************************ 内容渲染 ************************/

  //线上
  renderOnlineContent = () => {
    const { columns, onlineData, onlineLoading, onlinePageSize, onlinePagination, onlineCash, onlineWarningRows, pageSizeOptions } = this.state;
    const tableTitle = (
      <div>
        支付中
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
      <div className="paying-online">
        <Table rowKey={record => record.id}
               columns={columns}
               dataSource={onlineData}
               pagination={false}
               loading={onlineLoading}
               title={()=>{return tableTitle}}
               scroll={{x: true, y: false}}
               rowClassName={record => {
                 let warningFlag = false;
                 onlineWarningRows.map(item => {
                   item.id === record.id && (warningFlag = true)
                 });
                 return warningFlag ? 'row-warning' : ''
               }}
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
    const { columns, fileData, fileLoading, filePageSize, filePagination, fileCash, fileWarningRows, pageSizeOptions } = this.state;
    const tableTitle = (
      <div>
        支付中
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
      <div className="paying-file">
        <Table rowKey={record => record.id}
               columns={columns}
               dataSource={fileData}
               pagination={false}
               loading={fileLoading}
               title={()=>{return tableTitle}}
               scroll={{x: true, y: false}}
               rowClassName={record => {
                 let warningFlag = false;
                 fileWarningRows.map(item => {
                   item.id === record.id && (warningFlag = true)
                 });
                 return warningFlag ? 'row-warning' : ''
               }}
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
      labelCol: { span: 8 },
      wrapperCol: { span: 15, offset: 1 },
    };
    const { radioValue, searchForm, okModalVisible, failModalVisible, onlineWarningRows, fileWarningRows, confirmSuccessLoading, confirmFailLoading } = this.state;
    let warningItems = radioValue === 'online' ? onlineWarningRows : fileWarningRows;
    let warningRows = warningItems.map(item => {
      return (
        <div key={item.id}>
          付款流水号：{item.billcode}
          <span className="ant-divider" />
          单据类型：{item.documentCategoryName}
        </div>
      )
    });
    return (
      <div className="pay-paying">
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
        <Alert message="支付结果与银行业务处理速度有关，请耐心等待" type="info" showIcon style={{marginBottom:20}} />
        {warningRows.length > 0 && <Alert message="请注意，以下付款已超过12小时未更新状态"
                                          description={warningRows}
                                          type="warning"
                                          style={{margin:'-10px 0 20px'}}
                                          showIcon />}
        {radioValue === 'online' && this.renderOnlineContent()}
        {radioValue === 'file' && this.renderFileContent()}
        <Modal visible={okModalVisible}
               confirmLoading={confirmSuccessLoading}
               onOk={this.confirmSuccess}
               onCancel={() => this.setState({ okModalVisible: false })}
               okText="确认成功"
               width={400}>
          <div style={{height:110}}>
            <span style={{marginRight:10,fontSize:14}}>
              <Icon type="exclamation-circle" style={{color:'#faad14', fontSize:22, marginRight:8, position:'relative', top:2}}/>
              将付款状态更改为
            </span>
            <Badge status="success" text="支付成功"/>
            <div style={{fontSize:12,color:'red',marginLeft:29}}>请通过网银或询问银行的方式确认该笔付款已成功转账</div>
            <Form style={{marginLeft:29}}>
              <FormItem {...formItemLayout}
                        label="实际付款日期"
                        style={{margin:'20px 0 10px'}}>
                {getFieldDecorator('date', {
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
        <Modal visible={failModalVisible}
               confirmLoading={confirmFailLoading}
               onOk={this.confirmFail}
               onCancel={() => this.setState({ failModalVisible: false })}
               okText="确认失败"
               width={400}>
          <div style={{height:80, paddingTop:20}}>
            <span style={{marginRight:10,fontSize:14}}>
              <Icon type="exclamation-circle" style={{color:'#faad14', fontSize:22, marginRight:8, position:'relative', top:2}}/>
              将付款状态更改为
            </span>
            <Badge status="error" text="支付失败"/>
            <div style={{fontSize:12,color:'red',marginLeft:29}}>请务必向银行确认该付款支付失败，以免产生重复支付</div>
          </div>
        </Modal>
      </div>
    )
  }

}

PayPaying.contextTypes = {
  router: React.PropTypes.object
};

PayPaying.propTypes = {
  subTab: React.PropTypes.string,
};

function mapStateToProps() {
  return {}
}

const wrappedPayPaying = Form.create()(injectIntl(PayPaying));

export default connect(mapStateToProps)(wrappedPayPaying);
