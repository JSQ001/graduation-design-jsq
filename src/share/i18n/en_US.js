import common from 'static/i18n/en_US/common.json'
import menu from 'static/i18n/en_US/menu.json'
import budgetOrganization from 'static/i18n/en_US/budget-setting/budget-organization/budget-organization.json'
import login from 'static/i18n/en_US/login.json'
import budgetStructure from 'static/i18n/en_US/budget-setting/budget-organization/budget-organization.json'
import budgetItem from 'static/i18n/en_US/budget-setting/budget-organization/budget-item.json'
import budgetControlRules from 'static/i18n/en_US/budget-setting/budget-organization/budget-control-rules.json'
import payWorkbench from 'static/i18n/en_US/pay/pay-workbench.json'
import budgetVersion from 'static/i18n/en_US/budget-setting/budget-organization/budget-version.json'
import budgetItemType from 'static/i18n/en_US/budget-setting/budget-organization/budget-item-type.json'
import budgetJournal from 'static/i18n/en_US/budget-journal/budget-journal.json'
import bankDefinition from 'static/i18n/en_US/pay/bank-definition.json'
import agencySetting from 'static/i18n/en_US/approve-setting/agency-setting.json'
import securitySetting from 'static/i18n/en_US/setting/security-setting.json'
import accountPeriodDefine from 'static/i18n/en_US/finance-setting/account-period-define.json'
import accountPeriodControl from 'static/i18n/en_US/finance-setting/account-period-control.json'
import companyMaintain from 'static/i18n/en_US/setting/company-maintain.json'
import financeView from 'static/i18n/en_US/financial-management/finance-view.json'



const i18nList = [
  common,  //公用
  login,  //登录及主界面
  menu,  //菜单
  budgetOrganization,  //预算组织
  budgetStructure,  //预算表
  budgetItem,   //预算项目
  budgetControlRules, //预算控制规则
  payWorkbench, //付款工作台
  budgetVersion, //预算版本
  budgetItemType, //预算项目类型
  budgetJournal,   //预算日记账
  bankDefinition, //银行定义
  agencySetting, //代理设置
  securitySetting, //安全配置
  accountPeriodDefine, //会计期间定义
  accountPeriodControl, //会计期间控制
  companyMaintain, //公司维护
  financeView //单据查看

];

let result = {};

i18nList.map(i18n => {
  result = Object.assign(result, i18n)
});

export default result
