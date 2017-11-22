import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

import { Alert, Form, Switch, Icon, Input, Select, Button, Row, Col, message, Spin } from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;

import httpFetch from 'share/httpFetch'
import config from 'config'

class NewSetOfBooks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      accountSetOptions: [],
      currencyOptions: [],
      periodSetOptions: []
    };
  }

  onCancel = () => {
    this.props.close();
  };

  handleSave = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({loading: true});
        let params = {};
        let method;
        params = Object.assign(params, values);
        if(this.props.params.setOfBooksId){
          method = 'put';
          params.id = this.props.params.setOfBooksId;
          params.accountSetId = this.props.params.accountSetId;
        }
        else {
          method = 'post'
        }
        httpFetch[method](`${config.baseUrl}/api/setOfBooks`, params).then((res)=>{
          this.setState({loading: false});
          message.success(this.props.intl.formatMessage({id: 'common.save.success'}, {name: values.setOfBooksName}));  //保存成功
          this.props.form.resetFields();
          this.props.close(true);
        }).catch((e)=>{
          if(e.response){
            message.error(`保存失败, ${e.response.data.message}`);
          }
          this.setState({loading: false});
        })
      }
    });
  };

  getAccountSetOptions = () => {
    this.state.accountSetOptions.length === 0 && httpFetch.get(`${config.baseUrl}/api/account/set/query`).then(res => {
      this.setState({ accountSetOptions: res.data })
    })
  };

  getCurrencyList = () => {
    this.state.currencyOptions.length === 0 && this.service.getCurrencyList().then(res => {
      this.setState({ currencyOptions: res.data })
    })
  };

  getPeriodSetOptions = () => {
    this.state.periodSetOptions.length === 0 && httpFetch.get(`${config.baseUrl}/api/periodset`).then(res => {
      this.setState({ periodSetOptions: res.data })
    })
  };

  render(){
    const { formatMessage } = this.props.intl;
    const { getFieldDecorator } = this.props.form;
    const { params } = this.props;
    const { accountSetOptions, currencyOptions, periodSetOptions, loading } = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 10, offset: 1 },
    };
    return (
      <div>
        <Alert
          message={formatMessage({id: 'common.help'})/*提示信息*/}
          description="【账套代码】、【科目表】、【会计期代码】、【账套本位币】保存后将不可修改"
          type="info"
          showIcon
        />
        <Form onSubmit={this.handleSave} style={{marginTop: 30}}>
          <FormItem {...formItemLayout} label="帐套代码">
            {getFieldDecorator('setOfBooksCode', {
              rules: [{
                required: true
              }],
              initialValue: params.setOfBooksCode
            })(
              <Input disabled={!!params.setOfBooksId}/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="会计期代码">
            {getFieldDecorator('periodSetCode', {
              rules: [{
                required: true
              }],
              initialValue: params.periodSetCode
            })(
              <Select  onFocus={this.getPeriodSetOptions} disabled={!!params.setOfBooksId}>
                {periodSetOptions.map(item => {
                  return <Option value={item.periodSetCode} key={item.id}>{item.periodSetCode}</Option>
                })}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="帐套名称">
            {getFieldDecorator('setOfBooksName', {
              rules: [{
                required: true
              }],
              initialValue: params.setOfBooksName
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="科目表">
            {getFieldDecorator('accountSetId', {
              rules: [{
                required: true
              }],
              initialValue: params.accountSetCode
            })(
              <Select  onFocus={this.getAccountSetOptions} disabled={!!params.setOfBooksId}>
                {accountSetOptions.map(item => {
                  return <Option value={item.id} key={item.id}>{item.accountSetCode}</Option>
                })}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="帐套本位币">
            {getFieldDecorator('functionalCurrencyCode', {
              rules: [{
                required: true
              }],
              initialValue: params.functionalCurrencyCode
            })(
              <Select  onFocus={this.getCurrencyList} disabled={!!params.setOfBooksId} notFoundContent={<Spin size="small" />}>
                {currencyOptions.map(item => {
                  return <Option value={item.otherCurrency} key={item.id}>{item.otherCurrency}</Option>
                })}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={formatMessage({id: 'common.column.status'})/* 状态 */}>
            {getFieldDecorator('enabled', {
              initialValue: params.enabled,
              valuePropName: 'checked'
            })(
              <Switch checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="cross" />}/>
            )}
          </FormItem>
          <div className="slide-footer">
            <Button type="primary" htmlType="submit" loading={loading}>{formatMessage({id: 'common.save'})/* 保存 */}</Button>
            <Button onClick={this.onCancel}>{formatMessage({id: 'common.cancel'})/* 取消 */}</Button>
          </div>
        </Form>
      </div>
    )
  }

}

function mapStateToProps() {
  return {}
}
const WrappedNewSetOfBooks = Form.create()(NewSetOfBooks);

export default connect(mapStateToProps)(injectIntl(WrappedNewSetOfBooks));
