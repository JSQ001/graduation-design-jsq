import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import menuRoute from 'share/menuRoute'

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
      payWorkbench:  menuRoute.getRouteItem('pay-workbench','key'),    //付款工作台
    }
  }

  componentWillMount(){
    if(this.props.location.query.tab)
      this.setState({nowStatus: this.props.location.query.tab})
  }

  onChangeTabs = (key) => {
    this.setState({ nowStatus: key }, () => {
      this.context.router.replace(`${this.state.payWorkbench.url}?tab=${this.state.nowStatus}`);
    })
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
    const { tabs, nowStatus } = this.state;
    return (
      <div className="pay-workbench">
        <Tabs onChange={this.onChangeTabs} defaultActiveKey={nowStatus}>
          {tabs.map(tab => {
            return <TabPane tab={tab.name} key={tab.key}/>
          })}
        </Tabs>
        {this.renderContent()}
      </div>
    )
  }

}

PayWorkbench.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps)(injectIntl(PayWorkbench));
