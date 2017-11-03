import common from 'static/i18n/zh_CN/common.json'
import menu from 'static/i18n/zh_CN/menu.json'
import budgetOrganization from 'static/i18n/zh_CN/budget-setting/budget-organization/budget-organization.json'
import login from 'static/i18n/zh_CN/login.json'
import budgetStructure from 'static/i18n/zh_CN/budget-setting/budget-organization/budget-structure.json'
import budgetItem from 'static/i18n/zh_CN/budget-setting/budget-organization/budget-item.json'
import budgetControlRules from 'static/i18n/zh_CN/budget-setting/budget-organization/budget-control-rules.json'
import payWorkbench from 'static/i18n/zh_CN/pay/pay-workbench.json'
import budgetVersion from 'static/i18n/zh_CN/budget-setting/budget-organization/budget-version.json'
import budgetItemType from 'static/i18n/zh_CN/budget-setting/budget-organization/budget-item-type.json'
import budgetJournal from 'static/i18n/zh_CN/budget-journal/budget-journal.json'
import agencySetting from 'static/i18n/zh_CN/approve-setting/agency-setting.json'
import bankDefinition from 'static/i18n/zh_CN/pay/bank-definition.json'
import securitySetting from 'static/i18n/zh_CN/setting/security-setting.json'
import accountPeriodDefine from 'static/i18n/zh_CN/finance-setting/account-period-define.json'
import accountPeriodControl from 'static/i18n/zh_CN/finance-setting/account-period-control.json'
import companyMaintain from 'static/i18n/zh_CN/setting/company-maintain.json'


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
  agencySetting, //代理设置
  securitySetting, //安全设置
  accountPeriodDefine, //会计期间定义
  accountPeriodControl, //会计期间控制
  companyMaintain     //公司维护


];

let result = {};

i18nList.map(i18n => {
  result = Object.assign(result, i18n)
});

export default result
