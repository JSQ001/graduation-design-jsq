/**
 * Created by 13576 on 2017/10/16.
 */
import React from 'react'
import { connect } from 'react-redux'
import { Form, Input, Switch, Button, Icon ,Tabs} from 'antd'
const FormItem = Form.Item;
const TabPane =Tabs.TabPane;


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

    });
  };


  componentWillMount(){

  }


  onCancel = () =>{
    this.props.close();
  };

  render(){
    const {} = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14, offset: 1 },
    };
    return (
      <div className="beep-timer">
          <Tabs type="line" tabPosition="left" >
            {this.renderTabs()}
          </Tabs>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {}
}

export default connect(mapStateToProps)(BeepTimer);
