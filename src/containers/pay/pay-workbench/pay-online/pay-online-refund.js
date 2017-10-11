import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

class PayOnlineRefund extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render(){
    return (
      <div className="pay-online-refund">
        退款
      </div>
    )
  }

}

function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps)(injectIntl(PayOnlineRefund));
