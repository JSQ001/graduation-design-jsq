import ApproveContract from 'containers/approve/contract'
import ApproveContractDetail from 'containers/approve/contract-detail'
import BudgetJournalCheck from 'containers/approve/budget-journl-check/budget-journal-check'
import BudgetJournalCheckDetail from 'containers/approve/budget-journl-check/budget-journal-check-detail'


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

//预算日记账审核详情
const budgetJournalCheckDetail={
  key:'budget-journal-check-detail',
  url:'/main/approve/budget-journal-check/budget-journal-check-detail/:journalCode',
  components:BudgetJournalCheckDetail,
  parent:'budget-journal-check'

}


//预算日记账审核
const budgetJournalCheck = {
  key:'budget-journal-check',
  url:'/main/approve/budget-journal-check',
  components: BudgetJournalCheck,
  parent: 'budget',
  children: {budgetJournalCheckDetail}
};


//审批
const approve = {
  key:'approve',
  subMenu: [contract,budgetJournalCheck],
  icon: 'bars'
};

export default approve
