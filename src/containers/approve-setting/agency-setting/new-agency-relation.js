import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

import { Form, Button, Icon, Select, Switch, Checkbox, DatePicker, message, Collapse } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
const Panel = Collapse.Panel;
import debounce from 'lodash.debounce'
import httpFetch from 'share/httpFetch'
import config from 'config'

import moment from 'moment';

class NewAgencyRelation extends React.Component {
  constructor(props) {
    super(props);
    const { formatMessage } = this.props.intl;
    this.state = {
      loading: false,
      data: [],
      statusValue: {'0': formatMessage({id:'common.enabled'})}, //启用
      uuid: 0,
      keys: [],
      billOptions: {},    //代理单据选项
      chosenOptions: {},  //选中的代理单据选项
      chosenOptions1OIDs: {},  //选中的报销单选项ID
      chosenOptions2OIDs: {},  //选中的申请单选项ID
      proxyVerify: {},    //代理人校验
      billProxyRuleDTOs: [],
      startAgencyDate: moment().locale('zh-cn').utcOffset(8),
      endAgencyDate: null,
    };
    this.handleSearch = debounce(this.handleSearch, 250);
  }

  componentWillReceiveProps(nextProps){
    console.log(nextProps.billProxyRuleDTOs);
    this.state.uuid == 0 && this.setState({
      billProxyRuleDTOs: nextProps.billProxyRuleDTOs,
      uuid: nextProps.billProxyRuleDTOs.length
    })
  }

  handleSearch = (value, key) => {
    let proxyVerify = this.state.proxyVerify;
    if (!value) {
      let billOptions = this.state.billOptions;
      billOptions[key] = {};
      proxyVerify[key] = {
        status: 'error',
        help: '请选择'
      };
      this.setState({ billOptions, proxyVerify });
      return;
    }
    proxyVerify[key] = {};
    this.setState({ proxyVerify });
    let url = `${config.baseUrl}/api/search/users/by/${value}`;
    value && httpFetch.get(url).then((response)=>{
      let data = response.data;
      data.map(item => {
        item.text = item.fullName + '-' + item.employeeID;
      });
      this.setState({ data })
    });
  };

  handleSelect = (item, key) => {
    item = JSON.parse(item);
    let proxyVerify = this.state.proxyVerify;
    if (item.status == 1002) {
      proxyVerify[key] = {
        status: 'warning',
        help: `该员工将于${item.leavingDate}离职，离职后此代理将自动禁用`
      };
    } else {
      proxyVerify[key] = {};
    }
    this.setState({ proxyVerify });

    //获取代理单据选项
    // let url = `${config.baseUrl}/api/custom/forms/proxy?principalOID=${this.props.principalOID}&proxyOID=${item.userOID}`;
    let url = `${config.baseUrl}/api/custom/forms/proxy?principalOID=6980cd2b-72ff-4303-8b57-593c178e23e8&proxyOID=${item.userOID}`;
    httpFetch.get(url).then((response)=>{
      let bill1Options = [];
      let bill2Options = [];
      response.data.map(item => {
        item.label = item.formName;
        item.value = item.id;
        if (item.formType / 1000 >= 3) {  //报销单
          bill1Options.push(item)
        } else {
          bill2Options.push(item)
        }
      });
      let billOptions = this.state.billOptions;
      billOptions[key] = {
        bill1Options: bill1Options,
        bill2Options: bill2Options
      };
      this.setState({ billOptions })
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

  handleSubmit = (e, key) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {

        console.log(values);
        let proxyOID = JSON.parse(values[`proxyOID-${key}`]);
        //console.log(proxyOID);
        let billProxyRuleDTO = {
          'customFormDTOs': this.state.chosenOptions[key],
          'enabled': values[`enabled-${key}`],
          'endDate': values[`endDate-${key}`] || null ,
          'leavingDate': proxyOID.leavingDate,
          //'principalOID': this.props.principalOID,
          'proxyName': proxyOID.fullName,
          'proxyOID': proxyOID.userOID,
          'proxyTimeRange': values[`endDate-${key}`] ? 102 : 101,
          //'recordOID': null,
          'ruleOID': null,
          'startDate': values[`startDate-${key}`],
          'status': proxyOID.status
        };
        console.log(billProxyRuleDTO);
        let billProxyRuleDTOs = this.state.billProxyRuleDTOs;
        billProxyRuleDTOs.push(billProxyRuleDTO);
        this.setState({ billProxyRuleDTOs, loading: true });

        // httpFetch.get(`${config.baseUrl}/api/bill/proxy/rules/${this.props.principalOID}`).then((res)=>{
        httpFetch.get(`${config.baseUrl}/api/bill/proxy/rules/6980cd2b-72ff-4303-8b57-593c178e23e8`).then((res)=>{
          let principalInfo = res.data;
          principalInfo.billProxyRuleDTOs = billProxyRuleDTOs;
          console.log(principalInfo);
          httpFetch.post(`${config.baseUrl}/api/bill/proxy/rules`, principalInfo).then((res)=>{
            if(res.status == 200){
              this.setState({loading: false});
              message.success('新建成功');
            }
          }).catch((e)=>{
            this.setState({loading: false});
            if(e.response.data.validationErrors){
              message.error(`新建失败, ${e.response.data.validationErrors[0].message}`);
            } else {
              message.error('呼，服务器出了点问题，请联系管理员或稍后再试:(');
            }
          })
        }).catch((e)=>{

        })
      }
    });
  };

