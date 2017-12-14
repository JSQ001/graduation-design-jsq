/**
 * Created by fudebao on 2017/12/05.
 */
import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Button, Form, Switch, Input, message, Icon, Select, Radio, DatePicker } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

import Chooser from 'components/chooser'

import config from 'config';
import httpFetch from 'share/httpFetch';
import moment from 'moment';


class AddPayWay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      params: {},
      loading: false,
      companyTypeList: [],
      setOfBooksNameList: [],
      legalEntityList: [],
      companyLevelList: [],
      parentCompanyList: [],
      dateFormat: 'YYYY/MM/DD',
      payWayTypeList: [],
      payWayList: [],
      disabled: true
      // isDisabled: false
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ params: nextProps.params.record });
    this.getPayWayTypeList();
    if (nextProps.params.record.id) {
      this.getPayWayList(nextProps.params.record.paymentMethodCategory);
      this.setState({ disabled: false});
    }
  }

  //获取付款方式类型
  getPayWayTypeList = () => {
    this.getSystemValueList(2105).then(res => {
      this.setState({ payWayTypeList: res.data.values });
    })
  }

  //获取付款方式
  getPayWayList = (paymentType) => {
    httpFetch.get(`${config.payUrl}/api/Cash/PaymentMethod/selectByPaymentType?paymentType=${paymentType}`).then(res => {
      this.setState({ payWayList: res.data });
    })
  }

  //付款类型改变时触发
  typeChange = (value) => {

    value ? this.setState({ disabled: false }) : this.setState({ disabled: true });

    this.props.form.setFieldsValue({
      paymentMethodId: ""
    });

    this.getPayWayList(value);
  }

  //编辑保存
  handleSave = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({ loading: true });

        values.bankAccountId = this.state.params.companyBankId;

        delete values.authorizeEmployeeId;

        let toValue = {
          ...this.state.params,
          ...values,
        }

        httpFetch.post(`${config.baseUrl}/api/comapnyBankPayment/insertOrUpdate`, toValue).then((res) => {
          this.setState({ loading: false });
          this.props.form.resetFields();
          this.props.close(true);
          message.success(this.props.intl.formatMessage({ id: 'common.operate.success' }));
        }).catch((e) => {
          this.setState({ loading: false });

          message.error(this.props.intl.formatMessage({ id: "common.save.filed" }) + `${e.response.data.message}`);
        })
      }
    });
  }

  onCancel = () => {
    this.props.close();
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { formatMessage } = this.props.intl;
    const { params, companyTypeList, setOfBooksNameList, legalEntityList, companyLevelList, parentCompanyList, dateFormat, payWayTypeList, payWayList, disabled  } = this.state;
    const formItemLayout = {
      labelCol: { span: 6, offset: 1 },
      wrapperCol: { span: 14, offset: 1 },
    };
    return (
      <div className="new-payment-method">
        <Form onSubmit={this.handleSave}>
          <FormItem {...formItemLayout} label={formatMessage({id:"pay.way.type"})}>
            {getFieldDecorator('authorizeEmployeeId', {
              rules: [{
                required: true,
                message: formatMessage({id:"common.please.enter"})
              }],
              initialValue: params.paymentMethodCategory
            })(
              <Select onChange={this.typeChange} placeholder={formatMessage({ id: "common.please.select" })}>
                {payWayTypeList.map(option => {
                  return <Option key={option.code}>{option.messageKey}</Option>
                })}
              </Select>)}
          </FormItem>

          <FormItem {...formItemLayout} label={formatMessage({id:"pay.way"})}>
            {getFieldDecorator('paymentMethodId', {
              rules: [{
                required: true,
                message: this.props.intl.formatMessage({ id: "common.please.enter" })
              }],
              initialValue: params.paymentMethodId
            })(
              <Select disabled={disabled} placeholder={formatMessage({id:"common.please.select"})}>
              {payWayList.map(option => {
                return <Option key={option.id}>{option.description}</Option>
                })}
              </Select>)}
          </FormItem>


          <div className="slide-footer">
              <Button type="primary" htmlType="submit"
                loading={this.state.loading}>{this.props.intl.formatMessage({ id: "common.save" })}</Button>
              <Button onClick={this.onCancel}>{this.props.intl.formatMessage({ id: "common.cancel" })}</Button>
            </div>
        </Form>
      </div>
        )
  }
}



const WrappedNewSubjectSheet = Form.create()(AddPayWay);
function mapStateToProps(state) {
  return {
          company: state.login.company,
  }
}
export default connect(mapStateToProps)(injectIntl(WrappedNewSubjectSheet));
