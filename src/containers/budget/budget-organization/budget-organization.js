/**
 * created by jsq on 2017/9/18
 */
import React from 'react';
import httpFetch from 'share/httpFetch'
import config from 'config'
import { connect } from 'react-redux'
import { Table, Button } from 'antd'

import { injectIntl } from 'react-intl';
import SearchArea from 'components/search-area.js'


class BudgetOrganization extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      loading: true,
      data: [],
      searchForm: [
        {type: 'select', id: 'setOfBooksId', label: '账套',
          options:[
            {label:"账套1", value:'1'},
            {label:"账套2", value:'2'},
            {label:"账套3", value:'3'}
          ]},
        {type: 'input', id: 'organizationCode', label: '预算组织'},
        {type: 'input', id: 'description', label: '预算组织描述'},
      ],
    }
  }

  //处理搜索
  handleSearch = (values) =>{

  }
  render(){
    const { searchForm,} = this.state;
    return(
      <div className="budget-organization">
        <SearchArea searchForm={searchForm} submitHandle={this.handleSearch}/>

      </div>
    )
  }
}


function mapStateToProps(state) {
  return {}
}

export default connect(mapStateToProps)(injectIntl(BudgetOrganization));
