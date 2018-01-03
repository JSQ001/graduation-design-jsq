/**
 * Created by jsq on 2017/12/6.
 */
import React from 'react'
import { connect } from 'react-redux'
const TabPane = Tabs.TabPane;
import httpFetch from 'share/httpFetch'
import config from 'config'
import { injectIntl } from 'react-intl';
import menuRoute from 'routes/menuRoute'
import { Tabs, Table, Button, notification, Icon, Popover, Row, Col, Card } from 'antd';

import 'styles/financial-management/check-center/check-center.scss'

class CheckCenter extends React.Component{
  constructor(props){
    super(props);
    const { formatMessage } = this.props.intl;
    this.state = {
      loading: true,
      a:23131212,
      cards: [
        {
          label: formatMessage({id: "check-center.ticket"}),url:'', key: 'ticket', checked: 0, unChecked:0 ,total: 0, index: 1, onClick:()=>this.handleTicket('ticket')
        },
        {
          label: formatMessage({id: "check-center.hotel"}),url:"", key: 'hotel', checked: 11, unChecked:11 ,total: 22, index: 2, onClick:()=>this.handleTicket('hotel')
        },
        {
          label: formatMessage({id: "check-center.train"}),url:"",key: 'train', checked: 11, unChecked:11 ,total: 22, index: 3, onClick:()=>this.handleTicket('train')
        }
      ]
    }
  }

  componentWillMount(){
    this.getList()
  }

  getList(){
    let {cards} = this.state;
    let value = {
      channel:'hly-admin',
      companyOID: this.props.company.companyOID
    };
    httpFetch.post(`${config.baseUrl}/vendor-data-service/api/order/settlement/totalSummary`,value).then((response)=>{
      console.log(response.data)
      let array = response.data.summaryVOList;
      for(let i = 0;i< array.length; i++){
        console.log(array[i])
        cards[i].key = array[i].vendorTypeName
        cards[i].label = array[i].vendorTypeName;
        cards[i].total = array[i].allReconciledNum;
        cards[i].checked = array[i].reconciledNum;
        cards[i].unChecked = array[i].notReconciledNum;
        cards[i].url = array[i].vendorTypeIco;
      }
      this.setState({
        cards,
        loading: false
      })
    })
  }

  //数字每三位中加一个‘，’
  numberToString(){
    let a = 3123123123133;
    let result = [];
    for(let i = 0;i < a.toString().length;i++){
      let b= i+1;
      result.push(a.toString()[i])
      if(b%3==0 && i!=0){
        result.push(',');
        console.log(b%3)
      }
    }
    let str = "";
    result.map((item)=>{
      str += item
    });
    console.log(str)
  }

  //账单详情
  handleTicket = (key) =>{
    this.context.router.push(menuRoute.getRouteItem('check-center-'+key, 'key').url);
  };

  renderCard(){
    const {cards} = this.state;
    console.log(cards)
    return cards.map((item)=>(
      <Card className={"check-center-tab"+item.index} key={item.index} onClick={item.onClick}>
        <img src={item.url} className="tab-img" width={30} height={30}/>
        {item.label}
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
    const {loading} = this.state;
    return(
      <div className="check-center">
        {this.renderCard()}
        <Button onClick={this.numberToString}>点击{this.state.a}</Button>
      </div>)
  }
}

function mapStateToProps(state) {
  return {
    company: state.login.company
  }
}

CheckCenter.contextTypes = {
  router: React.PropTypes.object
};

export default connect(mapStateToProps)(injectIntl(CheckCenter));
