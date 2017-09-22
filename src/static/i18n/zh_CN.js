
const zh_CN = {
  "budget.organizationName": "预算组织名称",
  "budget.organization": "预算组织",
  "budget.structure":"预算表",
  "budget.structureCode": "预算表代码",
  "budget.structureName": "预算表名称",
  "periodStrategy":"编制期段",
  "budget.structureDescription": "预算表描述",
  "menu.budget-structure-detail": "预算表详情",
  "dimensionCode": "维度代码",
  "description": "描述",
  "layoutPosition": "布局位置",
  "layoutPriority": "布局顺序",
  "defaultDimValueCode": "默认维值",
  "prompting.sobOrganization": "请维护当前账套下的预算组织。",
  "prompting.saveSuccess": "保存成功！",
  "periodStrategy.month": "月度",
  "periodStrategy.quarter": "季度",
  "periodStrategy.year": "年度",
  "validator.organizationCode.exist": "该预算表代码已存在",
  "dimension.distribute": "维度分配",
  "company.distribute": "公司分配",
  "structure.validator.periodStrategy": "该预算表已被预算日记账引用，不允许修改编制期段。",
  "title.basicInformation": "基本信息"
};

import common from 'static/i18n/zh_CN/common.json'
import menu from 'static/i18n/zh_CN/menu.json'
import budgetOrganization from 'static/i18n/zh_CN/budget-setting/budget-organization.json'
import login from 'static/i18n/zh_CN/login.json'

const i18nList = [
  common,  //公用
  login,  //登录及主界面
  menu,  //菜单
  budgetOrganization  //预算组织
];

let result = {};

i18nList.map(i18n => {
  result = Object.assign(result, i18n)
});

console.log(result);

export default result
