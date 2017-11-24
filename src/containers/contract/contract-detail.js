import React from 'react'
import { injectIntl } from 'react-intl'
import { Form, Affix, Button } from 'antd'

import ContractDetailCommon from 'containers/contract/contract-detail-common'
import 'styles/contract/contract-detail.scss'

class ContractDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    }
  }


  render() {
    const { loading } = this.state;
    return (
      <div className="contract-detail background-transparent">
        <ContractDetailCommon contractEdit={true}/>
        <Affix offsetBottom={0} className="bottom-bar">
          <Button type="primary" htmlType="submit" loading={loading} style={{margin:'0 20px'}}>提 交</Button>
          <Button>保 存</Button>
          <Button style={{marginLeft:'50px'}}>删除该合同</Button>
          <Button style={{marginLeft:'20px'}}>返 回</Button>
        </Affix>
      </div>
    )
  }
}

const wrappedContractDetail = Form.create()(injectIntl(ContractDetail));

export default wrappedContractDetail;
