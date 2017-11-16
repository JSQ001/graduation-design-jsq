import React from 'react'
import { injectIntl } from 'react-intl'
import { Form } from 'antd'

class ContractDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    return (
      <div className="contract-detail">
        合同详情
      </div>
    )
  }
}

const wrappedContractDetail = Form.create()(injectIntl(ContractDetail));

export default wrappedContractDetail;
