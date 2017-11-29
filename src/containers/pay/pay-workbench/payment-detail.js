import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import config from 'config'
import httpFetch from 'share/httpFetch'
import { Alert, Badge, Table, Card } from 'antd'

import 'styles/pay/pay-workbench/payment-detail.scss'

class PaymentDetail extends React.Component {
  constructor(props) {
    super(props);
    const {formatMessage} = this.props.intl;
    this.state = {
      loading: false,
      billsColumns: [
        {title: '单据编号', dataIndex: 'billsNumber', key: 'billsNumber', render: number => (<a>{number}</a>)},
        {title: '单据类型', dataIndex: 'billsType', key: 'billsType'},
        {title: '币种', dataIndex: 'currency', key: 'currency'},
        {title: '单据总金额', dataIndex: 'totalAmount', key: 'totalAmount', render: this.filterMoney},
        {title: '申请人', dataIndex: 'applicant', key: 'applicant'}
      ],
      detailColumns: [
        {title: '付款批次号', dataIndex: 'batchNumber', key: 'batchNumber'},
        {title: '付款流水号', dataIndex: 'serialNumber', key: 'serialNumber'},
        {title: '币种', dataIndex: 'currency', key: 'currency'},
        {title: '付款金额', dataIndex: 'payedAmount', key: 'payedAmount', render: this.filterMoney},
        {title: '付款方式', dataIndex: 'payWay', key: 'payWay'},
      ],
      financeColumns: [
        {title: '摘要', dataIndex: 'abstract', key: 'abstract'},
        {title: '公司', dataIndex: 'company', key: 'company'},
        {title: '成本中心', dataIndex: 'costCenter', key: 'costCenter'},
        {title: '科目', dataIndex: 'subject', key: 'subject'},
      ],
      logColumns: [
        {title: '操作类型', dataIndex: 'operaType', key: 'operaType'},
        {title: '操作人', dataIndex: 'operaPerson', key: 'operaPerson'},
        {title: '执行结果', dataIndex: 'executionResult', key: 'executionResult', render: (result) => {
          let status = result == '未支付' ? 'default' : (result == '成功' ? 'success' : 'error');
          return <Badge status={status} text={result}/>
        }},
        {title: '操作时间', dataIndex: 'operaTime', key: 'operaTime'},
        {title: '备注', dataIndex: 'remark', key: 'remark', width: '35%'},
      ],
      data: [],
      logData: [],
    };
  }

  componentWillMount() {
    this.getInfo()
  }

  getInfo = () => {
    let url = `${config.contractUrl}/payment/api/Cash/PaymentMethod/selectById/${this.props.params.id}`;
    httpFetch.get(url).then(res => {

    })
  };

  render(){
    const { formatMessage } = this.props.intl;
    const { loading, billsColumns, detailColumns, financeColumns, logColumns, data, logData } = this.state;
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
        <Alert message={<Badge text="支付成功" status='success'/>} type="info" className="top-result" />
        <h3 className="header-title">{formatMessage({id:"paymentDetail.bills"})}</h3>
        <Table rowKey="id"
               columns={billsColumns}
               dataSource={data}
               loading={loading}
               pagination={false}
               bordered
               size="middle"/>
        <h3 className="header-title">{formatMessage({id:"paymentDetail.detail"})}</h3>
        <Table rowKey="id"
               columns={detailColumns}
               dataSource={data}
               loading={loading}
               pagination={false}
               bordered
               size="middle"/>
        <Card bordered={false} noHovering>
          <Card.Grid style={gridLeftStyle}>描述：</Card.Grid>
          <Card.Grid style={gridRightStyle}>Content</Card.Grid>
          <Card.Grid style={gridLeftStyle}>付方信息：</Card.Grid>
          <Card.Grid style={gridRightStyle}>Content</Card.Grid>
          <Card.Grid style={gridLeftStyle}>账户信息：</Card.Grid>
          <Card.Grid style={gridRightStyle}>Content</Card.Grid>
          <Card.Grid style={gridLeftStyle}>出纳：</Card.Grid>
          <Card.Grid style={gridRightStyle}>Content</Card.Grid>
        </Card>
        <Card bordered={false} noHovering>
          <Card.Grid style={gridLeftStyle}>收方类型：</Card.Grid>
          <Card.Grid style={gridRightStyle}>Content</Card.Grid>
          <Card.Grid style={gridLeftStyle}>收方信息：</Card.Grid>
          <Card.Grid style={gridRightStyle}>Content</Card.Grid>
        </Card>
        <h3 className="header-title">{formatMessage({id:"paymentDetail.finance"})}</h3>
        <Table rowKey="id"
               columns={financeColumns}
               dataSource={data}
               loading={loading}
               pagination={false}
               bordered
               size="middle"/>
        <h3 className="header-title">{formatMessage({id:"paymentDetail.log"})}</h3>
        <Table rowKey="id"
               columns={logColumns}
               dataSource={logData}
               loading={loading}
               pagination={false}
               style={{marginBottom:'50px'}}
               expandedRowRender={record => <p>{record.description}</p>}
               size="middle"/>
      </div>
    )
  }

}

function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps)(injectIntl(PaymentDetail));
