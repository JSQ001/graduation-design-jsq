import ApproveContract from 'containers/approve/contract'
import ApproveContractDetail from 'containers/approve/contract-detail'

//审批合同
const contractDetail = {
  key:'approve-contract-detail',
  url:'/main/approve/approve-contract/approve-contract-detail/:id',
  components: ApproveContractDetail ,
  parent: 'approve-contract'
};

//合同
const contract = {
  key:'approve-contract',
  url:'/main/approve/approve-contract',
  components: ApproveContract ,
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
