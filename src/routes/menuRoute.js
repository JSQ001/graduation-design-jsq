/**
 * Created by zaranengap on 2017/8/29.
 */
import React from 'react';
import { Router, Route, browserHistory } from 'react-router'
import configureStore from 'stores';
const menuIndexUrl = '/main/person-info';
import {setCurrentPage} from 'actions/main'
import requireAuthentication from 'components/method/requireAuthentication'
import Main from 'containers/main'
import Login from 'containers/login'
import Register from 'containers/register'
import UserCenter from 'containers/user-center/user-center'
import Admin from 'containers/admin/admin'
import Project from 'containers/user-center/project'
import UserInfo from 'containers/user-info/user-info'
import PersonInfo from 'containers/person-info/person-info'
import TitleCenter from 'containers/title-center/title-center'
import CourseCenter from 'containers/course-center/course-center'
import DepartmentManage from 'containers/department-manage/department-manage'
import DepartmentManageDetail from 'containers/department-manage/department-manage-detail'
import Major from 'containers/department-manage/major'
import TitleDetail from 'containers/title-center/title-detail'
import CourseDetail from 'containers/course-center/course-class'

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
//个人信息
  const personInfo = {
    key: 'person-info',
    url: '/main/person-info',
    components: PersonInfo,
    icon: 'man',
  };

//注册
const register  = {
  key:'register',
  url:'/main/register',
  components: Register,
  parent: 'main',
};

//退出页面
const logout = {
  key: 'logout',
  url:'/logout',
  components: Login
};

//主页面
const userCenter = {
  key: 'user-center',
  url: '/main/user-center',
  components: UserCenter,
  parent: 'main',
  role: 'admin'
};

//用户信息
const userInfo = {
  key: 'user-info',
  url: '/main/user-info',
  components: UserInfo,
  parent: 'main',
  role: 'admin'
};

//题库中心
const titleCenter = {
  key: 'title-center',
  url: '/main/teacher-info',
  components: TitleCenter,
  parent: 'main',
  role: 'teacher',
  children: {
    titleDetail:{
      key: 'title-center-detail',
      url: '/main/title-center/title-center-detail/:id',
      components: TitleDetail,
      parents: 'title-center',
      role: 'teacher'
    }
  }
};

//系部管理
const departmentManage = {
  key: 'department-manage',
  url: '/main/department-manage',
  components: DepartmentManage,
  parents: 'department-manage',
  role: 'admin',
  subMenu:[
    {
      key: 'dept-info',
      url: '/main/department-manage/dept-info',
      components: DepartmentManage,
      parents: 'department-manage',
      role: 'admin',
    },
    {
      key: 'major-info',
      url:'/main/department-manage/major-info',
      components: Major,
      parents: 'department-manage',
      role: 'admin',
    },
    {
      key: 'department-manage-detail',
      url: '/main/department-manage/department-manage-detail',
      components: DepartmentManageDetail,
      parents: 'department-manage',
      role: 'admin',
    },
  ],
};

//课程中心
const courseCenter = {
  key: 'course-center',
  url: '/main/course-center',
  components: CourseCenter,
  parents: '/main',
  role: 'teacher',
  children: {
    courseDetail:{
      key: 'course-detail',
      url: '/main/course-center/course-detail/:id',
      components: CourseDetail,
      parents: 'course-center',
      role: 'teacher'
    }
  }
};

const menu = [
  personInfo,   //个人信息
  userInfo,  //用户中心
  titleCenter,  //题库中心
  departmentManage, //系部管理
  courseCenter,  //课程中心
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


function getChildrenList(){
  let result = [];
  menu.map(item => {
    item.subMenu ? item.subMenu.map(subItem => {
      if (subItem.children) {
        for (let child in subItem.children)
          result.push(subItem.children[child])
      }
    }) : {}
    if (item.children) {
      for (let child in item.children)
        result.push(item.children[child])
    }

  });
  return result;
}


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
        <Route key={item.key} path={item.url} component={item.components}>
          {renderSubItem(item)}
        </Route>
    )
    }
  </Route>
);


/**
 * 首页菜单的路由配置，配置后台主要的路由层级
 * @type {Array}
 */
const MainRoute =getMenuList().concat(getChildrenList(menu)).map(item =>{
    return <Route key={item.key} path={item.url} component={item.components}/>
  }
);

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
    }
    else{
      if (menuItem.children) {
        for (let childName in menuItem.children) {
          if (menuItem.children[childName][attrName] === attr)
            current = menuItem.children[childName]
        }
      }else
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
  //adminIndexUrl: menuAdminIndexUrl,
  ClientRoute: ClientRoute,
  MainRoute: <Router history={browserHistory} onUpdate={updateCurrentPage}>{MainRoute}</Router>,
  menu: menu,
  getMenuItemByAttr: getMenuItemByAttr,
  getRouteItem: getRouteItem
};
export default menuRoute
