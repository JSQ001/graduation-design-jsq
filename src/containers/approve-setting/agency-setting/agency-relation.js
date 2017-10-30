import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

import { Form, Button, Icon, Select, Switch, Checkbox, DatePicker, message, Collapse, Spin, Row, Col, Badge, Popconfirm, Alert } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
const Panel = Collapse.Panel;
import debounce from 'lodash.debounce'
import httpFetch from 'share/httpFetch'
import config from 'config'

import moment from 'moment';

class AgencyRelation extends React.Component {
  constructor(props) {
    super(props);
    const { formatMessage } = this.props.intl;
    this.state = {
      loading: false,
      data: [],
      statusValue: {'0': formatMessage({id:'common.enabled'})}, //启用
      uuid: 0,
      billOptions: {},    //代理单据选项
      chosenOptions: {},  //选中的代理单据选项
      chosenOptions1OIDs: {}, //选中的报销单选项ID
      chosenOptions2OIDs: {}, //选中的申请单选项ID
      proxyVerify: {},        //代理人校验
      billProxyRuleDTOs: [],
      principalInfo: {},
      startAgencyDate: moment().locale('zh-cn').utcOffset(8),
      endAgencyDate: null,
      fetching: false,
      editBillSelectedOID: {}, //代理关系选中的代理单据formOID数组集合, { index: ['', ''] }
      editBillSelectedItems: {}, //编辑代理关系时选中的代理单据, { index: [{}, {}] }
      editItem: {}, //编辑代理关系数据
      editItemIndex: null, //编辑代理关系的index
      switchDisabled: false, //状态是否可修改，false:可修改
    };
    this.handleSearch = debounce(this.handleSearch, 250);
  }

  componentWillReceiveProps(nextProps){
    !this.state.principalInfo.principalOID && this.setState({
      billProxyRuleDTOs: nextProps.billProxyRuleDTOs,
      principalInfo: nextProps.principalInfo,
    },() => {
      let editBillSelectedOID = {};
      let editBillSelectedItems = {};
      this.state.billProxyRuleDTOs.map((item, index) => {
        editBillSelectedItems[index] = [];
        editBillSelectedOID[index] = {};
        editBillSelectedOID[index].bill1 = [];
        editBillSelectedOID[index].bill2 = [];
        item.customFormDTOs.map(billItem => {
          editBillSelectedItems[index].push(billItem);
          if (billItem.formType / 1000 >= 3) {  //报销单
            editBillSelectedOID[index].bill1.push(billItem.formOID)
          } else {
            editBillSelectedOID[index].bill2.push(billItem.formOID)
          }
        });
      });
      this.setState({ editBillSelectedOID, editBillSelectedItems })
    })
  }

  //查询代理人下拉列表，key==-1表示编辑的代理关系，key>0表示新增的代理关系
  handleSearch = (value, key) => {
    let proxyVerify = this.state.proxyVerify;
    proxyVerify[key] = {};
    this.setState({ proxyVerify, fetching: true });
    let url = `${config.baseUrl}/api/search/users/by/${value}`;
    value && httpFetch.get(url).then((response)=>{
      let data = response.data;
      data.map(item => {
        item.text = `${item.fullName} - ${item.employeeID}`
      });
      this.setState({ data, fetching: false })
    });
  };

