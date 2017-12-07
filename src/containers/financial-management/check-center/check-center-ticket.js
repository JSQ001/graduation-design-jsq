/**
 * Created by jsq on 2017/12/6.
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import SearchArea from 'components/search-area.js';
import { Tabs, Radio, Table, Button, Icon, Popover, Row, Col, Card } from 'antd';

const TabPane = Tabs.TabPane;
import httpFetch from 'share/httpFetch'
import config from 'config'

import 'styles/financial-management/check-center/check-center-ticket.scss'

class CheckCenterTicket extends React.Component{
  constructor(props){
    super(props);
    const { formatMessage } = this.props.intl;
    this.state = {
      loading: true,
      radio:[
        {
          label: ''
        }
      ],
      searchForm: [
        {type: 'input', id: 'bankCode', label: formatMessage({id: 'check-center.suppliers'}) }, /*供应商*/
        {type: 'date', id: 'bankName', label: formatMessage({id: 'check-center.time'}) }, /*时间*/
        {type: 'select', id: 'countryName',options:[], labelKey: 'country',valueKey: 'country',
          label: formatMessage({id: 'check-center-serviceType'}),  /*服务类型*/
          event:'TYPE_CHANGE',
          defaultValue:'全部',
          //getUrl: `http://192.168.1.77:13001/location-service/api/localization/query/county`, method: 'get', getParams: {},
        },
        {type: 'input', id: 'clearingKey', label: formatMessage({id: 'check-center-clearingKey'}) , /*结算主键*/},
        {type: 'input', id: 'linkNumber', label: formatMessage({id: 'check-center-linkNumber'}) , /*关联行程号*/}
      ],
      cards: [
        {
          label: '机票', checked: 11, unChecked:11 ,total: 22, index: 1, onClick:this.handleTicket
        },
        {
          label: '酒店', checked: 11, unChecked:11 ,total: 22, index: 2, onClick:this.handleTicket
        },
        {
          label: '火车', checked: 11, unChecked:11 ,total: 22, index: 3, onClick:this.handleTicket
        }
      ]
    }
  }

  componentWillMount(){
    /* httpFetch.post(`http://uat.huilianyi.com/vendor-data-service/api/order/settlement/totalSummary`).then((response)=>{
     console.log(response.data)
     })*/
  }

  //机票账单
  handleTicket = () =>{
    alert(1)
  };


  render(){
    const { searchForm, radio} = this.state;
    return(
      <div className="check-center-ticket">
        <SearchArea searchForm={searchForm} submitHandle={this.handleSearch}/>
        <Radio.Group value={radio} onChange={this.onChange} style={{ marginBottom: 16 }}>
          {radio.map((item)=><Radio.Button value={item.value}>{item.label}</Radio.Button>)}
        </Radio.Group>
      </div>)
  }
}

function mapStateToProps(state) {
  return {}
}

export default connect(mapStateToProps)(injectIntl(CheckCenterTicket));
