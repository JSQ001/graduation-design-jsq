import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

class PayOnlineSuccess extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render(){
    return (
      <div className="pay-online-success">
        成功
      </div>
    )
  }

}

function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps)(injectIntl(PayOnlineSuccess));
