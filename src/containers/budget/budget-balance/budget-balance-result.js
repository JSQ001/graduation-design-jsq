import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

import 'styles/budget/budget-balance/budget-balance-result.scss'
import { Table, Row, Col, Form } from 'antd'
const FormItem = Form.Item;

import httpFetch from 'share/httpFetch'
import config from 'config'
import SlideFrame from 'components/slide-frame'
import BudgetBalanceAmountDetail from 'containers/budget/budget-balance/budget-balance-amount-detail'

class BudgetBalanceResult extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: [],
      columns: [
        {title: '公司', dataIndex: 'companyName'},
        {title: '预算项目类型', dataIndex: 'itemTypeName'},
        {title: '预算项目', dataIndex: 'itemName'},
        {title: '年', dataIndex: 'periodYear'},
        {title: '季度', dataIndex: 'periodQuarter'},
        {title: '期间', dataIndex: 'periodName'},
        {title: '币种', dataIndex: 'currency'},
        {title: '预算额', dataIndex: 'bgtAmount', render: (bgtAmount, record) => bgtAmount > 0 ? <a onClick={() => this.showSlideFrame(record, 'J')}>{this.filterMoney(bgtAmount)}</a> : this.filterMoney(bgtAmount)},
        {title: '保留额', dataIndex: 'expReserveAmount', render: (expReserveAmount, record) => expReserveAmount > 0 ? <a onClick={() => this.showSlideFrame(record, 'R')}>{this.filterMoney(expReserveAmount)}</a> : this.filterMoney(expReserveAmount)},
        {title: '发生额', dataIndex: 'expUsedAmount', render: (expUsedAmount, record) => expUsedAmount > 0 ? <a onClick={() => this.showSlideFrame(record, 'U')}>{this.filterMoney(expUsedAmount)}</a> : this.filterMoney(expUsedAmount)},
        {title: '可用额', dataIndex: 'expAvailableAmount', render: expAvailableAmount => this.filterMoney(expAvailableAmount)},
        {title: '部门', dataIndex: 'unitName'},
        {title: '部门组', dataIndex: 'unitGroupName'},
        {title: '员工', dataIndex: 'employeeName'},
        {title: '员工组', dataIndex: 'employeeGroupName'}
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
      pageSize: 10,
      showSlideFrameFlag: false,
      slideFrameParam: {},
      titleMap: {
        J: '预算额明细',
        R: '保留额明细',
        U: '发生额明细'
      }
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
      let data = [], total = [];
      if(res.data){
        data = res.data.queryResultList.map((item, index) => {
          item.key = this.state.page * this.state.pageSize + index;
          return item;
        });
        total = res.data.queryResultCurrencyList
      }
      this.setState({
        loading: false,
        data,
        total
      })
    })
  };

  showSlideFrame = (record, type) => {

    this.setState({
      showSlideFrameFlag: true,
      slideFrameParam: {
        type: type,
        data: record,
        title: this.state.titleMap[type]
      }
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
    const { columns, data, condition, loading, showSlideFrameFlag, slideFrameParam } = this.state;
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
               rowKey="key"
               scroll={{ x: '150%' }}/>
        <SlideFrame content={BudgetBalanceAmountDetail}
                    show={showSlideFrameFlag}
                    onClose={() => this.setState({ showSlideFrameFlag: false })}
                    params={slideFrameParam}
                    title={slideFrameParam.title} width="70%"/>
      </div>
    )
  }

}

function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps)(injectIntl(BudgetBalanceResult));
