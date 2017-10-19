import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { Form, Input, Select, Button, InputNumber} from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;

import httpFetch from 'share/httpFetch'
import menuRoute from 'share/menuRoute'
import config from 'config'

class NewAccountPeriod extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      periodAdditionalFlags: [],
      loading: false
    };
  }

  componentWillMount(){
    this.getSystemValueList(1010).then(res => {
      this.setState({ periodAdditionalFlags: res.data.values })
    })
  }

  handleSave = (e) => {
    if(this.props.params.period)
      this.props.close();
    else{
      //TODO:新增期间
      this.props.close();
    }
  };

  render(){
    const { formatMessage } = this.props.intl;
    const { getFieldDecorator } = this.props.form;
    const { loading, periodAdditionalFlags } = this.state;
    const { period } = this.props.params;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 10, offset: 1 },
    };
    return (
      <div className="new-budget-organization">
        <Form onSubmit={this.handleSave}>
          <FormItem {...formItemLayout} label="会计期代码">
            {getFieldDecorator('periodSetCode', {
              rules: [{
                required: true
              }],
              initialValue: period ? period.periodSetCode : ''
            })(
              <Input disabled={period} placeholder={formatMessage({id: 'common.please.enter'})/* 请输入 */}/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="期间总数">
            {getFieldDecorator('totalPeriodNum', {
              rules: [{
                required: true,
                message: formatMessage({id: 'common.please.enter'}),  //请输入
              }],
              initialValue: period ? period.totalPeriodNum : 12
            })(
              <InputNumber disabled={period} min={12} onChange={() => {}} placeholder={formatMessage({id: 'common.please.enter'})/* 请输入 */}/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="会计期名称">
            {getFieldDecorator('periodSetName', {
              rules: [{
                required: true,
                message: formatMessage({id: 'common.please.enter'}),  //请输入
              }],
              initialValue: period ? period.periodSetName : ''
            })(
              <Input disabled={period} placeholder={formatMessage({id: 'common.please.enter'})/* 请输入 */}/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="名称附加">
            {getFieldDecorator('periodAdditionalFlag', {
              rules: [{
                required: true
              }],
              initialValue: period ? period.periodAdditionalFlag : ''
            })(
              <Select placeholder="请选择" disabled={period}>
                {periodAdditionalFlags.map((option)=>{
                  return <Option key={option.value}>{option.messageKey}</Option>
                })}
              </Select>
            )}
          </FormItem>
          <div className="slide-footer">
            <Button type="primary" htmlType="submit" loading={loading}>{formatMessage({id: 'common.ok'})/* 保存 */}</Button>
            <Button onClick={() => {this.props.close()}}>{formatMessage({id: 'common.cancel'})/* 取消 */}</Button>
          </div>
        </Form>
      </div>
    )
  }

}

function mapStateToProps(state) {
  return {}
}

const WrappedNewAccountPeriod = Form.create()(NewAccountPeriod);

export default connect(mapStateToProps)(injectIntl(WrappedNewAccountPeriod));