  //选择代理人 => 获取代理单据选项，key==-1表示编辑的代理关系，key>0表示新增的代理关系
  handleSelect = (item, key) => {
    item = JSON.parse(item);
    let proxyVerify = this.state.proxyVerify;
    if (item.status == 1002) {  //item.status:1002 待离职
      proxyVerify[key] = {
        status: 'warning',
        help: this.props.intl.formatMessage({ id: 'agencySetting.leave-info', time: item.leavingDate }) //该员工将于 {time} 离职，离职后此代理将自动禁用
      };
    } else {
      proxyVerify[key] = {};
    }
    this.setState({ proxyVerify });

    //获取代理单据选项
    let url = `${config.baseUrl}/api/custom/forms/proxy?principalOID=${this.props.principalOID}&proxyOID=${item.userOID}`;
    httpFetch.get(url).then((response)=>{
      let bill1Options = [];
      let bill2Options = [];
      response.data.map(item => {
        item.label = item.formName;
        item.value = item.formOID;
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

  //代理关系状态更改，key==-1表示编辑的代理关系，key>0表示新增的代理关系
  handleStatusChange = (checked, key) => {
    const { formatMessage } = this.props.intl;
    let statusValue = this.state.statusValue;
    statusValue[key] = checked ? formatMessage({id:'common.enabled'}) : formatMessage({id:'common.disabled'}); //启用 禁用
    this.setState({ statusValue })
  };

  //添加代理关系
  add = () => {
    this.setState((prevState) => {
      uuid: prevState.uuid++
    },()=>{
      this.setState({
        startAgencyDate: moment().locale('zh-cn').utcOffset(8),
        endAgencyDate: null,
        editItemIndex: null,
      },() =>{
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        let edit_tag = false;
        this.state.billProxyRuleDTOs.map(item => {
          if (item.isEdit || keys.length > 0) edit_tag = true
        });
        if(edit_tag) {
          message.warning('你有一个编辑中的代理关系未保存');
          return;
        }
        const nextKeys = keys.concat(this.state.uuid);
        form.setFieldsValue({
          keys: nextKeys,
        });
      });
    });
  };

  //移除通过 add() 添加的代理关系
  remove = (k) => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  };

  //保存单个代理关系 - 接口
  handleSave = (principalInfo, key) => {
    const { formatMessage } = this.props.intl;
    httpFetch.post(`${config.baseUrl}/api/bill/proxy/rules`, principalInfo).then((res)=>{
      if(res.status == 200){
        message.success(formatMessage({id: 'common.save.success'}, {name: ''})/* 保存成功 */);
        this.setState({
          loading: false,
          billProxyRuleDTOs: res.data.billProxyRuleDTOs,
          principalInfo: res.data
        });
        key && this.remove(key)
      } else {
        message.error(`${formatMessage({id: 'common.save.filed'})/* 保存失败 */}, ${res.data.message}`);
      }
    }).catch((e)=>{
      if(e.response){
        message.error(`${formatMessage({id: 'common.save.filed'})/* 保存失败 */}, ${e.response.data.message}`);
        this.setState({loading: false});
      } else {
        console.log(e);
      }
    })
  };

  //保存单个代理关系 - 新增
  handleSubmit = (e, key) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const index = this.state.billProxyRuleDTOs.length;
        let editBillSelectedItems = this.state.editBillSelectedItems;
        editBillSelectedItems[index] = [];
        let editBillSelectedOID = this.state.editBillSelectedOID;
        editBillSelectedOID[index] = {};
        editBillSelectedOID[index].bill1 = [];
        editBillSelectedOID[index].bill2 = [];
        this.state.chosenOptions[key].map(billItem => {
          editBillSelectedItems[index].push(billItem);
          if (billItem.formType / 1000 >= 3) {  //报销单
            editBillSelectedOID[index].bill1.push(billItem.formOID)
          } else {
            editBillSelectedOID[index].bill2.push(billItem.formOID)
          }
        });
        this.setState({ editBillSelectedOID, editBillSelectedItems });


        let proxyOID = JSON.parse(values[`proxyOID-${key}`]);
        let billProxyRuleDTO = {
          'enabled': (values[`endDate-${key}`] && (new Date(values[`endDate-${key}`]) < new Date())) ? false : values[`enabled-${key}`],
          'endDate': values[`endDate-${key}`] ? values[`endDate-${key}`].format('YYYY-MM-DD') : null ,
          'leavingDate': proxyOID.leavingDate,
          'proxyName': proxyOID.fullName,
          'proxyOID': proxyOID.userOID,
          'proxyTimeRange': values[`endDate-${key}`] ? 102 : 101,
          'ruleOID': null,
          'startDate': values[`startDate-${key}`].format('YYYY-MM-DD'),
          'status': proxyOID.status,
          'customFormDTOs': this.state.chosenOptions[key],
          'emplyeeId': proxyOID.employeeID
        };
        let principalInfo = this.state.principalInfo;
        let billProxyRuleDTOs = [].concat(this.state.billProxyRuleDTOs);
        billProxyRuleDTOs.push(billProxyRuleDTO);
        principalInfo.billProxyRuleDTOs = billProxyRuleDTOs;
        principalInfo.enabled = false;
        billProxyRuleDTOs.map(item => {
          if(item.enabled) {
            principalInfo.enabled = true;
          }
        });
        this.setState({ loading: true });
        this.handleSave(principalInfo, key);
      }
    });
  };

