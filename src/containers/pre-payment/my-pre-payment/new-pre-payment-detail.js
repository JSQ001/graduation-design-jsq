/**
 * Created by 13576 on 2017/12/4.
 */
import React from 'react'
import { injectIntl } from 'react-intl'
import config from 'config'
import httpFetch from 'share/httpFetch'
import { Form, Button, Input, Row, Col, Select, InputNumber, DatePicker, message, Steps, Modal } from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
import ListSelector from 'components/list-selector'
import SelectContract from "./select-contract"

import Chooser from 'components/chooser'

import moment from 'moment'

class NewPrePaymentDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      currency: null,
      partnerCategoryOptions: [],
      currencyList: [],
      payWayTypeList: [],
      showListSelector: false,
      contractValue: [],
      amount: '',
      availableAmount: '',
      lineNumber: '',
      dueDate: '',
      accountName: '',
      number: ''
    }
  }

  componentWillMount() {
    // this.getCashTransactionList();
    this.getCurrencyList();
    this.getPayWayTypeList();
  }

  componentWillReceiveProps(nextProps) {

  }


  //获取现金事务
  getCashTransactionList = () => {

    //如果存在就不需要再获取了
    if (this.state.partnerCategoryOptions && this.state.partnerCategoryOptions.length) return;

    httpFetch.get(`http://192.168.1.195:8072/api/cash/pay/requisition/type/assign/transaction/classes/query?sobPayReqTypeId=940868530340466690`).then(res => {
      this.setState({ partnerCategoryOptions: res.data });
    });
  }

  //获取币种列表
  getCurrencyList = () => {
    httpFetch.get(`${config.baseUrl}/api/company/standard/currency/getAll?language=chineseName`).then(res => {
      this.setState({ currencyList: res.data });
    })
  }

  //获取付款方式类型
  getPayWayTypeList = () => {
    this.getSystemValueList(2105).then(res => {
      this.setState({ payWayTypeList: res.data.values });
    })
  }

  onCancel = () => {
    this.props.close();
  };

  handleListCancel = () => {
    this.setState({ showListSelector: false });
  }

  handleListOk = (result) => {

    let value = [];
    result.result.map(item => {
      value.push({
        key: item.contractLineId,
        label: item.contractLineId,
        value: item
      })
    });
    this.setState({ showListSelector: false, contractValue: value, lineNumber: result.result[0].lineNumber, dueDate: moment(result.result[0].dueDate).format('YYYY-MM-DD') });
  };

  //保存
  handleSave = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.headerId = this.props.params.id;
        values.lineNumber = 1;  //之后要删掉！！！！！！！！！！！！！！！！！！！
        values.dueDate = moment(values.dueDate).format('YYYY-MM-DD');
        let url = `${config.contractUrl}/contract/api/contract/line`;
        this.setState({ loading: true });
        httpFetch.post(url, values).then(res => {
          if (res.status === 200) {
            this.props.close(true);
            message.success('保存成功');
            this.setState({ loading: false })
          }
        }).catch(e => {
          this.setState({ loading: false });
          message.error(`保存失败, ${e.response.data.message}`);
        })
      }
    })
  };

  //更新
  handleUpdate = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.id = this.props.params.record.id;
        values.headerId = this.props.params.id;
        values.versionNumber = this.props.params.record.versionNumber;
        values.dueDate = moment(values.dueDate).format('YYYY-MM-DD');
        values.lineNumber = 1;  //之后要删掉！！！！！！！！！！！！！！！！！！！
        let url = `${config.contractUrl}/contract/api/contract/line`;
        this.setState({ loading: true });
        httpFetch.put(url, values).then(res => {
          if (res.status === 200) {
            this.props.close(true);
            message.success('修改成功');
            this.setState({ loading: false })
          }
        }).catch(e => {
          this.setState({ loading: false });
          message.error(`修改失败, ${e.response.data.message}`);
        })
      }
    })
  };

  clickContractSelect = () => {
    this.refs.contractSelect.blur();
    this.setState({ showListSelector: true });
  }

  handle = (values) => {
    if(values && values.length) {
      this.setState({accountName: values[0].bankNumberName,number:values[0].number});
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { loading,accountName, contractValue, dueDate, lineNumber, availableAmount, amount, currency, showListSelector, partnerCategoryOptions, currencyList, payWayTypeList } = this.state;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 10, offset: 1 },
    };
    return (
      <div className="new-pay-plan">
        <Form onSubmit={this.props.params.record.id ? this.handleUpdate : this.handleSave}>
          <div className="common-item-title">基本信息</div>
          {/* <Steps direction="vertical">
            <Steps.Step title="基本信息" description="" />
          </Steps> */}
          <FormItem {...formItemLayout} label="事由说明">
            {getFieldDecorator('description')(
              <TextArea autosize={{ minRows: 2 }}
                style={{ minWidth: '100%' }}
                placeholder="请输入" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="现金事务">
            {getFieldDecorator('cshTransactionClassCode', {
              rules: [{
                required: true,
                message: '请选择'
              }]
            })(
              <Select onFocus={this.getCashTransactionList} placeholder="请选择">
                {partnerCategoryOptions.map((option) => {
                  return <Option value={option.transactionClassId} key={option.transactionClassId}>{option.transactionClassName}</Option>
                })}
              </Select>
              )}
          </FormItem>
          <FormItem  {...formItemLayout} label="收款方">
            {getFieldDecorator('partnerd', {
              rules: [{
                required: true,
                message: '请选择'
              }]
            })(
              <Chooser placeholder={this.props.intl.formatMessage({ id: "common.please.select" })}
                type="select_supplier_employee"
                onChange={this.handle}
                labelKey="name"
                valueKey="code"
                single={true} />
              )}
          </FormItem>

          <Row gutter={8}>
            <Col span={8} className="ant-form-item-label label-style">金额：</Col>
            <Col span={4} className="ant-col-offset-1">
              <FormItem>
                {getFieldDecorator('1111', {
                  rules: [{
                    required: true,
                    message: '请选择币种'
                  }],
                  initialValue: "CNY"
                })(
                  <Select>
                    {
                      currencyList.map(item => {
                        return <Option value={item.currency} key={item.currency}>{item.currencyName}</Option>
                      })
                    }
                  </Select>
                  )}
              </FormItem>
            </Col>

            <Col span={6}>
              <FormItem className="ant-col-offset-1">
                {getFieldDecorator('amount', {
                  rules: [{
                    required: true,
                    message: '请输入'
                  }]
                })(
                  <InputNumber placeholder="请输入" style={{ width: '100%' }} />
                  )}
              </FormItem>
            </Col>
          </Row>

          <FormItem {...formItemLayout} label="银行户名">
            {getFieldDecorator('partnerId', {
              rules: [{
                required: true,
                message: '请输入'
              }],
              initialValue: this.state.accountName
            })(
              <Input />
              )}
          </FormItem>
          <FormItem {...formItemLayout} label="银行账号">
            {getFieldDecorator('accountName', {
              rules: [{
                required: true,
                message: '请选择'
              }],
              initialValue: this.state.number
            })(
              <Select placeholder="请选择">

              </Select>
              )}
          </FormItem>
        
          <FormItem {...formItemLayout} label="计划付款日期">
            {getFieldDecorator('dueDate', {
              rules: [{
                required: true,
                message: '请选择'
              }]
            })(
              <DatePicker style={{ width: '100%' }} />
              )}
          </FormItem>
          <FormItem {...formItemLayout} label="付款方式">
            {getFieldDecorator('payment', {
              rules: [{
                required: true,
                message: '请选择'
              }]
            })(
              <Select>
                {
                  payWayTypeList.map(item => {
                    return <Option key={item.id} value={item.id}>{item.messageKey}</Option>
                  })
                }
              </Select>
              )}
          </FormItem>

          <div className="common-item-title">合同信息</div>

          <div style={{ marginBottom: '16px', marginLeft: '60px' }}>
            <Row gutter={8}>
              <Col span={4} className="ant-form-item-label">
                关联合同:
              </Col>
              <Col span={16}>
                <Select ref="contractSelect"
                  value={contractValue}
                  labelInValue
                  dropdownStyle={{ display: 'none' }}
                  onFocus={this.clickContractSelect} />
                <div style={{ marginTop: '8px' }}>
                  {contractValue.length == 0 ? "注：根据收款方选择合同" : `付款计划序号：${lineNumber} | 付款计划日期：${dueDate}`}
                </div>
              </Col>
              <Col span={4} style={{ textAlign: "left" }} className="ant-form-item-label">
                <a>查看详情</a>
              </Col>
            </Row>

          </div>
          {/* <div style={{ marginBottom: '8px', marginLeft: '60px' }}>
            <Button onClick={() => { this.setState({ showListSelector: true }) }}>+ 关联合同</Button>
            <div style={{ marginTop: '8px' }}>
              合同单号：JK1234123412   付款计划序号： 序号1  付款计划日期：2017-12-12
            </div>
          </div> */}

          <div className="slide-footer">
            <Button type="primary" htmlType="submit" loading={loading}>保存</Button>
            <Button onClick={this.onCancel}>取消</Button>
          </div>
        </Form>

        <SelectContract visible={showListSelector}
          onCancel={this.handleListCancel}
          onOk={this.handleListOk}
          single={true}
        />

        {/* <ListSelector visible={showListSelector}
          type={'select_contract'}
          onCancel={this.handleListCancel}
          onOk={this.handleListOk}
          single={true} /> */}
      </div>
    )
  }
}

const wrappedNewPrePaymentDetail = Form.create()(injectIntl(NewPrePaymentDetail));

export default wrappedNewPrePaymentDetail;
