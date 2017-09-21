import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

class BudgetJournal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render(){
    return (
      <div>
        预算日记账
      </div>
    )
  }

}

function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps)(injectIntl(BudgetJournal));
