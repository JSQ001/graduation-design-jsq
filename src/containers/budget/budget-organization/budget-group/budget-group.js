import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

class BudgetGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render(){
    return (
      <div>
        预算项目组定义
      </div>
    )
  }

}

function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps)(injectIntl(BudgetGroup));
