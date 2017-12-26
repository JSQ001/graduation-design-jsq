/**
 * Created by 13576 on 2017/10/18.
 */

import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';


import { Form, Input, Switch, Button, Icon ,Tabs,Row,Col,message,Popconfirm} from 'antd'
import httpFetch from 'share/httpFetch'
import config from 'config'
import menuRoute from 'share/menuRoute'

import 'styles/finance-setting/beep-timer/beef-info.scss'



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

  render(){

    const {} = this.state;

    return (
      <div className="beep-info">

        <div className="beep-info-in">
          <div className="beep-info-operation">
            <Popconfirm placement="top" title="确定删除" onConfirm={this.onDelete} okText="Yes" cancelText="No">
            <span><a>删除&nbsp;</a></span>
            </Popconfirm>

            <span>|</span><span>
            <a>&nbsp;编辑</a></span>
          </div>

          <div className="beep-info-title">
            <b> 借还款提醒这边显示标题，50字符</b>
          </div>
          <div className="beep-info-content">
            请及时还款，这里显示内容，200字符。请及时还款，这里显示内容，200字符。请及时还款，这里显示内容，200字符。请及时还款，这里显示内容，200字符。请及时还款，这里显示内容，200字符。
          </div>
          <br/><hr/><br/><br/>
          {this.props.type ==="traver" && (<div>
            <div>
              <Row>
                <Col span={8}>
                  <span>发送日期：</span>
                </Col>
                <Col span={8}>
                  <span>发送时间：</span>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <span>适用单据：</span>
                </Col>
              </Row>
            </div>
          </div>)}
        </div>
      </div>
    )
  }
}

BeepInfo.propTypes = {
  type: React.PropTypes.string,  //选择类型 "borrow","traver","business-card","regularly"
  applyData:React.PropTypes.object,
  onEdit:React.PropTypes.func
}
BeepInfo.defaultProps = {
  applyData:{},
  onEdit:()=>{}

}


function mapStateToProps(state) {
  return {}
}

export default connect(mapStateToProps)(injectIntl(BeepInfo));
