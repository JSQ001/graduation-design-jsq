/**
 * Created by 13576 on 2017/10/18.
 */

import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';


import { Collapse,Form, Input, Switch, Button, Icon ,Tabs,Row,Col,message,Popconfirm} from 'antd'
import httpFetch from 'share/httpFetch'
import config from 'config'
import menuRoute from 'share/menuRoute'

import 'styles/finance-setting/beep-timer/beef-info.scss'
const Panel =Collapse.Panel


class BeepInfo extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      paramsData:{}
    };
  }

  componentWillMount(){
   if(this.props.applyData){
     console.log(this.props.applyData);
      if(this.props.applyData.params){
        let paramsData = JSON.parse(this.props.applyData.params);
        this.setState({"paramsData":paramsData})
      }
    }

  }

  //确定删除
  onDelete=()=>{

  }

  //获取
  getTraverApprove = () =>{
    const paramsData = this.state.paramsData;
    const formOIDs = paramsData.formOIDs;
    let rows = [];
    let renderFormData = [];
      httpFetch.post(`${config.baseUrl}/api/custom/forms/getByOIDs`,formOIDs).then((res)=>{
        rows = res.data.rows;
      })
    if(rows.length>0){
      rows.map((item,i)=>{
          renderFormData.push(<span key={i} style={{color:item.valid?"black":"gray"}}>item.formName</span>)
      })
    }else {
      renderFormData.push(<span key={1} style={{color:"red"}}>请选择申请单</span>)
    }
    return renderFormData;

  }

  render(){
    const { formatMessage } = this.props.intl;
    const {applyData} = this.state;
    const paramsData = this.state.paramsData;
    const customPanelStyle = {
      background: '#f7f7f7',
      borderRadius: 4,
      marginTop: 10,
      border: 0,
      overflow: 'hidden',
    };
    let panelHeader = (
      <div className="beep-info-in">
        <span className="beep-info-title" style={{ fontSize:"16px"}}>{paramsData.title?paramsData.title:""}</span>
        <span className="beep-info-operation">
            <a onClick={(e) => {this.handleEdit()}}>{formatMessage({id: 'common.edit'})/* 编辑 */}</a>
            <span className="ant-divider"/>
            <Popconfirm onConfirm={() => {this.handleDelete()}} onClick={e => e.stopPropagation()} title="你确定要删除这条数据吗?">
              <a>{formatMessage({id: 'common.delete'})/* 删除 */}</a>
            </Popconfirm>
        </span>
      </div>
    );
    return (
      <div className="beep-info">
        <Collapse bordered={false} >
          <Panel header={panelHeader} style={customPanelStyle}>
            <div className="beep-info-content">
              {paramsData.content?paramsData.content:""}
            </div>
            <br/><hr className="beep-info-hr"/><br/><br/>
            {this.props.type ==="traver" && (<div>
              <div>
                <Row>
                  <Col span={8}>
                    <span>发送日期：</span>
                    差旅申请结束日期后<span style={{color:"blue"}}>{paramsData.data?" "+paramsData.data+" ":" "}</span>天提醒员工
                  </Col>
                  <Col span={8}>
                    <span>发送时间：</span>
                    <span>{paramsData.hour?paramsData.hour+"时":""}</span>
                  </Col>
                </Row>
                <br/>
                <Row>
                  <Col span={24}>
                    <span>适用单据：</span>
                    {this.getTraverApprove()}
                  </Col>
                </Row>
              </div>
            </div>)}

          </Panel>
        </Collapse>

      </div>
    )
  }
}

BeepInfo.propTypes = {
  type: React.PropTypes.string,  //选择类型 "borrow","traver","business-card","regularly"
  applyData:React.PropTypes.object,
  onEdit:React.PropTypes.func,
  index:React.PropTypes.string
}
BeepInfo.defaultProps = {
  applyData:{},
  onEdit:()=>{}

}


function mapStateToProps(state) {
  return {}
}

export default connect(mapStateToProps)(injectIntl(BeepInfo));
