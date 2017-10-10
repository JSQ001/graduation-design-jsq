/**
 * Created by zaranengap on 2017/8/29.
 */
import React from 'react';
import { Router, Route, browserHistory } from 'react-router'

import Main from 'containers/main'
import requireAuthentication from 'components/requireAuthentication'

import Dashboard from 'containers/dashboard'
import ConfirmManagement from 'containers/financial-management/confirm-payment'
import ValueList from 'containers/setting/value-list/value-list'
import NewValueList from 'containers/setting/value-list/new-value-list'
import MyAccount from 'containers/expense-report/my-account'

import NewBudgetOrganization from 'containers/budget-setting/budget-organization/new-budget-organization'
import BudgetOrganization from 'containers/budget-setting/budget-organization/budget-organization'
import BudgetOrganizationDetail from 'containers/budget-setting/budget-organization/budget-organization-detail'
import NewBudgetStructure from 'containers/budget-setting/budget-organization/budget-structure/new-budget-structure'
import NewBudgetItem from 'containers/budget-setting/budget-organization/budget-item/new-budget-item'
import BudgetItemDetail from 'containers/budget-setting/budget-organization/budget-item/budget-item-detail'
import BudgetStructureDetail from 'containers/budget-setting/budget-organization/budget-structure/budget-structure-detail'
import NewBudgetVersions from 'containers/budget-setting/budget-organization/budget-versions/new-budget-versions'
import BudgetVersionsDetail from 'containers/budget-setting/budget-organization/budget-versions/budget-versions-detail'
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

import BudgetJournal from 'containers/budget/budget-journal/budget-journal'

import BudgetBalance from 'containers/budget/budget-balance/budget-balance'

import PayWorkbench from 'containers/pay/pay-workbench/pay-workbench'

import configureStore from 'stores';
import {setCurrentPage} from 'actions/main'

const menuIndexUrl = '/main/dashboard';

//确认付款
const confirmPayment = {
  key:'confirm-payment',
  url:'/main/financial-management/confirm-payment',
  components: ConfirmManagement,
  parent: 'financial-management'
};

//新建值列表
const newValueList = {
  key:'new-value-list',
  url:'/main/setting/value-list/new-value-list',
  components: NewValueList,
  parent: 'value-list'
};

//值列表
const valueList = {
  key:'value-list',
  url:'/main/setting/value-list',
  components: ValueList,
  parent: 'setting',
  children: {
    newValueList
  }
};

//我的账本
const myAccount = {
  key: 'my-account',
  url:'/main/expense-report/my-account',
  components:MyAccount,
  parent:'expense-report'
};

//////////////////////预算设置模块///////////////////////

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
  url:'/main/budget-setting/budget-organization/budget-organization-detail/:id/budget-structure/budget-structure-detail/:id',
  components: BudgetStructureDetail,
  parent:'budget-organization-detail',
  children: {

  }
};

//预算表分配公司
const budgetStructureCompany = {
  key: 'budget-structure-company',
  url: '/'
};

//新建预算版本
const newBudgetVersions = {
  key:'new-budget-versions',
  url:'/main/budget-setting/budget-organization/budget-organization-detail/:id/budget-versions/new-budget-versions',
  components: NewBudgetVersions,
  parent: 'budget-organization-detail'
};

//预算版本详情
const budgetVersionsDetail = {
  key:'budget-versions-detail',
  url:'/main/budget-setting/budget-organization/budget-organization-detail/:id/budget-versions/budget-versions-detail/:versionId',
  components:BudgetVersionsDetail,
  parent: 'budget-organization-detail'
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
  url: '/main/budget-setting/budget-organization/budget-organization-detail/:id/budget-item/budget-item-detail/:id',
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
  url: '/main/budget-setting/budget-organization/budget-organization-detail/:id/budget-control-rules/budget-control-rules-detail/:id',
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
    budgetVersionsDetail,
    newBudgetVersions,
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
  icon: 'tags-o'
};

//////////////////////预算设置模块结束///////////////////////

//////////////////////预算模块///////////////////////////

//预算日记账
const budgetJournal = {
  key:'budget-journal',
  url:'/main/budget/budget-journal',
  components: BudgetJournal,
  parent: 'budget',
  children: {}
};

//预算余额
const budgetBalance = {
  key: 'budget-balance',
  url:'/main/budget/budget-balance',
  components: BudgetBalance,
  parent: 'budget',
  children: {}
};

//预算
const budget = {
  key:'budget',
  subMenu: [budgetJournal, budgetBalance],
  icon: 'tags'
};

//////////////////////预算模块结束///////////////////////////

//////////////////////支付模块///////////////////////////

//付款工作台
const payWorkbench = {
  key: 'pay-workbench',
  url:'/main/pay/pay-workbench',
  components: PayWorkbench,
  parent: 'pay',
  children: {}
};

//支付
const pay = {
  key:'pay',
  subMenu: [payWorkbench],
  icon: 'pay-circle'
};

//////////////////////支付模块结束///////////////////////////

