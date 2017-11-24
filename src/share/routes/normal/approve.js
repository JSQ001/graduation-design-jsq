import Contract from 'containers/approve/contract'
import ContractDetail from 'containers/approve/contract-detail'

//审批合同
const contractDetail = {
  key:'contract-detail',
  url:'/main/approve/contract/contract-detail',
  components: ContractDetail ,
  parent: 'contract'
};

//合同
const contract = {
  key:'contract',
  url:'/main/approve/contract',
  components: Contract ,
  parent: 'approve',
  children: {
    contractDetail
  }
};

//审批
const approve = {
  key:'approve',
  subMenu: [contract],
  icon: 'bars'
};

export default approve
