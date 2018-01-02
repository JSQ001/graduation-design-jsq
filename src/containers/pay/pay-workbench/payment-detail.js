import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import config from 'config'
import httpFetch from 'share/httpFetch'
import menuRoute from 'share/menuRoute'
import paymentService from 'service/paymentService'
import { Alert, Badge, Table, Card, Icon, Spin } from 'antd'

import moment from 'moment'
import 'styles/pay/pay-workbench/payment-detail.scss'

class PaymentDetail extends React.Component {
  constructor(props) {
    super(props);
    const {formatMessage} = this.props.intl;
    this.state = {
      loading: false,
      billsColumns: [
        {title: '单据编号', dataIndex: 'documentCode', render: number => (<a>{number}</a>)},
        {title: '单据类型', dataIndex: 'documentType'},
        {title: '币种', dataIndex: 'currency'},
        {title: '单据总金额', dataIndex: 'documentTotalAmount', render: this.filterMoney},
        {title: '申请人', dataIndex: 'documentApplicant'}
      ],
      detailColumns: [
        {title: '付款批次号', dataIndex: 'customerBatchNo'},
        {title: '付款流水号', dataIndex: 'billcode'},
        {title: '币种', dataIndex: 'currency'},
        {title: '付款金额', dataIndex: 'payAmount', render: this.filterMoney},
        {title: '付款方式', dataIndex: 'paymentTypeName'}
      ],
      financeColumns: [
        {title: '摘要', dataIndex: 'abstract'},
        {title: '公司', dataIndex: 'company'},
        {title: '成本中心', dataIndex: 'costCenter'},
        {title: '科目', dataIndex: 'subject'}
      ],
      offHistoryColumns: [
        {title: '序号', dataIndex: 'index', render: (value, record, index) => index + 1},
        {title: '核销日期', dataIndex: 'writeOffDate', render: value => moment(value).format('YYYY-MM-DD')},
        {title: '单据编号', dataIndex: 'documentCode'},
        {title: '核销金额', dataIndex: 'writeOffAmount', render: this.filterMoney},
        {title: '状态', dataIndex: 'status', render: value => <Badge text={value} status='success'/>},
      ],
      logColumns: [
        {title: '操作类型', dataIndex: 'operationType'},
        {title: '操作人', dataIndex: 'operationMan'},
        {title: '操作时间', dataIndex: 'operationTime', render: value => moment(value).format('YYYY-MM-DD HH:mm:ss')},
        {title: '备注', dataIndex: 'remark', width: '30%'},
      ],
      payStatus: {
        W: {label: '待支付', state: 'default'},
        P: {label: '支付中', state: 'processing'},
        S: {label: '支付成功', state: 'success'},
        F: {label: '支付失败', state: 'error'},
        R: {label: '重新支付', state: 'warning'},
      },
      payStatusValue: '',
      billsData: [],
      detailData: [],
      financeData: [],
      offHistoryDate: [],
      logData: [],
      payWorkbench:  menuRoute.getRouteItem('pay-workbench','key'),    //付款工作台
    };
  }

  componentWillMount() {
    this.getInfo()
  }

  getInfo = () => {
    this.setState({loading: true});
    paymentService.getPayDetail(this.props.params.id).then(res => {
      if (res.status === 200) {
        this.setState({
          billsData: [res.data.payDocumentDTO],
          detailData: [res.data.payDetailDTO],
          logData: res.data.operationDTO,
          payStatusValue: res.data.payStatus,
          loading: false
        })
      }
    })
  };

  handleBack = () => {
    this.context.router.replace(`${this.state.payWorkbench.url}?tab=${this.props.params.tab}&subTab=${this.props.params.subTab}`);
  };

