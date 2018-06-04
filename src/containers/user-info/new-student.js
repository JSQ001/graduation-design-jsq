import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { Form, Input, Select, Switch, Button, Icon, Checkbox, Alert, message, DatePicker,Radio } from 'antd'
import moment from 'moment'
const FormItem = Form.Item;
const { TextArea } = Input;
import httpFetch from 'share/httpFetch'
import config from 'config'
const RadioGroup = Radio.Group;
const Option = Select.Option;

class NewStudent extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      studentDetail: {},
      dept: [],
      clas: [],
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

  handleDept = () =>{
    httpFetch.get(`${config.baseUrl}/api/department/search?enabled=true`).then(response=>{
      console.log(response)
      this.setState({
        dept: response.data
      })
    })
  };

  handleClass = () =>{
    httpFetch.get(`${config.baseUrl}/api/class/search?enabled=true`).then(response=>{
      console.log(response)
      this.setState({
        clas: response.data
      })
    })
  };

  handleSave = (e) =>{
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        //this.setState({loading: true});
        console.log(values)
        values.role = [3];
        let method = !this.state.studentDetail.id ? httpFetch.post(`${config.baseUrl}/api/user/insert`,values):
          httpFetch.put(`${config.baseUrl}/api/user/update`,{...values, id:this.state.studentDetail.id});
        method.then((res)=>{
          this.setState({loading: false});
          if(res.status === 200){
            this.props.close(true);
            this.props.form.resetFields()
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
    this.props.form.resetFields()
    this.props.close();
  };

  switchChange = () => {
    this.setState((prevState) => ({
      isEnabled: !prevState.isEnabled
    }))
  };

  render(){
    const { getFieldDecorator } = this.props.form;
    const { isEnabled, studentDetail, dept,clas  } = this.state;
    const { formatMessage } = this.props.intl;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14, offset: 1 },
    };
    return (
      <div className="new-department-manage">
        <Form onSubmit={this.handleSave}>
          <FormItem {...formItemLayout} label="系部">
            {getFieldDecorator('deptId', {
              rules: [{
                required: true,
                message: formatMessage({id: "common.please.select"}/*请输入*/)
              }],
              initialValue: ""
            })(
              <Select disabled={!!studentDetail.id}  className="input-disabled-color"
                      placeholder={this.props.intl.formatMessage({id: 'common.please.select'})}
                      onFocus={this.handleDept}>
                {dept.map((item)=><Option key={item.id}>{item.deptName}</Option>)}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="班级">
            {getFieldDecorator('classId', {
              rules: [{
                required: true,
                message: formatMessage({id: "common.please.enter"}/*请输入*/)
              }],
              initialValue: ""
            })(
              <Select  className="input-disabled-color" placeholder={formatMessage({id: "common.please.enter"})}
                       onFocus={this.handleClass}>
                {clas.map((item)=><Option key={item.id}>{item.className}</Option>)}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="学号">
            {getFieldDecorator('userNumber', {
              rules: [{
                required: true,
                message: formatMessage({id: "common.please.enter"}/*请输入*/)
              }],
              initialValue: studentDetail.className
            })(
              <Input placeholder={formatMessage({id: "common.please.enter"}/*请输入*/)} />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="姓名">
            {getFieldDecorator('nickName', {
              rules: [{
                required: true,
                message: formatMessage({id: "common.please.enter"}/*请输入*/)
              }],
              initialValue: studentDetail.className
            })(
              <Input placeholder={formatMessage({id: "common.please.enter"}/*请输入*/)} />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="电话">
            {getFieldDecorator('phone')(
              <Input placeholder={formatMessage({id: "common.please.enter"}/*请输入*/)} />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="性别">
            {getFieldDecorator('gender', {
              initialValue: "man"
            })(
              <RadioGroup placeholder={formatMessage({id: "common.please.enter"}/*请输入*/)}>
                <Radio value="man" >男</Radio>
                <Radio valu="woman" >女</Radio>
              </RadioGroup>
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
          {!!studentDetail.id ?
            <FormItem {...formItemLayout} label="重置密码">
              {getFieldDecorator('password', {
                initialValue: "man"
              })(
                <Checkbox
                  indeterminate={this.state.indeterminate}
                  onChange={this.onCheckAllChange}
                  checked={this.state.checkAll}/>
              )}
            </FormItem>: null
          }
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

const WrappedNewStudent = Form.create()(injectIntl(NewStudent));

export default connect(mapStateToProps)(WrappedNewStudent);
