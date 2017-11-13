import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

import { Form, Switch, Icon, Input, Select, Button, Row, Col, message, Spin } from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;

import httpFetch from 'share/httpFetch'
import menuRoute from 'share/menuRoute'
import config from 'config'

class NewCodingRule extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      resetFrequenceOptions: [],
      codingRuleValue: menuRoute.getRouteItem('coding-rule-value', 'key')
    };
  }

  handleSave = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({loading: true});
        values.codingRuleObjectId = this.props.params.id;
        httpFetch.post(`${config.budgetUrl}/api/budget/coding/rules`, values).then((res)=>{
          this.setState({loading: false});
          message.success(this.props.intl.formatMessage({id: 'common.create.success'}, {name: ''}));  //新建成功
          this.context.router.push(this.state.codingRuleValue.url.replace(':id', this.props.params.id).replace(':ruleId', res.data.id));
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
    this.getSystemValueList(2024).then(res => {
      this.setState({ resetFrequenceOptions: res.data.values })
    });
  }

  render(){
    const { formatMessage } = this.props.intl;
    const { getFieldDecorator } = this.props.form;
    const { resetFrequenceOptions, loading, codingRule } = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 10, offset: 1 },
    };
    return (
      <div>
        <Form onSubmit={this.handleSave}>
          <FormItem {...formItemLayout} label="编码规则代码">
            {getFieldDecorator('codingRuleCode', {
              rules: [{
                required: true,
                message: formatMessage({id: 'common.please.enter'})  //请输入
              }]
            })(
              <Input placeholder={formatMessage({id: 'common.please.enter'})/* 请输入 */}/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="编码规则名称">
            {getFieldDecorator('codingRuleName', {
              rules: [{
                required: true,
                message: formatMessage({id: 'common.please.enter'})  //请输入
              }]
            })(
              <Input placeholder={formatMessage({id: 'common.please.enter'})/* 请输入 */}/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="重置频率">
            {getFieldDecorator('resetFrequence', {
              rules: [{
                required: true,
                message: formatMessage({id: 'common.please.select'})  //请选择
              }]
            })(
              <Select placeholder={formatMessage({id: 'common.please.select'})/* 请选择 */}  notFoundContent={<Spin size="small" />}>
                {resetFrequenceOptions.map((option)=>{
                  return <Option key={option.code}>{option.messageKey}</Option>
                })}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="备注">
            {getFieldDecorator('description')(
              <Input placeholder={formatMessage({id: 'common.please.enter'})/* 请输入 */}/>
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
              <Col span={3}><Button onClick={() => {this.context.router.push(codingRule.url.replace(':id', this.props.params.id));}}>{formatMessage({id: 'common.cancel'})/* 取消 */}</Button></Col>
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

NewCodingRule.contextTypes = {
  router: React.PropTypes.object
};

const WrappedNewCodingRule = Form.create()(NewCodingRule);

export default connect(mapStateToProps)(injectIntl(WrappedNewCodingRule));
