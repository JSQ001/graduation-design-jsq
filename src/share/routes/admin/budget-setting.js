import NewBudgetOrganization from 'containers/budget-setting/budget-organization/new-budget-organization'
import BudgetOrganization from 'containers/budget-setting/budget-organization/budget-organization'
import BudgetOrganizationDetail from 'containers/budget-setting/budget-organization/budget-organization-detail'
import NewBudgetStructure from 'containers/budget-setting/budget-organization/budget-structure/new-budget-structure'
import NewBudgetItem from 'containers/budget-setting/budget-organization/budget-item/new-budget-item'
import BudgetItemDetail from 'containers/budget-setting/budget-organization/budget-item/budget-item-detail'
import BudgetStructureDetail from 'containers/budget-setting/budget-organization/budget-structure/budget-structure-detail'
import NewBudgetGroup from 'containers/budget-setting/budget-organization/budget-group/new-budget-group'
import BudgetGroupDetail from 'containers/budget-setting/budget-organization/budget-group/budget-group-detail'

import NewBudgetStrategy from 'containers/budget-setting/budget-organization/budget-strategy/new-budget-strategy'
import BudgetStrategyDetail from 'containers/budget-setting/budget-organization/budget-strategy/budget-strategy-detail'
import NewBudgetStrategyDetail from 'containers/budget-setting/budget-organization/budget-strategy/new-budget-strategy-detail'
import StrategyControlDetail from 'containers/budget-setting/budget-organization/budget-strategy/strategy-control-detail'
import NewBudgetControlRules from 'containers/budget-setting/budget-organization/budget-control-rules/new-budget-control-rules'
import BudgetControlRulesDetail from 'containers/budget-setting/budget-organization/budget-control-rules/budget-control-rules-detail'

import NewBudgetJournalType from 'containers/budget-setting/budget-organization/budget-journal-type/new-budget-journal-type'
import BudgetJournalTypeDetail from 'containers/budget-setting/budget-organization/budget-journal-type/budget-journal-type-detail'

//新建预算表
const newBudgetStructure = {
  key:'new-budget-structure',
  url:'/main/budget-setting/budget-organization/budget-organization-detail/:id/budget-structure/new-budget-structure',
  components: NewBudgetStructure,
  parent: 'budget-organization-detail'
};

//预算表详情
const budgetStructureDetail = {
  key:'budget-structure-detail',
  url:'/main/budget-setting/budget-organization/budget-organization-detail/:id/budget-structure/budget-structure-detail/:structureId',
  components: BudgetStructureDetail,
  parent:'budget-organization-detail',
  children: {

  }
};


//新建预算项目组
const newBudgetGroup = {
  key:'new-budget-group',
  url:'/main/budget-setting/budget-organization/budget-organization-detail/:id/budget-group/new-budget-group',
  components: NewBudgetGroup,
  parent: 'budget-organization-detail'
};


//新建预算项目组
const budgetGroupDetail = {
  key:'budget-group-detail',
  url:'/main/budget-setting/budget-organization/budget-organization-detail/:id/budget-group/budget-group-detail/:groupId',
  components: BudgetGroupDetail,
  parent: 'budget-organization-detail'
};

//新建预算项目
const newBudgetItem = {
  key: 'new-budget-item',
  url: '/main/budget-setting/budget-organization/budget-organization-detail/:id/budget-item/new-budget-item',
  components: NewBudgetItem,
  parent: 'budget-organization-detail'
};

//预算项目详情
const budgetItemDetail = {
  key: 'budget-item-detail',
  url: '/main/budget-setting/budget-organization/budget-organization-detail/:id/budget-item/budget-item-detail/:itemId',
  components: BudgetItemDetail,
  parent: 'budget-organization-detail'

};

