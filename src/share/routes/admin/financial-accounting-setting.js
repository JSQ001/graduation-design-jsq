import SectionStructure from 'containers/financial-accounting-setting/section-structure/section-structure'

//科目段结构
const sectionStructure = {
  key: 'section-structure',
  url: '/main/financial-accounting-setting/section-structure',
  components: SectionStructure,
  parent: 'financial-accounting-setting',
  children: {}
};

//财务核算设置
const financialAccountingSetting = {
  key:'financial-accounting-setting',
  subMenu: [sectionStructure],
  icon: 'setting',
  admin: true
};

export default financialAccountingSetting
