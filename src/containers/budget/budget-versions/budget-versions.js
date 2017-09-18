/**
 * Created by 13576 on 2017/9/18.
 */
import React from 'React'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';


class BudgetVersions extends React.Component {
  constructor(props) {
    super(props);
  }

  render(){
    return (
      <div>

      </div>
    )
  }

}

function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps)(injectIntl(BudgetVersions));
