import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

import { Alert, Form, Switch, Icon, Input, Select, Button, Row, Col, message } from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;

import httpFetch from 'share/httpFetch'
import menuRoute from 'share/menuRoute'
import config from 'config'

class NewBudgetGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      budgetOrganization: menuRoute.getRouteItem('budget-organization','key'),    //组织定义的页面项
      loading: false
    };
  }

  componentWillMount(){

  }

  render(){
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <h3 className="header-title">新建预算项目组</h3>
        <div className="common-top-area">
          <Form>
            <Row gutter={40}>
              <Col span={8}>
                <FormItem label="预算组织">
                  {getFieldDecorator("organizationName")(
                    <Input/>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="预算项目组代码">
                  {getFieldDecorator("groupCode")(
                    <Input placeholder="请输入"/>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="预算项目组描述">
                  {getFieldDecorator("groupName")(
                    <Input placeholder="请输入"/>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem label="状态">
                  {getFieldDecorator('isEnabled', {
                    initialValue: true
                  })(
                    <Switch defaultChecked={true} checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="cross" />}/>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Button htmlType="submit" type="primary">保存</Button>
                <Button style={{ marginLeft: 8 }}>取消</Button>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    )
  }

}

function mapStateToProps(state) {
  return {
    organization: state.budget.organization
  }
}

NewBudgetGroup.contextTypes = {
  router: React.PropTypes.object
};

const WrappedNewBudgetGroup = Form.create()(NewBudgetGroup);

export default connect(mapStateToProps)(injectIntl(WrappedNewBudgetGroup));
