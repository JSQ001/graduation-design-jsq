import ApproveContract from 'containers/approve/approve-contract'

//合同
const approveContract = {
  key:'approve-contract',
  url:'/main/approve/approve-contract',
  components: ApproveContract ,
  parent: 'approve'
};

//审批
const approve = {
  key:'approve',
  subMenu: [approveContract],
  icon: 'bars'
};

export default approve
