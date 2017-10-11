import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

class PayFile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render(){
    return (
      <div className="pay-file">
        落地文件
      </div>
    )
  }

}

function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps)(injectIntl(PayFile));
