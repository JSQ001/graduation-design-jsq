import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'

import httpFetch from 'share/httpFetch'
import config from 'config'
import { Form, Input, Switch, message, Icon, Row, Col, Button } from 'antd'
const FormItem = Form.Item;

class NewBudgetStrategy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleSave = (e) =>{
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        httpFetch.post(`${config.budgetUrl}/api/budget/scenarios`, values).then((res)=>{
          console.log(res);
          if(res.status == 200){
            this.props.close(true);
            message.success('操作成功');
          }
        }).catch((e)=>{

        })
      }
    });
  };

  render(){
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14, offset: 1 },
    };
    return (
      <div>
        <Form onSubmit={this.handleSave}>
          <FormItem {...formItemLayout} label="预算控制策略代码">
            {getFieldDecorator('organizationCode', {
              rules: [{
                required: true,
                message: '请输入',
              }],
              initialValue: ''
            })(
              <Col span={15}><Input placeholder="请输入" /></Col>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="预算控制策略描述">
            {getFieldDecorator('organizationName', {
              rules: [{
                required: true,
                message: '请输入',
              }],
              initialValue: ''
            })(
              <Col span={15}><Input placeholder="请输入" /></Col>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="状态">
            {getFieldDecorator('isEnabled', {
              initialValue: true
            })(
              <Switch defaultChecked={true} checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="cross" />}/>
            )}
          </FormItem>
          <FormItem wrapperCol={{ offset: 7 }}>
            <Row gutter={1}>
              <Col span={3}><Button type="primary" htmlType="submit" loading={this.state.loading}>保存</Button></Col>
              <Col span={3}><Button>取消</Button></Col>
            </Row>
          </FormItem>
        </Form>
      </div>
    )
  }

}

function mapStateToProps() {
  return {}
}

const WrappedValueList = Form.create()(NewBudgetStrategy);

export default connect(mapStateToProps)(WrappedValueList);

