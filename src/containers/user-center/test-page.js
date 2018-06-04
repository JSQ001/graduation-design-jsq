/**
 * Created by jsq on 2018/4/26.
 */
import React from 'react'
import { connect } from 'react-redux'
import menuRoute from 'routes/menuRoute'
import { injectIntl } from 'react-intl'
import httpFetch from 'share/httpFetch'
import MyTag from 'components/myTag'
import config from 'config'
import Generator from 'containers/user-center/title-detail'
import 'styles/user-center/test-page.scss'
import { Form, Row, Col, Input, Button, Icon, DatePicker, Radio, Checkbox, Select, Switch, Spin  } from 'antd';
import 'components/timer'
import Timer from "../../components/timer";

const FormItem = Form.Item;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;


class TestPage extends React.Component{
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
      titleHead:{},
      data: [],
      userInfo: {},
      answer:[],
      json: {
        security: {
          title: '试题',
          key: 'page-create',
          hash: '33za1r8an66e59ng7ap69m9567'
        },
        layout: {
          width: '30%',
          gutter: 40,
          justify: 'start',
          align: 'top',
          span: 24,
          labelCol: { span: 1 ,offset:1},
          wrapperCol: { span: 60, offset: 1 },
          buttons: 'center',
          buttonsMargin: 10
        },
        forms: [],
        buttons: [
          { id: 'submit', type: 'submit', text: '提交', surface: 'primary' },
          { id: 'clear', type: 'clear', text: '清除', target: ['test1', 'test2', 'test3']},
          { id: 'set', type: 'set', text: '设置', surface: 'danger', target: [] }
        ]
      },
      nowIndex: 0
    }
  }

  getUser(){
    httpFetch.get(`${config.baseUrl}/api/account`).then((response)=>{
      this.setState({userInfo:response.data})
    });
  }

  getTitleHead(){
    let params = {
      titleType: 'test'
    };
    httpFetch.get(`${config.baseUrl}/api/title/head/get/${this.props.params.id}`).then(response=>{
      this.setState({
        loading: false,
        titleHead: response.data
      })
    })
  }

  getTitleDetail(){
    let json = this.state.json;
    httpFetch.get(`${config.baseUrl}/api/title/line/search?id=${this.props.params.id}&flag=true`).then(response=>{
      json.forms = response.data;
      this.setState({
        loading: false,
        data: response.data,
        json
      })
    })
  }

  componentWillMount(){
    localStorage.setItem('time',5400+new Date().getTime());

    let json = localStorage.getItem("json");
    console.log(json.forms)
    this.getUser();
    this.getTitleHead();
    this.getTitleDetail()
  }

  handleChange = (item,index)=>{
    if(this.state.nowIndex!=index){
      this.setState({
        nowIndex: index
      })
    }
  };


  renderTag() {
    const {data} = this.state;
    let tags = [];

    data.map((item,index)=>{
      if(index!=0&&(index+1)/10==0)
      tags.push(<Col><MyTag checked={index==this.state.nowIndex} handleChange={()=>this.handleChange(item,index)}>{index+1}</MyTag></Col>)
      tags.push(<MyTag checked={index==this.state.nowIndex} handleChange={()=>this.handleChange(item,index)}>{index+1}</MyTag>)
    });

    return tags
  }

  handleSelect= (value)=>{
    console.log(value)
    let {answer,json,nowIndex} = this.state;
    json.forms[nowIndex].answer = value;
    answer.push(json.forms[nowIndex]);
    this.setState({answer, json});
    localStorage.setItem("json",json);
    localStorage.setItem("answer",answer);
  };

  handleInput =(e) =>{
   this.handleSelect(e.target.value)
  };

  //渲染表单组
  renderFields = () => {
    const { getFieldDecorator } = this.props.form;
    const { json, editMode,nowIndex } = this.state;
    const formItemLayout = {
      labelCol: json.layout.labelCol,
      wrapperCol: json.layout.wrapperCol
    };
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };
    let title = json.forms[nowIndex];
    console.log(title)
    if(!!title){
      if(title.type === 'select')
        return <FormItem {...formItemLayout}>
         {getFieldDecorator(title.uuid, {
          initialValue: title.answer,
          rules: [{
            required: true,
            message: this.props.intl.formatMessage({id: "common.can.not.be.empty"}, {name: title.label}),  //name 不可为空
          }]
        })(
          <div className="title-info">
            {nowIndex+1+"、"}
            <b style={{marginLeft:10,width:200}}>{title.title}</b>
            <div className="group-options">
              {
                title.type=='select'?
                <RadioGroup  value={title.answer}>
                  {json.forms[nowIndex].options.map((option)=>{
                    return <Radio style={radioStyle} onClick={()=>{this.handleSelect(option)}} value={option} key={option}>{option}</Radio>
                  })}
                </RadioGroup>
                : null
              }
            </div>
          </div>

        )}
      </FormItem>;
      else return <div>
        {title.title}<Input value={title.answer} onChange={this.handleInput} ref="input"/>
      </div>
    }
    return null;
  };

  forward = ()=>{
    const {json, nowIndex} = this.state;
    if(nowIndex<json.forms.length-1){
      this.setState({
        nowIndex: this.state.nowIndex+1
      })
    }
  };

  backward = ()=>{
    if(this.state.nowIndex>0){
      this.setState({
        nowIndex: this.state.nowIndex-1
      })
    }
  };

  handleSubmit = (e)=> {
    let value = [];
    let {json, titleHead,userInfo} = this.state;

    httpFetch.post(`${config.baseUrl}/api/title/get/score/test?headId=${titleHead.id}&userNumber=${userInfo.userNumber}`,json.forms).then(res=>{
      console.log(res)
      this.context.router.push(menuRoute.indexUrl);
    })
  };

  render(){
    const {loading, data, headTips, userInfo,titleHead, json} = this.state;
    return (
      <div className="test-page">
        <div className="user-center-head">
          你好
          <span className="head-user-tips"> {userInfo.userNumber} </span>
          欢迎使用在线考试系统！
          <span className="head-user-tips">退出系统</span>
          <span className="head-tips">
            {
              headTips.map(item=><span className="head-tips-item" id={item.id}>{item.label}</span>)
            }
          </span>
        </div>
        <div className="test-page-center">
          {titleHead.titleName}
        </div>
        <div className="title-title-num">
          {this.renderTag()}
        </div>
        <Form
          style={{ width: json.layout.width }}
          className="page-title-jsq"
        >
          <Row gutter={json.layout.gutter} type="flex" align={json.layout.align} justify={json.layout.justify}>
            {this.renderFields()}
          </Row>
          <Icon type="step-forward" style={{marginLeft:45}} onClick={this.forward}>下一题</Icon>
          <Icon type="step-backward"  style={{marginLeft:75}} onClick={this.backward}>上一题</Icon>
         {/* <div>{this.leftTimer()}</div>*/}
         <div  className="timer">
           <Timer/>
         </div>
          <Button onClick={this.handleSubmit} className="submit">提交</Button>
        </Form>
      </div>)
  }
}
TestPage.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
  return {
    user: state.login.user
  }
}
const WrappedTestPage = Form.create()(injectIntl(TestPage));
export default connect(mapStateToProps)(injectIntl(WrappedTestPage));
