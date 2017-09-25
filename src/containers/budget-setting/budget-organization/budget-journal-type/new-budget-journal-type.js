import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { Form, Switch, Icon, Input, Select, Button, Row, Col, message } from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;

import httpFetch from 'share/httpFetch'
import menuRoute from 'share/menuRoute'
import config from 'config'

class NewBudgetJournalType extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      budgetJournalTypeDetailPage: menuRoute.getRouteItem('budget-journal-type-detail','key'),    //项目组详情的页面项
      loading: false
    };
  }

  handleSave = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({loading: true});
        values.organisationId = this.props.organization.id;
        httpFetch.post(`${config.budgetUrl}/api/budget/journal/types`, values).then((res)=>{
          this.setState({loading: false});
          message.success(`项目组${res.data.journalTypeName}新建成功`);
          this.context.router.replace(this.state.budgetJournalTypeDetailPage.url.replace(":typeId", res.data.id));
        }).catch((e)=>{
          if(e.response){
            message.error(`新建失败, ${e.response.data.validationErrors[0].message}`);
            this.setState({loading: false});
          } else {
            console.log(e)
          }
        })
      }
    });
  };

  render(){
    const { getFieldDecorator } = this.props.form;
    return (
      <div onSubmit={this.handleSave}>
        <h3 className="header-title">新建预算日记账类型</h3>
        <div className="common-top-area">
          <Form>
            <Row gutter={40}>
              <Col span={8}>
                <FormItem label="预算日记账类型代码">
                  {getFieldDecorator("journalTypeCode")(
                    <Input />
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="业务日记账类型描述">
                  {getFieldDecorator("journalTypeName")(
                    <Input placeholder="请输入"/>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="预算业务类型">
                  {getFieldDecorator("businessType")(
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

NewBudgetJournalType.contextTypes = {
  router: React.PropTypes.object
};

const WrappedNewBudgetJournalType = Form.create()(NewBudgetJournalType);

export default connect(mapStateToProps)(injectIntl(WrappedNewBudgetJournalType));
