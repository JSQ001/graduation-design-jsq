import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

class NewBudgetOrganization extends React.Component {
  constructor(props) {
    super(props);
  }

  render(){
    return (
      <div>
        新建
      </div>
    )
  }

}

function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps)(injectIntl(NewBudgetOrganization));
