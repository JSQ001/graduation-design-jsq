import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

class BudgetRule extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render(){
    return (
      <div>
        预算控制规则定义
      </div>
    )
  }


}

function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps)(injectIntl(BudgetRule));
