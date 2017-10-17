import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { Alert, Badge, Table, Card, Row, Col } from 'antd';

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
    let data = [{
      'id': 1,
      'serialNumber': '123312312312',
      'billsNumber': 'LA12321231213',
      'billsType': '差旅申请单',
      'applicant': '12303 | Louis',
      'date': '2017-12-12',
      'payDate': '2017-12-12',
      'currency': 'CNY',
      'totalAmount': 12122122,
      'cancelAmount': 2000,
      'payAmount': 122122,
      'payedAmount': 122122,
      'payWay': '线上',
      'payee': '对私 | jack',
      'accountNumber': '123666',
      'batchNumber': 'FK12341234123',
      'state': '未付款',
      'abstract': 'XXX',
      'company': '上海甄汇信息科技有限公司',
      'costCenter': '小桔闪报产品',
      'subject': '122111233-应付',
    }];
    let logData = [{
      'id': 1,
      'operaType': '支付',
      'operaPerson': '迎曦',
      'executionResult': '成功',
      'operaTime': '2016-09-21  08:50:08',
      'remark': '这是一段描述，关于这个应用的描述',
      'description': '这是一段description，关于这个应用的description'
    },{
      'id': 2,
      'operaType': '重新支付',
      'operaPerson': '海纳',
      'executionResult': '失败',
      'operaTime': '2016-09-21  08:50:08',
      'remark': '这是一段描述，关于这个应用的描述',
      'description': '这是一段description，关于这个应用的description'
    },{
      'id': 3,
      'operaType': '更改状态',
      'operaPerson': '王大锤',
      'executionResult': '成功',
      'operaTime': '2016-09-21  08:50:08',
      'remark': '这是一段描述，关于这个应用的描述',
      'description': '这是一段description，关于这个应用的description'
    },{
      'id': 4,
      'operaType': '取消支付',
      'operaPerson': '小王子',
      'executionResult': '未支付',
      'operaTime': '2016-09-21  08:50:08',
      'remark': '这是一段描述，关于这个应用的描述',
      'description': '这是一段description，关于这个应用的description'
    }];
    this.setState({ data, logData })
  }

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
