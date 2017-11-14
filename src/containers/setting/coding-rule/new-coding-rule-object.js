import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

import { Form, Switch, Icon, Input, Select, Button, Row, Col, message, Spin } from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;

import httpFetch from 'share/httpFetch'
import menuRoute from 'share/menuRoute'
import config from 'config'
import Chooser from 'components/chooser'

class NewCodingRuleObject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      documentCategoryOptions: [],
      codingRuleObject: menuRoute.getRouteItem('coding-rule-object', 'key'),
      codingRule: menuRoute.getRouteItem('coding-rule', 'key')
    };
  }

  handleSave = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({loading: true});
        values.companyCode = values.company[0].companyCode;
        httpFetch.post(`${config.budgetUrl}/api/budget/coding/rule/objects`, values).then((res)=>{
          this.setState({loading: false});
          message.success(this.props.intl.formatMessage({id: 'common.create.success'}, {name: ''}));  //新建成功
          this.context.router.push(this.state.codingRule.url.replace(':id', res.data.id));
        }).catch((e)=>{
          if(e.response){
            message.error(`新建失败, ${e.response.data.message}`);
            this.setState({loading: false});
          } else {
            console.log(e)
          }
        })
      }
    });
  };

  componentWillMount(){
    this.getSystemValueList(2023).then(res => {
      this.setState({ documentCategoryOptions: res.data.values })
    });
  }

  render(){
    const { formatMessage } = this.props.intl;
    const { getFieldDecorator } = this.props.form;
    const { documentCategoryOptions, loading, codingRuleObject } = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 10, offset: 1 },
    };
    return (
      <div>
        <Form onSubmit={this.handleSave}>
          <FormItem {...formItemLayout} label="单据类型">
            {getFieldDecorator('documentCategoryCode', {
              rules: [{
                required: true,
                message: formatMessage({id: 'common.please.select'})  //请选择
              }]
            })(
              <Select placeholder={formatMessage({id: 'common.please.select'})/* 请选择 */}  notFoundContent={<Spin size="small" />}>
                {documentCategoryOptions.map((option)=>{
                  return <Option key={option.code}>{option.messageKey}</Option>
                })}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="应用公司">
            {getFieldDecorator('company', {
              rules: [{
                required: true,
                message: formatMessage({id: 'common.please.select'}),  //请选择
              }]
            })(
              <Chooser single={true} type="company" labelKey="companyName" valueKey="companyCode"/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={formatMessage({id: 'common.column.status'})/* 状态 */}>
            {getFieldDecorator('isEnabled', {
              initialValue: false
            })(
              <Switch defaultChecked={this.props.params.isEnabled} checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="cross" />}/>
            )}
          </FormItem>
          <FormItem wrapperCol={{ offset: 7 }}>
            <Row gutter={1}>
              <Col span={3}><Button type="primary" htmlType="submit" loading={loading}>{formatMessage({id: 'common.save'})/* 保存 */}</Button></Col>
              <Col span={3}><Button onClick={() => {this.context.router.push(codingRuleObject.url)}}>{formatMessage({id: 'common.cancel'})/* 取消 */}</Button></Col>
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

NewCodingRuleObject.contextTypes = {
  router: React.PropTypes.object
};

const WrappedNewCodingRuleObject = Form.create()(NewCodingRuleObject);

export default connect(mapStateToProps)(injectIntl(WrappedNewCodingRuleObject));
