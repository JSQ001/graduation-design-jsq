import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

class PayFail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render(){
    const {  } = this.state;
    return (
      <div className="pay-fail">
        失败
      </div>
    )
  }

}

function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps)(injectIntl(PayFail));
