/**
 * Created by jsq on 2018/4/26.
 */
import React from 'react'
import { connect } from 'react-redux'
import { Input, message ,Select, Form, Icon, Button, Row, Col} from 'antd';
import { injectIntl } from 'react-intl'
import 'styles/person-info/person-info.scss'

const FormItem = Form.Item;

class PersonInfo extends React.Component{
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
  componentWillReceiveProps(nextProps){
    console.log(this.props.user)
  }

  handleSubmit = (e)=> {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
      }
    })
  };


  onCancel = ()=>{
    this.props.form.resetFields()
  };

  render(){
    const { formatMessage } = this.props.intl;
    const { getFieldDecorator } = this.props.form;
    const { loading} = this.state;
    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 4, offset: 0 },
    };
    return (
      <div className="person-info">
        <img src="../images/user.png" className="person-info-picture"/>
        <div className="person-info-detail">
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
PersonInfo.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
  return {
    user: state.login.user,
  }
}
const WrappedPersonInfo = Form.create()(PersonInfo);

export default connect(mapStateToProps)(injectIntl(WrappedPersonInfo));