  onOptionsChange = (values, key, type) => {
    let chosenOptions = this.state.chosenOptions;
    let bill1Options = this.state.billOptions[key].bill1Options;
    let bill2Options = this.state.billOptions[key].bill2Options;
    chosenOptions[key] = [];
    let chosenOptions1OIDs = this.state.chosenOptions1OIDs;
    let chosenOptions2OIDs = this.state.chosenOptions2OIDs;
    chosenOptions1OIDs[key] = type == 'bill1Options' ? values : (this.state.chosenOptions1OIDs[key] || []);
    chosenOptions2OIDs[key] = type == 'bill2Options' ? values : (this.state.chosenOptions2OIDs[key] || []);
    this.setState({ chosenOptions1OIDs, chosenOptions2OIDs}, () => {
      this.state.chosenOptions1OIDs[key].map(value => {
        bill1Options.map(item => {
          item.id == value && ((item.hasPermission = true) && chosenOptions[key].push(item));
        })
      });
      this.state.chosenOptions2OIDs[key].map(value => {
        bill2Options.map(item => {
          item.id == value && ((item.hasPermission = true) && chosenOptions[key].push(item));
        })
      });
      this.setState({ chosenOptions })
    })
  };

  disabledStartDate = (startAgencyDate) => {
    const endAgencyDate = this.state.endAgencyDate;
    if (!startAgencyDate || !endAgencyDate) {
      return false;
    }
    return startAgencyDate.valueOf() > endAgencyDate.valueOf();
  };

  onStartChange = (startAgencyDate) => {
    this.setState({ startAgencyDate })
  };

  disabledEndDate = (endAgencyDate) => {
    const startAgencyDate = this.state.startAgencyDate;
    if (!endAgencyDate || !startAgencyDate) {
      return false;
    }
    return endAgencyDate.valueOf() <= startAgencyDate.valueOf();
  };

  onEndChange = (endAgencyDate) => {
    this.setState({ endAgencyDate })
  };

