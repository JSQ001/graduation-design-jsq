import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import config from 'config'
import httpFetch from 'share/httpFetch'
import moment from 'moment'

import { Radio, Table, Breadcrumb, Icon, Tooltip, Badge, Modal, Form, Select, Input, InputNumber, Pagination, Button, Alert } from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
import SearchArea from 'components/search-area'
import menuRoute from 'share/menuRoute'

class EditableCell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value,
      editType: this.props.editType,
      message: this.props.message,
      maxPayedAmount: this.props.maxPayedAmount,
      editable: false,
    }
  }

  handleNumberChange = (value) => {
    this.setState({ value })
  };

  handleStringChange = (e) => {
    this.setState({ value: e.target.value })
  };

  check = () => {
    this.setState({ editable: false });
    if (this.props.onChange) {
      this.props.onChange(this.state.value);
    }
  };

  edit = () => {
    this.setState({ editable: true });
  };

  render() {
    const { value, editType, message, maxPayedAmount, editable } = this.state;
    return (
      <div className="editable-cell">
        {
          editable ?
            <div className="editable-cell-input-wrapper">
              {
                editType === 'number' ?
                  <InputNumber value={value} max={maxPayedAmount} min={0} onChange={this.handleNumberChange} onPressEnter={this.check}/>
                  :
                  <Input value={value} onChange={this.handleStringChange} onPressEnter={this.check}/>
              }
              <Icon type="check" className="editable-cell-icon-check" onClick={this.check}/>
            </div>
            :
            <div className="editable-cell-text-wrapper">
              {editType === 'number' ? (value || 0).toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') : (value || '')}
              <Tooltip placement="top" title={message}>
                <Icon type="edit" className="editable-cell-icon" onClick={this.edit} />
              </Tooltip>
            </div>
        }
      </div>
    );
  }
}

