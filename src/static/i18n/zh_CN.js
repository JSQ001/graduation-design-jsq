
const zh_CN = {
  "budget.organizationName": "预算组织名称",
  "budget.organization": "预算组织",
  "budget.structure":"预算表",
  "budget.structureCode": "预算表代码",
  "budget.structureName": "预算表名称",
  "periodStrategy":"编制期段",
  "budget.structureDescription": "预算表描述",
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
  "title.basicInformation": "基本信息",
  "text.edit": "编辑",
  "budget.itemCode": "预算项目代码",
  "budget.itemName": "预算项目名称",
  "budget.itemDescription": "预算项目描述",
  "budget.itemCodeFrom": "预算项目代码从",
  "budget.itemCodeTo": "预算项目代码至",
  "budget.itemType": "预算项目类型",
  "budget.item.variationAttribute": "变动属性",
};

import common from 'static/i18n/zh_CN/common.json'
import menu from 'static/i18n/zh_CN/menu.json'
import budgetOrganization from 'static/i18n/zh_CN/budget-setting/budget-organization/budget-organization.json'
import login from 'static/i18n/zh_CN/login.json'
import budgetStructure from 'static/i18n/zh_CN/budget-setting/budget-organization/budget-structure.json'
import budgetItem from 'static/i18n/zh_CN/budget-setting/budget-organization/budget-item.json'
import budgetControlRules from 'static/i18n/zh_CN/budget-setting/budget-organization/budget-control-rules.json'
import bankDefinition from 'static/i18n/zh_CN/pay/bank-definition.json'
import payWorkbench from 'static/i18n/zh_CN/pay/pay-workbench.json'
import budgetVersion from 'static/i18n/zh_CN/budget-setting/budget-organization/budget-version.json'
import budgetItemType from  'static/i18n/zh_CN/budget-setting/budget-organization/budget-item-type.json'
import budgetJournal from 'static/i18n/zh_CN/budget-journal/budget-journal.json'
import securitySetting from 'static/i18n/zh_CN/setting/security-setting.json'

const i18nList = [
  common,  //公用
  login,  //登录及主界面
  menu,  //菜单
  budgetOrganization, //预算组织
  budgetStructure,  //预算表
  budgetItem,  //预算项目
  budgetControlRules, //预算控制规则
  payWorkbench, //付款工作台
  budgetVersion, //预算版本
  budgetItemType, //预算项目类型
  budgetJournal,  //预算日记账
  bankDefinition, //银行定义
  securitySetting, //安全设置
];

let result = {};

i18nList.map(i18n => {
  result = Object.assign(result, i18n)
});

export default result
