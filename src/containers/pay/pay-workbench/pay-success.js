import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

class PaySuccess extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render(){
    const {  } = this.state;
    return (
      <div className="pay-success">
        成功
      </div>
    )
  }

}

function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps)(injectIntl(PaySuccess));
