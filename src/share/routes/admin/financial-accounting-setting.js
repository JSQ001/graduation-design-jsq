import SectionStructure from 'containers/financial-accounting-setting/section-structure/section-structure'
import SectionSetting from 'containers/financial-accounting-setting/section-structure/section-setting'
import AccountingSource from 'containers/financial-accounting-setting/accounting-source/accounting-source'
import VoucherTemplate from 'containers/financial-accounting-setting/accounting-source/voucher-template'
import AccountingScenariosSystem from 'containers/financial-accounting-setting/accounting-scenarios-system/accounting-scenarios-system'
import AccountingElements from 'containers/financial-accounting-setting/accounting-scenarios-system/accounting-elements'


//科目段设置
const sectionSetting = {
  key: 'section-setting',
  url: '/main/financial-accounting-setting/section-structure/:id/section-setting',
  components: SectionSetting,
  parent: 'section-structure',
};

//科目段结构
const sectionStructure = {
  key: 'section-structure',
  url: '/main/financial-accounting-setting/section-structure',
  components: SectionStructure,
  parent: 'financial-accounting-setting',
  children: {sectionSetting}
};

//凭证模板
const voucherTemplate = {
  key: 'voucher-template',
  url: '/main/financial-accounting-setting/accounting-source/:id/voucher-template',
  components: VoucherTemplate,
  parent: 'section-structure'
};

//核算来源事物
const accountingSource = {
  key: 'accounting-source',
  url: '/main/financial-accounting-setting/accounting-source',
  components: AccountingSource,
  parent: 'financial-accounting-setting',
  children:{voucherTemplate}
};

//核算要素
const accountingElements = {
  key: 'accounting-elements',
  url: '/main/financial-accounting-setting/accounting-scenarios-system/:id/accounting-elements',
  components: AccountingElements,
  parent: 'financial-accounting-setting'
};

//核算场景系统级
const accountingScenariosSystem = {
  key: 'accounting-scenarios-system',
  url: '/main/financial-accounting-setting/accounting-scenarios-system',
  components: AccountingScenariosSystem,
  parent: 'financial-accounting-setting',
  children: {accountingElements}
};

//财务核算设置
const financialAccountingSetting = {
  key:'financial-accounting-setting',
  subMenu: [sectionStructure, accountingSource, accountingScenariosSystem],
  icon: 'setting',
  admin: true
};

export default financialAccountingSetting
