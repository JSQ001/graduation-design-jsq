import React from 'react'
import { injectIntl } from 'react-intl'
import { Form, Menu, Button } from 'antd'

class ContractDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 'contractInfo',
    }
  }

  render() {
    const { current } = this.state;
    let contractContainer;
    if (current === 'contractInfo') {
      contractContainer = (
        <div>
          <div className="contract-header">
            <h3 className="header-title">审计咨询合同 非摊销类
              <Button type="primary" style={{float:'right'}}>编辑</Button>
            </h3>
          </div>
        </div>
      )
    } else if (current === 'contractHistory') {
      contractContainer = (
        <div>合同历史</div>
      )
    }
    return (
      <div className="contract-detail">
        <Menu onClick={(e) => {this.setState({ current: e.key })}}
              selectedKeys={[this.state.current]}
              style={{marginBottom:'20px'}}
              mode="horizontal">
          <Menu.Item key="contractInfo">合同信息</Menu.Item>
          <Menu.Item key="contractHistory">合同历史</Menu.Item>
        </Menu>
        {contractContainer}
      </div>
    )
  }
}

const wrappedContractDetail = Form.create()(injectIntl(ContractDetail));

export default wrappedContractDetail;
