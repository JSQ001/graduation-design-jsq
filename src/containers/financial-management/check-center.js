/**
 * Created by jsq on 2017/12/6.
 */
import React from 'react'
import { connect } from 'react-redux'
import { Tabs, Table, Button, notification, Icon, Popover } from 'antd';
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
        123
      </div>)
  }
}


function mapStateToProps(state) {
  return {}
}

export default connect(mapStateToProps)(CheckCenter);
