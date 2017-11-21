import React from 'react'
import { injectIntl } from 'react-intl'
import { Form } from 'antd'

class ApproveContract extends React.Component{
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    return (
      <div className="approve-contract">
         合同
      </div>
    )
  }
}

const wrappedApproveContract = Form.create()(injectIntl(ApproveContract));

export default wrappedApproveContract


