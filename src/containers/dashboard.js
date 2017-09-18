/**
 * Created by zaranengap on 2017/7/4.
 */
import React from 'react'
import { connect } from 'react-redux'
import { Row, Col, Card, Icon } from 'antd';
import echarts from 'echarts'
import animals from 'static/animalData'
import 'styles/dashboard.scss'

class Dashboard extends React.Component{
  componentDidMount() {
    let index = 0;
    let option = {
      series: [
        {
          name: 'animals',
          type: 'graph',
          data: animals[0].nodes,
          links: animals[0].links,
          lineStyle: {
            normal: {
              width: 2,
              curveness: 0,
              color: '#333'
            }
          },
          itemStyle: {
            normal: {
              color: '#555'
            }
          },
          silent: true,
          symbolSize: 1
        },
        {
          name: 'btn',
          type: 'graph',
          data: [
            {
              x: 50,
              y: 350,
              name: 'btn-left',
              symbolSize: 45
            },
            {
              x: 950,
              y: 350,
              name: 'btn-right',
              symbolSize: 45,
            },
            {
              x: 56,
              y: 359.5,
              name: 'left1',
            },
            {
              x: 56,
              y: 340.5,
              name: 'left2',
            },
            {
              x: 38,
              y: 350,
              name: 'left3',
            },
            {
              x: 944,
              y: 359.5,
              name: 'right1',
            },
            {
              x: 944,
              y: 340.5,
              name: 'right2',
            },
            {
              x: 962,
              y: 350,
              name: 'right3',
            }


          ],
          links: [
            {source: 'left1', target: 'left2'},
            {source: 'left1', target: 'left3'},
            {source: 'left2', target: 'left3'},
            {source: 'right1', target: 'right2'},
            {source: 'right1', target: 'right3'},
            {source: 'right2', target: 'right3'}
          ],
          lineStyle: {
            normal: {
              width: 1.5,
              color: '#555'
            }
          },
          itemStyle: {
            normal: {
              color: 'transparent',
              borderWidth: 1,
              borderColor: '#555'
            }
          },
          label: {
            emphasis: {
              show: false
            }
          },
          symbolSize: 0
        }
      ],
      animationDuration: 1500,
      animationDurationUpdate: 1500
    };
    setTimeout(()=>{
      let mainCharts = echarts.init(this.refs.mainCharts);
      mainCharts.setOption(option);
      mainCharts.on('click', function (params) {
        option.series[0].symbolSize = 6;
        if (params.name === 'btn-right') {
          if (index === animals.length - 1) {
            index = 0;
          } else {
            index++;
          }
        } else {
          if (index === 0) {
            index = animals.length - 1;
          } else {
            index--;
          }
        }
        option.series[0].data = animals[index].nodes;
        option.series[0].links = animals[index].links;
        mainCharts.setOption(option);
        setTimeout(function () {
          option.series[0].symbolSize = 2;
          mainCharts.setOption(option);
        }, 1000)
      });
    },0);
  };

  render() {
    return (
      <div className="dashboard">
        <h1>汇联易后台中控系统2.0</h1>
        <div ref="mainCharts" className="charts" id="charts">
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {}
}

export default connect(mapStateToProps)(Dashboard);
