import SectionStructure from 'containers/financial-accounting-setting/section-structure/section-structure'
import SectionSetting from 'containers/financial-accounting-setting/section-structure/section-setting'
import AccountingSource from 'containers/financial-accounting-setting/accounting-source/accounting-source'
import VoucherTemplate from 'containers/financial-accounting-setting/accounting-source/voucher-template'
import AccountingScenariosSystem from 'containers/financial-accounting-setting/accounting-scenarios-system/accounting-scenarios-system'
import AccountingElements from 'containers/financial-accounting-setting/accounting-scenarios-system/accounting-elements'
import AccountingScenarios from 'containers/financial-accounting-setting/accounting-scenarios/accounting-scenarios'
import MatchingGroupElements from 'containers/financial-accounting-setting/accounting-scenarios/matching-group-elements'
import SubjectMatchingSetting from 'containers/financial-accounting-setting/accounting-scenarios/subject-matching-setting'


//财务核算设置
const financialAccountingSetting = {
  key:'financial-accounting-setting',
  icon: 'setting',
  admin: true,
  subMenu: [
    //科目段结构
    {
      key: 'section-structure',
      url: '/main/financial-accounting-setting/section-structure',
      components: SectionStructure,
      parent: 'financial-accounting-setting',
      children: {
        //科目段设置
        sectionSetting: {
          key: 'section-setting',
          url: '/main/financial-accounting-setting/section-structure/section-setting/:id',
          components: SectionSetting,
          parent: 'section-structure',
        }
      }
    },
    //核算来源事务
    {
      key: 'accounting-source',
      url: '/main/financial-accounting-setting/accounting-source',
      components: AccountingSource,
      parent: 'financial-accounting-setting',
      children:{
        //凭证模板
        voucherTemplate:{
          key: 'voucher-template',
          url: '/main/financial-accounting-setting/accounting-source/voucher-template/:id',
          components: VoucherTemplate,
          parent: 'section-structure'
        }
      }
    },
    //核算场景系统级
    {
      key: 'accounting-scenarios-system',
      url: '/main/financial-accounting-setting/accounting-scenarios-system',
      components: AccountingScenariosSystem,
      parent: 'financial-accounting-setting',
      children: {
        //核算要素
        accountingElements:{
          key: 'accounting-elements',
          url: '/main/financial-accounting-setting/accounting-scenarios-system/accounting-elements/:id',
          components: AccountingElements,
          parent: 'financial-accounting-setting'
        }
      }
    },
    //核算场景账套级
    {
      key: 'accounting-scenarios',
      url: '/main/financial-accounting-setting/accounting-scenarios',
      components: AccountingScenarios,
      parent: 'financial-accounting-setting',
      children:{
        //配置组与核算要素
        matchingGroupElements:{
          key: 'matching-group-elements',
          url: '/main/financial-accounting-setting/accounting-scenarios/matching-group-elements/:id',
          components: MatchingGroupElements,
          parent: 'accounting-scenarios',

        },
        //科目匹配设置
        subjectMatchingSetting:{
          key: 'subject-matching-setting',
          url: '/main/financial-accounting-setting/accounting-scenarios/:id/matching-group-elements/subject-matching-setting/:groupId',
          components: SubjectMatchingSetting,
          parents: 'accounting-scenarios'

        }
      }
    }
  ]
};

export default financialAccountingSetting
