import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

class PayOnlineFail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render(){
    return (
      <div className="pay-online-fail">
        失败
      </div>
    )
  }

}

function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps)(injectIntl(PayOnlineFail));
