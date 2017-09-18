import React from 'React'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

class BudgetScenarios extends React.Component {
  constructor(props) {
    super(props);
  }

  render(){
    return (
      <div>
        budget
      </div>
    )
  }

}

function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps)(injectIntl(BudgetScenarios));
