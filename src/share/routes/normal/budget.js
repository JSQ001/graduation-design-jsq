import BudgetJournal from 'containers/budget/budget-journal/budget-journal'
import NewBudgetJournal from 'containers/budget/budget-journal/new-budget-journal'
import BudgetJournalDetail from 'containers/budget/budget-journal/budget-journal-detail'

import BudgetBalance from 'containers/budget/budget-balance/budget-balance'
import BudgetBalanceResult from 'containers/budget/budget-balance/budget-balance-result'

//新建预算日记账
const newBudgetJournal={
  key:'new-budget-journal',
  url:'/main/budget/budget-journal/new-budget-journal',
  components:NewBudgetJournal,
  parent: 'budgetJournal',
};

//预算日记账详情
const budgetJournalDetail={
  key:'budget-journal-detail',
  url:'/main/budget/budget-journal/budget-journal-detail/:journalCode',
  components:BudgetJournalDetail,
  parent: 'budgetJournal',
};

//预算日记账
const budgetJournal = {
  key:'budget-journal',
  url:'/main/budget/budget-journal',
  components: BudgetJournal,
  parent: 'budget',
  children: {newBudgetJournal,budgetJournalDetail}
};


const budgetBalanceResult = {
  key: 'budget-balance-result',
  url:'/main/budget/budget-balance/budget-balance-result/:id',
  components: BudgetBalanceResult,
  parent: 'budget-balance'
};


//预算余额
const budgetBalance = {
  key: 'budget-balance',
  url:'/main/budget/budget-balance',
  components: BudgetBalance,
  parent: 'budget',
  children: {
    budgetBalanceResult
  }
};

//预算
const budget = {
  key:'budget',
  subMenu: [budgetJournal, budgetBalance],
  icon: 'tags'
};

export default budget