  render(){
    const { formatMessage } = this.props.intl;
    const { loading, billsColumns, detailColumns, financeColumns, offHistoryColumns, logColumns, billsData, detailData, financeData, offHistoryDate, logData, payStatusValue, payStatus } = this.state;
    const gridLeftStyle = {
      width: '20%',
      textAlign: 'left',
      padding: '10px 8px'
    };
    const gridRightStyle = {
      width: '80%',
      textAlign: 'left',
      padding: '10px 8px'
    };
    return (
      <div className="payment-detail">
        <Spin spinning={loading}>
          <Alert message={<Badge text={payStatusValue ? payStatus[payStatusValue].label : ''}
                                 status={payStatusValue ? payStatus[payStatusValue].state : 'default'}/>}
                 type="info" className="top-result" />
          <h3 className="header-title">{formatMessage({id:"pay.workbench.detail.bills"})/*付款单据*/}</h3>
          <Table rowKey="documentCode"
                 columns={billsColumns}
                 dataSource={billsData}
                 pagination={false}
                 bordered
                 size="middle"/>
          <h3 className="header-title">{formatMessage({id:"pay.workbench.detail.detail"})/*付款详情*/}</h3>
          <Table rowKey="draweeId"
                 columns={detailColumns}
                 dataSource={detailData}
                 pagination={false}
                 bordered
                 size="middle"/>
          <Card bordered={false} hoverable={false}>
            <Card.Grid style={gridLeftStyle}>描述：</Card.Grid>
            <Card.Grid style={gridRightStyle}>{detailData[0] && detailData[0].remark}</Card.Grid>
            <Card.Grid style={gridLeftStyle}>付方信息：</Card.Grid>
            <Card.Grid style={gridRightStyle}>{detailData[0] && detailData[0].draweeAccountNumber} {detailData[0] && detailData[0].draweeAccountName}</Card.Grid>
            <Card.Grid style={gridLeftStyle}>账户信息：</Card.Grid>
            <Card.Grid style={gridRightStyle}>{detailData[0] && detailData[0].currency} {detailData[0] && detailData[0].exchangeRate}</Card.Grid>
            <Card.Grid style={gridLeftStyle}>出纳：</Card.Grid>
            <Card.Grid style={gridRightStyle}>{detailData[0] && detailData[0].draweeId}</Card.Grid>
          </Card>
          <Card bordered={false} hoverable={false}>
            <Card.Grid style={gridLeftStyle}>收方类型：</Card.Grid>
            <Card.Grid style={gridRightStyle}>{detailData[0] && detailData[0].partnerCategory}</Card.Grid>
            <Card.Grid style={gridLeftStyle}>收方信息：</Card.Grid>
            <Card.Grid style={gridRightStyle}>{detailData[0] && detailData[0].payeeAccountName} {detailData[0] && detailData[0].payeeAccountNumber}</Card.Grid>
          </Card>
          <h3 className="header-title">{formatMessage({id:"pay.workbench.detail.finance"})/*财务信息*/}</h3>
          <Table rowKey="id"
                 columns={financeColumns}
                 dataSource={financeData}
                 pagination={false}
                 bordered
                 size="middle"/>
          <h3 className="header-title">核销历史</h3>
          <Table rowKey="id"
                 columns={offHistoryColumns}
                 dataSource={offHistoryDate}
                 pagination={false}
                 bordered
                 size="middle"/>
          <h3 className="header-title">{formatMessage({id:"pay.workbench.detail.log"})/*操作日志*/}</h3>
          <Table rowKey={(record, index) => index}
                 columns={logColumns}
                 dataSource={logData}
                 pagination={false}
                 style={{marginBottom:'50px'}}
                 expandedRowRender={record => <p>{record.description}</p>}
                 size="middle"/>
          <a style={{fontSize:'14px',paddingBottom:'20px'}} onClick={this.handleBack}>
            <Icon type="rollback" style={{marginRight:'5px'}}/>返回
          </a>
        </Spin>
      </div>
    )
  }

}

PaymentDetail.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps)(injectIntl(PaymentDetail));
