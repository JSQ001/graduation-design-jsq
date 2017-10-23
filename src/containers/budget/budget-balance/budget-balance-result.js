import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

import 'styles/budget/budget-balance/budget-balance-result.scss'
import { Table, Row, Col, Form } from 'antd'
const FormItem = Form.Item;

import httpFetch from 'share/httpFetch'
import config from 'config'

class BudgetBalanceResult extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: [],
      columns: [
        {title: '公司', dataIndex: 'companyName', width: '10%'},
        {title: '预算项目类型', dataIndex: 'itemTypeName', width: '10%'},
        {title: '预算项目', dataIndex: 'itemName', width: '10%'},
        {title: '年', dataIndex: 'periodYear', width: '10%'},
        {title: '季度', dataIndex: 'periodQuarter', width: '10%'},
        {title: '期间', dataIndex: 'periodName', width: '10%'},
        {title: '币种', dataIndex: 'currency', width: '10%'},
        {title: '预算额', dataIndex: 'bgtAmount', width: '10%'},
        {title: '保留额', dataIndex: 'expReserveAmount', width: '10%'},
        {title: '发生额', dataIndex: 'expUsedAmount', width: '10%'},
        {title: '可用额', dataIndex: 'expAvailableAmount', width: '10%'},
        {title: '部门', dataIndex: 'unitName', width: '10%'},
        {title: '部门组', dataIndex: 'unitGroupName', width: '10%'},
        {title: '员工', dataIndex: 'employeeName', width: '10%'},
        {title: '员工组', dataIndex: 'employeeGroupName', width: '10%'}
      ],
      condition: {
        companyNumber: 0,
        version: '',
        type: '',
        budgetStructure: '',
        budgetScenarios: ''
      },
      total: [],
      menuText: {
        totalNumber: '数据条数',
        bgtAmount: '总预算额',
        expReserveAmount: '总保留额',
        expUsedAmount: '总发生额',
        expAvailableAmount: '总可用额'
      },
      page: 0,
      pageSize: 10
    };
  }

  componentWillMount(){
    httpFetch.get(`${config.budgetUrl}/api/budget/balance/query/header/${this.props.params.id}`).then(res => {
      let companyNumber = 0;
      res.data.queryLineList.map(item => {
        companyNumber += item.parameterCode === 'COMPANY' ? 1 : 0
      });
      this.setState({
        condition: {
          companyNumber: companyNumber,
          version: res.data.versionName,
          type: res.data.amountQuarterFlag,
          budgetStructure: res.data.structureName,
          budgetScenarios: res.data.scenarioName
        }
      })
    });
    this.getList();
  };

  getList = () => {
    return httpFetch.get(`${config.budgetUrl}/api/budget/balance/query/results/${this.props.params.id}?page=${this.state.page}&size=${this.state.pageSize}`).then(res => {
      this.setState({
        loading: false,
        data: res.data.queryResultList,
        total: res.data.queryResultCurrencyList
      })
    })
  };

  renderMoney = (number, fixed) => {
    return <span className={number >= 0 ? 'green' : 'red'}>{this.filterMoney(number, fixed)}</span>
  };

  renderTotal = () => {
    return this.state.total.map((item, outerIndex) => {
      return (
        <div className="currency-item" key={outerIndex}>
          {item.currency}
          {Object.keys(item).map((itemName, index) => {
            return itemName === 'currency' ? null : (
              <span className="currency-item-child" key={index}>
                <span className="ant-divider" />{this.state.menuText[itemName]}：{this.renderMoney(item[itemName], itemName === 'totalNumber' ? 0 : 2)}
              </span>
            )
          })}
        </div>
      )
    })
  };

  render(){
    const { columns, data, condition, loading } = this.state;
    return (
      <div className="budget-balance-result">
        <h3 className="header-title">查询结果</h3>
        <div className="header-info">
          <div className="header-info-title">查询条件</div>
          <div className="header-info-content">
            <Row gutter={40}>
              <Col span={8} className="info-block">
                <div className="info-title">公司:</div>
                <div className="info-content">共 {condition.companyNumber} 个</div>
              </Col>
              <Col span={8} className="info-block">
                <div className="info-title">预算版本:</div>
                <div className="info-content">{condition.version}</div>
              </Col>
              <Col span={8} className="info-block">
                <div className="info-title">金额/数量:</div>
                <div className="info-content">{condition.type}</div>
              </Col>
              <Col span={8} className="info-block">
                <div className="info-title">预算表:</div>
                <div className="info-content">{condition.budgetStructure}</div>
              </Col>
              <Col span={8} className="info-block">
                <div className="info-title">预算场景:</div>
                <div className="info-content">{condition.budgetScenarios}</div>
              </Col>
            </Row>
          </div>
        </div>

        {this.renderTotal()}
        <Table columns={columns}
               dataSource={data}
               loading={loading}
               size="middle"
               bordered
               scroll={{ x: '150%' }}/>
      </div>
    )
  }

}

function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps)(injectIntl(BudgetBalanceResult));
