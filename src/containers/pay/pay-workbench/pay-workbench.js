import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

import { Radio } from 'antd';

import PayOnline from 'containers/pay/pay-workbench/pay-online'
import PayOffline from 'containers/pay/pay-workbench/pay-offline'
import PayFile from 'containers/pay/pay-workbench/pay-file'

import 'styles/pay/pay-workbench/pay-workbench.scss'

class PayWorkbench extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nowStatus: '线上',
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
    const { nowStatus } = this.state;
    return (
      <div className="pay-workbench">
        <Radio.Group onChange={this.handleModeChange} value={nowStatus} style={{marginBottom:'20px'}}>
          <Radio.Button value="线上">线上</Radio.Button>
          <Radio.Button value="线下">线下</Radio.Button>
          <Radio.Button value="落地文件">落地文件</Radio.Button>
        </Radio.Group>
        {this.renderContent()}
      </div>
    )
  }

}

function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps)(injectIntl(PayWorkbench));
