import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { Form, Select, Tag, Input, Table, Button, message, Modal, Col } from 'antd'
const Search = Input.Search;
const FormItem = Form.Item;
const Option = Select.Option;

import httpFetch from 'share/httpFetch'
import menuRoute from 'routes/menuRoute'
import config from 'config'

import 'styles/finance-setting/account-period-define/new-account-rule.scss'

class NewAccountPeriod extends React.Component {
  constructor(props) {
    super(props);
    const { formatMessage } = this.props.intl;
    this.state = {
      loading: false,
      ruleIsDefine: false,  //规则是否定义
      period: null, //期间详情
      periodRule: [], //期间规则
      columns: [
        {title: formatMessage({id: 'common.sequence'}),
          dataIndex: 'periodNum', key: 'periodNum', width: '8%', render:(count, render, index)=>{
          return this.state.ruleIsDefine ? (index + 1) : (
            <FormItem>
              {this.props.form.getFieldDecorator(`periodNum-${count}`, {
                initialValue: index + 1
              })(
                <Input className="no-input-style" disabled />
              )}
            </FormItem>)
        }},  //序号
        {title: formatMessage({id: 'account.period.define.rule.periodAdditionalName'}),
          dataIndex: 'periodAdditionalName', key: 'periodAdditionalName', width: '25%', render:(count)=>{
          return this.state.ruleIsDefine ? count : (
            <FormItem hasFeedback>
              {this.props.form.getFieldDecorator(`periodAdditionalName-${count}`, {
                rules: [{
                  required: true,
                  message: ' '
                }],
                initialValue: this.state.additionalName[count]
              })(
                <Input placeholder="请输入" onChange={(e) => {
                  let additionalName = this.state.additionalName;
                  additionalName[count] = e.target.value;
                  this.setState({ additionalName })
                }}/>
              )}
            </FormItem>)
        }}, //期间名附加
        {title: formatMessage({id: 'account.period.define.rule.monthFrom'}),
          dataIndex: 'monthFrom', key: 'monthFrom', render:(count) => {
          let options = [];
          let maxValue = 12;
          const monthToVal = this.state.monthTo[count];
          if (monthToVal) {
            maxValue = monthToVal
          }
          for(let m = 1; m <= maxValue; m++) {
            options.push(<Option key={m}>{m}</Option>);
          }
          return this.state.ruleIsDefine ? count : (
            <FormItem>
              {this.props.form.getFieldDecorator(`monthFrom-${count}`, {
                initialValue: this.state.monthFrom[count] ? String(this.state.monthFrom[count]) : undefined
              })(
                <Select placeholder="请选择" disabled={count > 1 ? true : false} onChange={(value) => {
                  let monthFrom = this.state.monthFrom;
                  monthFrom[count] = value;
                  this.setState({ monthFrom })
                }}>
                  {options}
                </Select>
              )}
            </FormItem>)
        }}, //月份从
        {title: formatMessage({id: 'account.period.define.rule.dateFrom'}),
          dataIndex: 'dateFrom', key: 'dateFrom', render:(count) => {
          let maxValue;
          const monthFromVal = this.state.monthFrom[count];
          const monthToVal = this.state.monthTo[count];
          const dateToVal = this.state.dateTo[count];
          if (monthFromVal == 2) {
            maxValue = 28;
          } else if (monthFromVal == 4 || monthFromVal == 6 || monthFromVal == 9 || monthFromVal == 11) {
            maxValue = 30;
          } else {
            maxValue = 31;
          }
          if (dateToVal && monthFromVal == monthToVal) {
            maxValue = dateToVal;
          }
          let options = [];
          for(let m = 1; m <= maxValue; m++) {
            options.push(<Option key={m}>{m}</Option>);
          }
          if (!monthFromVal) {
            options = []
          }
          return this.state.ruleIsDefine ? count : (
            <FormItem>
              {this.props.form.getFieldDecorator(`dateFrom-${count}`, {
                initialValue: this.state.dateFrom[count] ? String(this.state.dateFrom[count]) : undefined
              })(
                <Select placeholder="请选择" disabled={count > 1 ? true : false} onChange={(value) => {
                  let dateFrom = this.state.dateFrom;
                  dateFrom[count] = value;
                  this.setState({ dateFrom })
                }}>
                  {options}
                </Select>
              )}
            </FormItem>)
        }}, //日期从
        {title: formatMessage({id: 'account.period.define.rule.monthTo'}),
          dataIndex: 'monthTo', key: 'monthTo', render:(count) => {
          let options = [];
          const monthFromVal = this.state.monthFrom[count];
          const dateFromVal = this.state.dateFrom[count];
          const dateToVal = this.state.dateTo[count];
          for (let m = monthFromVal; m <= 12; m++) {
            options.push(<Option key={m}>{m}</Option>)
          }
          if (!dateFromVal) {
            options = []
          }
          return this.state.ruleIsDefine ? count : (
            <FormItem>
              {this.props.form.getFieldDecorator(`monthTo-${count}`, {
                rules: [{
                  required: true,
                  message: ' '
                }],
                initialValue: this.state.monthTo[count] ? String(this.state.monthTo[count]) : undefined
              })(
                <Select placeholder="请选择" onChange={(value) => {
                  let monthFrom = this.state.monthFrom;
                  let dateFrom = this.state.dateFrom;
                  let monthTo = this.state.monthTo;
                  monthTo[count] = value;
                  this.setState({ monthTo });
                  if (dateToVal) {
                    if (value == 2 && dateToVal == 28) {
                      monthFrom[count + 1] = 3;
                      dateFrom[count + 1] = 1;
                    } else if ((value == 4 || value == 6 || value == 9 || value == 11) && dateToVal == 30) {
                      monthFrom[count + 1] = parseInt(value) + 1;
                      dateFrom[count + 1] = 1;
                    } else if (value == 12 && dateToVal == 31 && count < this.state.period.totalPeriodNum) {
                      Modal.error({
                        title: formatMessage({id :'account.period.define.rule.modal.error.title'}),  //截止日期不对
                        content: formatMessage({id: 'account.period.define.rule.modal.error.content'}),  //截止日期不能为 12月31日
                      });
                      return;
                    } else if (dateToVal == 31) {
                      monthFrom[count + 1] = parseInt(value) + 1;
                      dateFrom[count + 1] = 1;
                    } else {
                      monthFrom[count + 1] = value;
                      dateFrom[count + 1] = parseInt(dateToVal) + 1;
                    }
                    this.setState({ monthFrom, dateFrom },() => {
                      if (count == this.state.count) {
                        this.addNewRow();
                      } else {
                        this.clearWrite(count+1)
                      }
                    })
                  }
                }}>
                  {options}
                </Select>
              )}
            </FormItem>)
        }}, //月份到
        {title: formatMessage({id: 'account.period.define.rule.dateTo'}),
          dataIndex: 'dateTo', key: 'dateTo', render:(count) => {
          let maxValue;
          let minValue;
          const monthFromVal = this.state.monthFrom[count];
          const monthToVal = this.state.monthTo[count];
          const dateFrom = this.state.dateFrom[count];
          if (monthToVal == 2) {
            maxValue = 28;
          } else if (monthToVal == 4 || monthToVal == 6 || monthToVal == 9 || monthToVal == 11) {
            maxValue = 30;
          } else {
            maxValue = 31;
          }
          if (monthToVal == monthFromVal) {
            minValue = dateFrom;
          } else {
            minValue = 1;
          }
          let options = [];
          for(let d = minValue; d <= maxValue; d++) {
            options.push(<Option key={d}>{d}</Option>);
          }
          if (!monthToVal) {
            options = []
          }
          return this.state.ruleIsDefine ? count : (
            <FormItem>
              {this.props.form.getFieldDecorator(`dateTo-${count}`, {
                rules: [{
                  required: true,
                  message: ' '
                }],
                initialValue: this.state.dateTo[count] ? String(this.state.dateTo[count]) : undefined
              })(
                <Select placeholder="请选择" onChange={(value) => {
                  let monthFrom = this.state.monthFrom;
                  let dateFrom = this.state.dateFrom;
                  let dateTo = this.state.dateTo;
                  dateTo[count] = value;
                  this.setState({ dateTo });
                  if (monthToVal == 2 && value == 28) {
                    monthFrom[count + 1] = 3;
                    dateFrom[count + 1] = 1;
                  } else if ((monthToVal == 4 || monthToVal == 6 || monthToVal == 9 || monthToVal == 11) && value == 30) {
                    monthFrom[count + 1] = parseInt(monthToVal) + 1;
                    dateFrom[count + 1] = 1;
                  } else if (monthToVal == 12 && value == 31 && count < this.state.period.totalPeriodNum) {
                    Modal.error({
                      title: '截止日期不对',
                      content: '截止日期不能为 12月31日',
                    });
                    return;
                  } else if (value == 31) {
                    monthFrom[count + 1] = parseInt(monthToVal) + 1;
                    dateFrom[count + 1] = 1;
                  } else {
                    monthFrom[count + 1] = monthToVal;
                    dateFrom[count + 1] = parseInt(value) + 1;
                  }
                  this.setState({ monthFrom, dateFrom },() => {
                    if (count == this.state.count) {
                      this.addNewRow()
                    } else {
                      this.clearWrite(count+1)
                    }
                  })
                }}>
                  {options}
                </Select>
              )}
            </FormItem>)
        }}, //日期到
        {title: formatMessage({id: 'account.period.define.rule.quarter'}),
          dataIndex: 'quarterNum', key: 'quarterNum', render:(count) => {
          return this.state.ruleIsDefine ? count : (
            <FormItem>
              {this.props.form.getFieldDecorator(`quarterNum-${count}`, {
                rules: [{
                  required: true,
                  message: ' '
                }],
                initialValue: this.state.quarterNum[count] ? String(this.state.quarterNum[count]) : undefined
              })(
                <Select placeholder="请选择" onChange={(value) => {
                  let quarterNum = this.state.quarterNum;
                  quarterNum[count] = value;
                  this.setState({ quarterNum })
                }}>
                  <Option value="1">1</Option>
                  <Option value="2">2</Option>
                  <Option value="3">3</Option>
                  <Option value="4">4</Option>
                </Select>
              )}
            </FormItem>)
        }}, //季度
      ],
      data: [],
      count: 1,
      additionalName: {},
      monthFrom: {},
      monthTo: {},
      dateFrom: {},
      dateTo: {},
      quarterNum: {},
      modalVisible: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.period ||
      (this.state.period.id && this.state.period.id != nextProps.params.period.id)) {
      this.setState({
        period: nextProps.params.period,
        data: [{
          id: 1,
          periodNum: 1,
          periodAdditionalName: 1,
          monthFrom: 1,
          monthTo: 1,
          dateFrom: 1,
          dateTo: 1,
          quarterNum: 1
        }]
      },() => {
        if (this.state.period) {
          let url = `${config.baseUrl}/api/periodset/${this.state.period.id}`;
          this.state.period.id && httpFetch.get(url).then(res => {
            this.setState({period: res.data},() => { this.getList() })
          });
        }
      })
    }
  }

