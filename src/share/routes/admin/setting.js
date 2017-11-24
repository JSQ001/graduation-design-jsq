import ValueList from 'containers/setting/value-list/value-list'
import NewValueList from 'containers/setting/value-list/new-value-list'
import SecuritySetting from 'containers/setting/security-setting/security-setting'
import CallbackSetting from  'containers/setting/callback-setting/callback-setting'
import CodingRuleObject from 'containers/setting/coding-rule/coding-rule-object'
import CodingRule from 'containers/setting/coding-rule/coding-rule'
import NewCodingRuleObject from 'containers/setting/coding-rule/new-coding-rule-object'
import NewCodingRule from 'containers/setting/coding-rule/new-coding-rule'
import CodingRuleValue from 'containers/setting/coding-rule/coding-rule-value'
import CompanyMaintain from 'containers/setting/company-maintain/company-maintain'
import NewCompanyMaintain from 'containers/setting/company-maintain/new-company-maintain'
import CompanyMaintainDetail from 'containers/setting/company-maintain/company-maintain-detail'
import NewBankAccount from 'containers/setting/company-maintain/new-bank-account'
import BankAccountDetail from 'containers/setting/company-maintain/bank-account-detail'
import AddAuthorization from 'containers/setting/company-maintain/add-authorization'
import CompanyGroup from 'containers/setting/company-group/company-group'
import NewCompanyGroup from 'containers/setting/company-group/new-company-group'
import CompanyGroupDetail from 'containers/setting/company-group/company-group-detail'
import DepartmentGroup from 'containers/setting/department-group/department-group'
import DepartmentGroupDetail from 'containers/setting/department-group/department-group-detail'
import NewDepartmentGroup from 'containers/setting/department-group/new-department-group'

//新建部门组
const newDepartmentGroup = {
  key: 'new-department-group',
  url: '/main/setting/department-group/new-department-group',
  components: NewDepartmentGroup,
  parent: "department-group"
};

//部门组详情
const departmentGroupDetail = {
  key: 'department-group-detail',
  url: '/main/setting/department-group/department-group-detail/:id',
  components: DepartmentGroupDetail,
  parent: 'department-group'
};

//部门组
const departmentGroup = {
  key: 'department-group',
  url: '/main/setting/department-group',
  components: DepartmentGroup,
  parent: 'setting',
  children: {
    newDepartmentGroup,
    departmentGroupDetail
  }
};

//新建公司组
const newCompanyGroup = {
  key: 'new-company-group',
  url: '/main/setting/company-group/new-company-group',
  components: NewCompanyGroup,
  parent: 'company-group',
};

//公司组详情
const companyGroupDetail = {
  key: 'company-group-detail',
  url: '/main/setting/company-group/company-group-detail/:id',
  components: CompanyGroupDetail,
  parent: 'company-group',
};



//公司组
const companyGroup = {
  key: 'company-group',
  url: '/main/setting/company-group',
  components: CompanyGroup,
  parent: 'setting',
  children: {
    newCompanyGroup,
    companyGroupDetail
  }
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

//安全配置
const securitySetting = {
  key:'security-setting',
  url:'/main/setting/security-setting',
  components: SecuritySetting,
  parent: 'setting',
  children:{}
};

//回调设置
const callbackSetting = {
  key:'callback-setting',
  url:'/main/setting/callback-setting',
  components:CallbackSetting,
  parent: 'setting',
  children:{}
};

//新建编码规则对象
const newCodingRuleObject = {
  key:'new-coding-rule-object',
  url:'/main/setting/coding-rule-object/new-coding-rule-object',
  components: NewCodingRuleObject,
  parent: 'coding-rule-object'
};

//编码规则
const codingRule = {
  key:'coding-rule',
  url:'/main/setting/coding-rule-object/coding-rule/:id',
  components: CodingRule,
  parent: 'coding-rule-object'
};

//新建编码规则
const newCodingRule = {
  key:'new-coding-rule',
  url:'/main/setting/coding-rule-object/coding-rule/:id/new-coding-rule',
  components: NewCodingRule,
  parent: 'coding-rule'
};

//编码规则明细
const codingRuleValue = {
  key:'coding-rule-value',
  url:'/main/setting/coding-rule-object/coding-rule/:id/coding-rule-value/:ruleId',
  components: CodingRuleValue,
  parent: 'coding-rule'
};

//编码规则定义
const codingRuleObject = {
  key:'coding-rule-object',
  url:'/main/setting/coding-rule-object',
  components:CodingRuleObject,
  parent: 'setting',
  children:{
    newCodingRuleObject,
    codingRule,
    codingRuleValue,
    newCodingRule
  }
};

//新建公司
const newCompanyMaintain ={
  key:'new-company-maintain',
  url:'/main/setting/company-maintain/new-company-maintain',
  components:NewCompanyMaintain,
  parent:'company-maintain'
};


//公司维护详情
const companyMaintainDetail ={
  key:'company-maintain-detail',
  url:'/main/setting/company-maintain/company-maintain-detail/:companyOId',
  components:CompanyMaintainDetail,
  parent: 'company-maintain'
};

//新建银行账户
const newBankAccount ={
  key:'new-bank-account',
  url:'/main/setting/company-maintain/new-bank-account',
  components:NewBankAccount,
  parent: 'company-maintain'
};

//银行账户详情
const bankAccountDetail ={
  key:'bank-account-detail',
  url:'/main/setting/company-maintain/bank-account-detail',
  components:BankAccountDetail,
  parent: 'company-maintain'
};

//添加授权
const addAuthorization ={
  key:'add-authorization',
  url:'/main/setting/company-maintain/add-authorization',
  components:AddAuthorization,
  parent: 'company-maintain'
};

//公司维护
const companyMaintain ={
  key:'company-maintain',
  url:'/main/setting/company-maintain',
  components:CompanyMaintain,
  parent: 'setting',
  children:{
    newCompanyMaintain,
    companyMaintainDetail,
    newBankAccount,
    bankAccountDetail,
    addAuthorization
  }
};

//设置
const setting = {
  key:'setting',
  subMenu: [valueList, securitySetting, callbackSetting, codingRuleObject, companyMaintain, companyGroup, departmentGroup],
  icon: 'setting',
  admin: true
};

export default setting
