import SectionStructure from 'containers/financial-accounting-setting/section-structure/section-structure'
import SectionSetting from 'containers/financial-accounting-setting/section-structure/section-setting'

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
          url: '/main/financial-accounting-setting/section-structure/:id/section-setting',
          components: SectionSetting,
          parent: 'section-structure',
        }
      }
    }
  ]
};

export default financialAccountingSetting
