import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

import { Alert, Form, Switch, Icon, Input, Select, Button, Row, Col } from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;

class NewBudgetOrganization extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleSave = (e) => {
    e.preventDefault();
    let value = this.props.form.getFieldsValue();
    console.log(value)
  };

  render(){
    const { getFieldDecorator } = this.props.form;
    const {} = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 10, offset: 1 },
    };
    return (
      <div>
        <Alert
          message="帮助提示"
          description="同一账套下只能有一个生效的预算组织代码，且同一租户下预算组织代码不允许重复。保存后不可修改。"
          type="info"
          showIcon
        />
        <Form onSubmit={this.handleSave}>
          <FormItem {...formItemLayout} label="帐套">
            {getFieldDecorator('setOfBooksId', {
              rules: [{
                required: true,
                message: '请选择帐套'
              }],
              initialValue: ''
            })(
              <Select placeholder="请选择帐套">
                <Option value='HEC_TEST_DATA_002' key='HEC_TEST_DATA_002'>HEC_TEST_DATA_002</Option>
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="预算组织代码">
            {getFieldDecorator('organizationCode', {
              rules: [{
                required: true,
                message: '请输入预算组织代码',
              }],
              initialValue: ''
            })(
              <Input placeholder="请输入预算组织代码" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="预算组织名称">
            {getFieldDecorator('organizationName', {
              rules: [{
                required: true,
                message: '请输入预算组织名称',
              }],
              initialValue: ''
            })(
              <Input placeholder="请输入预算组织名称" />
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
              <Col span={3}><Button type="primary" htmlType="submit">保存</Button></Col>
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

const WrappedNewBudgetOrganization = Form.create()(NewBudgetOrganization);

export default connect(mapStateToProps)(injectIntl(WrappedNewBudgetOrganization));
