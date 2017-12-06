import BankDefinition from 'containers/basic-data/bank-definition/bank-definition'

//银行定义
const bankDefinition = {
  key:'bank-definition',
  url:'/main/basic-data/bank-definition',
  components: BankDefinition ,
  parent: 'basic-data',
};

//基础数据
const basicData = {
  key:'basic-data',
  subMenu: [bankDefinition],
  icon: 'setting',
  admin: true
};

export default basicData
