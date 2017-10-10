import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { Button, Form } from 'antd'
const FormItem = Form.Item;

import Chooser from 'components/chooser'

import 'styles/budget/budget-balance/budget-balance.scss'
import SearchArea from 'components/search-area'

class BudgetBalance extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchForm: [
        {type: 'list', id:'company', label: '公司', listType: 'company',isRequired: true, labelKey: 'companyName', valueKey: 'companyCode'},
        {type: 'select', id:'version', label: '版本', isRequired: true, options: []},
        {type: 'select', id:'budgetStructure', label: '预算表', isRequired: true, options: []},
        {type: 'select', id:'budgetScenarios', label: '预算场景', isRequired: true, options: []},
        {type: 'select', id:'year', label: '年度', isRequired: true, options: []},
        {type: 'items', id: 'dateRange', items: [
          {type: 'date', id: 'dateFrom', label: '期间从', isRequired: true},
          {type: 'date', id: 'dateTo', label: '期间到'}
        ]},
        {type: 'select', id:'total', label: '期间汇总', isRequired: true, options: []},
        {type: 'items', id: 'seasonRange', items: [
          {type: 'select', id: 'seasonFrom', label: '季度从', isRequired: true, options: []},
          {type: 'select', id: 'seasonTo', label: '季度到', options: []}
        ]},
        {type: 'select', id:'type', label: '金额/数量', isRequired: true, options: []}
      ],
    };
  }

  search = (result) => {
    console.log(result)
  };

  clear = () => {

  };

  handleTest = (e) => {
    e.preventDefault();
    console.log(this.props.form.getFieldsValue())
  };

  render(){
    const { searchForm } = this.state;
    return (
      <div className="budget-balance">
        <SearchArea
          searchForm={searchForm}
          submitHandle={this.search}
          clearHandle={this.clear}
          maxLength={9}/>
        <div className="footer-operate">
          <Button type="primary">查询</Button>
          <Button style={{ marginLeft: 10, marginRight: 20 }}>重置</Button>
          <Button style={{ marginRight: 10}}>保存方案</Button>
          <Button>应用现有方案</Button>
        </div>
      </div>
    )
  }

}

function mapStateToProps() {
  return {}
}

const WrappedBudgetBalance = Form.create()(BudgetBalance);

export default connect(mapStateToProps)(injectIntl(WrappedBudgetBalance));
