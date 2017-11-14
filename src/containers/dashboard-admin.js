/**
 * Created by zaranengap on 2017/10/17.
 */
import React from 'react'
import { connect } from 'react-redux'
import { Row, Col, Card, Icon } from 'antd';
import 'styles/dashboard-admin.scss'

class DashboardAdmin extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      cards: [{
        title: '在职员工数量（人）',
        icon: 'pie-chart',
        color: '#61A8E8'
      },{
        title: '启用中的部门数量（个）',
        icon: 'appstore',
        color: '#A5D687'
      },{
        title: '启用中的法人实体（人）',
        icon: 'smile',
        color: '#F9D97E'
      },{
        title: '启用中的公司（个）',
        icon: 'info-circle',
        color: '#E68A80'
      }]
    };
  }

  componenyWillMount() {
  };

  renderCards = () => {
    return this.state.cards.map((card, index) =>  (
      <Col span={6} key={index}>
        <Card>
          <Icon type={card.icon} style={{ fontSize: 50, color: card.color }}/>
          <div className="number-block">
            <div className="title">{card.title}</div>
            <div className="number">15,234</div>
          </div>
        </Card>
      </Col>
    ))
  };

  render() {
    const { company } = this.props;
    return (
      <div className="dashboard-admin background-transparent">
        <Card>
          <div className="dashboard-head">
            <img src={company.logoURL}/>
            <div className="company-content">
              <div className="company-name">{company.name}</div>
              <div className="company-detail">
                税务登记号: {company.taxId}&nbsp;&nbsp;&nbsp;&nbsp;
                创建时间: {new Date(company.createdDate).format('yyyy-MM-dd')}
              </div>
            </div>
          </div>
        </Card>
        <Row gutter={20} className="company-number">
          {this.renderCards()}
        </Row>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    company: state.login.company
  }
}

export default connect(mapStateToProps)(DashboardAdmin);
