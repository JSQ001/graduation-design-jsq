import MyContract from 'containers/contract/my-contract'

//我的合同
const myContract = {
  key:'my-contract',
  url:'/main/contract/my-contract',
  components: MyContract ,
  parent: 'approve'
};

//合同
const contract = {
  key:'contract',
  subMenu: [myContract],
  icon: 'file'
};

export default contract
