import React from 'react'
import { connect } from 'react-redux'

import { Form } from 'antd'

class NewBudgetStrategyDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return (
      <div className="new-budget-strategy-detail">
        这是新建控制策略详情的页面
      </div>
    )
  }
}

function mapStateToProps() {
  return {}
}

const WrappedNewBudgetStrategyDetail = Form.create()(NewBudgetStrategyDetail);

export default connect(mapStateToProps)(WrappedNewBudgetStrategyDetail);