  render(){
    const { formatMessage } = this.props.intl;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { loading, data, statusValue, billOptions, proxyVerify } = this.state;
    const formItemLayout = {
      labelCol: { span: 1 },
      wrapperCol: { span: 23 },
    };
    const options = data.map(d => <Option key={JSON.stringify(d)}>{d.text}</Option>);
    getFieldDecorator('keys',  { initialValue: [] });
    const keys = getFieldValue('keys');
    const forms = keys.map((key) => {
      return (
        <Form className="relation-form" onSubmit={(e) => {this.handleSubmit(e, key)}} key={key}>
          <FormItem style={{display:'inline-block',marginRight:'50px',width:'300px'}}
                    validateStatus={proxyVerify[key] ? proxyVerify[key].status : ''}
                    help={proxyVerify[key] ? proxyVerify[key].help : ''}
                    label={formatMessage({id:'agencySetting.agent'})}>{/*代理人*/}
            {getFieldDecorator(`proxyOID-${key}`, {
              rules: [{
                required: true,
                message: formatMessage({id: 'common.please.select'})  //请选择
              }]})(
              <Select placeholder={formatMessage({id: 'common.please.select'})/* 请选择 */}
                      mode="combobox"
                      onSearch={(value) => {this.handleSearch(value, key)}}
                      onSelect={(item) => {this.handleSelect(item, key)}}>
                {options}
              </Select>
            )}
          </FormItem>
          <FormItem style={{display:'inline-block'}}
                    colon={false}
                    label={<span>{formatMessage({id:'common.column.status'})} ：<span>{statusValue[key] || statusValue[0]}</span></span>}>
            {getFieldDecorator(`enabled-${key}`, {
              initialValue: true
            })(
              <Switch defaultChecked={true}
                      checkedChildren={<Icon type="check" />}
                      unCheckedChildren={<Icon type="cross" />}
                      onChange={(checked) => {this.handleStatusChange(checked, key)}}/>
            )}
          </FormItem>
          <FormItem style={{borderTop:'1px solid #eaeaea',paddingTop:'10px'}}
                    label={formatMessage({id:'agencySetting.agent-bills'})}>{/*代理单据*/}
            {getFieldDecorator(`customFormDTOs-${key}`, {
              rules: [{
                required: true,
                message: formatMessage({id: 'common.please.select'})  //请选择
              }]})(
              <div style={{marginLeft:'10px'}}>
                <FormItem {...formItemLayout}
                          style={{marginBottom:'0'}}
                          label={formatMessage({id:'agencySetting.expense-account'})/*报销单*/}>
                  {getFieldDecorator(`bill1-${key}`)(
                    <CheckboxGroup options={billOptions[key] ? billOptions[key].bill1Options: []}
                                   onChange={(value) => {this.onOptionsChange(value, key, 'bill1Options')}} />
                  )}
                </FormItem>
                <FormItem {...formItemLayout}
                          label={formatMessage({id:'agencySetting.application-form'})/*申请单*/}>
                  {getFieldDecorator(`bill2-${key}`)(
                    <CheckboxGroup options={billOptions[key] ? billOptions[key].bill2Options: []}
                                   onChange={(value) => {this.onOptionsChange(value, key, 'bill2Options')}} />
                  )}
                </FormItem>
              </div>
            )}
          </FormItem>
          <FormItem label={formatMessage({id:'agencySetting.agency-date'})}>{/*代理日期*/}
            <FormItem style={{display:'inline-block',marginRight:'20px'}}>
              {getFieldDecorator(`startDate-${key}`, {
                initialValue: moment().locale('zh-cn').utcOffset(8)
              })(
                <DatePicker format="YYYY-MM-DD"
                            allowClear={false}
                            disabledDate={this.disabledStartDate}
                            onChange={this.onStartChange}/>
              )}
            </FormItem>
            <FormItem style={{display:'inline-block'}}>
              {getFieldDecorator(`endDate-${key}`)(
                <DatePicker format="YYYY-MM-DD"
                            placeholder={formatMessage({id:'agencySetting.indefinite'})}
                            disabledDate={this.disabledEndDate}
                            onChange={this.onEndChange}/> //无限制
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
