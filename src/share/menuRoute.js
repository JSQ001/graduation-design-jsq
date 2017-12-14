/**
 * Created by zaranengap on 2017/8/29.
 */
import React from 'react';
import { Router, Route, browserHistory } from 'react-router'

import Main from 'containers/main'
import requireAuthentication from 'components/requireAuthentication'

import configureStore from 'stores';
import {setCurrentPage} from 'actions/main'

const menuIndexUrl = '/main/dashboard';
const menuAdminIndexUrl = '/main/dashboard-admin';

//非管理员模式下菜单
import dashboard from 'share/routes/normal/dashboard'  //仪表盘
import myAccount from 'share/routes/normal/my-account'  //我的账本
import expenseReport from 'share/routes/normal/expense-report'  //报销单
import request from 'share/routes/normal/request'  //申请单
import financialManagement from 'share/routes/normal/finacial-management'  //财务管理
import budget from 'share/routes/normal/budget'  //预算
import pay from 'share/routes/normal/pay'  //支付
import contract from 'share/routes/normal/contract'  //合同
import approve from 'share/routes/normal/approve'  //审批
import prePayment from 'share/routes/normal/pre-payment'  //预付款

//管理员模式下菜单
import dashboardAdmin from 'share/routes/admin/dashboard-admin'  //管理员仪表盘
import setting from 'share/routes/admin/setting'  //基础设置
import basicData from 'share/routes/admin/basic-data' //基础数据
import budgetSetting from 'share/routes/admin/budget-setting'  //预算设置
import financeSetting from 'share/routes/admin/finance-setting'  //财务设置
import approveSetting from 'share/routes/admin/approve-setting'  //审批设置
import receiptTypeSetting from 'share/routes/admin/receipt-type-setting'  //单据类型设置
import paySetting from  'share/routes/admin/pay-setting' //支付设置


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
  dashboard,  //仪表盘
  myAccount,  //我的账本
  expenseReport,  //报销单
  request,  //申请单
  financialManagement,  //财务管理
  budget,  //预算
  pay,  //支付
  contract, //合同
  prePayment, //预付款
  approve, //审批
  /** 以下是管理员模式下的菜单 **/
  dashboardAdmin,  //管理员仪表盘
  setting,  //基础设置
  budgetSetting,  //预算设置
  financeSetting,  //财务设置
  approveSetting,  //审批设置
  receiptTypeSetting,  //单据类型设置
  basicData,      //基础数据
  paySetting,   //支付设置

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
function getRouteItem(attr, attrName = 'key'){
  let current = null;
  this.menu.map(menuItem => {
    if(menuItem[attrName] === attr) {
      current = menuItem;
      if (menuItem.children) {
        for (let childName in menuItem.children) {
          if (menuItem.children[childName][attrName] === attr)
            current = menuItem.children[childName]
        }
      }
    }
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
  adminIndexUrl: menuAdminIndexUrl,
  ClientRoute: ClientRoute,
  MainRoute: <Router history={browserHistory} onUpdate={updateCurrentPage}>{MainRoute}</Router>,
  menu: menu,
  getMenuItemByAttr: getMenuItemByAttr,
  getRouteItem: getRouteItem
};

export default menuRoute
