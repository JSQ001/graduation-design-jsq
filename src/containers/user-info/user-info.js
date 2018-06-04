
/**
 * Created by jsq on 2018/4/26.
 */
import React from 'react'
import { connect } from 'react-redux'
import { Input, message ,Select, Form, Icon, Button, Table, Badge, Tabs} from 'antd';
import { injectIntl } from 'react-intl'
import Admin from 'containers/user-info/admin'
import Teacher from 'containers/user-info/teacher'
import Student from 'containers/user-info/student'

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

class StudentInfo extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      tabs: [
        /*{key: 'admin', name:'管理员'},*/
        {key: 'teacher', name:'教师'},
        {key: 'student', name:'学生'},
      ],
      nowStatus: 'teacher'
    }
  }

  componentWillMount(){
    //获取用户信息
    console.log(this.props.params)
  };

  onChangeTabs = (key) =>{
    this.setState({
      nowStatus: key
    })
  };

  renderContent = () => {
    switch (this.state.nowStatus){
      case 'admin':
        return <Admin/>;
        break;
      case 'teacher':
        return <Teacher/>;
        break;
      case 'student':
        return <Student/>;
        break;
    }
  };

  render(){
    const { formatMessage } = this.props.intl;
    const { tabs, nowStatus} = this.state;
    return (
      <div className="teacher-info">
        <Tabs onChange={this.onChangeTabs} defaultActiveKey={nowStatus}>
          {tabs.map(tab => <TabPane tab={tab.name} key={tab.key}/>)}
        </Tabs>
        {this.renderContent()}
      </div>)
  }
}
StudentInfo.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
  return {
    user: state.login.user,
  }
}


export default connect(mapStateToProps)(injectIntl(StudentInfo));
