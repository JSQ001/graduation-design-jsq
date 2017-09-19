import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

class BudgetStructure extends React.Component {
  constructor(props) {
    super(props);
  }

  render(){
    return (
      <div className="budget-structure">
        表{this.props.id}
      </div>
    )
  }

}

function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps)(injectIntl(BudgetStructure));
