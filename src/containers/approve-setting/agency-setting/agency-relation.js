import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

import { Form, Button, Icon, Select, Switch, Checkbox, DatePicker, message, Collapse, Spin, Row, Col, Badge, Menu, Dropdown, Popconfirm } from 'antd';
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
      keys: [],
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
      billSelectedOID: {}, //代理关系选中的代理单据formOID数组集合
      editRelationBill: {}, //编辑代理关系时选中的代理单据
      editItem: {}, //编辑代理关系数据
    };
    this.handleSearch = debounce(this.handleSearch, 250);
  }

  componentWillReceiveProps(nextProps){
    !this.state.principalInfo.principalOID && this.setState({
      billProxyRuleDTOs: nextProps.billProxyRuleDTOs,
      principalInfo: nextProps.principalInfo,
    },() => {
      let billSelectedOID = {};
      let editRelationBill = {};
      this.state.billProxyRuleDTOs.map((item, index) => {
        billSelectedOID[index] = {};
        editRelationBill[index] = [];
        billSelectedOID[index].bill1 = [];
        billSelectedOID[index].bill2 = [];
        item.customFormDTOs.map(formOID => {
          editRelationBill[index].push(formOID);
          if (formOID.formType / 1000 >= 3) {  //报销单
            billSelectedOID[index].bill1.push(formOID.formOID)
          } else {
            billSelectedOID[index].bill2.push(formOID.formOID)
          }
        });
      });
      this.setState({ billSelectedOID, editRelationBill })
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
    if (item.status == 1002) {
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
      const { form } = this.props;
      const keys = form.getFieldValue('keys');
      const nextKeys = keys.concat(this.state.uuid);
      form.setFieldsValue({
        keys: nextKeys,
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
      this.setState({loading: false});
      if(e.response.data.message){
        message.error(`${formatMessage({id: 'common.save.filed'})/* 保存失败 */}, ${e.response.data.message}`);
      } else {
        message.error('呼，服务器出了点问题，请联系管理员或稍后再试:(');
      }
    })
  };

  //保存单个代理关系 - 新增
  handleSubmit = (e, key) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let proxyOID = JSON.parse(values[`proxyOID-${key}`]);
        let billProxyRuleDTO = {
          'enabled': values[`enabled-${key}`],
          'endDate': values[`endDate-${key}`] ? values[`endDate-${key}`].format('YYYY-MM-DD') : null ,
          'leavingDate': proxyOID.leavingDate,
          'proxyName': proxyOID.fullName,
          'proxyOID': proxyOID.userOID,
          'proxyTimeRange': values[`endDate-${key}`] ? 102 : 101,
          'ruleOID': null,
          'startDate': values[`startDate-${key}`].format('YYYY-MM-DD'),
          'status': proxyOID.status,
          'customFormDTOs': this.state.chosenOptions[key]
        };
        let principalInfo = this.state.principalInfo;
        let billProxyRuleDTOs = [].concat(this.state.billProxyRuleDTOs);
        billProxyRuleDTOs.push(billProxyRuleDTO);
        principalInfo.billProxyRuleDTOs = billProxyRuleDTOs;
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
        console.log(this.state.editItem);
        let proxyOID;
        try {
          proxyOID = JSON.parse(values[`proxyOID`]);
        } catch(e) {
          proxyOID = this.state.editItem;
        }
        let billProxyRuleDTO = {
          'enabled': values.enabled,
          'endDate': values.endDate ? values.endDate.format('YYYY-MM-DD') : null ,
          'leavingDate': proxyOID.leavingDate,
          'proxyName': proxyOID.fullName || proxyOID.proxyName,
          'proxyOID': proxyOID.userOID || proxyOID.proxyOID,
          'proxyTimeRange': values.endDate ? 102 : 101,
          'ruleOID': this.state.editItem.ruleOID,
          'startDate': values.startDate.format('YYYY-MM-DD'),
          'status': proxyOID.status,
          'customFormDTOs': this.state.chosenOptions[-1]
        };
        let principalInfo = this.state.principalInfo;
        let billProxyRuleDTOs = [].concat(this.state.billProxyRuleDTOs);
        billProxyRuleDTOs.push(billProxyRuleDTO);
        principalInfo.billProxyRuleDTOs = billProxyRuleDTOs;
        this.setState({ loading: true });
        this.handleSave(principalInfo);
      }
    });
  };

  //选择代理单据，key==-1表示编辑的代理关系，key>0表示新增的代理关系
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
          item.formOID == value && ((item.hasPermission = true) && chosenOptions[key].push(item));
        })
      });
      this.state.chosenOptions2OIDs[key].map(value => {
        bill2Options.map(item => {
          item.formOID == value && ((item.hasPermission = true) && chosenOptions[key].push(item));
        })
      });
      this.setState({ chosenOptions })
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
    this.setState({ endAgencyDate })
  };

  //删除某个代理关系
  handleDelete = (e, index) => {
    let billProxyRuleDTOs = this.state.billProxyRuleDTOs;
    let principalInfo = this.state.principalInfo;
    billProxyRuleDTOs = billProxyRuleDTOs.slice(0, index).concat(billProxyRuleDTOs.slice(index+1));
    principalInfo.billProxyRuleDTOs = billProxyRuleDTOs;
    this.handleSave(principalInfo);
  };

  //编辑某个代理关系，key==-1表示编辑的代理关系，key>0表示新增的代理关系
  handleEdit = (index, isEdit, editItem) => {
    let billProxyRuleDTOs = this.state.billProxyRuleDTOs;
    let edit_tag = false;
    isEdit && billProxyRuleDTOs.map(item => {
      if(item.isEdit) {
        message.warning('你有一个编辑中的代理关系未保存');
        edit_tag = true;
      }
    });
    if(edit_tag) return;
    let statusValue = this.state.statusValue;
    statusValue[-1] = undefined;
    if(isEdit) {
      //获取代理单据选项
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
        this.setState({ billOptions })
      });
    }

    billProxyRuleDTOs[index].isEdit = isEdit;
    let chosenOptions = this.state.chosenOptions;
    let chosenOptions1OIDs = this.state.chosenOptions1OIDs;
    let chosenOptions2OIDs = this.state.chosenOptions2OIDs;
    chosenOptions[-1] = this.state.editRelationBill[index];
    chosenOptions1OIDs[-1] = this.state.billSelectedOID[index].bill1;
    chosenOptions2OIDs[-1] = this.state.billSelectedOID[index].bill2;
    this.setState({ billProxyRuleDTOs, statusValue, chosenOptions, chosenOptions1OIDs, chosenOptions2OIDs, editItem })
  };

  render(){
    const { formatMessage } = this.props.intl;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { loading, data, statusValue, billOptions, proxyVerify, fetching, billProxyRuleDTOs, billSelectedOID } = this.state;
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
      const menu = (
        <Menu>
          <Menu.Item>
            <Popconfirm onConfirm={(e) => this.handleDelete(e, index)} title="你确定要删除这条数据吗?">
              <a>删除</a>
            </Popconfirm>
          </Menu.Item>
          <Menu.Item><a>复制</a></Menu.Item>
        </Menu>
      );
      const panelHeader = (
        <div>
          <span className="header-principal">代理人：{item.proxyName} - {item.emplyeeId}</span>
          <span className="header-more">
            <a onClick={() => {this.handleEdit(index, true, item)}}>{formatMessage({id: 'common.edit'})/* 编辑 */}</a>
            <span className="ant-divider"/>
            <Dropdown overlay={menu}><a>更多 <Icon type="down"/></a></Dropdown>
          </span>
        </div>
      );
      const panelItem = (
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
                    initialValue: billSelectedOID[index].bill1
                  })(
                    <CheckboxGroup options={billOptions[-1] ? billOptions[-1].bill1Options: []}
                                   onChange={(value) => {this.onOptionsChange(value, -1, 'bill1Options')}} />
                  )}
                </FormItem>
                <FormItem {...formItemLayout}
                          label={formatMessage({id:'agencySetting.application-form'})/*申请单*/}>
                  {getFieldDecorator(`bill2`, {
                    initialValue: billSelectedOID[index].bill2
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
                initialValue: moment(item.startDate, 'YYYY-MM-DD')
              })(
                <DatePicker format="YYYY-MM-DD"
                            allowClear={false}
                            disabledDate={this.disabledStartDate}
                            onChange={this.onStartChange}/>
              )}
            </FormItem>
            <FormItem style={{display:'inline-block'}}>
              {getFieldDecorator(`endDate`, {
                initialValue: item.proxyTimeRange == 102 ? moment(item.endDate, 'YYYY-MM-DD') : null
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
            <Button onClick={() => this.handleEdit(index, false)}>{formatMessage({id: 'common.cancel'})/* 取消 */}</Button>
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