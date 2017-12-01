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
      nowStatus: 'Unpaid',
      tabs: [
        {key: 'Unpaid', name:'未支付'},
        {key: 'Paying', name:'支付中'},
        {key: 'Fail', name:'退票或失败'},
        {key: 'Success', name:'支付成功'}
      ],
    }
  }

  onChangeTabs = (key) => {
    this.setState({ nowStatus: key })
  };

  renderContent = () => {
    let content = null;
    switch (this.state.nowStatus){
      case 'Unpaid':
        content = <PayUnpaid/>;
        break;
      case 'Paying':
        content = <PayPaying/>;
        break;
      case 'Fail':
        content = <PayFail/>;
        break;
      case 'Success':
        content = <PaySuccess/>;
        break;
    }
    return content;
  };

  render(){
    const { tabs } = this.state;
    return (
      <div className="pay-workbench">
        <Tabs onChange={this.onChangeTabs} defaultActiveKey="Unpaid">
          {tabs.map(tab => {
            return <TabPane tab={tab.name} key={tab.key}/>
          })}
        </Tabs>
        {this.renderContent()}
      </div>
    )
  }

}

function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps)(injectIntl(PayWorkbench));
