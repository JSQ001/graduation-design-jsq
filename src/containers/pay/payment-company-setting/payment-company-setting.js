/**
 * Created by 13576 on 2017/11/27.
 */
import React from 'react'
import {connect} from 'react-redux'
import {injectIntl} from 'react-intl'
class PaymentCompanySetting extends React.Component{
  constructor(props){
    super(props);
    this.state({

    })
  }

  render(){
    <div className="payment-company-setting">
      payment-company-setting
    </div>
  }
}

function mapStateToProps() {

}
export default connect(mapStateToProps)(injectIntl(PaymentCompanySetting))
