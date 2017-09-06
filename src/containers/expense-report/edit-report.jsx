/**
 * Created by lwj on 2017/9/6.
 */

import React from 'react'
import debounce from 'lodash.debounce';
import { connect } from 'react-redux'
import { Tabs, Table, Button, notification, Icon } from 'antd';
const TabPane = Tabs.TabPane;
import httpFetch from 'share/httpFetch'
import config from 'config'

class EditReport extends React.Component{
    constructor(props){
        super(props);
        this.state = {
          loading: false,
          username: '',
          password: ''
        }
    }


    render(){
        return (
            <div>
                <div>hello world</div>

            </div>

        )
    }
}

function mapStateToProps(state) {
    return {}
  }

  export default EditReport;
