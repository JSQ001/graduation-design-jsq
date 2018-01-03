import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

import menuRoute from 'routes/menuRoute'
import httpFetch from 'share/httpFetch'
import config from 'config'
import { Form, Input, Row, Col, Select, Button, message } from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;

import 'styles/budget-setting/budget-organization/budget-strategy/new-budget-strategy-detail.scss'

class NewBudgetStrategyDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      controlMethodNotice: '',
      controlMethodOptions: [],
      messageCodeOptions: [],
      controlMethodValue: '',
      budgetStrategyDetail:  menuRoute.getRouteItem('budget-strategy-detail','key'),    //控制策略详情
    }
  }

  componentWillMount(){
    this.getSystemValueList(2005).then(res => { //预算控制方法
      let controlMethodOptions = res.data.values;
      this.setState({ controlMethodOptions })
    });
    this.getSystemValueList(2022).then(res => { //预算控制消息
      let messageCodeOptions = res.data.values;
      this.setState({ messageCodeOptions })
    });
  }

  handleSave = (e) =>{
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.controlStrategyId = this.props.params.strategyId;
        if (values.controlMethod !== 'NO_MESSAGE' && !values.messageCode) {
          message.error('请选择消息');
          return;
        }
        this.setState({loading: true});
        httpFetch.post(`${config.budgetUrl}/api/budget/control/strategy/details`, values).then((res)=>{
          if(res.status === 200){
            this.setState({loading: false});
            message.success(this.props.intl.formatMessage({id: 'common.create.success'},{name: ''}) /* 新建成功 */);
            this.handleCancel();
          }
        }).catch((e)=>{
          if(e.response){
            message.error(`${this.props.intl.formatMessage({id: 'common.create.filed'}) /* 新建失败 */}, ${e.response.data.message}`);
          }
          this.setState({loading: false});
        })
      }
    });
  };

  handleCancel = () => {
    this.context.router.push(this.state.budgetStrategyDetail.url.replace(':id', this.props.params.id).replace(':strategyId', this.props.params.strategyId));
  };

  handleMethodChange = (value) => {
    let controlMethodNotice = '';
    if(value === 'BLOCK') {
      controlMethodNotice = '如果满足触发条件，当单据提交时，禁止提交';
    } else if(value === 'ALLOWED') {
      controlMethodNotice = '如果满足触发条件，当单据提交时，进行提示';
    } else {
      controlMethodNotice = '不做任何控制';
      this.props.form.setFieldsValue({messageCode: null})
    }
    this.setState({ controlMethodNotice, controlMethodValue: value })
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { controlMethodNotice, controlMethodOptions, messageCodeOptions, controlMethodValue } = this.state;
    return (
      <div className="new-budget-strategy-detail">
        <Form onSubmit={this.handleSave}>
          <Row>
            <Col span={7}>
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
            <Col span={7} offset={1}>
              <FormItem label="规则代码">
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
            <Col span={7} offset={1}>
              <FormItem label="控制策略" help={controlMethodNotice}>
                {getFieldDecorator('controlMethod', {
                  rules: [{
                    required: true,
                    message: '请选择'
                  }]})(
                  <Select onChange={this.handleMethodChange} placeholder="请选择">
                    {controlMethodOptions.map((option)=>{
                      return <Option key={option.value}>{option.messageKey}</Option>
                    })}
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={7}>
              <FormItem label="控制规则名称">
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
            <Col span={7} offset={1}>
              <FormItem label="消息">
                {getFieldDecorator('messageCode', {
                  rules: [{
                    required: controlMethodValue === 'NO_MESSAGE' ? false : true,
                    message: '请选择'
                  }]})(
                  <Select placeholder="请选择" disabled={controlMethodValue === 'NO_MESSAGE' ? true : false}>
                    {messageCodeOptions && messageCodeOptions.map((option)=>{
                      return <Option key={option.value}>{option.messageKey}</Option>
                    })}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={7} offset={1}>
              <FormItem label="事件">
                {getFieldDecorator('expWfEvent', {
                  initialValue: ''
                })(
                  <Input placeholder="请输入" />
                )}
              </FormItem>
            </Col>
          </Row>
          <div>
            <Button type="primary" htmlType="submit" style={{marginRight:'20px'}} loading={this.state.loading}>保存</Button>
            <Button onClick={this.handleCancel}>取消</Button>
          </div>
        </Form>
      </div>
    )
  }
}

NewBudgetStrategyDetail.contextTypes={
  router:React.PropTypes.object
};

function mapStateToProps(state) {
  return { }
}

const WrappedNewBudgetStrategyDetail = Form.create()(NewBudgetStrategyDetail);

export default connect(mapStateToProps)(injectIntl(WrappedNewBudgetStrategyDetail));