//首页
const dashboard = {
  key:'dashboard',
  url: menuIndexUrl,
  components: Dashboard,
  icon: 'home'
};

//财务管理
const financialManagement = {
  key:'financial-management',
  subMenu: [confirmPayment],
  icon: 'pay-circle-o'
};

//设置
const setting = {
  key:'setting',
  subMenu: [valueList],
  icon: 'setting'
};

//报销单
const expenseReport = {
  key: 'expense-report',
  subMenu: [myAccount],
  icon: 'file-text'
};

/**
 * 项目菜单整体路由配置
 * 分为三层: menuItem, subMenuItem, children
 * menuItem为菜单一级
 * subMenuItem为菜单二级
 * children为具体页面的所有内部页面
 * @params name    菜单标题
 * @params key    菜单id
 * @params url    菜单路径
 * @params components    菜单组件
 * @params parent    父菜单id
 * @params subMenu    二级菜单列表
 * @params children    页面内部所有页面 key : page
 */
const menu = [
  dashboard,
  setting,
  financialManagement,
  expenseReport,
  budgetSetting,
  budget,
  pay
];

/**
 * 渲染二级菜单页内的children
 * @param subItem
 * @return {Array}
 */
const renderSubItem = (subItem) => {
  let result = [];
  if(subItem.children) {
    for (let childName in subItem.children)
      result.push(subItem.children[childName])
    return result.map(item => {
      return <Route key={item.key} path={item.url} component={item.components}/>
    })
  }
};

/**
 * 整个项目的路由配置，配置在项目入口可使每个页面可以单独进入
 * @type {DOM}
 */
const ClientRoute = (
  <Route path={menuIndexUrl} component={requireAuthentication(Main)}>
    {menu.map(item =>
      item.subMenu ? item.subMenu.map(subItem =>
        <Route key={subItem.key} path={subItem.url} component={subItem.components}>
          {renderSubItem(subItem)}
        </Route>
      ) :
        <Route key={item.key} path={item.url} component={item.components}/>)
    }
  </Route>
);

function getChildrenList(){
  let result = [];
  menu.map(item => {
    item.subMenu ? item.subMenu.map(subItem => {
      if (subItem.children) {
        for (let child in subItem.children)
          result.push(subItem.children[child])
      }
    }) : {};
  });
  return result;
}

/**
 * 首页菜单的路由配置，配置后台主要的路由层级
 * @type {Array}
 */
const MainRoute = getMenuList().concat(getChildrenList(menu)).map(item =>
    <Route key={item.key} path={item.url} component={item.components}/>);

function getMenuList(){
  let result = [];
  menu.map(item => {
    item.subMenu ? result = result.concat(item.subMenu) : result = result.concat(item)
  });
  return result;
}

/**
 * 根据传入的值和值名称查找菜单项
 * @param attr    值
 * @param attrName    值名称
 * @return {*}    菜单项
 */
function getMenuItemByAttr(attr, attrName){
  let current = null;
  this.menu.map(menuItem => {
    if(menuItem[attrName] === attr)
      current = menuItem;
    else{
      if(menuItem.subMenu){
        menuItem.subMenu.map(subMenuItem => {
          if(subMenuItem[attrName] === attr)
            current = subMenuItem;
          if(subMenuItem.children){
            for (let child in subMenuItem.children)
              if(subMenuItem.children[child][attrName] === attr)
                current = subMenuItem;
          }
        })
      }
    }
  });
  return current;
}

/**
 * 更新当前页面currentPage到Redux
 */
const updateCurrentPage = () => {
  let path = location.pathname;
  let nowCurrent = [];
  let sections = path.split('/');
  sections.splice(0, 1);
  sections.map(section => {
    let routeItem = menuRoute.getRouteItem(section, 'key');
    routeItem !== null && nowCurrent.push(routeItem);
  });
  configureStore.store.dispatch(setCurrentPage(nowCurrent))
};

/**
 * 根据传入的值和值名称查找页面项（包括children在内的）
 * @param attr    值
 * @param attrName    值名称
 * @return {*}    页面项
 */
function getRouteItem(attr, attrName){
  let current = null;
  this.menu.map(menuItem => {
    if(menuItem[attrName] === attr)
      current = menuItem;
    else{
      if(menuItem.subMenu){
        menuItem.subMenu.map(subMenuItem => {
          if(subMenuItem[attrName] === attr)
            current = subMenuItem;
          if(subMenuItem.children){
            for(let childName in subMenuItem.children){
              if(subMenuItem.children[childName][attrName] === attr)
                current = subMenuItem.children[childName]
            }
          }
        })
      }
    }
  });
  return current;
}

const menuRoute = {
  indexUrl: menuIndexUrl,
  ClientRoute: ClientRoute,
  MainRoute: <Router history={browserHistory} onUpdate={updateCurrentPage}>{MainRoute}</Router>,
  menu: menu,
  getMenuItemByAttr: getMenuItemByAttr,
  getRouteItem: getRouteItem
};

export default menuRoute
