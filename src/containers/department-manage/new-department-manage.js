import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { Form, Input, Switch, Button, Icon, Checkbox, Alert, message, DatePicker } from 'antd'
import moment from 'moment'
const FormItem = Form.Item;
const { TextArea } = Input;
import httpFetch from 'share/httpFetch'
import config from 'config'
import 'styles/department-manage/new-department-mamnage.scss'

class NewDepartmentManage extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      deptDetail: {},
      isEnabled: true,
      loading: false,
      firstRender: true
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      deptDetail: nextProps.params
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
        console.log(values)
        //this.setState({loading: true});
        let method = !this.state.deptDetail.id ? httpFetch.post(`${config.baseUrl}/api/department/insert`,values):
          httpFetch.put(`${config.baseUrl}/api/department/update`,{...values, id:this.state.deptDetail.id});
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

  render(){
    const { getFieldDecorator } = this.props.form;
    const { isEnabled, deptDetail } = this.state;
    const { formatMessage } = this.props.intl;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14, offset: 1 },
    };
    return (
      <div className="new-department-manage">
        <Form onSubmit={this.handleSave}>
          <FormItem {...formItemLayout} label="系部代码">
            {getFieldDecorator('deptCode', {
              rules: [{
                required: true,
                message: formatMessage({id: "common.please.enter"}/*请输入*/)
              }],
              initialValue: deptDetail.deptCode
            })(
              <Input disabled={!!deptDetail.id} className="input-disabled-color" placeholder={formatMessage({id: "common.please.enter"})}/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="系部名称">
            {getFieldDecorator('deptName', {
              rules: [{
                required: true,
                message: formatMessage({id: "common.please.enter"}/*请输入*/)
              }],
              initialValue: deptDetail.deptName
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
              initialValue: !!deptDetail.id ? moment( deptDetail.createdDate, 'YYYY-MM-DD') : null
            })(
              <DatePicker disabled={!!deptDetail.id} placeholder={formatMessage({id: "common.please.select"}/*请输入*/)} />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="备注">
            {getFieldDecorator('description', {
              initialValue: ''
            })(
              <TextArea autosize={{minRows: 2}}
                        style={{minWidth:'100%'}}
                        placeholder={formatMessage({id: "common.please.enter"}/*请输入*/)}/>
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

const WrappedNewDepartmentManage = Form.create()(injectIntl(NewDepartmentManage));

export default connect(mapStateToProps)(WrappedNewDepartmentManage);
