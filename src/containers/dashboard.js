/**
 * Created by zaranengap on 2017/7/4.
 */
import React from 'react'
import { connect } from 'react-redux'
import { Row, Col, Card, Icon, Carousel } from 'antd';
import 'styles/dashboard.scss'
import httpFetch from 'share/httpFetch'
import config from 'config'

class Dashboard extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      imgBasicHeight: 712,
      imgBasicWidth: 1242,
      carousels: [],
      imgStyle: [],
      cardHeight: 150
    };
  }

  componentWillMount() {
  }

  componentDidMount(){
    const { imgBasicHeight, imgBasicWidth } = this.state;
    let percent = imgBasicHeight / imgBasicWidth;  //图片长宽比
    let cardWidth = (document.getElementsByClassName('helios-content')[0].clientWidth - 72 - 20) / 3;  //内容区域每张Card宽度
    let cardHeight = cardWidth * percent;  //每张Card高度
    this.setState({ cardHeight });
    httpFetch.get(`${config.baseUrl}/api/carousels/company/${this.props.user.companyOID}`).then(res => {
      if(res.data.length > 0){
        res.data.map((item, index) => {
          //预加载图片获得图片尺寸，并根据比例调整显示高宽
          let img = new Image();
          img.src = item.attachmentDTO.fileURL;
          img.onload = () => {
            let { height, width } = img;  //图片尺寸
            if(height + width > 1){
              let { imgStyle } = this.state;
              if(height / width < percent){  //需固定高度并且平移x居中图片
                let targetWidth = cardHeight * width / height;
                imgStyle[index] = { height: cardHeight, width: targetWidth, left: -(targetWidth - cardWidth) / 2};
              }
              if(height / width > percent){  //需固定宽度与底部
                let targetHeight = cardWidth * height / width;
                imgStyle[index] = { width: cardWidth, height: targetHeight, bottom: 0};
              }
              this.setState({ imgStyle });
            }
          }
        });
      }
      this.setState({ carousels: res.data })
    })

  }

  render() {
    const { carousels, cardHeight, imgStyle } = this.state;
    const cardStyle = {height : cardHeight};
    return (
      <div className="dashboard background-transparent">
        <Row gutter={10} type="flex" align="top">
          <Col span={8}>
            <Card style={cardStyle}>
              <div className="card-title">Hi, 这里是最新消息</div>
              <div className="card-content">
                <div className="no-content">
                  <Icon type="exclamation-circle-o" /><br/>
                  <span>没有最新消息</span>
                </div>
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card className="carousels" style={cardStyle}>
              {carousels.length > 0 ? <Carousel style={cardStyle}>
                {carousels.map((item, index) => {
                  return (
                    <div className="carousel" key={item.id}>
                      <img src={item.attachmentDTO.fileURL} style={imgStyle[index]}/>
                      <div className="carousel-title">{item.title}</div>
                    </div>
                  )
                })}
              </Carousel> : null}
            </Card>
          </Col>
          <Col span={8}>
            <Card style={cardStyle}>
              <div className="card-title">最近使用</div>
              <div className="card-content">
                <div className="recent-item" style={{ marginTop: 10 }}><Icon type="tag" />预算组织定义</div>
                <div className="recent-item"><Icon type="pay-circle" />预算余额</div>
                <div className="recent-item"><Icon type="pie-chart" />预算日记账</div>
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card style={cardStyle}>
              <div className="card-title">账本</div>
              <div className="card-content">
                <div className="number"><b>4</b> 笔待报销费用</div>
                <div className="money">438,600.00</div>
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card style={cardStyle}>
              <div className="card-title">商务卡</div>
              <div className="card-content">
                <div className="number"><b>3</b> 笔商务处理卡费用</div>
                <div className="money">10,650.00</div>
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card style={cardStyle}>
              <div className="card-title">审批</div>
              <div className="card-content">
                <div className="number"><b>2</b> 笔待我审批的单据</div>
              </div>
            </Card>
          </Col>
          <Col span={12}>
            <Card className="document-card">
              <div className="card-title">
                待提报单据<div className="extra">总金额 0.00</div>
              </div>
              <div className="card-content">
                <div className="add">+</div>
              </div>
            </Card>
          </Col>
          <Col span={12}>
            <Card className="document-card">
              <div className="card-title">
                进行中单据<div className="extra">总金额 0.00</div>
              </div>
              <div className="card-content">
                <div className="add">+</div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.login.user
  }
}

export default connect(mapStateToProps)(Dashboard);
