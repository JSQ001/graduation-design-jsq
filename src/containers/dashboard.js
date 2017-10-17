/**
 * Created by zaranengap on 2017/7/4.
 */
import React from 'react'
import { connect } from 'react-redux'
import { Row, Col, Card, Icon } from 'antd';
import 'styles/dashboard.scss'

class Dashboard extends React.Component{

  constructor(props){
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="dashboard">
        首页
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {}
}

export default connect(mapStateToProps)(Dashboard);