class PayUnpaid extends React.Component {
  constructor(props) {
    super(props);
    const {formatMessage} = this.props.intl;
    this.state = {
      onlineLoading: false,
      radioValue: 'online',
      searchForm: [
        {type: 'input', id: 'receiptNumber', label: formatMessage({id: "payWorkbench.receiptNumber"})}, //单据编号
        {type: 'select', id: 'receiptType', label: formatMessage({id: "payWorkbench.receiptType"}), options: []}, //单据类型
        {type: 'select', id: 'applicant', label: formatMessage({id: "payWorkbench.applicant"}), options: []}, //申请人
        {type: 'items', id: 'dateRange', items: [
          {type: 'date', id: 'dateFrom', label: formatMessage({id: "payWorkbench.dateFrom"})}, //申请日期从
          {type: 'date', id: 'dateTo', label: formatMessage({id: "payWorkbench.dateTo"})} //申请日期至
        ]},
        {type: 'items', id: 'mountRange', items: [
          {type: 'input', id: 'mountFrom', label: formatMessage({id: "payWorkbench.mountFrom"})}, //金额区间从
          {type: 'input', id: 'mountTo', label: formatMessage({id: "payWorkbench.mountTo"})} //金额区间至
        ]},
        {type: 'items', id: 'payee', label: formatMessage({id: "payWorkbench.payee"}), items: [
          {type: 'select', id: 'partnerCategory', label: formatMessage({id: "payWorkbench.payee"}), options: []}, //收款方类型
          {type: 'select', id: 'partnerName', label: ' ', options: []}  //收款方
        ]}
      ],
      onlineColumns: [
        {title: '单据编号 | 单据类型', dataIndex: 'documentNumber', render: (value, record) => {
          return (
            <Breadcrumb separator="|">
              <Breadcrumb.Item>{value}</Breadcrumb.Item>
              <Breadcrumb.Item>{record.documentCategory}</Breadcrumb.Item>
            </Breadcrumb>
          )}
        },
        {title: '工号 | 申请人', dataIndex: 'employeeName'},
        {title: '申请日期', dataIndex: 'requisitionDate', render: value => moment(value).format('YYYY-MM-DD')},
        {title: '币种', dataIndex: 'currency'},
        {title: '总金额', dataIndex: 'amount', render: this.filterMoney},
        {title: '可支付金额', dataIndex: 'payableAmount', render: this.filterMoney},
        {title: '本次支付金额', dataIndex: 'payedAmount', render: (amount, record) => {
          return (
            <div style={{textAlign: 'right'}}>
              <EditableCell value={record.payableAmount} editType="number"
                            message={formatMessage({id: "payWorkbench.payedAmount.tooltip"}/*点击修改本次支付金额*/)}
                            maxPayedAmount={record.payableAmount} />
            </div>)}
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
        {title: '收款账号', dataIndex: 'accountNumber', render: (number) => (
          <EditableCell value={number} editType="string"
                        message={formatMessage({id: "payWorkbench.accountNumber.tooltip"})} />
        )},
        {title: '状态', dataIndex: 'state', render: (state) => <Badge status='default' text={state}/>}
      ],
      onlinePage: 0,
      onlinePageSize: 10,
      onlinePagination: {
        total: 0,
      },
      onlineData: [],    //线上列表值
      onlineSelectedRowIDs: [],       //线上 - 选中行的id
      onlineSelectedRows: [],         //线上 - 选中行
      onlineNotice: null,             //线上 - 提示
      onlineError: null,              //线上 - 错误
      payOnlineAble: false,           //线上 - 线上支付按钮是否可用
      failSelectedRowKeys: [],
      payModalVisible: false,
      confirmSuccessDate: null,
      paymentDetail:  menuRoute.getRouteItem('payment-detail','key'),    //支付详情
    };
  }

  componentWillMount() {
    this.getOnlineList()
  }

  //获取线上列表
  getOnlineList = () => {
    const { onlinePage, onlinePageSize } = this.state;
    let url = `${config.contractUrl}/payment/api/cash/transactionData/query?page=${onlinePage}&size=${onlinePageSize}`;
    this.setState({ onlineLoading: true });
    httpFetch.get(url).then(res => {
      if (res.status === 200) {
        this.setState({
          onlineData: res.data,
          onlineLoading: false,
          onlinePagination: {
            total: Number(res.headers['x-total-count']) ? Number(res.headers['x-total-count']) : 0
          }
        })
      }
    })
  };

  //搜索
  search = (result) => {
    console.log(result)
  };

  //清空搜索区域
  clear = () => {

  };

  //线上 - 列表选择更改
  onOnlineSelectChange = (keys, rows) => {
    let amount = 0;
    rows.forEach(item => {
      amount += item.payableAmount;
    });
    let onlineNotice = (
      <span>
        已选择<span style={{fontWeight:'bold',color:'#108EE9'}}> {keys.length} </span> 项
        <span className="ant-divider" />
        本次支付金额总计：CNY <span style={{fontWeight:'bold',fontSize:'15px'}}> {this.filterMoney(amount)} </span>
      </span>
    );
    this.setState({
      onlineSelectedRowIDs: keys,
      onlineSelectedRows: rows,
      onlineNotice: keys.length ? onlineNotice : '',
      payOnlineAble: keys.length
    });
  };

  //线上支付确认
  handleOk = (e) => {
    console.log(e);
    this.setState({ payModalVisible: false });
  };

  //线上支付取消
  handleCancel = (e) => {
    console.log(e);
    this.setState({ payModalVisible: false });
  };

  //线上 - 修改每页显示数量
  onlinePaginationChange = (onlinePage, onlinePageSize) => {
    onlinePage = onlinePage - 1;
    this.setState({ onlinePage, onlinePageSize },() => {
      this.getOnlineList()
    })
  };

  renderContent = () => {
    const { onlineLoading, onlineColumns, onlineData, onlineSelectedRowIDs, onlinePageSize, onlinePagination, onlineNotice, onlineError } = this.state;
    const rowSelection = {
      onlineSelectedRowIDs,
      onChange: this.onOnlineSelectChange
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
                onClick={this.showPayModal}>
          {this.props.intl.formatMessage({id:"payWorkbench.payOnline"}/*线上支付*/)}
        </Button>
        {onlineNotice ? <Alert message={onlineNotice} type="info" showIcon style={{marginBottom:'10px'}}/> : ''}
        {onlineError ? <Alert message={onlineError} type="error" showIcon style={{marginBottom:'10px'}}/> : ''}
        <Table rowKey={record => record.id}
               columns={onlineColumns}
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
                    total={onlinePagination.total} //数据总数
                    onChange={this.onlinePaginationChange}
                    onShowSizeChange={this.onlinePaginationChange}
                    style={{margin:'16px 0', textAlign:'right'}} />
      </div>
    )
  };

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
        <Radio.Group onChange={this.handleModeChange} value={radioValue} style={{margin:'20px 0'}}>
          <Radio.Button value="online">线上</Radio.Button>
          <Radio.Button value="offline">线下</Radio.Button>
          <Radio.Button value="file">落地文件</Radio.Button>
        </Radio.Group>
        {this.renderContent()}
        <Modal
          title="线上支付确认"
          visible={payModalVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}>
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
                <TextArea rows={4} placeholder="请输入"/>
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
