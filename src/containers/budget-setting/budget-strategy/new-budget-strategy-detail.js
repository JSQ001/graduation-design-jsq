import React from 'react'
import { connect } from 'react-redux'

import httpFetch from 'share/httpFetch'
import config from 'config'
import { Form, Input, Row, Col, Select, Button } from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;

import 'styles/budget/budget-strategy/new-budget-strategy-detail.scss'

class NewBudgetStrategyDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  handleSave = (e) =>{
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        httpFetch.post(`${config.budgetUrl}/api/budget/control/strategy/details`, values).then((res)=>{
          console.log(res);
          if(res.status == 200){
            message.success('操作成功');
          }
        }).catch((e)=>{

        })
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const {  } = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14, offset: 1 },
    };
    return (
      <div className="new-budget-strategy-detail">
        <Form onSubmit={this.handleSave}>
          <Row gutter={40}>
            <Col span={8} style={{ display: 'inline-block'}}>
              <FormItem label="序号">
                {getFieldDecorator('detailSequence', {
                  rules: [{
                    required: true,
                    message: '请输入'
                  }],
                  initialValue: ''
                })(
                  <Input placeholder="请输入" />
                )}
              </FormItem>
            </Col>
            <Col span={8} style={{ display: 'inline-block'}}>
              <FormItem label="明细代码">
                {getFieldDecorator('detailCode', {
                  rules: [{
                    required: true,
                    message: '请输入'
                  }],
                  initialValue: ''
                })(
                  <Input placeholder="请输入" />
                )}
              </FormItem>
            </Col>
            <Col span={8} style={{ display: 'inline-block'}}>
              <FormItem label="控制策略">
                {getFieldDecorator('controlMethod', {
                  rules: [{
                    required: true,
                    message: '请选择'
                  }]})(
                  <Select placeholder="请选择">
                    <Option value="error">禁止</Option>
                    <Option value="warning">警告</Option>
                    <Option value="pass">通过</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={8} style={{ display: 'inline-block'}}>
              <FormItem label="控制规则描述">
                {getFieldDecorator('detailName', {
                  rules: [{
                    required: true,
                    message: '请输入'
                  }],
                  initialValue: ''
                })(
                  <Input placeholder="请输入" />
                )}
              </FormItem>
            </Col>
            <Col span={8} style={{ display: 'inline-block'}}>
              <FormItem label="消息">
                {getFieldDecorator('messageCode', {
                  /*rules: [{
                    required: true,
                    message: '请输入'
                  }],*/
                  initialValue: ''
                })(
                  <Input placeholder="请输入" />
                )}
              </FormItem>
            </Col>
            <Col span={8} style={{ display: 'inline-block'}}>
              <FormItem label="事件">
                {getFieldDecorator('expWfEvent', {
                  /*rules: [{
                    required: true,
                    message: '请输入'
                  }],*/
                  initialValue: ''
                })(
                  <Input placeholder="请输入" />
                )}
              </FormItem>
            </Col>
          </Row>
          <div>
            <Button type="primary" htmlType="submit" style={{marginRight:'20px'}}>保存</Button>
            <Button>取消</Button>
          </div>
        </Form>
      </div>
    )
  }
}

function mapStateToProps() {
  return {}
}

const WrappedNewBudgetStrategyDetail = Form.create()(NewBudgetStrategyDetail);

export default connect(mapStateToProps)(WrappedNewBudgetStrategyDetail);
