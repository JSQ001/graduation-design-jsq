/**
 * Created by jsq on 2017/12/6.
 */
import React from 'react'
import { connect } from 'react-redux'
import { Tabs, Table, Button, notification, Icon, Popover, Row, Col, Card } from 'antd';
const TabPane = Tabs.TabPane;
import httpFetch from 'share/httpFetch'
import config from 'config'
import menuRoute from 'share/menuRoute'

import { injectIntl } from 'react-intl';

import 'styles/financial-management/check-center/check-center.scss'

class CheckCenter extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      loading: true,
      cards: [
        {
          label: '机票',key: 'ticket', checked: 11, unChecked:11 ,total: 22, index: 1, onClick:()=>this.handleTicket('ticket')
        },
        {
          label: '酒店',key: 'hotel', checked: 11, unChecked:11 ,total: 22, index: 2, onClick:()=>this.handleTicket('hotel')
        },
        {
          label: '火车',key: 'train', checked: 11, unChecked:11 ,total: 22, index: 3, onClick:()=>this.handleTicket('train')
        }
      ]
    }
  }

  componentWillMount(){
   /* httpFetch.post(`http://uat.huilianyi.com/vendor-data-service/api/order/settlement/totalSummary`).then((response)=>{
      console.log(response.data)
    })*/
  }

  //账单详情
  handleTicket = (key) =>{
    this.context.router.push(menuRoute.getRouteItem('check-center-'+key, 'key').url);
  };

  renderCard(){
    const {cards} = this.state;
    return cards.map((item)=>(
      <Card className={"check-center-tab"+item.index} onClick={item.onClick}>
        <img src="" className="tab-img" width={10} height={10}/>
        <div title="e121e21oe1jo2" className="tab-content">
          累计订单数
          <p className="tab-content-total">
            {item.total}
          </p>
          <span className="tab-content-unchecked">
              未确认：{item.unChecked}笔
            </span>
          <span className="ant-divider" />
          <span className="tab-content-checked">
              已确认：{item.checked}笔
            </span>
          <hr className="tab-content-hr"/>
          <p className="table-footer">
            查看明细
          </p>
        </div>
      </Card>
    ))
  }

  render(){
    return(
      <div className="check-center">
        {this.renderCard()}
      </div>)
  }
}

function mapStateToProps(state) {
  return {}
}

CheckCenter.contextTypes = {
  router: React.PropTypes.object
};

export default connect(mapStateToProps)(CheckCenter);
