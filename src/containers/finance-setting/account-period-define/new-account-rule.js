import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { Form, Select, Tag, Input, Table, Checkbox, Button } from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;

import httpFetch from 'share/httpFetch'
import menuRoute from 'share/menuRoute'
import config from 'config'

import 'styles/finance-setting/account-period-define/new-account-rule.scss'

class NewAccountPeriod extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      ruleIsDefine: false,  //规则是否定义
      period: null, //期间详情
      columns: [
        {title: '序号', dataIndex: 'periodNum', key: 'periodNum', width: '8%', render:(count) => {
          return (
            <FormItem>
              {this.props.form.getFieldDecorator(`periodNum-${count}`, {
                initialValue: count
              })(
                <Input className="no-input-style" disabled/>
              )}
            </FormItem>)
        }},
        {title: '期间名附加', dataIndex: 'periodAdditionalName', key: 'periodAdditionalName', width: '25%',render:(count)=>{
          return (
            <FormItem>
              {this.props.form.getFieldDecorator(`periodAdditionalName-${count}`)(
                <Input placeholder="请输入" />
              )}
            </FormItem>)
        }},
        {title: '月份从', dataIndex: 'monthFrom', key: 'monthFrom', render:(count) => {
          let options = [];
          for(let m = 1; m <= 12; m++) {
            options.push(<Option key={m}>{m}</Option>);
          }
          return (
            <FormItem>
              {this.props.form.getFieldDecorator(`monthFrom-${count}`, {
                initialValue: this.state.monthFrom[count]
              })(
                <Select placeholder="请选择" disabled={this.state.monthFrom[count] ? true : false} onChange={(value) => {
                  let monthFrom = this.state.monthFrom;
                  monthFrom[count] = value;
                  this.setState({ monthFrom })
                }}>
                  {options}
                </Select>
              )}
            </FormItem>)
        }},
        {title: '日期从', dataIndex: 'dateFrom', key: 'dateFrom', render:(count) => {
          let maxValue;
          const monthFrom = this.state.monthFrom[count];
          if (monthFrom == 2) {
            maxValue = 28;
          } else if (monthFrom == 4 || monthFrom == 6 || monthFrom == 9 || monthFrom == 11) {
            maxValue = 30;
          } else {
            maxValue = 31;
          }
          let options = [];
          for(let m = 1; m <= maxValue; m++) {
            options.push(<Option key={m}>{m}</Option>);
          }
          if (!monthFrom) {
            options = []
          }
          return (
            <FormItem>
              {this.props.form.getFieldDecorator(`dateFrom-${count}`)(
                <Select placeholder="请选择" onChange={(value) => {
                  let dateFrom = this.state.dateFrom;
                  dateFrom[count] = value;
                  this.setState({ dateFrom })
                }}>
                  {options}
                </Select>
              )}
            </FormItem>)
        }},
        {title: '月份到', dataIndex: 'monthTo', key: 'monthTo', render:(count) => {
          let options = [];
          const monthFrom = this.state.monthFrom[count];
          const dateFrom = this.state.dateFrom[count];
          for (let m = monthFrom; m <= 12; m++) {
            options.push(<Option key={m}>{m}</Option>)
          }
          if (!dateFrom) {
            options = []
          }
          return (
            <FormItem>
              {this.props.form.getFieldDecorator(`monthTo-${count}`)(
                <Select placeholder="请选择" onChange={(value) => {
                  let monthTo = this.state.monthTo;
                  let monthFrom = this.state.monthFrom;
                  monthTo[count] = value;
                  monthFrom[count + 1] = value;
                  this.setState({ monthTo, monthFrom })
                }}>
                  {options}
                </Select>
              )}
            </FormItem>)
        }},
        {title: '日期到', dataIndex: 'dateTo', key: 'dateTo', render:(count) => {
          let maxValue;
          let minValue;
          const monthFrom = this.state.monthFrom[count];
          const monthTo = this.state.monthTo[count];
          const dateFrom = this.state.dateFrom[count];
          if (monthTo == 2) {
            maxValue = 28;
          } else if (monthTo == 4 || monthTo == 6 || monthTo == 9 || monthTo == 11) {
            maxValue = 30;
          } else {
            maxValue = 31;
          }
          if (monthTo == monthFrom) {
            minValue = dateFrom;
          } else {
            minValue = 1;
          }
          let options = [];
          for(let d = minValue; d <= maxValue; d++) {
            options.push(<Option key={d}>{d}</Option>);
          }
          if (!monthTo) {
            options = []
          }
          return (
            <FormItem>
              {this.props.form.getFieldDecorator(`dateTo-${count}`)(
                <Select placeholder="请选择" onChange={(value) => {
                  let dateTo = this.state.dateTo;
                  dateTo[count] = value;
                  this.setState({ dateTo },() => {
                    this.addNewRow();
                  })
                }}>
                  {options}
                </Select>
              )}
            </FormItem>)
        }},
        {title: '季度', dataIndex: 'quarterNum', key: 'quarterNum', render:(count) => {
          return (
            <FormItem>
              {this.props.form.getFieldDecorator(`getFieldDecorator-${count}`)(
                <Select placeholder="请选择">
                  <Option value="1">1</Option>
                  <Option value="2">2</Option>
                  <Option value="3">3</Option>
                  <Option value="4">4</Option>
                </Select>
              )}
            </FormItem>)
        }},
        {title: '调整', dataIndex: 'adjustmentFlag', key: 'adjustmentFlag', width: '8%', render:(count) => {
          return (
            <FormItem>
              {this.props.form.getFieldDecorator(`adjustmentFlag-${count}`, {
                initialValue: false
              })(
                <Checkbox/>
              )}
            </FormItem>)
        }}
      ],
      data: [],
      count: 1,
      additionalName: {},
      monthFrom: {},
      monthTo: {},
      dateFrom: {},
      dateTo: {},
      quarterNum: {},
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.period ||
      (this.state.period.id && this.state.period.id != nextProps.params.period.id)) {
      this.setState({
        period: nextProps.params.period,
        data: [{
          periodNum: 1,
          periodAdditionalName: 1,
          monthFrom: 1,
          monthTo: 1,
          dateFrom: 1,
          dateTo: 1,
          quarterNum: 1,
          adjustmentFlag: 1
        }]
      },() => {
        if (this.state.period) {
          let url = `${config.baseUrl}/api/periodset/${this.state.period.id}`;
          this.state.period.id && httpFetch.get(url).then(res => {
            this.setState({period: res.data})
          });
        }
      })
    }
  }

  addNewRow = () => {
    const { count, data, period} = this.state;
    if(count > period.totalPeriodNum) return;
    const newData = {
      periodNum: count + 1,
      periodAdditionalName: count + 1,
      monthFrom: count + 1,
      monthTo: count + 1,
      dateFrom: count + 1,
      dateTo: count + 1,
      adjustmentFlag:  count + 1,
      quarterNum: count + 1
    };

    this.setState({
      data: [...data, newData],
      count: count + 1,
    })
  };

  handleSave = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log(values);
      }
    });
  };

  render(){
    const { formatMessage } = this.props.intl;
    const { loading, period, columns, data } = this.state;
    return (
      <div className="new-account-rule">
        <h3 className="header-title">{formatMessage({id: 'account-period-define.rule.define'})/* 会计期规则定义 */}
          <Tag color={this.state.ruleIsDefine ? 'green-inverse' : 'red-inverse'}>
            {this.state.ruleIsDefine ? formatMessage({id: 'account-period-define.rule.has-define'}) :
              formatMessage({id: 'account-period-define.rule.not-define'})}
          </Tag>
        </h3>
        <Form style={{overflow:'hidden'}}>
          <FormItem label={formatMessage({id: 'account-period-define.rule.total-period'})/* 期间总数 */}
                    style={{width:'20%',marginRight:'30px'}}
                    className="float-left">
            <Input value={period && period.totalPeriodNum} disabled/>
          </FormItem>
          <FormItem label={formatMessage({id: 'account-period-define.rule.addition-name'})/* 名称附加 */}
                    style={{width:'40%'}}
                    className="float-left">
            <Input value={period && period.periodAdditionalFlag} disabled/>
          </FormItem>
        </Form>
        <Form onSubmit={this.handleSave}>
          <Button type="primary" onClick={this.addNewRow}>add</Button>
          <Table columns={columns}
                 dataSource={data}
                 rowKey={record => record.periodNum}
                 pagination={false}
                 bordered
                 size="middle"/>
          <div className="slide-footer">
            <Button type="primary" htmlType="submit" loading={loading}>{formatMessage({id: 'common.save'})/* 保存 */}</Button>
            <Button onClick={() => {this.props.close()}}>{formatMessage({id: 'common.cancel'})/* 取消 */}</Button>
          </div>
        </Form>
      </div>
    )
  }

}

function mapStateToProps(state) {
  return {}
}

const WrappedNewAccountPeriod = Form.create()(NewAccountPeriod);

export default connect(mapStateToProps)(injectIntl(WrappedNewAccountPeriod));
