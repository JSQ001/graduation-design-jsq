import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

class PayOnlinePayment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render(){
    return (
      <div className="pay-online-payment">
        等待付款结果
      </div>
    )
  }

}

function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps)(injectIntl(PayOnlinePayment));
