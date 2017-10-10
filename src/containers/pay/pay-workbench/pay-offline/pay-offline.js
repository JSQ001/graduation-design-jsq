import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

class PayOffline extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render(){
    return (
      <div className="pay-offline">
        线下
      </div>
    )
  }

}

function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps)(injectIntl(PayOffline));
