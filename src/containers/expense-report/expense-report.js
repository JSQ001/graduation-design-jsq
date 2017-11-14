/**
 * Created by zaranengap on 2017/11/14
 */
import React  from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import httpFetch from 'share/httpFetch'
import config from 'config'

import Chooser from 'components/chooser'

class ExpenseReport extends React.Component{
  constructor(props){
    super(props);
    this.state = {
    }
  }

  componentWillMount(){

  }

  render(){
    return(
      <div>
        <h3 className="header-title">报销单</h3>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {}
}

export default connect(mapStateToProps)(injectIntl(ExpenseReport));
