/**
 * Created by zaranengap on 2017/7/4.
 */
import React from 'react'
import { connect } from 'react-redux'
import { Row, Col, Card, Icon } from 'antd';
import 'styles/dashboard.scss'

import Aliyun1 from 'images/sprite/aliyun-1.jpg'
import Aliyun2 from 'images/sprite/aliyun-2.jpg'
import Aliyun3 from 'images/sprite/aliyun-3.jpg'
import Aliyun4 from 'images/sprite/aliyun-4.jpg'
import Aliyun5 from 'images/sprite/aliyun-5.jpg'
import Aliyun6 from 'images/sprite/aliyun-6.jpg'

class Dashboard extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      spriteMap: {
        aliyun1: Aliyun1,
        aliyun2: Aliyun2,
        aliyun3: Aliyun3,
        aliyun4: Aliyun4,
        aliyun5: Aliyun5,
        aliyun6: Aliyun6
      }
    };
  }

  componentDidMount(){
    let sprites = document.getElementsByClassName('sprite')
    for(let i = 0; i < sprites.length; i++)
      spriteAnimation(sprites[i], this.state.spriteMap['aliyun' + (i + 1)], 75, 75, 60);
  }

  render() {
    return (
      <div className="dashboard">
        <Row gutter={20}>
          <Col span={8}>
            <Card>
              <div className="sprite"></div>
              <div className="total-block">
                <div className="total-block-title">待提交申请单</div>
                <div className="total-block-content">12</div>
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <div className="sprite"></div>
              <div className="total-block">
                <div className="total-block-title">待审批申请单</div>
                <div className="total-block-content">0</div>
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <div className="sprite"></div>
              <div className="total-block">
                <div className="total-block-title">待提交报销单</div>
                <div className="total-block-content">16</div>
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <div className="sprite"></div>
              <div className="total-block">
                <div className="total-block-title">待审批报销单</div>
                <div className="total-block-content">4</div>
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <div className="sprite"></div>
              <div className="total-block">
                <div className="total-block-title">待还款金额(CNY)</div>
                <div className="total-block-content">30,000</div>
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <div className="sprite"></div>
              <div className="total-block">
                <div className="total-block-title">待报销费用</div>
                <div className="total-block-content">5,332</div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {}
}

export default connect(mapStateToProps)(Dashboard);
