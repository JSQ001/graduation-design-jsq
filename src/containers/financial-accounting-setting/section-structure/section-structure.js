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
        { type: 'select', id: 'setOfBook', label: formatMessage({id: 'section.setOfBook'}), options:[],labelKey: 'setOfBooksName',valueKey: 'id',
          getUrl:`${config.baseUrl}/api/setOfBooks/by/tenant`, method: 'get', getParams: {roleType: 'TENANT'},
        },
        {                                                                        //科目段结构代码
          type: 'input', id: 'sectionStructureCode', label: formatMessage({id: 'section.structure.code'})
        },
        {                                                                        //科目段结构名称
          type: 'input', id: 'sectionStructureCName', label: formatMessage({id: 'section.structure.name'})
        }
      ]
    }
  };

  handleSearch = (params)=>{
    console.log(params)
  };

  render(){
    const { formatMessage} = this.props.intl;
    const { searchForm} = this.state;
    return(
      <div className="section-structure">
        <div className="section-structure-header">
          {formatMessage({id:"section.structure.header"})}
        </div>
        <SearchArea searchForm={searchForm} submitHandle={this.handleSearch}/>

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
