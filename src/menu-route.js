/**
 * Created by zaranengap on 2017/8/29.
 */
import React from 'react';
import { Router, Route, browserHistory } from 'react-router'

import Main from './containers/main'
import requireAuthentication from './components/requireAuthentication'

import Dashboard from './containers/dashboard'
import ConfirmManagement from './containers/financial-management/confirm-payment'
import ValueList from './containers/setting/value-list'

const menu = [
  {name: 'Dashboard', key:'dashboard', url:'/main', components: Dashboard},
  {name: '财务管理', key:'financial-management',
    subMenu: [{name: '确认付款', key:'confirm-payment', url:'/main/financial-management/confirm-payment', components: ConfirmManagement, parent: 'financial-management'}]},
  {name: '设置', key:'setting',
    subMenu: [{name: '值列表', key:'value-list', url:'/main/setting/value-list', components: ValueList, parent: 'setting'}]},
];

const ClientRoute = (
  <Route path="/main" component={requireAuthentication(Main)}>
    {menu.map(item =>
      item.subMenu ? item.subMenu.map(subItem =>
        <Route key={subItem.key} path={subItem.url} component={subItem.components}/>
      ) :
        <Route key={item.key} path={item.url} component={item.components}/>)
    }
  </Route>
);

const MainRoute = getMenuList().map(item =>
    <Route key={item.key} path={item.url} component={item.components}/>);

function getMenuList(){
  let result = [];
  menu.map(item => {
    item.subMenu ? result = result.concat(item.subMenu) : result = result.concat(item)
  });
  return result;
}


export default {
  ClientRoute: ClientRoute,
  menu: menu,
  MainRoute: (
    <Router history={browserHistory}>
      {MainRoute}
    </Router>
  )
}
