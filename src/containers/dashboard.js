/**
 * Created by zaranengap on 2017/7/4.
 */
import React from 'react'
import { connect } from 'react-redux'
import { Row, Col, Card, Icon } from 'antd';
import echarts from 'echarts'
import 'styles/dashboard.scss'

class Dashboard extends React.Component{
  componentDidMount() {
    let blueColor = new echarts.graphic.LinearGradient(
      0, 0, 0, 1,
      [
        {offset: 0, color: '#83bff6'},
        {offset: 0.5, color: '#188df0'},
        {offset: 1, color: '#188df0'}
      ]
    );
    let greenColor = new echarts.graphic.LinearGradient(
      0, 0, 0, 1,
      [
        {offset: 0, color: '#c6e4f6'},
        {offset: 0.5, color: '#77edf0'},
        {offset: 1, color: '#6bf0c6'}
      ]
    );
    let versionCharts = echarts.init(this.refs.versionCharts);
    versionCharts.setOption({
      tooltip : {
        trigger: 'axis',
        axisPointer : {
          type : 'shadow'
        }
      },
      xAxis: {
        data: ["4.4.4","5.1.1","6.0","7.0","12.0.2","10.1","12.2.1","10.3","9.3.4"]
      },
      legend: {
        data:['android','ios']
      },
      yAxis: {},
      series: [{
        name: 'android',
        type: 'bar',
        itemStyle: {
          normal: {
            color: blueColor
          }
        },
        data: [1,1,2,2,14,5,3,3,2]
      },{
        name: 'ios',
        type: 'bar',
        itemStyle: {
          normal: {
            color: greenColor
          }
        },
        data: [1,1,2,2,14,5,3,3,2]
      }]
    });
    let deviceCharts = echarts.init(this.refs.deviceCharts);
    deviceCharts.setOption({
      tooltip : {
        trigger: 'item',
        formatter: "{b} : {c} ({d}%)"
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: ['正常','禁用']
      },
      series : [
        {
          type: 'pie',
          radius : '55%',
          center: ['50%', '60%'],
          data:[
            {value:335, name:'正常'},
            {value:310, name:'禁用'}
          ],
          color: [blueColor,greenColor],
          animationType: 'scale',
          animationEasing: 'elasticOut',
          animationDelay: function (idx) {
            return Math.random() * 200;
          }
        },
      ]
    })
  };

  render() {
    return (
      <div className="dashboard">
        <Row type="flex" justify="space-between" className="card-row">
          <Col span="6">
            <Card className="card platform-card">
              <div className="card-title">平台数</div>
              <Row type="flex" justify="space-between">
                <Col><Icon type="android" className="platform-icon"/>27</Col>
                <Col><Icon type="apple" className="platform-icon"/>6</Col>
              </Row>
            </Card>
          </Col>
          <Col span="6">
            <Card className="card device-card">
              <div className="card-title">设备数</div>
              <Row type="flex" justify="space-between">
                <Col span="8">
                  <div className="number">5055</div>
                  <div className="label">总用户</div>
                </Col>
                <Col span="8">
                  <div className="number">20</div>
                  <div className="label">已激活</div>
                </Col>
                <Col span="8">
                  <div className="number">30403</div>
                  <div className="label">已授权</div>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col span="6">
            <Card className="card user-card">
              <div className="card-title">用户数</div>
              <Row type="flex" justify="space-between">
                <Col span="12">
                  <div className="number">10</div>
                  <div className="label">在线</div>
                </Col>
                <Col span="12">
                  <div className="number">20</div>
                  <div className="label">已激活</div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        <Row type="flex" justify="space-between">
          <Col span="11" className="charts-area">
            <h3>版本分布图</h3>
            <div ref="versionCharts" className="charts"></div>
          </Col>
          <Col span="11" className="charts-area">
            <h3>设备状态</h3>
            <div ref="deviceCharts" className="charts"></div>
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
