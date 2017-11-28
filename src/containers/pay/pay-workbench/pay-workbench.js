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

    }
  }

  render(){
    const {} = this.state;
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
      </div>
    )
  }

}

function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps)(injectIntl(PayWorkbench));
