import React from 'react'
import { connect } from 'react-redux'

import menuRoute from 'share/menuRoute'
import httpFetch from 'share/httpFetch'
import config from 'config'
import { Form, Input, Switch, message, Icon, Row, Col, Button } from 'antd'
const FormItem = Form.Item;

import 'styles/budget-setting/budget-organization/budget-strategy/new-budget-strategy.scss'

class NewBudgetStrategy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      isEnabled: true,
      budgetOrganizationDetail:  menuRoute.getRouteItem('budget-organization-detail','key'),    //预算组织详情
      budgetStrategyDetail:  menuRoute.getRouteItem('budget-strategy-detail','key'),    //预算控制策略详情
    };
  }

  handleSave = (e) =>{
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({loading: true});
        values.organizationId = this.props.params.id;
        httpFetch.post(`${config.budgetUrl}/api/budget/control/strategies`, values).then((res)=>{
          if(res.status === 200){
            this.setState({loading: false});
            message.success('新建成功');
            this.context.router.push(this.state.budgetStrategyDetail.url.replace(':id', this.props.params.id).replace(':strategyId', res.data.id));
          }
        }).catch((e)=>{
          this.setState({loading: false});
          if(e.response){
            message.error(`新建失败, ${e.response.data.message}`);
          }
        })
      }
    });
  };

  handleCancle = () => {
    this.context.router.push(this.state.budgetOrganizationDetail.url.replace(':id', this.props.params.id) + '?tab=STRATEGY');
  };

  switchChange = () => {
    this.setState((prevState) => ({
      isEnabled: !prevState.isEnabled
    }))
  };

  render(){
    const { getFieldDecorator } = this.props.form;
    const { isEnabled } = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14, offset: 1 },
    };
    return (
      <div className="new-budget-strategy">
        <Form onSubmit={this.handleSave} style={{width:'55%',margin:'0 auto'}}>
          <FormItem {...formItemLayout} label="预算控制策略代码" hasFeedback>
            {getFieldDecorator('controlStrategyCode', {
              rules: [{
                required: true,
                message: '请输入',
              }],
              initialValue: ''
            })(
              <Input placeholder="请输入" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="预算控制策略描述" hasFeedback>
            {getFieldDecorator('controlStrategyName', {
              rules: [{
                required: true,
                message: '请输入',
              }],
              initialValue: ''
            })(
              <Input placeholder="请输入" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="状态">
            {getFieldDecorator('isEnabled', {
              initialValue: isEnabled
            })(
              <div>
                <Switch defaultChecked={true} checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="cross" />} onChange={this.switchChange}/>
                <span className="enabled-type">{isEnabled ? '启用' : '禁用'}</span>
              </div>
            )}
          </FormItem>
          <FormItem wrapperCol={{ offset: 7 }}>
              <Button type="primary" htmlType="submit" loading={this.state.loading} style={{marginRight:'10px'}}>保存</Button>
              <Button onClick={this.handleCancle}>取消</Button>
          </FormItem>
        </Form>
      </div>
    )
  }

}

NewBudgetStrategy.contextTypes={
  router:React.PropTypes.object
};

function mapStateToProps() {
  return {}
}

const WrappedNewBudgetStrategy = Form.create()(NewBudgetStrategy);

export default connect(mapStateToProps)(WrappedNewBudgetStrategy);

