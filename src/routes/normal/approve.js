import ApproveContract from 'containers/approve/contract/contract'
import ApproveContractDetail from 'containers/approve/contract/contract-detail'
import BudgetJournalCheck from 'containers/approve/budget-journl-check/budget-journal-check'
import BudgetJournalCheckDetail from 'containers/approve/budget-journl-check/budget-journal-check-detail'

//审批
const approve = {
  key:'approve',
  icon: 'bars',
  subMenu: [
    //合同
    {
      key:'approve-contract',
      url:'/main/approve/approve-contract',
      components: ApproveContract ,
      parent: 'approve',
      children: {
        //审批合同
        contractDetail: {
          key:'approve-contract-detail',
          url:'/main/approve/approve-contract/approve-contract-detail/:id',
          components: ApproveContractDetail ,
          parent: 'approve-contract'
        }
      }
    },
    //预算日记账审核
    {
      key:'budget-journal-check',
      url:'/main/approve/budget-journal-check',
      components: BudgetJournalCheck,
      parent: 'budget',
      children: {
        //预算日记账审核详情
        budgetJournalCheckDetail: {
          key:'budget-journal-check-detail',
          url:'/main/approve/budget-journal-check/budget-journal-check-detail/:journalCode',
          components:BudgetJournalCheckDetail,
          parent:'budget-journal-check'

        }
      }
    }]
};

export default approve
