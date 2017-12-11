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
      loading: false,
      pagination: {
        current: 1,
        page: 0,
        total:0,
        pageSize:10,
        showSizeChanger:true,
        showQuickJumper:true,
      },
      detail:[
        {key:'unPay', label: formatMessage({id: "check-center.unPay"}), quota: '123,45', count: '' },
        {key:'checked', label: formatMessage({id: "check-center.checked"}), quota: '231,322', count: '' },
        {key:'unchecked', label: formatMessage({id: "check-center.unchecked"}), quota: '903,1', count: '' }
      ],
      defaultLabel: 'all',
      radio:[
        {label: formatMessage({id: "check-center.all"}), value: 'all' },
        {label: formatMessage({id: "check-center.checked"}), value: 'checked'},
        {label: formatMessage({id: "check-center.unchecked"}), value: 'unchecked'}
      ],
      searchForm: [
        {type: 'input', id: 'bankCode', label: formatMessage({id: 'check-center.suppliers'}) }, /*供应商*/
        {type: 'date', id: 'bankName', label: formatMessage({id: 'check-center.time'}) }, /*时间*/
        {type: 'select', id: 'countryName',options:[], labelKey: 'country',valueKey: 'country',
          label: formatMessage({id: 'check-center.serviceType'}),  /*服务类型*/
          event:'TYPE_CHANGE',
          defaultValue:'全部',
          //getUrl: `http://192.168.1.77:13001/location-service/api/localization/query/county`, method: 'get', getParams: {},
        },
        {type: 'input', id: 'clearingKey', label: formatMessage({id: 'check-center.clearingKey'}) , /*结算主键*/},
        {type: 'input', id: 'linkNumber', label: formatMessage({id: 'check-center.linkNumber'}) , /*关联行程号*/}
      ],
      columns:[
        {          /*供应商*/
          title: formatMessage({id:"check-center.suppliers"}), key: "countryName", dataIndex: 'countryName'
        },
        {          /*结算日期*/
          title: formatMessage({id:"check-center.clearDate"}), key: "bankCode", dataIndex: 'bankCode'
        },
        {          /*结算主键*/
          title: formatMessage({id:"check-center.clearingKey"}), key: "bankCode", dataIndex: 'bankCode'
        },
        {          /*关联行程号*/
          title: formatMessage({id:"check-center.linkNumber"}), key: "linkNumber", dataIndex: 'linkNumber'
        },
        {          /*价格*/
          title: formatMessage({id:"check-center.price"}), key: "price", dataIndex: 'price'
        },
        {          /*服务类型*/
          title: formatMessage({id:"check-center.serviceType"}), key: "serviceType", dataIndex: 'serviceType'
        },
        {          /*乘机人*/
          title: formatMessage({id:"check-center.person"}), key: "serviceType", dataIndex: 'serviceType'
        },
        {          /*出发城市*/
          title: formatMessage({id:"check-center.departureCity"}), key: "departureCity", dataIndex: 'departureCity'
        },
        {          /*到达城市*/
          title: formatMessage({id:"check-center.reachCity"}), key: "reachCity", dataIndex: 'reachCity'
        },
        {          /*类型*/
          title: formatMessage({id:"check-center.type"}), key: "reachCity", dataIndex: 'reachCity'
        },
        {          /*起飞时间*/
          title: formatMessage({id:"check-center.departureTime"}), key: "departureTime", dataIndex: 'departureTime'
        },
        {          /*对账状态*/
          title: formatMessage({id:"check-center.checkStatus"}), key: "checkStatus", dataIndex: 'checkStatus'
        },
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


  renderDetail() {
    const {detail} = this.state;
    return detail.map((item)=>(
      <div className={"check-center-detail-"+item.key}>
        <p>{item.label}</p>
        <p>{item.quota}元</p>
        <p>{item.total}笔</p>
      </div>))
  }

  render(){
    const { loading, searchForm, radio, defaultLabel, data, columns, pagination} = this.state;
    return(
      <div className="check-center-ticket">
        <SearchArea searchForm={searchForm} submitHandle={this.handleSearch}/>
        <Radio.Group value={defaultLabel} className="check-center-radio" onChange={this.onChange} style={{ marginBottom: 16 }}>
          {radio.map((item)=><Radio.Button value={item.value}>{item.label}</Radio.Button>)}
        </Radio.Group>
        <Card className="check-center-detail">
          {this.renderDetail()}
        </Card>
        <Table
            loading={loading}
            data={data}
            columns={columns}
            pagination={pagination}
        />
      </div>)
  }
}

function mapStateToProps(state) {
  return {}
}

export default connect(mapStateToProps)(injectIntl(CheckCenterTicket));
