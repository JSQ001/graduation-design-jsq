/**
 * Created by 13576 on 2017/10/6.
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { Button, Table, Select } from 'antd';
import SearchArea from 'components/search-area.js';
import "styles/budget/budget-journal/budget-journal-detail.scss"
import httpFetch from 'share/httpFetch';
import config from 'config'
import menuRoute from 'share/menuRoute'

class BudgetJournalDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render(){
    return (
      <div>
        预算日记账详情
      </div>
    )
  }

}



function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps)(injectIntl(BudgetJournalDetail));
