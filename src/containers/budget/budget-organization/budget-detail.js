import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

import { Tabs } from 'antd';
const TabPane = Tabs.TabPane;

import BudgetScenarios from 'containers/budget/budget-scenarios/budget-scenarios'
import BudgetTable from 'containers/budget/budget-organization/budget-table'
import BudgetVersions from 'containers/budget/budget-versions/budget-versions'

class BudgetDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nowStatus: 'SCENARIOS',
      tabs: [
        {key: 'SCENARIOS', name:'预算场景定义'},
        {key: 'TABLE', name:'预算表'},
        {key: 'VERSIONS', name:'预算版本定义'},
      ]
    }
  }

  //渲染Tabs
  renderTabs(){
    return (
      this.state.tabs.map(tab => {
        return <TabPane tab={tab.name} key={tab.key}/>
      })
    )
  }

  onChangeTabs = (key) =>{
    this.setState({
      nowStatus: key
    })
  };



  renderContent = () => {
    let content = null;
    switch (this.state.nowStatus){
      case 'SCENARIOS':
        content = BudgetScenarios;
        break;
      case 'TABLE':
        content = BudgetTable;
        break;
      case 'VERSIONS':
        content = BudgetVersions;
        break;
    }
    return React.createElement(content, Object.assign({}, this.props.params, {id: this.props.params.id}));
  };

  render(){
    return (
      <div>
        <Tabs type="card" onChange={this.onChangeTabs}>
          {this.renderTabs()}
        </Tabs>
        {this.renderContent()}
      </div>
    )
  }

}

function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps)(injectIntl(BudgetDetail));
