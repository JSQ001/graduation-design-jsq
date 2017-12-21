/**
 * Created by 13576 on 2017/9/18.
 */
import React from 'React'
import {connect} from 'react-redux'
import {injectIntl} from 'react-intl';
import config from 'config'
import httpFetch from 'share/httpFetch';
import moment from 'moment'
import menuRoute from 'share/menuRoute'
import {Form, Input, Switch, Button, Col, Row, Select, DatePicker, Alert, notification, Icon, message} from 'antd'
import 'styles/budget-setting/budget-organization/budget-versions/new-budget-versions.scss'

const FormItem = Form.Item;
const sd = this;


class NewBudgetVersions extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      versionCodeError: false,
      statusError: false,
      newData: [],
      version: {},
      checkoutCodeData: [],
      loading: false,
      budgetVersionsDetailDetailPage: menuRoute.getRouteItem('budget-versions-detail', 'key'),    //预算版本详情的页面项
      budgetOrganization: menuRoute.getRouteItem('budget-organization-detail', 'key'),  //预算组织详情的页面项
    };
  }

  componentWillMount() {
    console.log(this.props)
    this.setState({
      version: this.props.params
    })
  }

  componentWillReceiveProps = (nextProps) => {
    console.log(nextProps)
  }

  //检查处理提交数据
  handleSave = (e) => {
    this.setState({loading: true});
    e.preventDefault();
    let value = this.props.form.getFieldsValue();
    if (!this.state.statusError) {
      const dataValue = value['versionDate']
      const toleValues = {
        ...value,
        'versionDate': value['versionDate'] ? value['versionDate'].format('YYYY-MM-DD') : '',
        'organizationId': this.props.organization.id
      }
      console.log(value)
      typeof this.state.version.id ==='undefined' ? this.saveData(toleValues) : this.updateVersion(toleValues);
    }
  };

  //保存数据
  saveData(value) {
    httpFetch.post(`${config.budgetUrl}/api/budget/versions`, value).then((response) => {
      if(response.status === 200){
        message.success(this.props.intl.formatMessage({id: "common.create.success"}, {name: this.props.intl.formatMessage({id: "budgetVersion.version"})}));
        this.setState({loading: false});
        this.props.close(true);
      }
    }).catch(e => {
      this.setState({loading: false});
      if (e.response) {
        message.error(this.props.intl.formatMessage({id: "common.save.filed"}) + "" + `${e.response.data.message}`);
        this.setState({loading: false});
      }
    });
  }

  updateVersion(value){
    value.id = this.state.version.id;
    value.versionNumber = this.state.version.versionNumber;
    httpFetch.put(`${config.budgetUrl}/api/budget/versions`, value).then((response) => {
      if(response.status === 200){
        message.success(this.props.intl.formatMessage({id: "common.operate.success"}));
        this.setState({loading: false});
        this.props.close(true);
      }
    }).catch(e => {
      this.setState({loading: false});
      if (e.response) {
        message.error(this.props.intl.formatMessage({id: "common.save.filed"}) + "" + `${e.response.data.message}`);
        this.setState({loading: false});
      }
    });
  }

  onCancel =()=>{
    this.props.close(true);
    console.log(this.props)
  };

  render() {
    const { formatMessage } = this.props.intl;
    const {getFieldDecorator} = this.props.form;
    const versionCodeError = false;
    const {version} = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14, offset: 1 },
    };
    return (

      <div className="new-budget-versions">
        <div className="new-budget-versions-help">
          <Alert
            message={formatMessage({id: "common.help"})}
            description={formatMessage({id: "budgetVersion.newVersion.info"})}
            type="info"
            showIcon
          />
        </div>
        <div className="new-budget-versions-from">
          <Form onSubmit={this.handleSave}>
            <FormItem {...formItemLayout}
              label={formatMessage({id: "budget.organization"})}>
              {getFieldDecorator('organizationName',
                {
                  initialValue: this.props.organization.organizationName,
                  rules: [
                    {required: true,}
                  ],
                })(
                <Input disabled={true}/>
              )}
            </FormItem>
            <FormItem {...formItemLayout}
              label={formatMessage({id: "budgetVersion.versionCode"})}>
              {getFieldDecorator('versionCode', {
                initialValue: version.versionCode,
                rules: [{required: true, message: formatMessage({id: "common.please.enter"})},]
              })(
                <Input />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label={formatMessage({id: "budgetVersion.versionName"})}>
              {getFieldDecorator('versionName', {
                initialValue: version.versionName,
                rules: [{required: true, message: formatMessage({id: "common.please.enter"})}],
              })(<Input />)}

            </FormItem>
            <FormItem {...formItemLayout}
              label={formatMessage({id: "budgetVersion.versionStatus"})}>
              {getFieldDecorator('status', {
                initialValue: typeof version.id === 'undefined' ? "NEW" : version.status.value,
                rules: [{required: true,}],
              })(
                <Select
                  placeholder="">
                  <Select.Option value="NEW">{this.props.intl.formatMessage({id: "budgetVersion.new"})}</Select.Option>
                  <Select.Option value="CURRENT">{this.props.intl.formatMessage({id: "budgetVersion.current"})}</Select.Option>
                  <Select.Option value="HISTORY">{this.props.intl.formatMessage({id: "budgetVersion.history"})}</Select.Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label={this.props.intl.formatMessage({id: "budgetVersion.versionDescription"})}>
              {getFieldDecorator('description', {
                initialValue: version.description
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout}
              label={this.props.intl.formatMessage({id: "budgetVersion.versionDate"})}>
              {getFieldDecorator('versionDate',
                {
                  initialValue:typeof version.id === 'undefined'? null: moment( version.versionDate, 'YYYY-MM-DD'),
                  valuePropName: "defaultValue",
                }
              )(
                <DatePicker style={{width: 315}}/>
              )}
            </FormItem>
            <FormItem {...formItemLayout}
              label={this.props.intl.formatMessage({id: "budgetVersion.isEnabled"})}>
              {getFieldDecorator('isEnabled', {
                  valuePropName: "checked",
                  initialValue: typeof version.id === 'undefined' ? true: version.isEnabled,
                }
              )(
                <Switch checkedChildren={<Icon type="check"/>} unCheckedChildren={<Icon type="cross"/>}/>
              )}
            </FormItem>
            <div className="slide-footer">
              <Button type="primary" htmlType="submit" loading={this.state.loading}>{this.props.intl.formatMessage({id: "common.save"})}</Button>
              <Button onClick={this.onCancel}>{this.handleCreate}>{this.props.intl.formatMessage({id: "common.cancel"})}</Button>
            </div>
          </Form>
        </div>
      </div>

    )
  }

}


NewBudgetVersions.contextTypes = {
  router: React.PropTypes.object
}


const WrappedNewBudgetVersions = Form.create()(NewBudgetVersions);

function mapStateToProps(state) {
  return {
    organization: state.budget.organization
  }
}

export default connect(mapStateToProps)(injectIntl(WrappedNewBudgetVersions));
