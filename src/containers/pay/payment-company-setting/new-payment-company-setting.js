/**
 * Created by 13576 on 2017/11/25.
 */
import React from 'react'
import {connect} from 'react-redux'
import {injectIntl} from 'react-intl'
class NewPaymentCompanySetting extends React.Component{
  constructor(props){
    super(props);
    this.state({

    })
  }

  render(){
    <div className="new-payment-company-setting">
      new-payment-company-setting
    </div>
  }
}

function mapStateToProps() {

}
export default connect(mapStateToProps)(injectIntl(NewPaymentCompanySetting))
