/**
 * Created by 13576 on 2017/10/16.
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

import { Form, Input, Switch, Button, Icon ,Tabs,Row,Col,message} from 'antd'
import httpFetch from 'share/httpFetch'
import config from 'config'
import menuRoute from 'routes/menuRoute'
const FormItem = Form.Item;
const TabPane =Tabs.TabPane;

import WrappedBeepFrom from 'containers/finance-setting/beep-timer/beep-from.js'
import BeepInfo from 'containers/finance-setting/beep-timer/beep-info.js'

import 'styles/finance-setting/beep-timer/apply-traver.scss'



class ApplyTraver extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      fromData:[],
      rowsData:[],
      New:false
    };
  }

  componentWillMount(){
    this.getData();
    this.getList();
  }

  //获取差旅申请提醒
  getList(){
    const companyOID={"companyOID":"5ea88443-d99d-4f2e-8aa4-c4d73dc9c67b"}
    httpFetch.post(`${config.baseUrl}/api/taskConfig/queryByExample`,companyOID).then((res)=>{
        this.setState({
          rowsData:res.data.rows
        })
    })
  }

  //获得已经有的差旅申请单数据
  getData(){
    httpFetch.get(`${config.baseUrl}/api/custom/forms/company/travel/application/all`).then((req)=>{
      console.log(req);
      this.setState({
        fromData: req.data
      })
    })
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


  onCancel = () =>{
    this.props.close();
  };

  renderBeepInfo = () =>{
    const rowsData = this.state.rowsData;
    const renderBeepInfo =[];
    rowsData.map((item,i)=>{
      console.log(item);
      renderBeepInfo.push(
        <BeepInfo
        type={"traver"}
        applyData ={item}
        key = {i}
      />
      )
    })
    return renderBeepInfo
  }

  addApply = () => {
    if(this.New) {
      message.warning('你有一个编辑中的表单');
      return;
    }else {
      this.setState({New:true})
    }

  }

  handCancel = () =>{
    console.log(123+"handCancel")
    this.setState({New:false})
  }

  submitHandle = (value) =>{
    console.log(value);
  }



  render(){
    const {New} = this.state;
    return (
      <div className="apply-traver">
        <div className="header">
          <span>1、只在申请单未关闭且未关联报销单时提醒</span><br/>
          <span>2、每个单据可以设置多条提醒规则，每条规则都会发送提醒，即支持多次提醒</span>
        </div>
        <div>
          {this.renderBeepInfo()}
        </div>
        <div>
          { New?<WrappedBeepFrom  type={"traver"} applyData ={{}}  submitHandle ={this.submitHandle} handCancel={this.handCancel}/>:""}
        </div>
        <div className="apply-traver-button">
          <Button type="dashed"  style={{ width: '100%', high:40}} onClick={this.addApply}>
            <Icon type="plus" /> 添加
          </Button>
        </div>

      </div>

    )
  }
}


function mapStateToProps(state) {
  return {
    company: state.login.company,
  }
}

export default connect(mapStateToProps)(injectIntl(ApplyTraver));
