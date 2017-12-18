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

class AddAuthorization extends React.Component {
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
      extraParams: {},
      disable: true
      // isDisabled: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params) {
      this.setState({ params: nextProps.params });
    }
  }

  //编辑保存
  handleSave = (e) => {
    e.preventDefault();

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({ loading: true });

        values.authorizeCompanyId = values.authorizeCompanyId[0].id;
        values.authorizeEmployeeId = values.authorizeEmployeeId[0].userOid;
        values.authorizeDepartmentId = values.authorizeDepartmentId[0].id;

        values.bankAccountId = this.state.params.companyBankId;

        let toValue = {
          ...this.state.params,
          ...values,
        }
        httpFetch.post(`${config.baseUrl}/api/companyBankAuth/insertOrUpdate`, toValue).then((res) => {
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

  companyChange = (value) => {
    let info = value[0];

    this.setState({ extraParams: { ...this.state.extraParams, companyId: info.id } });

  }

  deptChange = (value) => {
    let info = value[0];

    this.setState({ extraParams: { ...this.state.extraParams, departmentId: info.id } });

  }


  render() {
    const { getFieldDecorator } = this.props.form;
    const { params, companyTypeList, setOfBooksNameList, legalEntityList, companyLevelList, parentCompanyList, dateFormat, extraParams, disable } = this.state;
    const formItemLayout = {
      labelCol: { span: 6, offset: 1 },
      wrapperCol: { span: 14, offset: 1 },
    };
    return (
      <div className="new-payment-method">
        <Form onSubmit={this.handleSave}>

          <FormItem {...formItemLayout} label={this.props.intl.formatMessage({ id: "company.startDateActive" })}>
            {getFieldDecorator('authorizeDateFrom', {
              rules: [{
                required: true,
                message: this.props.intl.formatMessage({ id: "common.please.enter" })
              }],
              initialValue: moment(params.authorizeDateFrom ? params.authorizeDateFrom : new Date(), dateFormat)
            })(
              <DatePicker />
              )}
          </FormItem>

          <FormItem {...formItemLayout} label={this.props.intl.formatMessage({ id: "company.endDateActive" })}>
            {getFieldDecorator('authorizeDateTo', {
              rules: [{
                required: true,
                message: this.props.intl.formatMessage({ id: "common.please.enter" })
              }],
              initialValue: moment(params.authorizeDateTo ? params.authorizeDateTo : new Date(), dateFormat)
            })(
              <DatePicker />
              )}
          </FormItem>

          <FormItem {...formItemLayout} label={this.props.intl.formatMessage({ id: 'common.column.status' })}>
            {getFieldDecorator('enabled', {
              initialValue: params.id ? params.isEnabled : true
            })(
              <Switch defaultChecked={this.props.form.getFieldValue('enabled') ? true : false} checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="cross" />} />
              )}&nbsp;&nbsp;&nbsp;&nbsp;{this.props.form.getFieldValue('enabled') ? this.props.intl.formatMessage({ id: "common.status.enable" }) : this.props.intl.formatMessage({ id: "common.status.disable" })}
          </FormItem>


          <FormItem {...formItemLayout} label={this.props.intl.formatMessage({ id: "authorization.company" })}>
            {getFieldDecorator('authorizeCompanyId', {
              rules: [{
                required: true,
                message: this.props.intl.formatMessage({ id: "common.please.enter" })
              }],
              initialValue: params.companyId ? [{ id: params.companyId, name: params.companyName }] : []
            })(
              <Chooser placeholder={this.props.intl.formatMessage({ id: "common.please.select" })}
                type="select_authorization_company"
                onChange={this.handle}
                labelKey="name"
                valueKey="id"
                single={true}
                onChange={this.companyChange} />
              )}
          </FormItem>

          <FormItem {...formItemLayout} label={this.props.intl.formatMessage({ id: "authorization.department" })}>
            {getFieldDecorator('authorizeDepartmentId', {
              rules: [{
                required: true,
                message: this.props.intl.formatMessage({ id: "common.please.enter" })
              }],
              initialValue: params.departmentCode ? [{ id: params.departmentCode, name: params.departmentName }] : []
            })(

              < Chooser placeholder={this.props.intl.formatMessage({ id: "common.please.select" })}
                type="journal_line_department"
                onChange={this.handle}
                labelKey="name"
                valueKey="id"
                single={true}
                onChange={this.deptChange}
              />
              )}
          </FormItem>

          <FormItem {...formItemLayout} label={this.props.intl.formatMessage({ id: "authorization.employee" })}>
            {getFieldDecorator('authorizeEmployeeId', {
              rules: [{
                required: true,
                message: this.props.intl.formatMessage({ id: "common.please.enter" })
              }],
              initialValue: params.employeeOid ? [{ userOID: params.employeeOid, fullName: params.employeeName }] : []
            })(
              <Chooser placeholder={this.props.intl.formatMessage({ id: "common.please.select" })}
                type="select_authorization_user"
                onChange={this.handle}
                labelKey="userName"
                valueKey="userOid"
                single={true}
                listExtraParams={extraParams}
              disabled={!(this.props.form.getFieldValue('authorizeDepartmentId') && this.props.form.getFieldValue('authorizeDepartmentId').length && this.props.form.getFieldValue('authorizeCompanyId') && this.props.form.getFieldValue('authorizeCompanyId').length)}
              />
              )}
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

const WrappedAddAuthorization = Form.create()(AddAuthorization);

function mapStateToProps(state) {
  return {
    company: state.login.company,
  }
}
export default connect(mapStateToProps)(injectIntl(WrappedAddAuthorization));
