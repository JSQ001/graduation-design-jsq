/**
 * Created by 13576 on 2017/11/25.
 */
import React from 'react'
import {connect} from 'react-redux'
import {injectIntl} from 'react-intl'
class NewPaymentMethod extends React.Component{
  constructor(props){
    super(props);
    this.state({

    })
  }

  render(){
    <div className="new-payment-method">
        new-payment-method
    </div>
  }
}

function mapStateToProps() {

}
export default connect(mapStateToProps)(injectIntl(NewPaymentMethod))
