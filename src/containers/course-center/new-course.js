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


class NewCourse extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      courseDetail: {},
      teacher:[],
      courseType:[
        {label: '公共课', value:'common'},
        {label: '专业课', value:'pre'},
        {label: '选修课', value:'select'}
      ],
      isEnabled: true,
      loading: false,
      firstRender: true
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
        this.setState({loading: true});
        values = {...values,deptId: this.state.classDetail.deptId};
        let method = !this.state.classDetail.id ? httpFetch.post(`${config.baseUrl}/api/course/insert`,values):
          httpFetch.put(`${config.baseUrl}/api/course/update`,{...values, id:this.state.classDetail.id});
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

  getTeacher = () =>{
    httpFetch.get(`${config.baseUrl}/api/user/teacher/all`).then(response=>{
      this.setState({teacher: response.data})
    })
  };

  switchChange = () => {
    this.setState((prevState) => ({
      isEnabled: !prevState.isEnabled
    }))
  };

  render(){
    const { getFieldDecorator } = this.props.form;
    const { isEnabled, courseDetail, teacher, courseType } = this.state;
    const { formatMessage } = this.props.intl;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14, offset: 1 },
    };
    return (
      <div className="new-department-manage">
        <Form onSubmit={this.handleSave}>
          <FormItem {...formItemLayout} label="课程号">
            {getFieldDecorator('courseNumber', {
              rules: [{
                required: true,
                message: formatMessage({id: "common.please.enter"}/*请输入*/)
              }],
              initialValue: courseDetail.className
            })(
              <Input placeholder={formatMessage({id: "common.please.enter"}/*请输入*/)} />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="课程类型">
            {getFieldDecorator('courseType', {
              rules: [{
                required: true,
                message: formatMessage({id: "common.please.select"}/*请输入*/)
              }],
              initialValue: courseDetail.courseType
            })(
              <Select placeholder={formatMessage({id: "common.please.select"})}>
                {courseType.map(item=><option key={item.value}>{item.label}</option>)}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="课程名称">
            {getFieldDecorator('courseName', {
              rules: [{
                required: true,
                message: formatMessage({id: "common.please.enter"}/*请输入*/)
              }],
              initialValue: courseDetail.className
            })(
              <Input placeholder={formatMessage({id: "common.please.enter"}/*请输入*/)} />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="讲师">
            {getFieldDecorator('teacherId', {
              rules: [{
                required: true,
                message: formatMessage({id: "common.please.enter"}/*请输入*/)
              }],
              initialValue: courseDetail.className
            })(
              <Select placeholder={formatMessage({id: "common.please.select"})}
                  onFocus={this.getTeacher}>
                {teacher.map(item=><option key={item.id}>{item.nickName}</option>)}
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

function mapStateToProps(state) {
  return {}
}

const WrappedNewCourse = Form.create()(injectIntl(NewCourse));

export default connect(mapStateToProps)(WrappedNewCourse);
