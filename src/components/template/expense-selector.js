import React from 'react'
import { injectIntl } from 'react-intl'
import { Form, Radio, Select } from 'antd'
import 'styles/components/expense-selector.scss'

class ExpenseSelector extends React.Component{
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentWillMount(){

  }

  render() {
    return (
      <div className="expense-selector">
        expense-selector
      </div>
    )
  }
}

const wrappedExpenseSelector = Form.create()(injectIntl(ExpenseSelector));

export default wrappedExpenseSelector;