  //保存单个代理关系 - 编辑
  handleEditSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let proxyOID;
        try {
          proxyOID = JSON.parse(values[`proxyOID`]);
        } catch(e) {
          proxyOID = this.state.editItem;
        }
        let startDate = this.state.startAgencyDate;
        let endDate = this.state.endAgencyDate;
        let billProxyRuleDTO = {
          'enabled': (endDate && (new Date(endDate) < new Date())) ? false : values.enabled,
          'endDate': endDate ? moment(endDate).format('YYYY-MM-DD') : null ,
          'leavingDate': proxyOID.leavingDate,
          'proxyName': proxyOID.fullName || proxyOID.proxyName,
          'proxyOID': proxyOID.userOID || proxyOID.proxyOID,
          'proxyTimeRange': endDate ? 102 : 101,
          'ruleOID': this.state.editItem.ruleOID,
          'startDate': moment(startDate).format('YYYY-MM-DD'),
          'status': proxyOID.status,
          'customFormDTOs': this.state.chosenOptions[-1],
          'emplyeeId': proxyOID.emplyeeId || proxyOID.employeeID
        };
        let principalInfo = this.state.principalInfo;
        let billProxyRuleDTOs = [].concat(this.state.billProxyRuleDTOs);
        principalInfo.enabled = false;
        billProxyRuleDTOs.map((item, index) => {
          if (item.ruleOID == billProxyRuleDTO.ruleOID) {
            billProxyRuleDTOs[index] = billProxyRuleDTO
          }
          if(item.enabled) {
            principalInfo.enabled = true;
          }
        });
        principalInfo.billProxyRuleDTOs = billProxyRuleDTOs;
        this.setState({ loading: true });
        this.handleSave(principalInfo);
      }
    });
  };

  //选择代理单据，key==-1表示编辑的代理关系，key>0表示新增的代理关系
  onOptionsChange = (values, key, type) => {
    let index = this.state.editItemIndex;
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
          item.formOID == value && ((item.hasPermission = true) && chosenOptions[key].push(item));
        })
      });
      this.state.chosenOptions2OIDs[key].map(value => {
        bill2Options.map(item => {
          item.formOID == value && ((item.hasPermission = true) && chosenOptions[key].push(item));
        })
      });
      let editBillSelectedItems = this.state.editBillSelectedItems;
      let editBillSelectedOID = this.state.editBillSelectedOID;
      (index || index == 0) && (editBillSelectedItems[index] = chosenOptions[-1]);
      (index || index == 0) && (editBillSelectedOID[index].bill1 = chosenOptions1OIDs[-1]);
      (index || index == 0) && (editBillSelectedOID[index].bill2 = chosenOptions2OIDs[-1]);
      this.setState({ chosenOptions, editBillSelectedItems, editBillSelectedOID })
    })
  };

  //开始代理日期 < 结束代理日期
  disabledStartDate = (startAgencyDate) => {
    const endAgencyDate = this.state.endAgencyDate;
    if (!startAgencyDate || !endAgencyDate) {
      return false;
    }
    return startAgencyDate.valueOf() > endAgencyDate.valueOf();
  };

  //修改开始代理日期时间
  onStartChange = (startAgencyDate) => {
    this.setState({ startAgencyDate })
  };

  //结束代理日期 > 开始代理日期
  disabledEndDate = (endAgencyDate) => {
    const startAgencyDate = this.state.startAgencyDate;
    if (!endAgencyDate || !startAgencyDate) {
      return false;
    }
    return endAgencyDate.valueOf() <= startAgencyDate.valueOf();
  };

  //修改结束代理日期时间
  onEndChange = (endAgencyDate) => {
    if (endAgencyDate) {
      const endDate = new Date(new Date(endAgencyDate).getTime() + 86400000);
      if(endDate < new Date()) {
        this.setState({ switchDisabled: true })
      } else {
        this.setState({ switchDisabled: false })
      }
    } else {
      this.setState({ switchDisabled: false })
    }
    this.setState({ endAgencyDate })
  };

  //删除某个代理关系
  handleDelete = (index) => {
    let billProxyRuleDTOs = this.state.billProxyRuleDTOs;
    let principalInfo = this.state.principalInfo;
    billProxyRuleDTOs = billProxyRuleDTOs.slice(0, index).concat(billProxyRuleDTOs.slice(index+1));
    principalInfo.billProxyRuleDTOs = billProxyRuleDTOs;
    this.handleSave(principalInfo);
  };

  //编辑某个代理关系，key==-1表示编辑的代理关系，key>0表示新增的代理关系
  handleEdit = (e, index, isEdit, editItem) => {
    e.stopPropagation();
    let billProxyRuleDTOs = this.state.billProxyRuleDTOs;
    let edit_tag = false;
    isEdit && billProxyRuleDTOs.map(item => {
      if(item.isEdit) {
        edit_tag = true;
      }
    });
    if(edit_tag || this.props.form.getFieldValue('keys').length > 0) {
      message.warning('你有一个编辑中的代理关系未保存');
      return;
    }
    let statusValue = this.state.statusValue;
    statusValue[-1] = undefined;

    if(isEdit) {  //获取代理单据选项
      let url = `${config.baseUrl}/api/custom/forms/proxy?principalOID=${this.props.principalOID}&proxyOID=${editItem.proxyOID}`;
      httpFetch.get(url).then((response)=>{
        let bill1Options = [];
        let bill2Options = [];
        response.data.map(item => {
          item.label = item.formName;
          item.value = item.formOID;
          if (item.formType / 1000 >= 3) {  //报销单
            bill1Options.push(item)
          } else {
            bill2Options.push(item)
          }
        });
        let billOptions = this.state.billOptions;
        billOptions[-1] = {
          bill1Options: bill1Options,
          bill2Options: bill2Options
        };
        this.setState({
          billOptions,
          startAgencyDate: moment(editItem.startDate),
          endAgencyDate: editItem.proxyTimeRange == '102' ? moment(editItem.endDate) : null
        });
        const endDate = new Date(new Date(editItem.endDate).getTime() + 86400000);
        if(editItem.proxyTimeRange == 102 && endDate < new Date()) {  //proxyTimeRange:102 自定义结束时间
          this.setState({ switchDisabled: true })
        } else {
          this.setState({ switchDisabled: false })
        }
      });
    }

    billProxyRuleDTOs[index].isEdit = isEdit;
    let chosenOptions = this.state.chosenOptions;
    let chosenOptions1OIDs = this.state.chosenOptions1OIDs;
    let chosenOptions2OIDs = this.state.chosenOptions2OIDs;
    chosenOptions[-1] = this.state.editBillSelectedItems[index];
    chosenOptions1OIDs[-1] = this.state.editBillSelectedOID[index].bill1;
    chosenOptions2OIDs[-1] = this.state.editBillSelectedOID[index].bill2;
    let editItemIndex = index;
    this.setState({ billProxyRuleDTOs, statusValue, chosenOptions, chosenOptions1OIDs, chosenOptions2OIDs, editItem, editItemIndex })
  };

  render(){
    const { formatMessage } = this.props.intl;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { loading, data, statusValue, billOptions, proxyVerify, fetching, billProxyRuleDTOs, editBillSelectedOID, switchDisabled } = this.state;
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
                      showSearch
                      optionFilterProp='children'
                      notFoundContent={fetching ? <Spin size="small" /> : '无匹配结果'}
                      onSearch={(value) => {this.handleSearch(value, key)}}
                      onSelect={(item) => {this.handleSelect(item, key)}}>
                {options}
              </Select>
            )}
          </FormItem>
          <FormItem style={{display:'inline-block'}}
                    colon={false}
                    label={<span>{formatMessage({id:'common.column.status'})/* 状态 */} ：<span>{statusValue[key] || statusValue[0]}</span></span>}>
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
                            placeholder={formatMessage({id:'agencySetting.indefinite'})/* 无限制 */}
                            disabledDate={this.disabledEndDate}
                            onChange={this.onEndChange}/>
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
    const customPanelStyle = {
      background: '#f7f7f7',
      borderRadius: 4,
      marginTop: 10,
      border: 0,
      overflow: 'hidden',
    };
    const agencyInfo = billProxyRuleDTOs.map((item, index) => {
      const panelHeader = (
        <div>
          <span className="header-principal">代理人：{item.proxyName} - {item.emplyeeId}</span>
          <span className="header-more">
            <a onClick={(e) => {this.handleEdit(e, index, true, item)}}>{formatMessage({id: 'common.edit'})/* 编辑 */}</a>
            <span className="ant-divider"/>
            <Popconfirm onConfirm={() => {this.handleDelete(index)}} onClick={e => e.stopPropagation()} title="你确定要删除这条数据吗?">
              <a>{formatMessage({id: 'common.delete'})/* 删除 */}</a>
            </Popconfirm>
          </span>
        </div>
      );
      let alertEndDateMessage;
      let alertLeavingDateMessage;
      const endDate = new Date(new Date(item.endDate).getTime() + 86400000);
      if(item.proxyTimeRange == 102 && endDate < new Date()) {  //proxyTimeRange:102 自定义结束时间
        item.enabled = false;
        alertEndDateMessage = (
          <Alert message={`该代理关系在 ${endDate.format("yyyy-MM-dd")}号 失效`}
                 type="warning" showIcon
                 style={{marginTop:'3px'}} />)
      }
      if(item.status == 1003) { //status:1003 已离职
        item.enabled = false;
        alertLeavingDateMessage = (
          <Alert message={`员工 ${item.proxyName}-${item.emplyeeId} 已于 ${moment(item.leavingDate).format("YYYY-MM-DD")}日离职，该代理关系已于该日期内自动禁用`}
                 type="warning" showIcon
                 style={{marginTop:'3px'}} />)
      }
      const panelItem = (
        <div key={index}>
          <Collapse bordered={false} key={index}>
            <Panel header={panelHeader} style={customPanelStyle}>
              <div>
                <Row style={{marginBottom:'10px'}}>
                  代理单据：{item.customFormDTOs.map((bill, index) => {
                  return index < item.customFormDTOs.length-1 ? bill.formName + '，' : bill.formName
                })}
                </Row>
                <Row>
                  <Col span={8}>代理日期：
                    {moment(item.startDate).format("YYYY-MM-DD")} 至 {item.proxyTimeRange == 102 ? moment(item.endDate).format("YYYY-MM-DD") : '无限制'}
                  </Col>
                  <Col span={8}>状态：<Badge status={item.enabled ? 'success': 'error'} text={item.enabled ? '启用' : '禁用'} /></Col>
                </Row>
              </div>
            </Panel>
          </Collapse>
          {alertEndDateMessage}
          {alertLeavingDateMessage}
        </div>
      );
      const editItem = (
        <Form className="relation-form" onSubmit={(e) => {this.handleEditSubmit(e)}} key={index}>
          <FormItem style={{display:'inline-block',marginRight:'50px',width:'300px'}}
                    validateStatus={proxyVerify[-1] ? proxyVerify[-1].status : ''}
                    help={proxyVerify[-1] ? proxyVerify[-1].help : ''}
                    label={formatMessage({id:'agencySetting.agent'})}>{/*代理人*/}
            {getFieldDecorator(`proxyOID`, {
              rules: [{
                required: true,
                message: formatMessage({id: 'common.please.select'})  //请选择
              }],
              initialValue: `${item.proxyName} - ${item.emplyeeId}`
            })(
              <Select placeholder={formatMessage({id: 'common.please.select'})/* 请选择 */}
                      showSearch
                      optionFilterProp='children'
                      notFoundContent={fetching ? <Spin size="small" /> : '无匹配结果'}
                      onSearch={(value) => {this.handleSearch(value, -1)}}
                      onSelect={(item) => {this.handleSelect(item, -1)}}>
                {options}
              </Select>
            )}
          </FormItem>
          <FormItem style={{display:'inline-block'}}
                    colon={false}
                    label={<span>{formatMessage({id:'common.column.status'})/* 状态 */} ：
                      <span>{statusValue[-1] || (item.enabled ? formatMessage({id:'common.enabled'}) : formatMessage({id:'common.disabled'}))/*启用 禁用*/}</span>
                    </span>}>
            {getFieldDecorator(`enabled`, {
              initialValue: item.enabled
            })(
              <Switch defaultChecked={item.enabled}
                      checkedChildren={<Icon type="check" />}
                      unCheckedChildren={<Icon type="cross" />}
                      disabled={switchDisabled}
                      onChange={(checked) => {this.handleStatusChange(checked, -1)}}/>
            )}
          </FormItem>
          <FormItem style={{borderTop:'1px solid #eaeaea',paddingTop:'10px'}}
                    label={formatMessage({id:'agencySetting.agent-bills'})}>{/*代理单据*/}
            {getFieldDecorator(`customFormDTOs`)(
              <div style={{marginLeft:'10px'}}>
                <FormItem {...formItemLayout}
                          style={{marginBottom:'0'}}
                          label={formatMessage({id:'agencySetting.expense-account'})/*报销单*/}>
                  {getFieldDecorator(`bill1`, {
                    initialValue: editBillSelectedOID[index].bill1
                  })(
                    <CheckboxGroup options={billOptions[-1] ? billOptions[-1].bill1Options: []}
                                   onChange={(value) => {this.onOptionsChange(value, -1, 'bill1Options')}} />
                  )}
                </FormItem>
                <FormItem {...formItemLayout}
                          label={formatMessage({id:'agencySetting.application-form'})/*申请单*/}>
                  {getFieldDecorator(`bill2`, {
                    initialValue: editBillSelectedOID[index].bill2
                  })(
                    <CheckboxGroup options={billOptions[-1] ? billOptions[-1].bill2Options: []}
                                   onChange={(value) => {this.onOptionsChange(value, -1, 'bill2Options')}} />
                  )}
                </FormItem>
              </div>
            )}
          </FormItem>
          <div label={formatMessage({id:'agencySetting.agency-date'})}>{/*代理日期*/}
            <FormItem style={{display:'inline-block',marginRight:'20px'}}>
              {getFieldDecorator(`startDate`, {
                initialValue: moment(new Date(item.startDate).format('yyyy-MM-dd'))
              })(
                <DatePicker format="YYYY-MM-DD"
                            allowClear={false}
                            disabledDate={this.disabledStartDate}
                            onChange={this.onStartChange}/>
              )}
            </FormItem>
            <FormItem style={{display:'inline-block'}}>
              {getFieldDecorator(`endDate`, {
                initialValue: item.proxyTimeRange == 102 ? moment(new Date(item.endDate).format('yyyy-MM-dd')) : null
              })(
                <DatePicker format="YYYY-MM-DD"
                            placeholder={formatMessage({id:'agencySetting.indefinite'})/* 无限制 */}
                            disabledDate={this.disabledEndDate}
                            onChange={this.onEndChange}/>
              )}
            </FormItem>
          </div>
          <FormItem>
            <Button type="primary"
                    htmlType="submit"
                    loading={loading}
                    style={{marginRight:'10px'}}>{formatMessage({id: 'common.save'})/* 保存 */}</Button>
            <Button onClick={(e) => this.handleEdit(e, index, false)}>{formatMessage({id: 'common.cancel'})/* 取消 */}</Button>
          </FormItem>
        </Form>
      );
      return item.isEdit ? editItem : panelItem
    });
    return (
      <div className="agency-relation">
        <h3 className="header-title">{formatMessage({id:'agencySetting.agency-relation'})}</h3>{/*代理关系*/}
        <p style={{color:'#999'}}>{formatMessage({id:'agencySetting.agency-relation-intro'})}</p>{/*选择哪些员工可以帮被代理人提交单据 | 单据可按照被代理人的需求进行分配*/}
        {agencyInfo}
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

const WrappedAgencyRelation = Form.create()(AgencyRelation);

export default connect(mapStateToProps)(injectIntl(WrappedAgencyRelation));
