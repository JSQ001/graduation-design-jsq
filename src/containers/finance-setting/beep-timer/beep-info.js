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

    };
  }

  componentWillMount(){
  }

  //确定删除
  onDelete=()=>{

  }

  getTraverApprove = () =>{
    const applyData = this.props.applyData;
    formOIDs = applyData.formOIDs;
    

  }

  render(){
    const { formatMessage } = this.props.intl;
    const applyData = this.props.applyData;
    const {} = this.state;
    const customPanelStyle = {
      background: '#f7f7f7',
      borderRadius: 4,
      marginTop: 10,
      border: 0,
      overflow: 'hidden',
    };
    let panelHeader = (
      <div>
        <span className="header-principal">{applyData.code}</span>
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
              {applyData.description}
            </div>
            <br/><hr/><br/><br/>
            {this.props.type ==="traver" && (<div>
              <div>
                <Row>
                  <Col span={8}>
                    <span>发送日期：</span>
                    <span>{applyData.data}</span>
                  </Col>
                  <Col span={8}>
                    <span>发送时间：</span>
                    <span>{applyData.hour}</span>
                  </Col>
                </Row>
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
