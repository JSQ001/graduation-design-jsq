/**
 *  created by jsq on 2017/9/20
 */
import React from 'react';
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import httpFetch from 'share/httpFetch';
import config from 'config'

import { Form,} from 'antd'


import 'styles/budget/budget-organization/budget-structure/budget-structure-detail.scss';

class BudgetStructureDetail extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      loading: true,

    }
  }
  render(){
    return(
      <div className="budget-structure-detail">
        fdaadfs
      </div>
    )
  }

}

function mapStateToProps(state) {
  return {
    organization: state.budget.organization
  }
}

const WrappedBudgetStructureDetail = Form.create()(BudgetStructureDetail);

export default connect(mapStateToProps)(injectIntl(WrappedBudgetStructureDetail));
