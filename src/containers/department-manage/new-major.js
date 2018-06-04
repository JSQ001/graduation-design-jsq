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

class NewMajor extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      majorDetail: {},
      dept:[],
      isEnabled: true,
      loading: false,
      firstRender: true
    };
  }


  componentWillReceiveProps(nextProps) {
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
        let method = !this.state.majorDetail.id ? httpFetch.post(`${config.baseUrl}/api/major/insert`,values):
          httpFetch.put(`${config.baseUrl}/api/major/update`,{...values, id:this.state.majorDetail.id});
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
    this.props.close();
  };

  handleDept = () =>{
    httpFetch.get(`${config.baseUrl}/api/department/search?enabled=true`).then(response=>{
      console.log(response)
      this.setState({
        dept: response.data
      })
    })
  };

  render(){
    const { getFieldDecorator } = this.props.form;
    const { majorDetail, dept } = this.state;
    const { formatMessage } = this.props.intl;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14, offset: 1 },
      wrapperCol: { span: 14, offset: 1 },
    };
    return (
      <div className="new-department-manage">
        <Form onSubmit={this.handleSave}>
          <FormItem {...formItemLayout} label="系部">
            {getFieldDecorator('deptId', {
              rules: [{
                required: true,
                message: formatMessage({id: "common.please.enter"}/*请输入*/)
              }],
              initialValue: ""
            })(
              <Select disabled={!!majorDetail.id} className="input-disabled-color" placeholder={formatMessage({id: "common.please.enter"})}
                onFocus={this.handleDept}>
                {dept.map((item)=><Option value={item.id}>{item.deptName}</Option>)}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="专业名称">
            {getFieldDecorator('majorName', {
              rules: [{
                required: true,
                message: formatMessage({id: "common.please.enter"}/*请输入*/)
              }],
              initialValue: majorDetail.className
            })(
              <Input placeholder={formatMessage({id: "common.please.enter"}/*请输入*/)} />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="成立时间">
            {getFieldDecorator('createdDate', {
              rules: [{
                required: true,
                message: formatMessage({id: "common.please.select"}/*请输入*/)
              }],
              initialValue: !!majorDetail.id ? moment( majorDetail.createdDate, 'YYYY-MM-DD') : null
            })(
              <DatePicker disabled={!!majorDetail.id} placeholder={formatMessage({id: "common.please.select"}/*请输入*/)} />
            )}
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

const WrappedNewMajor = Form.create()(injectIntl(NewMajor));

export default connect(mapStateToProps)(WrappedNewMajor);
