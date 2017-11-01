import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

import { Form, Switch, InputNumber, Input, Select, Button, message, Spin } from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;

import httpFetch from 'share/httpFetch'
import config from 'config'

class NewCodingRuleValue extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      paramsNameOptions: []
    };
  }

  handleSave = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.codingRuleId = this.props.params.codingRuleId;
        this.setState({loading: true});
        httpFetch.post(`${config.budgetUrl}/api/budget/coding/rule/details`, values).then((res)=>{
          this.setState({loading: false});
          message.success(this.props.intl.formatMessage({id: 'common.create.success'}, {name: values.segmentType}));  //新建成功
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

  componentWillMount(){}

  render(){
    const { formatMessage } = this.props.intl;
    const { getFieldDecorator } = this.props.form;
    const { loading, paramsNameOptions } = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 10, offset: 1 },
    };
    return (
      <div>
        <Form onSubmit={this.handleSave}>
          <FormItem {...formItemLayout} label="顺序号">
            {getFieldDecorator('sequence', {
              rules: [{
                required: true,
                message: formatMessage({id: 'common.please.enter'})  //请输入
              }],
              initialValue: this.props.params.nowCodingRuleValue ? this.props.params.nowCodingRuleValue.sequence : 0
            })(
              <InputNumber/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="参数名称">
            {getFieldDecorator('segmentType', {
              rules: [{
                required: true,
                message: formatMessage({id: 'common.please.select'})  //请选择
              }],
              initialValue: this.props.params.nowCodingRuleValue ? this.props.params.nowCodingRuleValue.segmentType : ''
            })(
              <Select placeholder={formatMessage({id: 'common.please.select'})/* 请选择 */}  notFoundContent={<Spin size="small" />}>
                {paramsNameOptions.map((option)=>{
                  return <Option key={option.code}>{option.messageKey}</Option>
                })}
              </Select>
            )}
          </FormItem>
          <div className="slide-footer">
            <Button type="primary" htmlType="submit" loading={loading}>{formatMessage({id: 'common.save'})/* 保存 */}</Button>
            <Button onClick={() => {this.props.close()}}>{formatMessage({id: 'common.cancel'})/* 取消 */}</Button>
          </div>
        </Form>
      </div>
    )
  }

}

function mapStateToProps() {
  return {}
}

NewCodingRuleValue.contextTypes = {
  router: React.PropTypes.object
};

const WrappedNewCodingRuleValue = Form.create()(NewCodingRuleValue);

export default connect(mapStateToProps)(injectIntl(WrappedNewCodingRuleValue));
