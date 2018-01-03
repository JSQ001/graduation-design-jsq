import BankDefinition from 'containers/basic-data/bank-definition/bank-definition'

//基础数据
const basicData = {
  key:'basic-data',
  icon: 'setting',
  admin: true,
  subMenu: [
    //银行定义
    {
      key:'bank-definition',
      url:'/main/basic-data/bank-definition',
      components: BankDefinition ,
      parent: 'basic-data',
    }
  ]
};

export default basicData
