import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

import { Alert, Form, Switch, Icon, Input, Select, Button, Row, Col, message, Carousel } from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;

import 'styles/my-account/new-expense.scss'

import httpFetch from 'share/httpFetch'
import config from 'config'
import ExpenseTypeSelector from 'components/template/expense-type-selector'

class NewExpense extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }

  onCancel = () => {
    this.props.close();
  };

  handleSave = (e) => {};

  moreExpense = () => {};

  copyExpense = () => {};

  handleSelectExpenseType = (expenseT) => {

  };

  render(){
    const { formatMessage } = this.props.intl;
    const { getFieldDecorator } = this.props.form;
    const {} = this.state;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 10, offset: 1 },
    };
    return (
      <div className="new-expense">
        <ExpenseTypeSelector onSelect={this.handleSelectExpenseType}/>
        <Form onSubmit={this.handleSave}>
          <div className="slide-footer">
            <Button type="primary" htmlType="submit" loading={this.state.loading}>{formatMessage({id: 'common.save'})/* 保存 */}</Button>
            <Button onClick={this.moreExpense}>再记一笔</Button>
            <Button onClick={this.copyExpense}>复制</Button>
            <Button onClick={this.onCancel}>{formatMessage({id: 'common.cancel'})/* 取消 */}</Button>
          </div>
        </Form>
      </div>
    )
  }

}

function mapStateToProps(state) {
  return {}
}

const WrappedNewExpense = Form.create()(NewExpense);

export default connect(mapStateToProps)(injectIntl(WrappedNewExpense));
