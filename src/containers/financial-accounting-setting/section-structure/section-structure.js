/**
 * created by jsq on 2017/12/22
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { Button, Table} from 'antd'

import SearchArea from 'components/search-area.js';
import httpFetch from 'share/httpFetch';
import config from 'config'
import menuRoute from 'share/menuRoute'

import 'styles/financial-accounting-setting/section-structure/section-structure.scss'

class SectionStructure extends React.Component{
  constructor(props){
    super(props);
    const { formatMessage } = this.props.intl;
    this.state = {
      loading: true,
      data: [],
      searchForm: [                                                             //账套
        { type: 'select', id: 'controlRuleCodeFrom', label:formatMessage({id: 'budget.controlRulesFrom'}), options:[],labelKey: 'controlRuleName',valueKey: 'controlRuleCode',
          getUrl:`${config.budgetUrl}/api/budget/control/rules/query/all`, method: 'get', getParams: {organizationId: this.props.id},
        },
        {
          type: 'select',
        }
      ]
    }
  };
  render(){
    const { formatMessage} = this.props.intl;
    return(
      <div className="section-structure">
        <div className="section-structure-header">
          {formatMessage({id:"section.structure.header"})}
        </div>
      </div>
    )
  }
}

SectionStructure.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
  return {

  }
}

export default connect(mapStateToProps)(injectIntl(SectionStructure));
