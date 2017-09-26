const en_US = {
  "budget.structure":"Budget structure",
  "budget.structureCode": "Budget structure code",
  "budget.structureName": "Budget structure name",
  "periodStrategy":"Period strategy",
  "budget.structureDescription": "Budget structure description"
};

import common from 'static/i18n/en_US/common.json'
import menu from 'static/i18n/en_US/menu.json'
import budgetOrganization from 'static/i18n/en_US/budget-setting/budget-organization/budget-organization.json'
import login from 'static/i18n/en_US/login.json'
import budgetStructure from 'static/i18n/en_US/budget-setting/budget-organization/budget-organization.json'
import budgetItem from 'static/i18n/en_US/budget-setting/budget-organization/budget-item.json'

const i18nList = [
  common,  //公用
  login,  //登录及主界面
  menu,  //菜单
  budgetOrganization,  //预算组织
  budgetStructure,  //预算表
  budgetItem,   //预算项目

];

let result = {};

i18nList.map(i18n => {
  result = Object.assign(result, i18n)
});

export default result