  //获取期间规则
  getList = () => {
    let url = `${config.baseUrl}/api/periodrule/query?periodSetId=${this.state.period.id}`;
    httpFetch.get(url).then(res => {
      this.setState({
        ruleIsDefine: res.data.length > 0 ? true : false,
        periodRule: res.data,
        data: res.data.length > 0 ? res.data : this.state.data
      })
    });
  };

  //添加新的一行
  addNewRow = () => {
    const { count, data, period} = this.state;
    if(count >= period.totalPeriodNum) return;
    const newData = {
      id: count + 1,
      periodNum: count + 1,
      periodAdditionalName: count + 1,
      monthFrom: count + 1,
      monthTo: count + 1,
      dateFrom: count + 1,
      dateTo: count + 1,
      quarterNum: count + 1
    };

    this.setState({
      data: [...data, newData],
      count: count + 1,
    })
  };

  //保存期间规则
  handleSave = (e) => {
    e.preventDefault();
    const { formatMessage } = this.props.intl;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let params = [];
        let label;
        let count;
        for (let i = 1; i <= this.state.count; i++) {
          let param_obj = {};
          for (let key in values) {
            label = key.split('-')[0];
            count = key.split('-')[1];
            if (count == i) {
              param_obj[label] = values[key];
            }
          }
          param_obj.periodSetId = this.state.period.id;
          param_obj.tenantId = this.state.period.tenantId;
          params.push(param_obj);
        }
        if (this.state.count < this.state.period.totalPeriodNum) {
          Modal.error({
            title: formatMessage({id: 'account.period.define.rule.totalPeriodNum.error.title'}), //期间数量不对
            content: formatMessage({id: 'account.period.define.rule.totalPeriodNum.error.content'}) //期间数应该等于 期间总数
          });
          return;
        }
        this.setState({loading: true});
        httpFetch.post(`${config.baseUrl}/api/periodrule/batch`, params).then((res)=>{
          this.setState({loading: false});
          if(res.status == 201){
            message.success(formatMessage({id: 'common.save.success'}, {name: ' '}));  //保存成功
            this.getList();
          }
        }).catch((e)=>{
          if(e.response){
            message.error(`${formatMessage({id: 'common.save.filed'})}, ${e.response.data.message}`); //保存失败
          }
          this.setState({loading: false});
        })
      }
    });
  };

  //生成期间
  createPeriod = () => {
    this.setState({ modalVisible: true })
  };

  //创建期间弹框 - 确定
  handleModalOk = () => {
    const { formatMessage } = this.props.intl;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log(values);
        this.setState({loading: true});
        httpFetch.post(`${config.baseUrl}/api/periods/batch/create/periods?periodSetCode=${values.periodSetCode}&yearFrom=${values.yearFrom}&yearTo=${values.yearTo}`).then((res)=>{
          this.setState({loading: false});
          if(res.status == 200){
            message.success(formatMessage({id: 'common.save.success'}, {name: ' '})); //保存成功
            this.handleModalCancel();
          }
        }).catch((e)=>{
          if(e.response){
            message.error(`${formatMessage({id: 'common.save.filed'})}, ${e.response.data.message}`); //保存失败
          }
          this.setState({loading: false});
        })
      }
    });
  };

  //创建期间弹框 - 取消
  handleModalCancel = () => {
    this.setState({ modalVisible: false })
  };

  //清空已填写
  clearWrite = (count) => {
    let { additionalName, monthFrom, monthTo, dateFrom, dateTo, quarterNum } = this.state;
    let data = [];
    for (let i = 1; i <= count; i++) {
      data.push({
        id: i,
        periodNum: i,
        periodAdditionalName: i,
        monthFrom: i,
        monthTo: i,
        dateFrom: i,
        dateTo: i,
        quarterNum: i
      })
    }
    Object.keys(monthFrom).map(key => {
      if (count == 1) {
        additionalName = {};
        monthFrom = {};
        dateFrom = {};
        monthTo = {};
        dateTo = {};
        quarterNum = {};
      } else {
        if (key > count) {
          additionalName[key] = undefined;
          monthFrom[key] = undefined;
          dateFrom[key] = undefined;
          quarterNum[key] = undefined
        }
        if (key >= count) {
          monthTo[key] = undefined;
          dateTo[key] = undefined
        }
      }
    });
    this.props.form.resetFields();
    this.setState({
      data,
      additionalName,
      monthFrom,
      monthTo,
      dateFrom,
      dateTo,
      quarterNum,
    });
  };

  handleClose = () => {
    this.clearWrite(1);
    this.props.close()
  };

  render(){
    const { formatMessage } = this.props.intl;
    const { loading, period, columns, data, ruleIsDefine, modalVisible } = this.state;
    let button;
    let modal;
    if (ruleIsDefine) {
      button = <Button type="primary" onClick={this.createPeriod}>{formatMessage({id: 'account.period.define.rule.create-period'})/* 生成期间 */}</Button>;
      modal = <Modal title={formatMessage({id: 'account.period.define.rule.period.create'})/* 创建期间 */}
                     confirmLoading={loading}
                     visible={modalVisible}
                     onOk={this.handleModalOk}
                     onCancel={this.handleModalCancel}>
        <Form>
          <FormItem label={formatMessage({id: 'account.period.define.code'})/* 会计期代码 */} style={{marginBottom:0}}>
            {this.props.form.getFieldDecorator(`periodSetCode`, {
              initialValue: period ? period.periodSetCode : ''
            })(
              <Input style={{color:'rgba(0,0,0,0.65)',cursor:'text',width:'268px'}} disabled/>
            )}
          </FormItem>
          <FormItem label={formatMessage({id: 'account.period.define.name'})/* 会计期名称 */} style={{marginBottom:0}}>
            {this.props.form.getFieldDecorator(`periodSetName`, {
              initialValue: period ? period.periodSetName : ''
            })(
              <Input style={{color:'rgba(0,0,0,0.65)',cursor:'text',width:'268px'}} disabled/>
            )}
          </FormItem>
          <FormItem label={formatMessage({id: 'account.period.define.rule.year.create'})/* 创建年度 */}>
            <Col span={6} style={{marginRight:'20px'}}>
              <FormItem>
                {this.props.form.getFieldDecorator(`yearFrom`, {
                  rules: [{
                    required: true,
                    message: formatMessage({id: 'common.please.enter'})  //请输入
                  }],
                  initialValue: ''
                })(
                  <Input placeholder={formatMessage({id: 'account.period.define.rule.year.from'})/* 年度从 */} />
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem>
                {this.props.form.getFieldDecorator(`yearTo`, {
                  rules: [{
                    required: true,
                    message: formatMessage({id: 'common.please.enter'})  //请输入
                  }],
                  initialValue: ''
                })(
                  <Input placeholder={formatMessage({id: 'account.period.define.rule.year.to'})/* 年度到 */} />
                )}
              </FormItem>
            </Col>
          </FormItem>
        </Form>
      </Modal>
    } else {
      button = <Button type="primary" onClick={() => this.clearWrite(1)}>{formatMessage({id: 'account.period.define.rule.clear'})/* 清空已填写 */}</Button>;
      modal = ""
    }
    return (
      <div className="new-account-rule">
        <h3 className="header-title">{formatMessage({id: 'account.period.define.rule.define'})/* 会计期规则定义 */}
          <Tag color={this.state.ruleIsDefine ? 'green-inverse' : 'red-inverse'}>
            {this.state.ruleIsDefine ? formatMessage({id: 'account.period.define.rule.has-define'}) :
              formatMessage({id: 'account.period.define.rule.not-define'})}
          </Tag>
        </h3>
        <Form style={{overflow:'hidden', marginBottom:'20px'}}>
          <FormItem label={formatMessage({id: 'account.period.define.rule.total-period'})/* 期间总数 */}
                    style={{width:'20%',marginRight:'30px'}}
                    className="float-left">
            <Input value={period && period.totalPeriodNum} disabled/>
          </FormItem>
          <FormItem label={formatMessage({id: 'account.period.define.rule.addition-name'})/* 名称附加 */}
                    style={{width:'40%'}}
                    className="float-left">
            <Input value={period && period.periodAdditionalFlag} disabled/>
          </FormItem>
        </Form>
        {button}
        <Form style={{marginTop:'10px'}} onSubmit={this.handleSave}>
          <Table columns={columns}
                 dataSource={data}
                 rowKey={record => record.id}
                 pagination={false}
                 bordered
                 size="middle"/>
          <div className="slide-footer">
            {ruleIsDefine ? '' : <Button type="primary" htmlType="submit" loading={loading}>{formatMessage({id: 'common.save'})/* 保存 */}</Button>}
            <Button onClick={this.handleClose}>{formatMessage({id: 'common.cancel'})/* 取消 */}</Button>
          </div>
        </Form>
        {modal}
      </div>
    )
  }

}

function mapStateToProps(state) {
  return {}
}

const WrappedNewAccountPeriod = Form.create()(NewAccountPeriod);

export default connect(mapStateToProps)(injectIntl(WrappedNewAccountPeriod));
