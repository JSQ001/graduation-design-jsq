import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

import { Form, Switch, InputNumber, Input, Select, Button, message, Spin, Icon } from 'antd'

const FormItem = Form.Item;
const Option = Select.Option;

import httpFetch from 'share/httpFetch'
import config from 'config'

class NewCodingRuleValue extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      paramsNameOptions: [],
      dataFormatOptions: []
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
          this.props.close(true);
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
    this.getSystemValueList(2025).then(res => {
      this.setState({ paramsNameOptions: res.data.values })
    });
    this.getSystemValueList(2026).then(res => {
      this.setState({ dataFormatOptions: res.data.values })
    });
  }

  renderItems = () => {
    const { formatMessage } = this.props.intl;
    const { getFieldDecorator } = this.props.form;
    const { dataFormatOptions } = this.state;
    let segmentType = this.props.form.getFieldValue('segmentType');
    let result;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 10, offset: 1 },
    };
    switch(segmentType){
      case '10':
        result = (
          <FormItem {...formItemLayout} label="固定字符">
            {getFieldDecorator('segmentValue', {
              rules: [{
                required: true,
                message: formatMessage({id: 'common.please.enter'})  //请输入
              }],
              initialValue: this.props.params.nowCodingRuleValue ? this.props.params.nowCodingRuleValue.segmentValue : ''
            })(
              <Input/>
            )}
          </FormItem>
        );
        break;
      case '20':
        result = (
          <FormItem {...formItemLayout} label="日期格式">
            {getFieldDecorator('dateFormat', {
              rules: [{
                required: true,
                message: formatMessage({id: 'common.please.select'})  //请输入
              }],
              initialValue: this.props.params.nowCodingRuleValue ? this.props.params.nowCodingRuleValue.dateFormat : null
            })(
              <Select placeholder={formatMessage({id: 'common.please.select'})/* 请选择 */} notFoundContent={<Spin size="small" />}>
                {dataFormatOptions.map((option)=>{
                  return <Option key={option.code}>{option.messageKey}</Option>
                })}
              </Select>
            )}
          </FormItem>
        );
        break;
      case '30':
        result = null;
        break;
      case '40':
        result = null;
        break;
      case '50':
        result = (
          <div>
            <FormItem {...formItemLayout} label="位数">
              {getFieldDecorator('length', {
                rules: [{
                  required: true,
                  message: formatMessage({id: 'common.please.enter'})  //请输入
                }],
                initialValue: this.props.params.nowCodingRuleValue ? this.props.params.nowCodingRuleValue.length : 4
              })(
                <InputNumber min={1}/>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="步长">
              {getFieldDecorator('incremental', {
                rules: [{
                  required: true,
                  message: formatMessage({id: 'common.please.enter'})  //请输入
                }],
                initialValue: this.props.params.nowCodingRuleValue ? this.props.params.nowCodingRuleValue.incremental : 1
              })(
                <InputNumber min={1}/>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="开始值">
              {getFieldDecorator('startValue', {
                rules: [{
                  required: true,
                  message: formatMessage({id: 'common.please.enter'})  //请输入
                }],
                initialValue: this.props.params.nowCodingRuleValue ? this.props.params.nowCodingRuleValue.startValue : 1
              })(
                <InputNumber min={1}/>
              )}
            </FormItem>
          </div>
        );
        break;
      default:
        result = null;
    }
    return result;
  };

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
              initialValue: this.props.params.nowCodingRuleValue ? this.props.params.nowCodingRuleValue.sequence : 1
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
          {this.renderItems()}
          <FormItem {...formItemLayout} label={formatMessage({id: 'common.column.status'})/* 状态 */}>
            {getFieldDecorator('isEnabled', {
              initialValue: this.props.params.nowCodingRuleValue ? !!this.props.params.nowCodingRuleValue.isEnabled : true,
              valuePropName: 'checked'
            })(
              <Switch checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="cross" />}/>
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
