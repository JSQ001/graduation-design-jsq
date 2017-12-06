import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

import { Form, Switch, Icon, Input, Select, Button, Row, Col, message } from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;

import httpFetch from 'share/httpFetch'
import config from 'config'

class NewPrePaymentType extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      options: [],
      nowType: {}
    };
  }

  componentWillMount(){
    // this.getSystemValueList().then(res => {
    //   this.setState({options: res.data.values});
    // });
  }

  componentWillReceiveProps(nextProps){
    this.setState({nowType: Object.assign({}, nextProps.prePaymentType)})
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
        httpFetch.put(`${config.budgetUrl}/api/budget/organizations`,params).then((res)=>{
          this.setState({loading: false});
          message.success(this.props.intl.formatMessage({id: 'common.save.success'}, {name: values.typeName}));  //保存成功
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

  render(){
    const { formatMessage } = this.props.intl;
    const { getFieldDecorator } = this.props.form;
    const { nowType } = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 10, offset: 1 },
    };
    return (
      <div>
        <Form onSubmit={this.handleSave}>
          <FormItem {...formItemLayout} label="帐套">
            {getFieldDecorator('setOfBooksId', {
              rules: [{
                required: true
              }],
              initialValue: nowType.setOfBooksId
            })(
              <Select placeholder={formatMessage({id: 'common.please.select'})/* 请输入 */}/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="预付款类型代码">
            {getFieldDecorator('typeCode', {
              rules: [{
                required: true,
                message: formatMessage({id: 'common.please.enter'}),  //请输入
              }],
              initialValue: nowType.typeCode
            })(
              <Input placeholder={formatMessage({id: 'common.please.enter'})/* 请输入 */}/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="预付款类型名称">
            {getFieldDecorator('typeName', {
              rules: [{
                required: true,
                message: formatMessage({id: 'common.please.enter'}),  //请输入
              }],
              initialValue: nowType.organizationName
            })(
              <Input placeholder={formatMessage({id: 'common.please.enter'})/* 请输入 */}/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="付款方式">
            {getFieldDecorator('paymentMethodCategory', {
              rules: [{
                required: true,
                message: formatMessage({id: 'common.please.select'}),  //请选择
              }],
              initialValue: nowType.paymentMethodCategory
            })(
              <Input placeholder={formatMessage({id: 'common.please.select'})/* 请输入 */}/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={formatMessage({id: 'common.column.status'})/* 状态 */}>
            {getFieldDecorator('isEnabled', {
              initialValue: nowType.isEnabled,
              valuePropName: 'checked'
            })(
              <Switch checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="cross" />}/>
            )}&nbsp;&nbsp;&nbsp;&nbsp;{this.props.form.getFieldValue('isEnabled') ? formatMessage({id: "common.status.enable"}) : formatMessage({id: "common.status.disable"})}
          </FormItem>
          <div className="slide-footer">
            <Button type="primary" htmlType="submit" loading={this.state.loading}>{formatMessage({id: 'common.save'})/* 保存 */}</Button>
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
const WrappedNewPrePaymentType = Form.create()(NewPrePaymentType);

export default connect(mapStateToProps)(injectIntl(WrappedNewPrePaymentType));
