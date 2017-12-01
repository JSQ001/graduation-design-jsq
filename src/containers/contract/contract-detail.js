import React from 'react'
import { injectIntl } from 'react-intl'
import menuRoute from 'share/menuRoute'
import { Form, Affix, Button } from 'antd'

import ContractDetailCommon from 'containers/contract/contract-detail-common'
import 'styles/contract/contract-detail.scss'

class ContractDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      myContract:  menuRoute.getRouteItem('my-contract','key'),    //我的合同
    }
  }

  onCancel = () => {
    this.context.router.push(this.state.myContract.url);
  };

  render() {
    const { loading } = this.state;
    return (
      <div className="contract-detail background-transparent">
        <ContractDetailCommon contractEdit={true} id={this.props.params.id} />
        <Affix offsetBottom={0} className="bottom-bar">
          <Button type="primary" htmlType="submit" loading={loading} style={{margin:'0 20px'}}>提 交</Button>
          <Button>保 存</Button>
          <Button style={{marginLeft:'50px'}}>删除该合同</Button>
          <Button style={{marginLeft:'20px'}} onClick={this.onCancel}>返 回</Button>
        </Affix>
      </div>
    )
  }
}

ContractDetail.contextTypes = {
  router: React.PropTypes.object
};

const wrappedContractDetail = Form.create()(injectIntl(ContractDetail));

export default wrappedContractDetail;
