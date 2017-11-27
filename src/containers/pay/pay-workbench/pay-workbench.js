import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'

import { Tabs } from 'antd'
const TabPane = Tabs.TabPane;

import PayUnpaid from 'containers/pay/pay-workbench/pay-unpaid'
import PayPaying from 'containers/pay/pay-workbench/pay-paying'
import PayFail from 'containers/pay/pay-workbench/pay-fail'
import PaySuccess from 'containers/pay/pay-workbench/pay-success'

import 'styles/pay/pay-workbench/pay-workbench.scss'

class PayWorkbench extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  handleModeChange = (e) => {
    const nowStatus = e.target.value;
    this.setState({ nowStatus });
  };

  renderContent = () => {
    let content = null;
    switch (this.state.nowStatus){
      case '线上':
        content = PayOnline;
        break;
      case '线下':
        content = PayOffline;
        break;
      case '落地文件':
        content = PayFile;
        break;
    }
    return React.createElement(content, Object.assign({}, this.props.params, {organization: this.props.organization}));
  };

  render(){
    return (
      <div className="pay-workbench">
        <Tabs defaultActiveKey="1">
          <TabPane tab="未付款" key="Unpaid">
            <PayUnpaid/>
          </TabPane>
          <TabPane tab="支付中" key="Paying">
            <PayPaying/>
          </TabPane>
          <TabPane tab="退票或失败" key="Fail">
            <PayFail/>
          </TabPane>
          <TabPane tab="支付成功" key="Success">
            <PaySuccess/>
          </TabPane>
        </Tabs>

        {/*<Radio.Group onChange={this.handleModeChange} value={nowStatus} style={{marginBottom:'20px'}}>*/}
          {/*<Radio.Button value="线上">线上</Radio.Button>*/}
          {/*<Radio.Button value="线下">线下</Radio.Button>*/}
          {/*<Radio.Button value="落地文件">落地文件</Radio.Button>*/}
        {/*</Radio.Group>*/}
        {/*{this.renderContent()}*/}
      </div>
    )
  }

}

function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps)(injectIntl(PayWorkbench));
