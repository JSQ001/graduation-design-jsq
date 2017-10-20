/**
 * Created by 13576 on 2017/10/16.
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

import { Form, Input, Switch, Button, Icon ,Tabs,Row,Col,message} from 'antd'
import httpFetch from 'share/httpFetch'
import config from 'config'
import menuRoute from 'share/menuRoute'
const FormItem = Form.Item;
const TabPane =Tabs.TabPane;

import WrappedBeepFrom from 'containers/finance-setting/beep-timer/beep-from.js'





class BeepTimer extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      tabs: [
        {key: 'TRAVEL', name:'差旅申请'},
        {key: 'BORROW', name:'借款申请'}],
      status: 'TRAVEL',
      data: [],

    };
  }

  //获得已经有的差旅申请或者借款申请数据
  getData(){

  }

  //渲染Tabs
  renderTabs(){
    return (
      this.state.tabs.map(tab => {
        return <TabPane tab={tab.name} key={tab.key}/>
      })
    )
  }

  //Tabs点击
  onChangeTabs = (key) => {
    this.setState({

    },()=>{
      this.setState({
        status: key
      },()=>{
        this.getData()
      });
    });
  };


  componentWillMount(){

  }


  onCancel = () =>{
    this.props.close();
  };

  render(){
    const {} = this.state;

    return (
      <div className="beep-timer">
          <Tabs type="line" tabPosition="left"  onChange={this.onChangeTabs}>
            <TabPane tab="差旅申请" key="TRAVEL">
              <WrappedBeepFrom/>
            </TabPane>

            <TabPane tab="借款申请" key="BORROW">

            </TabPane>


          </Tabs>

      </div>

    )
  }
}

function mapStateToProps(state) {
  return {}
}

export default connect(mapStateToProps)(BeepTimer);
