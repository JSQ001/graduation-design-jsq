import React from 'react'
import { connect } from 'react-redux'
import { Form, Input, Switch, Button, Icon } from 'antd'
const FormItem = Form.Item;

import 'styles/setting/value-list/new-value.scss'

class ValueList extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      item: {
        allChoice: false,
        common: false,
        corporationOIDs: [],
        customEnumerationOID: "",
        departmentOIDs: [],
        enabled: true,
        keyword: "",
        messageKey: "",
        patientia: false,
        remark: "",
        returnChoiceUserOIDs: [],
        userOIDs: [""],
        userSummaryDTOs: [],
        value: "",
      }
    };
  }

  componentWillMount(){

  }

  handleSave = (e) =>{
    e.preventDefault();
    let value = this.props.form.getFieldsValue();
    this.props.close(value);
  };

  onCancel = () =>{
    this.props.close();
  };

  render(){
    const { getFieldDecorator } = this.props.form;
    const {} = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14, offset: 1 },
    };
    return (
      <div className="new-value">
        <Form onSubmit={this.handleSave}>
          <div className="common-item-title">基本信息</div>
          <FormItem {...formItemLayout} label="状态">
            {getFieldDecorator('enabled', {
              initialValue: true
            })(
              <Switch checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="cross" />}/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="值名称">
            {getFieldDecorator('messageKey', {
              rules: [{
                required: true,
                message: '请输入值名称',
              },{
                max: 100,
                message: '值名称最多100个字符',
              }],
              initialValue: ''
            })(
              <Input placeholder="请输入值名称，最多100个字符" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="编码">
            {getFieldDecorator('value', {
              rules: [{
                required: true,
                message: '请输入值编码',
              }],
              initialValue: ''
            })(
              <Input placeholder="请输入" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="备注">
            {getFieldDecorator('remark', {
              rules: [{
                max: 200,
                message: '值名称最多200个字符',
              }],
              initialValue: ''
            })(
              <Input placeholder="请输入，最多200个字符" />
            )}
          </FormItem>

          <div className="slide-footer">
            <Button type="primary" htmlType="submit">保存</Button>
            <Button onClick={this.onCancel}>取消</Button>
          </div>
          <div className="common-item-title">数据权限</div>
        </Form>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {}
}

const WrappedValueList = Form.create()(ValueList);

export default connect(mapStateToProps)(WrappedValueList);
