import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { Form, Input, Select, Switch, Button, Icon, Checkbox, Alert, message, DatePicker } from 'antd'
import moment from 'moment'
const FormItem = Form.Item;
const { TextArea } = Input;
import httpFetch from 'share/httpFetch'
import config from 'config'
import 'styles/department-manage/new-department-mamnage.scss'
const Option = Select.Option;


class NewTitle extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      courseDetail: {},
      teacher:[],
      course:[],
      isEnabled: true,
      loading: false,
      titleType:[
        {label: '考试题', value: 'test'},
        {label: '练习题', value: 'work'}
      ]
    };
  }


  componentWillReceiveProps(nextProps) {
    console.log(nextProps.params)
    this.setState({
      classDetail: nextProps.params
    });
    if (!nextProps.params.hasInit) {
      nextProps.params.hasInit = true;
      this.setState({ isEnabled: true },() => {
        this.props.form.resetFields()
      })
    }
  }

  handleSave = (e) =>{
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        //this.setState({loading: true});
        values = {...values,teacherId: 1};
        console.log(values)
        console.log(this.props.user)
        let method = !this.state.classDetail.id ? httpFetch.post(`${config.baseUrl}/api/title/head/insert`,values):
          httpFetch.put(`${config.baseUrl}/api/title/head/update`,{...values, id:this.state.titleDetail.id});
        method.then((res)=>{
          this.setState({loading: false});
          if(res.status === 200){
            this.props.form.resetFields();
            this.props.close(true);
            message.success(this.props.intl.formatMessage({id: "common.create.success"}, {name: ""})/*新建成功*/);
          }
        }).catch((e)=>{
          if(e.response){
            message.error(`${this.props.intl.formatMessage({id: "common.create.filed"}/*新建失败*/)}, ${e.response.data.message}`);
          }
          this.setState({loading: false});
        })
      }
    });
  };

  onCancel = () =>{
    this.props.form.resetFields();
    this.props.close();
  };

  getCourse = () =>{
    httpFetch.get(`${config.baseUrl}/api/course/all`).then(response=>{
      this.setState({
        course: response.data
      })
    })
  };

  switchChange = () => {
    this.setState((prevState) => ({
      isEnabled: !prevState.isEnabled
    }))
  };

  render(){
    const { getFieldDecorator } = this.props.form;
    const { isEnabled, courseDetail, titleType, course } = this.state;
    const { formatMessage } = this.props.intl;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14, offset: 1 },
    };
    return (
      <div className="new-department-manage">
        <Form onSubmit={this.handleSave}>
          <FormItem {...formItemLayout} label="课程名称">
            {getFieldDecorator('courseId', {
              rules: [{
                required: true,
                message: formatMessage({id: "common.please.select"}/*请输入*/)
              }],
              initialValue: courseDetail.courseType
            })(
              <Select placeholder={formatMessage({id: "common.please.select"})}
                onFocus={this.getCourse}>
                {course.map(item=><Option key={item.id}>{item.courseName}</Option>)}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="试题号">
            {getFieldDecorator('titleNumber', {
              rules: [{
                required: true,
                message: formatMessage({id: "common.please.enter"}/*请输入*/)
              }],
              initialValue: courseDetail.className
            })(
              <Input placeholder={formatMessage({id: "common.please.enter"}/*请输入*/)} />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="试题名称">
            {getFieldDecorator('titleName', {
              rules: [{
                required: true,
                message: formatMessage({id: "common.please.enter"}/*请输入*/)
              }],
              initialValue: courseDetail.className
            })(
              <Input placeholder={formatMessage({id: "common.please.enter"}/*请输入*/)} />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="试题类型">
            {getFieldDecorator('titleType', {
              rules: [{
                required: true,
                message: formatMessage({id: "common.please.select"}/*请输入*/)
              }],
              //initialValue: courseDetail.courseType
            })(
              <Select placeholder={formatMessage({id: "common.please.select"})}>
                {titleType.map(item=><Option key={item.value}>{item.label}</Option>)}
              </Select>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label={formatMessage({id: "common.column.status"}/*状态*/)}>
            {getFieldDecorator('enabled', {
              valuePropName: "checked",
              initialValue: true
            })(
              <Switch checkedChildren={<Icon type="check"/>} unCheckedChildren={<Icon type="cross" />} onChange={this.switchChange}/>
            )}
            <span className="enabled-type">
              {isEnabled ? formatMessage({id: "common.status.enable"}/*启用*/) : formatMessage({id: "common.status.disable"}/*禁用*/)}
            </span>
          </FormItem>
          <div className="slide-footer">
            <Button type="primary" htmlType="submit" loading={this.state.loading}>{formatMessage({id: "common.save"}/*保存*/)}</Button>
            <Button onClick={this.onCancel}>{formatMessage({id: "common.cancel"}/*取消*/)}</Button>
          </div>
        </Form>
      </div>
    )
  }
}
NewTitle.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
  return {
    user: state.login.user
  }
}

const WrappedNewTitle = Form.create()(injectIntl(NewTitle));

export default connect(mapStateToProps)(WrappedNewTitle);
