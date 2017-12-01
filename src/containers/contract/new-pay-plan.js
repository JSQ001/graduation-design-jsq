import React from 'react'
import { injectIntl } from 'react-intl'
import { Form, Button, Input, Row, Col, Select, InputNumber, DatePicker } from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;

class NewPayPlan extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    }
  }

  onCancel = () => {
    this.props.close();
  };

  handleSave = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log(values)
      }
    })
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { loading } = this.state;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 10, offset: 1 },
    };
    return (
      <div className="new-pay-plan">
        <Form onSubmit={this.handleSave}>
          <Row>
            <Col span={8} className="ant-form-item-label label-style">计划金额： </Col>
            <Col span={4} className="ant-col-offset-1">
              <FormItem>
                {getFieldDecorator('currency', {
                  rules: [{
                    required: true,
                    message: '请选择'
                  }],
                  initialValue: 'CNY'
                })(
                  <Select>
                    <Option value="CNY">CNY</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem className="ant-col-offset-1">
                {getFieldDecorator('amount', {
                  rules: [{
                    required: true,
                    message: '请输入'
                  }],
                  initialValue: ''
                })(
                  <InputNumber style={{width:'100%'}}/>
                )}
              </FormItem>
            </Col>
          </Row>
          <FormItem {...formItemLayout} label="合同方类型">
            {getFieldDecorator('partnerCategory', {
              rules: [{
                required: true,
                message: '请选择'
              }],
              initialValue: ''
            })(
              <Select></Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="合同方">
            {getFieldDecorator('partnerId', {
              rules: [{
                required: true,
                message: '请输入'
              }],
              initialValue: ''
            })(
              <Input />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="计划付款日期">
            {getFieldDecorator('dueDate', {
              rules: [{
                required: true,
                message: '请选择'
              }]})(
              <DatePicker style={{width:'100%'}}/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="备注">
            {getFieldDecorator('remark', {
              initialValue: ''
            })(
              <TextArea autosize={{minRows: 2}}
                        style={{minWidth:'100%'}}
                        placeholder="请输入"/>
            )}
          </FormItem>
          <div className="slide-footer">
            <Button type="primary" htmlType="submit" loading={loading}>保存</Button>
            <Button onClick={this.onCancel}>取消</Button>
          </div>
        </Form>
      </div>
    )
  }
}

const wrappedNewPayPlan = Form.create()(injectIntl(NewPayPlan));

export default wrappedNewPayPlan;
