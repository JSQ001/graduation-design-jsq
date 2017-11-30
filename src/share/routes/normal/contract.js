import MyContract from 'containers/contract/my-contract'
import NewContract from 'containers/contract/new-contract'
import ContractDetail from 'containers/contract/contract-detail'

//新建合同
const newContract = {
  key: 'new-contract',
  url: '/main/contract/my-contract/new-contract',
  components: NewContract,
  parent: 'my-contract'
};

//新建详情
const contractDetail = {
  key: 'contract-detail',
  url: '/main/contract/my-contract/contract-detail/:id',
  components: ContractDetail,
  parent: 'my-contract'
};

//我的合同
const myContract = {
  key:'my-contract',
  url:'/main/contract/my-contract',
  components: MyContract ,
  parent: 'contract',
  children: {
    newContract,
    contractDetail
  }
};

//合同
const contract = {
  key:'contract',
  subMenu: [myContract],
  icon: 'file'
};

export default contract
