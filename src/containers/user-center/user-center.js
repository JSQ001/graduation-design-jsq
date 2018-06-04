/**
 * Created by jsq on 2018/1/6.
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { Input, message ,Select, Form, Icon, Button, Row, Col} from 'antd';
import httpFetch from 'share/httpFetch'
import menuRoute from 'routes/menuRoute'
import UserInfo from 'containers/user-center/user-info'
import ChangePassword from 'containers/user-center/change-password'
import WorkOnline from 'containers/user-center/work-online'
import TestInline from 'containers/user-center/test-online'
import TestScore from 'containers/user-center/test-score'
import WorkScore from 'containers/user-center/work-score'
import Login from 'containers/login'
import 'styles/user-center/user-center.scss'

class UserCenter extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      headTips: [
        {
          id: 'index', label: '网站首页',
        },
        {
          id: 'user_center', label: '用户中心',
        },
        {
          id: 'question_center', label: '题库中心',
        },
        {
          id: 'login', label: '系统登录',
        },
      ],
      menuPicture: [
        {
          id: 'work-online', url: '../images/user_4.jpg', title: '在线作业', content: WorkOnline
        },
        {
          id: 'test', url: '../images/user_3.jpg', title: '在线考试', content: TestInline
        },
        {
          id: 'test-score', url: '../images/user_6.jpg', title: '考试成绩', content: TestScore
        },
        {
          id: 'work-score', url: '../images/user_5.jpg', title: '作业成绩', content: WorkScore
        },
       {
          id: 'user-info', url: '../images/user_1_hover.jpg', title: '个人资料', content: UserInfo
      },
      {
        id: 'change-password', url: '../images/user_2.jpg', title: '修改密码', content: ChangePassword
     },
      {
        id: 'exit', url: '../images/user_7.jpg', title: '退出系统'
      }
    ],
      currentPageIndex: 4
    }
  }

  handleOnPicture = (flag,item,index)=>{
    const { menuPicture, currentPageIndex } = this.state;
    if(currentPageIndex !== index ) {
      if (flag === 'in') {
        item.url = item.url.split(".jpg")[0] + "_hover.jpg";
        menuPicture[index] = item;
        this.setState({menuPicture})

      } else {
        item.url = item.url.split("_hover.jpg")[0] + ".jpg";
        menuPicture[index] = item;
        this.setState({menuPicture})
      }
    }
  };

  handleOnClick =(item,index)=>{
    const { menuPicture, currentPageIndex } = this.state;
    if(index===6)
      this.context.router.push('/?logout_sso=true');
    else {
      if(currentPageIndex!==index){
        menuPicture[currentPageIndex].url = menuPicture[currentPageIndex].url.split("_hover.jpg")[0] + ".jpg"
        this.setState({menuPicture,currentPageIndex: index});
      }
    }
  };

  callback =()=>{
    console.log(123)
  }

  renderPicture(){
    const {menuPicture} = this.state;
    return (
      menuPicture.map((item,index)=>
        <div className="item-picture" key={item.id}>
          <img src={item.url}
               onMouseOver={()=>this.handleOnPicture('in',item,index)}
               onMouseOut={()=>this.handleOnPicture('out',item,index)}
               onClick={()=>this.handleOnClick(item,index)}/>
          {item.title}
        </div>
      )
    )
  }

  render(){
    const {menuPicture, currentPageIndex, headTips } = this.state;
    const userInfo = this.props.user;
    return (
      <div className="user-center">
        <div className="user-center-head">
          你好
          <span className="head-user-tips"> {userInfo.userNumber} </span>
          欢迎使用在线考试系统！
          <span className="head-user-tips">退出系统</span>
          <span className="head-tips">
            {
              headTips.map(item=><span className="head-tips-item">{item.label}</span>)
            }
          </span>

        </div>
        <div className="user-center-menu">
          {
            this.renderPicture()
          }
        </div>
        <div className="user-center-content">
          {React.createElement(menuPicture[currentPageIndex].content, Object.assign({}, this.props.params, {callBack: ()=>{this.callback()}}))}
        </div>
      </div>
    )
  }
}

UserCenter.contextTypes = {
  router: React.PropTypes.object,
};

function mapStateToProps(state) {
  return {
    user: state.login.user,
  }
}

export default connect(mapStateToProps)(injectIntl(UserCenter));
