import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { Form, Switch, Icon, Input, Select, Button, Row, Col, message } from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;

import httpFetch from 'share/httpFetch'
import menuRoute from 'share/menuRoute'
import config from 'config'

class NewBudgetGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      budgetGroupDetail: menuRoute.getRouteItem('budget-group-detail','key'),    //项目组详情的页面项
      budgetOrganization: menuRoute.getRouteItem('budget-organization-detail', 'key'),  //预算组织详情的页面项
      loading: false
    };
  }

  handleSave = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.organizationId =  this.props.organization.id;
        this.setState({loading: true});
        httpFetch.post(`${config.budgetUrl}/api/budget/groups`, values).then((res)=>{
          this.setState({loading: false});
          message.success(`项目组${res.data.itemGroupName}新建成功`);
          this.context.router.replace(this.state.budgetGroupDetail.url.replace(":id", this.props.organization.id).replace(":groupId", res.data.id));
        }).catch((e)=>{
          if(e.response){
            message.error(`新建失败, ${e.response.data.message}`);
          }
          this.setState({loading: false});
        })
      }
    });
  };

  render(){
    const { getFieldDecorator } = this.props.form;
    const { formatMessage } = this.props.intl;
    return (
      <div onSubmit={this.handleSave}>
        <h3 className="header-title">新建预算项目组</h3>
        <div className="common-top-area">
          <Form>
            <Row gutter={40}>
              <Col span={8}>
                <FormItem label="预算组织">
                  {getFieldDecorator("organizationName", {
                    initialValue: this.props.organization.organizationName
                  })(
                    <Input disabled />
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="预算项目组代码">
                  {getFieldDecorator("itemGroupCode", {
                    rules: [{
                      required: true,
                      message: formatMessage({id: 'common.please.enter'}),  //请输入
                    }],
                    initialValue: ''
                  })(
                    <Input placeholder="请输入"/>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="预算项目组描述">
                  {getFieldDecorator("itemGroupName", {
                    rules: [{
                      required: true,
                      message: formatMessage({id: 'common.please.enter'}),  //请输入
                    }],
                    initialValue: ''
                  })(
                    <Input placeholder="请输入"/>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem label="状态">
                  {getFieldDecorator('isEnabled', {
                    initialValue: true,
                    valuePropName: 'checked'
                  })(
                    <Switch checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="cross" />}/>
                  )}&nbsp;&nbsp;&nbsp;&nbsp;{this.props.form.getFieldValue('isEnabled') ? formatMessage({id: "common.status.enable"}) : formatMessage({id: "common.status.disable"})}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Button htmlType="submit" type="primary">保存</Button>
                <Button style={{ marginLeft: 8 }} onClick={() => {this.context.router.push(this.state.budgetOrganization.url.replace(":id", this.props.organization.id) + '?tab=GROUP');}}>取消</Button>
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
