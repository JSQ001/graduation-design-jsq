/**
 * Created by 13576 on 2017/10/6.
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { Button, Table, Select,Form,Input,Switch,Icon} from 'antd';
const FormItem = Form.Item;
import SearchArea from 'components/search-area.js';
import "styles/budget-setting/budget-organization/budget-item/new-budget-item.scss"
import httpFetch from 'share/httpFetch';
import config from 'config'
import menuRoute from 'share/menuRoute'

class NewBudgetJournalFrom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEnabled:false,
      budgetJournalDetailPage: menuRoute.getRouteItem('budget-journal-detail','key'),    //预算日记账详情
    };
  }

  handleLastStep(){
    let path=this.state.budgetJournalDetailPage.url;
    this.context.router.push(path)
  }

  render(){
    const { getFieldDecorator } = this.props.form;
    const { isEnabled } = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14, offset: 1 },
    };
    return (
      <div className="new-budget-journal">
        <Form onSubmit={this.handleLastStep} style={{width:'55%',margin:'0 auto'}}>
          <FormItem {...formItemLayout} label={this.props.intl.formatMessage({id:"budget.journalNumber"})} >
            {getFieldDecorator('journalNumber', {
              rules: [{
              }],
              initialValue: '-'
            })(
              <Input  disabled={true} />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={this.props.intl.formatMessage({id:"budget.journalNumber"})} >
            {getFieldDecorator('jou', {
              rules: [{
                required: true,
                message: '',
              }],
              initialValue: '-'
            })(
              <Input  disabled={true} />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={this.props.intl.formatMessage({id:"budget.journalNumber"})} >
            {getFieldDecorator('organizationId', {
              rules: [{
                required: true,
                message: '',
              }],
              initialValue: '123报告发布发'
            })(
              <Input  disabled={true} />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={this.props.intl.formatMessage({id:"budget.companyId"})} >
            {getFieldDecorator('companyId', {
              rules: [{
                required: true,
                message: '',
              }],
              initialValue: '公司'
            })(
              <Input  disabled={true} />
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="预算控制策略描述" >
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
          <FormItem wrapperCol={{ offset: 7 }}>
            <Button type="primary" htmlType="submit" loading={this.state.loading} style={{marginRight:'10px'}}>下一步</Button>
            <Button>取消</Button>
          </FormItem>
        </Form>
      </div>
    )
  }

}


const NewBudgetJournal = Form.create()(NewBudgetJournalFrom);

NewBudgetJournal.contextTypes ={
  router: React.PropTypes.object
}

function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps)(injectIntl(NewBudgetJournal));
