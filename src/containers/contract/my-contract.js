import React from 'react'
import { injectIntl } from 'react-intl'
import { Form } from 'antd'

class MyContract extends React.Component{
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    return (
      <div className="my-contract">
        合同
      </div>
    )
  }
}

const wrappedMyContract = Form.create()(injectIntl(MyContract));

export default wrappedMyContract