//新建预算控制规则定义
const newBudgetControlRules = {
  key: 'new-budget-control-rules',
  url: '/main/budget-setting/budget-organization/budget-organization-detail/:id/budget-control-rules/new-budget-control-rules',
  components: NewBudgetControlRules,
  parent: 'budget-organization-detail'
};

//预算控制规则详情
const budgetControlRulesDetail = {
  key: 'budget-control-rules-detail',
  url: '/main/budget-setting/budget-organization/budget-organization-detail/:id/budget-control-rules/budget-control-rules-detail/:ruleId',
  components: BudgetControlRulesDetail,
  parent: 'budget-organization-detail'
};

//预算组织详情
const budgetOrganizationDetail = {
  key:'budget-organization-detail',
  url:'/main/budget-setting/budget-organization/budget-organization-detail/:id',
  components: BudgetOrganizationDetail,
  parent: 'budget-setting'
};

//新建预算组织
const newBudgetOrganization = {
  key:'new-budget-organization',
  url:'/main/budget-setting/budget-organization/new-budget-organization',
  components: NewBudgetOrganization,
  parent: 'budget-organization'
};

//新建预算控制策略
const newBudgetStrategy = {
  key:'new-budget-strategy',
  url:'/main/budget-setting/budget-organization/budget-organization-detail/:id/budget-strategy/new-budget-strategy',
  components: NewBudgetStrategy,
  parent: 'budget-organization-detail'
};

//预算控制策略详情
const budgetStrategyDetail = {
  key:'budget-strategy-detail',
  url:'/main/budget-setting/budget-organization/budget-organization-detail/:id/budget-strategy/budget-strategy-detail/:strategyId',
  components: BudgetStrategyDetail,
  parent: 'budget-organization-detail'
};

//新建预算控制策略详情
const newBudgetStrategyDetail = {
  key:'new-budget-strategy-detail',
  url:'/main/budget-setting/budget-organization/budget-organization-detail/:id/budget-strategy/budget-strategy-detail/:strategyId/new-budget-strategy-detail',
  components: NewBudgetStrategyDetail,
  parent: 'budget-organization-detail'
};

//预算控制规则详情(策略明细)
const strategyControlDetail = {
  key:'strategy-control-detail',
  url:'/main/budget-setting/budget-organization/budget-organization-detail/:id/budget-strategy/budget-strategy-detail/:strategyId/strategy-control-detail/:strategyControlId',
  components: StrategyControlDetail,
  parent: 'budget-organization-detail'
};

//新建预算日记账类型
const newBudgetJournalType = {
  key:'new-budget-journal-type',
  url:'/main/budget-setting/budget-organization/budget-organization-detail/:id/budget-journal-type/new-budget-journal-type',
  components: NewBudgetJournalType,
  parent: 'budget-journal-type'
};

//预算日记账详情
const budgetJournalTypeDetail = {
  key:'budget-journal-type-detail',
  url:'/main/budget-setting/budget-organization/budget-organization-detail/:id/budget-journal-type/budget-journal-type-detail/:typeId',
  components: BudgetJournalTypeDetail,
  parent: 'budget-journal-type'
};

//预算组织定义
const budgetOrganization = {
  key:'budget-organization',
  url:'/main/budget-setting/budget-organization',
  components: BudgetOrganization,
  parent: 'budget-setting',
  children: {
    newBudgetOrganization,
    budgetOrganizationDetail,
    newBudgetStructure,
    budgetStructureDetail,
    newBudgetGroup,
    budgetGroupDetail,
    newBudgetItem,
    budgetItemDetail,
    newBudgetStrategy,
    budgetStrategyDetail,
    newBudgetStrategyDetail,
    strategyControlDetail,
    newBudgetJournalType,
    budgetJournalTypeDetail,
    newBudgetControlRules,
    budgetControlRulesDetail,

  }
};

//预算设置
const budgetSetting = {
  key:'budget-setting',
  subMenu: [budgetOrganization],
  icon: 'tags-o',
  admin: true
};

export default budgetSetting
