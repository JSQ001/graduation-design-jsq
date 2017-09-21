import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

class BudgetJournalType extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render(){
    return (
      <div>
        预算日记账类型定义
      </div>
    )
  }

}

function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps)(injectIntl(BudgetJournalType));
