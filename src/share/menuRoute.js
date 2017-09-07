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
import EditReport from 'containers/expense-report/edit-report'
import MyAccount from 'containers/expense-report/my-account'
import {setCurrentPage} from 'actions/main'

import configureStore from 'stores';

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

//编辑报销单
const editReport = {
  key: 'edit-report',
  url:'/main/expense-report/edit-report',
  components:EditReport,
  parent:'expense-report'
};

//仪表盘
const dashboard = {
  key:'dashboard',
  url: menuIndexUrl,
  components: Dashboard
};

//财务管理
const financialManagement = {
  key:'financial-management',
  subMenu: [confirmPayment]
};

//设置
const setting = {
  key:'setting',
  subMenu: [valueList]
};

//报销单
const expenseReport = {
  key: 'expense-report',
  subMenu: [myAccount,editReport]
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
  expenseReport
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
