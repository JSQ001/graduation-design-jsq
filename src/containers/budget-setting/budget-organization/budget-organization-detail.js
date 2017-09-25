import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import config from 'config'

import { Tabs } from 'antd';
const TabPane = Tabs.TabPane;
import BudgetScenarios from 'containers/budget-setting/budget-organization/budget-scenarios/budget-scenarios'
import BudgetStructure from 'containers/budget-setting/budget-organization/budget-structure/budget-structure'
import BudgetVersions from 'containers/budget-setting/budget-organization/budget-versions/budget-versions'
import BudgetItemType from 'containers/budget-setting/budget-organization/budget-item-type/budget-item-type'
import BudgetItem from 'containers/budget-setting/budget-organization/budget-item/budget-item'
import BudgetGroup from 'containers/budget-setting/budget-organization/budget-group/budget-group'

import menuRoute from 'share/menuRoute'

class BudgetOrganizationDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nowStatus: 'SCENARIOS',
      tabs: [
        {key: 'SCENARIOS', name:'预算场景定义'},
        {key: 'STRUCTURE', name:'预算表'},
        {key: 'VERSIONS', name:'预算版本定义'},
        {key: 'TYPE', name:'预算项目类型定义'},
        {key: 'ITEM', name:'预算项目定义'},
        {key: 'GROUP', name:'预算项目组定义'},
      ],
      budgetOrganizationDetailPage: menuRoute.getRouteItem('budget-organization-detail','key'),    //组织定义详情的页面项
    };
  }

  //跳转设置
  componentWillMount(){
    this.context.router.replace(this.state.budgetOrganizationDetailPage.url.replace(':id', this.props.organization.id));
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
      case 'TYPE':
        content = BudgetItemType;
        break;
      case 'ITEM':
        content = BudgetItem;
        break;
      case 'GROUP':
        content = BudgetGroup;
        break;
    }
    return React.createElement(content, Object.assign({}, this.props.params, {organization: this.props.organization}));
  };

  render(){
    return (
      <div>
        <Tabs onChange={this.onChangeTabs}>
          {this.renderTabs()}
        </Tabs>
        {this.renderContent()}
      </div>
    )
  }

}

function mapStateToProps(state) {
  return {
    organization: state.budget.organization
  }
}

BudgetOrganizationDetail.contextTypes = {
  router: React.PropTypes.object
};

export default connect(mapStateToProps)(injectIntl(BudgetOrganizationDetail));
