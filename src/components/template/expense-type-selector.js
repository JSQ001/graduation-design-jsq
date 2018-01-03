import React from 'react'
import { injectIntl } from 'react-intl'
import { Form, Radio, Select } from 'antd'
import 'styles/components/expense-type-selector.scss'

class ExpenseTypeSelector extends React.Component{
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentWillMount(){
    
  }

  render() {
    return (
      <div className="expense-type-selector">
        expense-selector
      </div>
    )
  }
}


export default ExpenseTypeSelector;
