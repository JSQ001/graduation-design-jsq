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

class NewClass extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      classDetail: {},
      dept:[],
      major:[],
      grade:[{label: Date().toString().slice(11,15)+ "级"}],
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
        let method = !this.state.classDetail.id ? httpFetch.post(`${config.baseUrl}/api/class/insert`,values):
          httpFetch.put(`${config.baseUrl}/api/class/update`,{...values, id:this.state.classDetail.id});
        method.then((res)=>{
          this.setState({loading: false});
          if(res.status === 200){
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
    this.props.close();
  };

  switchChange = () => {
    this.setState((prevState) => ({
      isEnabled: !prevState.isEnabled
    }))
  };

  handleDept = () =>{
    httpFetch.get(`${config.baseUrl}/api/department/search?enabled=true`).then(response=>{
      console.log(response)
      this.setState({
        dept: response.data
      })
    })
  };

  handleMajor = () =>{
    let deptId = this.props.form.getFieldValue("deptId");
    httpFetch.get(`${config.baseUrl}/api/major/search?enabled=true&deptId=${deptId}`).then(response=>{
      console.log(response)
      this.setState({
        major: response.data
      })
    })
  };

  render(){
    const { getFieldDecorator } = this.props.form;
    const { isEnabled, classDetail, grade, dept,major } = this.state;
    const { formatMessage } = this.props.intl;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14, offset: 1 },
    };
    return (
      <div className="new-department-manage">
        <Form onSubmit={this.handleSave}>
          <FormItem {...formItemLayout} label="年级">
            {getFieldDecorator('grade', {
              rules: [{
                required: true,
                message: formatMessage({id: "common.please.enter"}/*请输入*/)
              }],
              initialValue: !classDetail.id ? Date().toString().slice(11,15)+ "级" : classDetail.grade
            })(
              <Select disabled className="input-disabled-color" placeholder={formatMessage({id: "common.please.enter"})}>
                {grade.map((item)=><Option value={item.label}>{item.label}</Option>)}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="系部">
            {getFieldDecorator('deptId', {
              rules: [{
                required: true,
                message: formatMessage({id: "common.please.enter"}/*请输入*/)
              }],
              initialValue: ""
            })(
              <Select disabled={!!classDetail.id} className="input-disabled-color" placeholder={formatMessage({id: "common.please.enter"})}
                      onFocus={this.handleDept}>
                {dept.map((item)=><Option value={item.id}>{item.deptName}</Option>)}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="专业">
            {getFieldDecorator('majorId', {
              rules: [{
                required: true,
                message: formatMessage({id: "common.please.enter"}/*请输入*/)
              }],
              initialValue: ""
            })(
              <Select disabled={!!classDetail.id} className="input-disabled-color" placeholder={formatMessage({id: "common.please.enter"})}
                      onFocus={this.handleMajor}>
                {major.map((item)=><Option value={item.id}>{item.majorName}</Option>)}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="班级名称">
            {getFieldDecorator('className', {
              rules: [{
                required: true,
                message: formatMessage({id: "common.please.enter"}/*请输入*/)
              }],
              initialValue: classDetail.className
            })(
              <Input placeholder={formatMessage({id: "common.please.enter"}/*请输入*/)} />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={formatMessage({id: "common.column.status"}/*状态*/)}>
            {getFieldDecorator('isEnabled', {
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

const WrappedNewClass = Form.create()(injectIntl(NewClass));

export default connect(mapStateToProps)(WrappedNewClass);
