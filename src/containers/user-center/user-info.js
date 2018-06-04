/**
 * Created by jsq on 2018/4/26.
 */
import React from 'react'
import { connect } from 'react-redux'
import { Input, message ,Select, Form, Icon, Button, Row, Col} from 'antd';
import menuRoute from 'routes/menuRoute'
import { injectIntl } from 'react-intl'
import 'styles/user-center/user-info.scss'

class UserInfo extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    }
  }

  componentWillMount(){
    //获取用户信息
    console.log(this.props.user)
  }

  render(){
    return (
      <div className="user-info">
        <img src="../images/user.png" className="user-info-picture"/>
        <div className="user-info-detail">
          <div className="detail-item-left">姓名：{this.props.user.nickName}</div>
          <div className="detail-item-center">学号：{this.props.user.userNumber}</div>
          <div className="detail-item-right">性别：{this.props.user.gender}</div>
          <br/>
          <div className="detail-item-left">电话：{this.props.user.phone}</div>
          <div className="detail-item-center">入学时间：
            {!this.props.user.createdDate ? null : this.props.user.createdDate.slice(0,4)+"/9" }</div>
          <div className="detail-item-right">系部：{this.props.user.deptName}</div>
          <br/>
          <div className="detail-item-left">专业：{this.props.user.majorName}</div>
          <div className="detail-item-center">班级：{this.props.user.className}</div>
        </div>
      </div>)
  }
}
UserInfo.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
  return {
    user: state.login.user
  }
}

export default connect(mapStateToProps)(injectIntl(UserInfo));
