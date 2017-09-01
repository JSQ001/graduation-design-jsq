/**
 * Created by zaranengap on 2017/8/29.
 */
import React from 'react';
import { Router, Route, browserHistory } from 'react-router'

import Main from '../containers/main'
import requireAuthentication from '../components/requireAuthentication'

import Dashboard from '../containers/dashboard'
import ConfirmManagement from '../containers/financial-management/confirm-payment'
import ValueList from '../containers/setting/value-list/value-list'
import NewValueList from '../containers/setting/value-list/new-value-list'

import {setCurrentPage} from 'actions/main'

import configureStore from 'stores';

const menu = [
  {
    name: 'Dashboard',
    key:'dashboard',
    url:'/main/dashboard',
    components: Dashboard
  },
  {
    name: '财务管理',
    key:'financial-management',
    subMenu: [
      {
        name: '确认付款',
        key:'confirm-payment',
        url:'/main/financial-management/confirm-payment',
        components: ConfirmManagement,
        parent: 'financial-management'
      }
    ]
  },
  {
    name: '设置',
    key:'setting',
    subMenu: [
      {
        name: '值列表',
        key:'value-list',
        url:'/main/setting/value-list',
        components: ValueList,
        parent: 'setting',
        children: {
          newValueList: {
            name: '新建值列表',
            key:'new-value-list',
            url:'/main/setting/value-list/new-value-list',
            components: NewValueList,
            parent: 'value-list',
          }
        }
      }
    ]
  },
];


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

let childrenList = getChildrenList(menu);

const renderSubItem = (subItem) => {
  let result = [];
  if(subItem.children) {
    for (let childName in subItem.children)
      result.push(subItem.children[childName])
    return result.map(item =>{
      return <Route key={item.key} path={item.url} component={item.components}/>
    })
  }
};

const ClientRoute = (
  <Route path="/main/dashboard" component={requireAuthentication(Main)}>
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

const MainRoute = getMenuList().concat(childrenList).map(item =>
    <Route key={item.key} path={item.url} component={item.components}/>);

function getMenuList(){
  let result = [];
  menu.map(item => {
    item.subMenu ? result = result.concat(item.subMenu) : result = result.concat(item)
  });
  return result;
}

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
        })
      }
    }
  });
  return current;
}

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
  ClientRoute: ClientRoute,
  MainRoute: <Router history={browserHistory} onUpdate={updateCurrentPage}>{MainRoute}</Router>,
  menu: menu,
  getMenuItemByAttr: getMenuItemByAttr,
  getRouteItem: getRouteItem
};

export default menuRoute
