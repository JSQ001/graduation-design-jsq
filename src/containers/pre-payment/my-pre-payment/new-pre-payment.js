/**
 * Created by 13576 on 2017/12/4.
 */
import React from 'react'
import { injectIntl } from 'react-intl'
import { Form, Button, Table, message, Badge } from 'antd'
import config from 'config'
import httpFetch from 'share/httpFetch'
import menuRoute from 'share/menuRoute'

import moment from 'moment'
import SearchArea from 'components/search-area'

class NewPrePayment extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      searchForm: [{
        type: 'value_list', label: '消息：', id: 'messageCode', options: [], valueListCode: 2022
      }, {
        type: 'selput', label: '人员', id: 'user', valueKey: 'fullName', listType: 'user', defaultValue: '123'
      }]
    }
  }

  search = (result) => {
    console.log(result)
  };

  render(){
    const { searchForm } = this.state;
    return(
      <div>
       新建
      </div>
    )
  }
}

const wrappedMyNewPrePayment = Form.create()(injectIntl(NewPrePayment));


export default wrappedMyNewPrePayment;
