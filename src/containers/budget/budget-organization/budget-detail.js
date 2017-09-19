import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import config from 'config'

import { Tabs } from 'antd';
const TabPane = Tabs.TabPane;

import Loading from 'components/loading'

import { setOrganization } from 'actions/budget'

import BudgetScenarios from 'containers/budget/budget-organization/budget-scenarios/budget-scenarios'
import BudgetStructure from 'containers/budget/budget-organization/budget-structure/budget-structure'
import BudgetVersions from 'containers/budget/budget-organization/budget-versions/budget-versions'

import httpFetch from "share/httpFetch";

class BudgetDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nowStatus: 'SCENARIOS',
      tabs: [
        {key: 'SCENARIOS', name:'预算场景定义'},
        {key: 'STRUCTURE', name:'预算表'},
        {key: 'VERSIONS', name:'预算版本定义'},
      ],
      loading: true
    };
  }

  //设置预算到redux
  componentWillMount(){
    if(this.props.organization.id)
      this.setState({loading: false});
    else
      httpFetch.get(`${config.budgetUrl}/api/budget/organizations/${this.props.params.id}`).then(res => {
        this.props.dispatch(setOrganization(res.data));
        this.setState({loading: false});
      })
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
      case 'STRUCTURE':
        content = BudgetStructure;
        break;
      case 'VERSIONS':
        content = BudgetVersions;
        break;
    }
    return React.createElement(content, Object.assign({}, this.props.params, {organization: this.props.organization}));
  };

  render(){
    return (
      <div>
        <Tabs type="card" onChange={this.onChangeTabs}>
          {this.renderTabs()}
        </Tabs>
        {this.state.loading ? <Loading/> : this.renderContent()}
      </div>
    )
  }

}

function mapStateToProps(state) {
  return {
    organization: state.budget.organization
  }
}

export default connect(mapStateToProps)(injectIntl(BudgetDetail));
