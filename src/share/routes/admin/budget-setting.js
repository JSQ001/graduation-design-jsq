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

//预算设置
const budgetSetting = {
  key:'budget-setting',
  icon: 'tags-o',
  admin: true,
  subMenu: [
    //预算组织定义
    {
      key:'budget-organization',
      url:'/main/budget-setting/budget-organization',
      components: BudgetOrganization,
      parent: 'budget-setting',
      children: {
        //新建预算组织
        newBudgetOrganization: {
          key:'new-budget-organization',
          url:'/main/budget-setting/budget-organization/new-budget-organization',
          components: NewBudgetOrganization,
          parent: 'budget-organization'
        },
        //预算组织详情
        budgetOrganizationDetail: {
          key:'budget-organization-detail',
          url:'/main/budget-setting/budget-organization/budget-organization-detail/:id',
          components: BudgetOrganizationDetail,
          parent: 'budget-setting'
        },
        //新建预算表
        newBudgetStructure : {
          key:'new-budget-structure',
          url:'/main/budget-setting/budget-organization/budget-organization-detail/:id/budget-structure/new-budget-structure',
          components: NewBudgetStructure,
          parent: 'budget-organization-detail'
        },
        //预算表详情
        budgetStructureDetail: {
          key:'budget-structure-detail',
          url:'/main/budget-setting/budget-organization/budget-organization-detail/:id/budget-structure/budget-structure-detail/:structureId',
          components: BudgetStructureDetail,
          parent:'budget-organization-detail',
          children: {}
        },
        //新建预算项目组
        newBudgetGroup: {
          key:'new-budget-group',
          url:'/main/budget-setting/budget-organization/budget-organization-detail/:id/budget-group/new-budget-group',
          components: NewBudgetGroup,
          parent: 'budget-organization-detail'
        },
        //新建预算项目组
        budgetGroupDetail: {
          key:'budget-group-detail',
          url:'/main/budget-setting/budget-organization/budget-organization-detail/:id/budget-group/budget-group-detail/:groupId',
          components: BudgetGroupDetail,
          parent: 'budget-organization-detail'
        },
        //新建预算项目
        newBudgetItem: {
          key: 'new-budget-item',
          url: '/main/budget-setting/budget-organization/budget-organization-detail/:id/budget-item/new-budget-item',
          components: NewBudgetItem,
          parent: 'budget-organization-detail'
        },
        //预算项目详情
        budgetItemDetail: {
          key: 'budget-item-detail',
          url: '/main/budget-setting/budget-organization/budget-organization-detail/:id/budget-item/budget-item-detail/:itemId',
          components: BudgetItemDetail,
          parent: 'budget-organization-detail'

        },
        //新建预算控制策略
        newBudgetStrategy: {
          key:'new-budget-strategy',
          url:'/main/budget-setting/budget-organization/budget-organization-detail/:id/budget-strategy/new-budget-strategy',
          components: NewBudgetStrategy,
          parent: 'budget-organization-detail'
        },
        //预算控制策略详情
        budgetStrategyDetail: {
          key:'budget-strategy-detail',
          url:'/main/budget-setting/budget-organization/budget-organization-detail/:id/budget-strategy/budget-strategy-detail/:strategyId',
          components: BudgetStrategyDetail,
          parent: 'budget-organization-detail'
        },
        //新建预算控制策略详情
        newBudgetStrategyDetail: {
          key:'new-budget-strategy-detail',
          url:'/main/budget-setting/budget-organization/budget-organization-detail/:id/budget-strategy/budget-strategy-detail/:strategyId/new-budget-strategy-detail',
          components: NewBudgetStrategyDetail,
          parent: 'budget-organization-detail'
        },
        //预算控制规则详情(策略明细)
        strategyControlDetail: {
          key:'strategy-control-detail',
          url:'/main/budget-setting/budget-organization/budget-organization-detail/:id/budget-strategy/budget-strategy-detail/:strategyId/strategy-control-detail/:strategyControlId',
          components: StrategyControlDetail,
          parent: 'budget-organization-detail'
        },
        //新建预算日记账类型
        newBudgetJournalType: {
          key:'new-budget-journal-type',
          url:'/main/budget-setting/budget-organization/budget-organization-detail/:id/budget-journal-type/new-budget-journal-type',
          components: NewBudgetJournalType,
          parent: 'budget-journal-type'
        },
        //预算日记账详情
        budgetJournalTypeDetail: {
          key:'budget-journal-type-detail',
          url:'/main/budget-setting/budget-organization/budget-organization-detail/:id/budget-journal-type/budget-journal-type-detail/:typeId',
          components: BudgetJournalTypeDetail,
          parent: 'budget-journal-type'
        },
        //新建预算控制规则定义
        newBudgetControlRules: {
          key: 'new-budget-control-rules',
          url: '/main/budget-setting/budget-organization/budget-organization-detail/:id/budget-control-rules/new-budget-control-rules',
          components: NewBudgetControlRules,
          parent: 'budget-organization-detail'
        },
        //预算控制规则详情
        budgetControlRulesDetail: {
          key: 'budget-control-rules-detail',
          url: '/main/budget-setting/budget-organization/budget-organization-detail/:id/budget-control-rules/budget-control-rules-detail/:ruleId',
          components: BudgetControlRulesDetail,
          parent: 'budget-organization-detail'
        },

      }
    }
  ]
};

export default budgetSetting
