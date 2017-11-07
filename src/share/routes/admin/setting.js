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

};

//新建公司
const newCompanyMaintain ={
  key:'new-company-maintain',
  url:'/main/setting/company-maintain/new-company-maintain',
  components:NewCompanyMaintain,
  parent:'companyMaintain',

}


//公司维护详情
const companyMaintainDetail ={
  key:'company-maintain-detail',
  url:'/main/setting/company-maintain/company-maintain-detail/:companyCode',
  components:CompanyMaintainDetail,
  parent: 'companyMaintain',

}

//公司维护
const companyMaintain ={
  key:'company-maintain',
  url:'/main/setting/company-maintain',
  components:CompanyMaintain,
  parent: 'setting',
  children:{

    newCompanyMaintain,
    companyMaintainDetail,
    newCodingRuleObject,
    codingRule,
    codingRuleValue,
    newCodingRule

  }
}



//设置
const setting = {
  key:'setting',
  subMenu: [valueList, securitySetting, callbackSetting,codingRuleObject, codingRule,companyMaintain],
  icon: 'setting',
  admin: true
};

export default setting
