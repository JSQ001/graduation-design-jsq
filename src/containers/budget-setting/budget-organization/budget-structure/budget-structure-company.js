/**
 * created by jsq on 2017/9/26
 */
import React from 'react'
import { Badge } from 'antd'
import config from 'config'
import { injectIntl } from 'react-intl';
import ListSelector from 'components/list-selector.js'
import SelectorData from 'share/selectorData.js'

class BudgetStructureCompany extends React.Component{
  constructor(props){
    super(props);

  }
  render(){
    return(
      <div>
        tiaffdas
      </div>
    )
  }
}
function mapStateToProps(state) {
  return {

  }
}

export default connect(mapStateToProps)(injectIntl(BudgetStructureCompany));
