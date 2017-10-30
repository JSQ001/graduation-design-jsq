import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

import { Table, Button, message } from 'antd'

import httpFetch from 'share/httpFetch'
import config from 'config'

import 'styles/budget-setting/budget-organization/new-budget-organization.scss'

class BudgetBalanceAmountDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      page: 0,
      pageSize: 10,
      data: [],
      columns: [
        {title: "公司", dataIndex: "companyName"},
        {title: "部门", dataIndex: "unitName"},
        {title: "预算申请人", dataIndex: "employeeName", type: "J"},{title: "申请人", dataIndex: "employeeName", type: "R"},{title: "报销人", dataIndex: "employeeName", type: "U"},
        {title: "单据类型", dataIndex: "documentType"},
        {title: "单据编号", dataIndex: "documentNumber"},
        {title: "预算申请日期", dataIndex: "requisitionDate", type: "J"},{title: "申请日期", dataIndex: "requisitionDate", type: "R"},{title: "报销日期", dataIndex: "requisitionDate", type: "U"},
        {title: "单据行号", dataIndex: "documentLineNum"},
        {title: "预算项目", type: "J"},{title: "申请项目", type: "R"},{title: "报销项目", type: "U"},
        {title: "币种", dataIndex: "currency"},
        {title: "预算金额", dataIndex: "amount", type: "J"},{title: "申请金额", dataIndex: "amount", type: "R"},{title: "报销金额", dataIndex: "amount", type: "U"},
        {title: "税额", dataIndex: "taxAmount"},
        {title: "不含税金额", dataIndex: "saleAmount"},
        {title: "状态"},
        {title: "摘要", dataIndex: "description"},
        {title: "关闭状态", type: "J"},{title: "关闭状态", type: "R"},{title: "反冲", type: "U"},
        {title: "会计期间", dataIndex: "periodName"},
        {title: "审核状态"}
      ]
    };
  }

  componentWillReceiveProps(nextProps){
    if(!this.props.params.data || (nextProps.params.data.key !== this.props.params.data.key || nextProps.params.data.type !== this.props.params.data.type)){
      this.getList(nextProps);
    }
  }

  getList = (nextProps) => {
    this.setState({ loading: true });
    let params = nextProps.params.data;
    params.reserveFlag = nextProps.params.type;
    params.organizationId = this.props.organization.id;
    params.year = params.periodYear;
    params = {
      "reserveFlag": "J",
      "organizationId": 1,
      "versionId": "1",
      "scenarioId": "1",
      "structureId": "1",
      "companyId": "1",
      "year": 2017,
      "itemGroupId": 1
    };
    httpFetch.post(`${config.budgetUrl}/api/budget/balance/query/results/detail`, params).then(res => {
      let data = res.data.map((item, index) => {
        item.key = index;
        return item;
      });
      this.setState({ loading: false, data });
    })
  }

  filterColumns = () => {
    const { columns } = this.state;
    let result = [];
    columns.map(column => {
      (!column.type || column.type === this.props.params.type) && result.push(column)
    });
    return result;
  };

  render(){
    const { data, loading } = this.state;
    return (
      <div>
        <h3 className="header-title">预算额明细</h3>
        <Table columns={this.filterColumns()}
               dataSource={data}
               bordered
               loading={loading}
               size="middle"
               rowKey="key"
               scroll={{ x: '255%' }}/>
        <div className="slide-footer">
          <Button onClick={() => {this.getList(this.props)}}>刷新查询结果</Button>
          <Button>导出CSV</Button>
        </div>
      </div>
    )
  }

}

function mapStateToProps(state) {
  return {
    organization: state.login.organization
  }
}

export default connect(mapStateToProps)(injectIntl(BudgetBalanceAmountDetail));