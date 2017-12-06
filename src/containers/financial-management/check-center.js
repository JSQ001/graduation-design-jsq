/**
 * Created by jsq on 2017/12/6.
 */
import React from 'react'
import { connect } from 'react-redux'
import { Tabs, Table, Button, notification, Icon, Popover, Row, Col } from 'antd';
const TabPane = Tabs.TabPane;
import httpFetch from 'share/httpFetch'
import config from 'config'

import SearchArea from 'components/search-area'

import 'styles/financial-management/check-center.scss'

class CheckCenter extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      loading: true
    }
  }

  render(){
    return(
      <div className="check-center">
        <Row/>
        <div className="check-center-tab1">
                    1
        </div>
        <div className="check-center-tab2">
                  2
        </div>
        <div className="check-center-tab3">
                              3
        </div>
      </div>)
  }
}


function mapStateToProps(state) {
  return {}
}

export default connect(mapStateToProps)(CheckCenter);
