import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

import "styles/budget-setting/budget-organization/budget-item/budget-item.scss"

class BudgetItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render(){
    return (
      <div className="budget-item">
        预算项目定义
      </div>
    )
  }

}

function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps)(injectIntl(BudgetItem));
