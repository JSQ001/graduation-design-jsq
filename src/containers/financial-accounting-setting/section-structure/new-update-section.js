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

import 'styles/financial-accounting-setting/section-structure/new-update-section.scss'

class NewUpdateSection extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      loading: true,
      data: [],
    }
  }

  render(){
    return(
      <div className="new-update-section">
        123
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    company: state.login.company,
  }
}

const WrappedNewUpdateSection = Form.create()(NewUpdateSection);
export default connect(mapStateToProps)(injectIntl(WrappedNewUpdateSection));
