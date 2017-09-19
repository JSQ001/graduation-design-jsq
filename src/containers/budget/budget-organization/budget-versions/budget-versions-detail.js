/**
 * Created by 13576 on 2017/9/18.
 */
import React from 'React'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import config from 'config'
import 'styles/budget/budget-versions/budget-versions-detail.scss'


class BudgetVersionsDetail extends React.Component {

  constructor(props) {
    super(props);
  }

  render(){
    return (
      <div>
        BudgetVersionsDetail
      </div>
    )
  }

}

function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps)(injectIntl(BudgetVersionsDetail));
