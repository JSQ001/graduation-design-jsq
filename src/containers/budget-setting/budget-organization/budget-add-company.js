/**
 *  created by jsq on 2017/9/26
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import httpFetch from 'share/httpFetch';
import config from 'config'
import ListSelector from 'components/list-selector.js'
import SelectorData from 'share/selectorData.js'

class BudgetAddCompany extends React.Component{

}

function mapStateToProps(state) {
  return {
  }
}
export default connect(mapStateToProps)(injectIntl(BudgetAddCompany));
