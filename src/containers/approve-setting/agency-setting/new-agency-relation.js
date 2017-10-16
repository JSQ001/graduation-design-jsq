import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

import { Form, Button, Icon, Select, Switch, Checkbox, DatePicker } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import debounce from 'lodash.debounce'
import httpFetch from 'share/httpFetch'
import config from 'config'

class NewAgencyRelation extends React.Component {
  constructor(props) {
    super(props);
    const { formatMessage } = this.props.intl;
    this.state = {
      loading: false,
      agentData: [],
      statusValue: {'0': formatMessage({id:'common.enabled'})}, //启用
      uuid: 0,
    };
    this.handleChange = debounce(this.handleChange, 250);
  }

  handleChange = (value) => {
    let url = `${config.baseUrl}/api/search/users/by/${value}`;
    value && httpFetch.get(url).then((response)=>{
      this.setState({
        agentData: response.data
      })
    });
  };

  handleStatusChange = (checked, key) => {
    const { formatMessage } = this.props.intl;
    let statusValue = this.state.statusValue;
    statusValue[key] = checked ? formatMessage({id:'common.enabled'}) : formatMessage({id:'common.disabled'}); //启用 禁用
    this.setState({ statusValue })
  };

  add = () => {
    this.setState((prevState) => {
      uuid: prevState.uuid++
    },()=>{
      const { form } = this.props;
      const keys = form.getFieldValue('keys');
      const nextKeys = keys.concat(this.state.uuid);
      form.setFieldsValue({
        keys: nextKeys,
      });
    });
  };

  remove = (k) => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  };

  render(){
    const { formatMessage } = this.props.intl;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { loading, agentData, statusValue } = this.state;
    const formItemLayout = {
      labelCol: { span: 1 }
    };
    const options = agentData.map(d => <Option key={d.userOID}>{d.fullName} - {d.employeeID}</Option>);
    console.log(options);
    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');
    const forms = keys.map((key) => {
      return (
        <Form className="relation-form" onSubmit={this.handleSubmit} key={key}>
          <FormItem style={{display:'inline-block',marginRight:'50px'}}
                    label={formatMessage({id:'agencySetting.agent'})}>{/*代理人*/}
            {getFieldDecorator(`principalOID-${key}`, 'principalOID', {
              rules: [{
                required: true,
                message: formatMessage({id: 'common.please.select'})  //请选择
              }]})(
              <Select placeholder={formatMessage({id: 'common.please.select'})/* 请选择 */}
                      mode="combobox"
                      onChange={this.handleChange}
                      style={{width:'300px'}}>
                {options}
              </Select>
            )}
          </FormItem>
          <FormItem style={{display:'inline-block'}}
                    colon={false}
                    label={<span>{formatMessage({id:'common.column.status'})} ：<span>{statusValue[key] || statusValue[0]}</span></span>}>
            {getFieldDecorator(`isEnabled-${key}`, 'isEnabled')(
              <Switch defaultChecked={true}
                      checkedChildren={<Icon type="check" />}
                      unCheckedChildren={<Icon type="cross" />}
                      onChange={(checked) => {this.handleStatusChange(checked, key)}}/>
            )}
          </FormItem>
          <FormItem style={{borderTop:'1px solid #eaeaea',paddingTop:'10px'}}
                    label={formatMessage({id:'agencySetting.agent-bills'})}>{/*代理单据*/}
            {getFieldDecorator(`agencyBills-${key}`, 'agencyBills', {
              rules: [{
                required: true,
                message: formatMessage({id: 'common.please.select'})  //请选择
              }]})(
              <div style={{marginLeft:'10px'}}>
                <FormItem {...formItemLayout}
                          style={{marginBottom:'0'}}
                          label={formatMessage({id:'agencySetting.expense-account'})/*报销单*/}>
                  {getFieldDecorator('bill1')(
                    <Checkbox/>
                  )}
                </FormItem>
                <FormItem {...formItemLayout}
                          label={formatMessage({id:'agencySetting.application-form'})/*申请单*/}>
                  {getFieldDecorator('bill2')(
                    <Checkbox/>
                  )}
                </FormItem>
              </div>
            )}
          </FormItem>
          <FormItem label={formatMessage({id:'agencySetting.agency-date'})}>{/*代理日期*/}
            <FormItem style={{display:'inline-block',marginRight:'20px'}}>
              {getFieldDecorator(`startDate-${key}`, 'startDate')(
                <DatePicker format="YYYY-MM-DD" />
              )}
            </FormItem>
            <FormItem style={{display:'inline-block'}}>
              {getFieldDecorator(`endDate-${key}`, 'endDate')(
                <DatePicker format="YYYY-MM-DD" placeholder={formatMessage({id:'agencySetting.indefinite'})} /> //无限制
              )}
            </FormItem>
          </FormItem>
          <FormItem>
            <Button type="primary"
                    htmlType="submit"
                    loading={loading}
                    style={{marginRight:'10px'}}>{formatMessage({id: 'common.save'})/* 保存 */}</Button>
            <Button onClick={() => this.remove(key)}>{formatMessage({id: 'common.cancel'})/* 取消 */}</Button>
          </FormItem>
        </Form>
      );
    });
    return (
      <div className="new-agency-relation">
        <h3 className="header-title">{formatMessage({id:'agencySetting.agency-relation'})}</h3>{/*代理关系*/}
        <p style={{color:'#999'}}>{formatMessage({id:'agencySetting.agency-relation-intro'})}</p>{/*选择哪些员工可以帮被代理人提交单据 | 单据可按照被代理人的需求进行分配*/}
        {forms}
        <Button type="dashed" className="new-relation-btn" onClick={this.add}>
          <Icon type="plus" /> {formatMessage({id:'common.add'})/* 添加 */}
        </Button>
      </div>
    )
  }

}

function mapStateToProps() {
  return {}
}

const WrappedNewAgencyRelation = Form.create()(NewAgencyRelation);

export default connect(mapStateToProps)(injectIntl(WrappedNewAgencyRelation));
