import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

import { Button, Tabs, Table, Breadcrumb, Icon, Alert, Tooltip, Badge, Modal, Form, Select, Input } from 'antd'
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
import SearchArea from 'components/search-area'

class PayOnline extends React.Component {
  constructor(props) {
    super(props);
    const {formatMessage} = this.props.intl;
    this.state = {
      loading: false,
      nowStatus: 'Unpaid',
      searchForm: [
        {type: 'input', id: 'receiptNumber', label: formatMessage({id: "payWorkbench.receiptNumber"})},
        {type: 'select', id: 'receiptType', label: formatMessage({id: "payWorkbench.receiptType"}), options: []},
        {type: 'select', id: 'applicant', label: formatMessage({id: "payWorkbench.applicant"}), options: []},
        {
          type: 'items', id: 'dateRange', items: [
          {type: 'date', id: 'dateFrom', label: formatMessage({id: "payWorkbench.dateFrom"})},
          {type: 'date', id: 'dateTo', label: formatMessage({id: "payWorkbench.dateTo"})}
        ]
        },
        {
          type: 'items', id: 'mountRange', items: [
          {type: 'input', id: 'mountFrom', label: formatMessage({id: "payWorkbench.mountFrom"})},
          {type: 'input', id: 'mountTo', label: formatMessage({id: "payWorkbench.mountTo"})}
        ]
        },
        {type: 'select', id: 'payee', label: formatMessage({id: "payWorkbench.payee"}), options: []}
      ],
      tabs: [
        {key: 'Unpaid', name: formatMessage({id: "payWorkbench.Unpaid"})},
        {key: 'Wait', name: formatMessage({id: "payWorkbench.Wait"})},
        {key: 'Fail', name: formatMessage({id: "payWorkbench.Fail"})},
        {key: 'Success', name: formatMessage({id: "payWorkbench.Success"})}
      ],
      unpaidColumns: [
        {title: '单据编号 | 单据类型', dataIndex: 'billsNumber', key: 'billsNumber'},
        {title: '工号 | 申请人', dataIndex: 'applicant', key: 'applicant'},
        {title: '申请日期', dataIndex: 'date', key: 'date'},
        {title: '币种', dataIndex: 'currency', key: 'currency'},
        {title: '总金额', dataIndex: 'totalAmount', key: 'totalAmount', render: this.filterMoney},
        {title: '已核销金额', dataIndex: 'cancelAmount', key: 'cancelAmount', render: this.filterMoney},
        {title: '可支付金额', dataIndex: 'payAmount', key: 'payAmount', render: this.filterMoney},
        {title: '本次支付金额', dataIndex: 'payedAmount', key: 'payedAmount', render: (amount) => (
          <div style={{textAlign: 'right'}}>
            <span>{(amount || 0).toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</span>
            <Tooltip placement="top" title={formatMessage({id: "payWorkbench.payedAmount.tooltip"})}>
              <Icon type="edit" style={{cursor: 'pointer', padding: '0 5px 0 10px'}}/>
            </Tooltip>
          </div>
        )},
        {title: '付款方式', dataIndex: 'payWay', key: 'payWay'},
        {title: '类型 | 收款方', dataIndex: 'payee', key: 'payee'},
        {title: '收款账号', dataIndex: 'accountNumber', key: 'accountNumber', render: (number) => (
          <div>
            <span>{number}</span>
            <Tooltip placement="top" title={formatMessage({id: "payWorkbench.accountNumber.tooltip"})}>
              <Icon type="edit" style={{cursor: 'pointer', padding: '0 5px 0 10px'}}/>
            </Tooltip>
          </div>
        )},
        {title: '状态', dataIndex: 'state', key: 'state', render: (state) => <Badge status='default' text={state}/>},
        {title: '操作', key: 'opera', fixed: 'right', render: () => (
          <span><a>查看</a><span className="ant-divider"/><a>更多 <Icon type="down"/></a></span>
        )}],
      waitColumns: [
        {title: '付款流水号', dataIndex: 'serialNumber', key: 'serialNumber'},
        {title: '单据编号 | 单据类型', dataIndex: 'billsNumber', key: 'billsNumber'},
        {title: '工号 | 申请人', dataIndex: 'applicant', key: 'applicant'},
        {title: '币种', dataIndex: 'currency', key: 'currency'},
        {title: '本次支付金额', dataIndex: 'payedAmount', key: 'payedAmount', render: (amount) => (
          <div style={{textAlign: 'right'}}>
            <span>{(amount || 0).toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</span>
            <Tooltip placement="top" title={formatMessage({id: "payWorkbench.payedAmount.tooltip"})}>
              <Icon type="edit" style={{cursor: 'pointer', padding: '0 5px 0 10px'}}/>
            </Tooltip>
          </div>
        )},
        {title: '付款方式', dataIndex: 'payWay', key: 'payWay'},
        {title: '类型 | 收款方', dataIndex: 'payee', key: 'payee'},
        {title: '收款账号', dataIndex: 'accountNumber', key: 'accountNumber', render: (number) => (
          <div>
            <span>{number}</span>
            <Tooltip placement="top" title={formatMessage({id: "payWorkbench.accountNumber.tooltip"})}>
              <Icon type="edit" style={{cursor: 'pointer', padding: '0 5px 0 10px'}}/>
            </Tooltip>
          </div>
        )},
        {title: '支付日期', dataIndex: 'payDate', key: 'payDate'},
        {title: '状态', dataIndex: 'state', key: 'state', render: (state) => <Badge status='processing' text={state}/>},
        {title: '操作', key: 'opera', fixed: 'right', render: () => (
          <span><a>查看</a><span className="ant-divider"/><a>更多 <Icon type="down"/></a></span>
        )}],
      failColumns: [
        {title: '付款流水号', dataIndex: 'serialNumber', key: 'serialNumber'},
        {title: '单据编号 | 单据类型', dataIndex: 'billsNumber', key: 'billsNumber'},
        {title: '工号 | 申请人', dataIndex: 'applicant', key: 'applicant'},
        {title: '币种', dataIndex: 'currency', key: 'currency'},
        {title: '本次支付金额', dataIndex: 'payedAmount', key: 'payedAmount', render: this.filterMoney},
        {title: '付款方式', dataIndex: 'payWay', key: 'payWay'},
        {title: '类型 | 收款方', dataIndex: 'payee', key: 'payee'},
        {title: '收款账号', dataIndex: 'accountNumber', key: 'accountNumber', render: (number) => (
          <div>
            <span>{number}</span>
            <Tooltip placement="top" title={formatMessage({id: "payWorkbench.accountNumber.tooltip"})}>
              <Icon type="edit" style={{cursor: 'pointer', padding: '0 5px 0 10px'}}/>
            </Tooltip>
          </div>
        )},
        {title: '状态', dataIndex: 'state', key: 'state', render: (state) => <Badge status='error' text={state}/>},
        {title: '付款批次号', dataIndex: 'batchNumber', key: 'batchNumber'},
        {title: '操作', key: 'opera', fixed: 'right', render: () => (
          <span><a>查看</a><span className="ant-divider"/><a>更多 <Icon type="down"/></a></span>
        )}],
      successColumns: [
        {title: '付款流水号', dataIndex: 'serialNumber', key: 'serialNumber'},
        {title: '单据编号 | 单据类型', dataIndex: 'billsNumber', key: 'billsNumber'},
        {title: '工号 | 申请人', dataIndex: 'applicant', key: 'applicant'},
        {title: '币种', dataIndex: 'currency', key: 'currency'},
        {title: '本次支付金额', dataIndex: 'payedAmount', key: 'payedAmount', render: this.filterMoney},
        {title: '付款方式', dataIndex: 'payWay', key: 'payWay'},
        {title: '类型 | 收款方', dataIndex: 'payee', key: 'payee'},
        {title: '收款账号', dataIndex: 'accountNumber', key: 'accountNumber'},
        {title: '状态', dataIndex: 'state', key: 'state', render: (state) => <Badge status='success' text={state}/>},
        {title: '付款批次号', dataIndex: 'batchNumber', key: 'batchNumber'},
        {title: '操作', key: 'opera', fixed: 'right', render: () => (
          <span><a>查看</a><span className="ant-divider"/><a>更多 <Icon type="down"/></a></span>
        )}],
      pagination: {
        total: 0
      },
      page: 0,
      pageSize: 10,
      data: [],    //列表值
      data1: [],    //列表值
      unpaidSelectedRowKeys: [],
      unpaidSelectedEntityOIDs: [],    //未付款 - 已选择的列表项的OIDs
      unpaidSelectedEntity: [],        //未付款 - 已选择的列表项
      unpaidNoticeWarning: '',         //未付款 - 提示信息
      unpaidNoticeError: '',           //未付款 - 错误信息
      payOnlineAble: false,            //未付款 - 线上支付按钮是否可用
      failSelectedRowKeys: [],
      failSelectedEntityOIDs: [],      //退款或失败 - 已选择的列表项的OIDs
      failSelectedEntity: [],          //退款或失败 - 已选择的列表项
      failNoticeWarning: '',           //退款或失败 - 提示信息
      failNoticeError: '',             //退款或失败 - 错误信息
      rePayAble: false,                //退款或失败 - 重新支付按钮是否可用
      cancelPayAble: false,            //退款或失败 - 取消支付按钮是否可用
      payModalVisible: false,
    };
  }


  componentWillMount() {
    let data = [];
    let data1 = [];
    for(let i = 1; i <= 10; i++) {
      data.push({
        'id': i,
        'serialNumber': '123312312312',
        'billsNumber': 'LA12321231213 | 借款申请单借款申请单借款申请单借款申请单借款申请单',
        'applicant': '12303 | Louis',
        'date': '2017-12-12',
        'payDate': '2017-12-12',
        'currency': i%3==0 ? 'CNY' : 'USD',
        'totalAmount': 12122122,
        'cancelAmount': 2000,
        'payAmount': 122122,
        'payedAmount': 122122,
        'payWay': '线上',
        'payee': '对私 | jack',
        'accountNumber': '123666',
        'batchNumber': 'FK12341234123',
        'state': '未付款'
      })
    }
    for(let i = 11; i <= 25; i++) {
      data1.push({
        'id': i,
        'serialNumber': '123312312312',
        'billsNumber': 'LA12321231213 | 借款申请单',
        'applicant': '12303 | Louis',
        'date': '2017-12-12',
        'currency': i%2==0 ? 'CNY' : 'USD',
        'totalAmount': 12122122,
        'cancelAmount': 2000,
        'payAmount': 122122,
        'payedAmount': 122122,
        'payWay': '线上',
        'payee': '对私 | jack',
        'accountNumber': '123666',
        'batchNumber': 'FK12341234123',
        'state': '支付失败'
      })
    }
    this.setState({ data, data1 })
  }

  //搜索
  search = (result) => {

  };

  //清空搜索区域
  clear = () => {

  };

  //列表选择提示信息
  noticeMessage = (type, entities) => {
    let isCurrencySame = true;
    let amount = 0;
    entities.forEach((entity, index)=>{
      amount += entity.totalAmount;
      index < entities.length-1 && (entity.currency != entities[index+1].currency) && (isCurrencySame = false);
    });
    if (isCurrencySame) {
      type == 'unpaid' && this.setState({
        payOnlineAble: entities.length>0 ? true : false,
        unpaidNoticeWarning: entities.length>0 ? (
          <span>
            已选择<span style={{fontWeight:'bold',color:'#108EE9'}}> {entities.length} </span> 项
            <span className="ant-divider" />
            本次支付金额总计：CNY <span style={{fontWeight:'bold',fontSize:'15px'}}> {this.filterMoney(amount)} </span>
          </span>
        ) : '',
        unpaidNoticeError: ''
      })
      type == 'fail' && this.setState({
        rePayAble: entities.length>0 ? true : false,
        cancelPayAble: entities.length>0 ? true : false,
        failNoticeWarning: entities.length>0 ? (
          <span>
            已选择<span style={{fontWeight:'bold',color:'#108EE9'}}> {entities.length} </span> 项
            <span className="ant-divider" />
            本次支付金额总计：CNY <span style={{fontWeight:'bold',fontSize:'15px'}}> {this.filterMoney(amount)} </span>
          </span>
        ) : '',
        failNoticeError: ''
      })
    } else {
      type == 'unpaid' && this.setState({
        payOnlineAble: false,
        unpaidNoticeWarning: '',
        unpaidNoticeError: (
          <span>
            已选择<span style={{fontWeight:'bold',color:'#108EE9'}}> {entities.length} </span> 项
            <span className="ant-divider" />不同币种不可同时支付</span>)
      })
      type == 'fail' && this.setState({
        rePayAble: false,
        cancelPayAble: entities.length>0 ? true : false,
        failNoticeWarning: '',
        failNoticeError: (
          <span>
            已选择<span style={{fontWeight:'bold',color:'#108EE9'}}> {entities.length} </span> 项
            <span className="ant-divider" />不同币种不可同时支付</span>)
      })
    }

  };

  //未支付 - 列表选择更改
  onUnpaidSelectChange = (unpaidSelectedRowKeys) => {
    this.setState({ unpaidSelectedRowKeys });
  };

  //未支付 - 选择一行
  onUnpaidSelectRow = (record, selected) => {
    let temp = this.state.unpaidSelectedEntityOIDs;
    let entities = this.state.unpaidSelectedEntity;
    if(selected) {
      temp.push(record.id);
      entities.push(record);
    } else {
      temp.delete(record.id);
      entities.delete(record);
    }
    this.setState({
      unpaidSelectedEntityOIDs: temp,
      unpaidSelectedEntity: entities,
    });
    this.noticeMessage('unpaid', entities)
  };

  //未支付 - 全选
  onUnpaidSelectAllRow = (selected) => {
    let temp = this.state.unpaidSelectedEntityOIDs;
    let entities = this.state.unpaidSelectedEntity;
    if(selected){
      this.state.data.map(item => {
        temp.addIfNotExist(item.id);
        entities.addIfNotExist(item);
      })
    } else {
      this.state.data.map(item => {
        temp.delete(item.id);
        entities.delete(item);
      })
    }
    this.setState({
      unpaidSelectedEntityOIDs: temp,
      unpaidSelectedEntity: entities,
    });
    this.noticeMessage('unpaid', entities)
  };

  //退款或失败 - 列表选择更改
  onFailSelectChange = (failSelectedRowKeys) => {
    this.setState({ failSelectedRowKeys });
  };

  //退款或失败 - 选择一行
  onFailSelectRow = (record, selected) => {
    let temp = this.state.failSelectedEntityOIDs;
    let entities = this.state.failSelectedEntity;
    if(selected) {
      temp.push(record.id);
      entities.push(record);
    } else {
      temp.delete(record.id);
      entities.delete(record);
    }
    this.setState({
      failSelectedEntityOIDs: temp,
      failSelectedEntity: entities,
    });
    this.noticeMessage('fail', entities)
  };

  //退款或失败 - 全选
  onFailSelectAllRow = (selected) => {
    let temp = this.state.failSelectedEntityOIDs;
    let entities = this.state.failSelectedEntity;
    if(selected){
      this.state.data1.map(item => {
        temp.addIfNotExist(item.id);
        entities.addIfNotExist(item);
      })
    } else {
      this.state.data1.map(item => {
        temp.delete(item.id);
        entities.delete(item);
      })
    }
    this.setState({
      failSelectedEntityOIDs: temp,
      failSelectedEntity: entities,
    });
    this.noticeMessage('fail', entities)
  };

  //线上支付确认框
  showPayModal = () => {
    this.setState({ payModalVisible: true });
  };
  handleOk = (e) => {
    console.log(e);
    this.setState({ payModalVisible: false });
  };
  handleCancel = (e) => {
    console.log(e);
    this.setState({ payModalVisible: false });
  };

  //渲染Tabs
  renderTabs(){
    return (
      this.state.tabs.map(tab => {
        return <TabPane tab={tab.name} key={tab.key}/>
      })
    )
  }

  onChangeTabs = (nowStatus) =>{
    this.setState({ nowStatus })
  };

  renderContent = () => {
    const { loading, unpaidColumns, waitColumns, failColumns, successColumns, data, data1, pagination, unpaidSelectedRowKeys, failSelectedRowKeys, nowStatus } = this.state;
    switch (nowStatus){
      case 'Unpaid':
        const rowSelection = {
          unpaidSelectedRowKeys,
          onChange: this.onUnpaidSelectChange,
          onSelect: this.onUnpaidSelectRow,
          onSelectAll: this.onUnpaidSelectAllRow
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
          <div className="pay-online-unpaid">
            <Table rowKey="id"
                   columns={unpaidColumns}
                   dataSource={data}
                   pagination={pagination}
                   loading={loading}
                   rowSelection={rowSelection}
                   title={()=>{return tableTitle}}
                   scroll={{x: true, y: false}}
                   bordered
                   size="middle"/>
          </div>
        );
      case 'Wait':
        const waitTitle = (
          <Breadcrumb separator="|">
            <Breadcrumb.Item>{this.props.intl.formatMessage({id:"payWorkbench.Wait"})}</Breadcrumb.Item>
            <Breadcrumb.Item>CNY <span className="num-style">250,000.00</span></Breadcrumb.Item>
            <Breadcrumb.Item>USD <span className="num-style">250,000.00</span></Breadcrumb.Item>
          </Breadcrumb>
        );
        return (
          <div className="pay-online-unpaid">
            <Table rowKey="id"
                   columns={waitColumns}
                   dataSource={data}
                   pagination={pagination}
                   loading={loading}
                   title={()=>{return waitTitle}}
                   scroll={{x: true, y: false}}
                   bordered
                   size="middle"/>
          </div>
        );
      case 'Fail':
        const rowSelectionFail = {
          failSelectedRowKeys,
          onChange: this.onFailSelectChange,
          onSelect: this.onFailSelectRow,
          onSelectAll: this.onFailSelectAllRow
        };
        const failTitle = (
          <Breadcrumb separator="|">
            <Breadcrumb.Item>{this.props.intl.formatMessage({id:"payWorkbench.Fail"})}</Breadcrumb.Item>
            <Breadcrumb.Item>CNY <span className="num-style">250,000.00</span></Breadcrumb.Item>
            <Breadcrumb.Item>USD <span className="num-style">250,000.00</span></Breadcrumb.Item>
          </Breadcrumb>
        );
        return (
          <div className="pay-online-unpaid">
            <Table rowKey="id"
                   columns={failColumns}
                   dataSource={data1}
                   pagination={pagination}
                   loading={loading}
                   rowSelection={rowSelectionFail}
                   title={()=>{return failTitle}}
                   scroll={{x: true, y: false}}
                   bordered
                   size="middle"/>
          </div>
        );
      case 'Success':
        const successTitle = (
          <Breadcrumb separator="|">
            <Breadcrumb.Item>{this.props.intl.formatMessage({id:"payWorkbench.Success"})}</Breadcrumb.Item>
            <Breadcrumb.Item>CNY <span className="num-style">250,000.00</span></Breadcrumb.Item>
            <Breadcrumb.Item>USD <span className="num-style">250,000.00</span></Breadcrumb.Item>
          </Breadcrumb>
        );
        return (
          <div className="pay-online-unpaid">
            <Table rowKey="id"
                   columns={successColumns}
                   dataSource={data}
                   pagination={pagination}
                   loading={loading}
                   title={()=>{return successTitle}}
                   scroll={{x: true, y: false}}
                   bordered
                   size="middle"/>
          </div>
        );
    }
  };

  render(){
    const { getFieldDecorator } = this.props.form;
    const { formatMessage } = this.props.intl;
    const { searchForm, nowStatus, unpaidNoticeWarning, unpaidNoticeError, payOnlineAble, failNoticeWarning, failNoticeError, rePayAble, cancelPayAble, payModalVisible } = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14, offset: 1 },
    };
    let payButton;
    switch(nowStatus) {
      case 'Unpaid':
        payButton = (
          <div>
            <Button type="primary" style={{margin:"30px auto 10px"}} disabled={!payOnlineAble}  onClick={this.showPayModal}>{this.props.intl.formatMessage({id:"payWorkbench.payOnline"})}</Button>
            {unpaidNoticeWarning ? <Alert className="pay-notice-warning" message={unpaidNoticeWarning} type="info" showIcon style={{marginBottom:'10px'}}/> : ''}
            {unpaidNoticeError ? <Alert message={unpaidNoticeError} type="error" showIcon style={{marginBottom:'10px'}}/> : ''}
          </div>
        );
        break;
      case 'Wait':
        payButton = <Alert message={formatMessage({id:"payWorkbench.Wait.Message"})} type="info" showIcon style={{margin:"30px auto 10px"}}/>;
        break;
      case 'Fail':
        payButton = (
          <div style={{margin:"30px auto 10px"}}>
            <Button type="primary" style={{margin:"0 10px 10px 0"}} disabled={!rePayAble}>{this.props.intl.formatMessage({id:"payWorkbench.RePay"})}</Button>
            <Button type="primary" disabled={!cancelPayAble}>{this.props.intl.formatMessage({id:"payWorkbench.CancelPay"})}</Button>
            {failNoticeWarning ? <Alert className="pay-notice-warning" message={failNoticeWarning} type="info" showIcon style={{marginBottom:'10px'}}/> : ''}
            {failNoticeError ? <Alert message={failNoticeError} type="error" showIcon style={{marginBottom:'10px'}}/> : ''}
          </div>
        );
        break;
      case 'Success':
        payButton = <Alert message={formatMessage({id:"payWorkbench.Success.Message"})} type="info" showIcon style={{margin:"30px auto 10px"}}/>;
        break;
    }
    return (
      <div className="pay-online">
        <SearchArea
          searchForm={searchForm}
          submitHandle={this.search}
          clearHandle={this.clear}
          eventHandle={this.searchEventHandle}/>
        {payButton}
        <Tabs onChange={this.onChangeTabs} type="card">
          {this.renderTabs()}
        </Tabs>
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

function mapStateToProps() {
  return {}
}

const WrappedPayOnline = Form.create()(PayOnline);

export default connect(mapStateToProps)(injectIntl(WrappedPayOnline));
