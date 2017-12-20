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

import moment from 'moment'

class NewPrePaymentDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      currency: null,
      partnerCategoryOptions: [],
      currencyList: [],
      payWayTypeList: []
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
    if(this.state.partnerCategoryOptions && this.state.partnerCategoryOptions.length) return;

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

  render() {
    const { getFieldDecorator } = this.props.form;
    const { loading, currency, partnerCategoryOptions, currencyList,payWayTypeList } = this.state;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 10, offset: 1 },
    };
    return (
      <div className="new-pay-plan">
        <Form onSubmit={this.props.params.record.id ? this.handleUpdate : this.handleSave}>
          <Steps direction="vertical">
            <Steps.Step title="基本信息" description="" />
          </Steps>
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
          <Row gutter={8}>
            <Col span={8} className="ant-form-item-label label-style">收款方：</Col>
            <Col span={4} className="ant-col-offset-1">
              <FormItem>
                {getFieldDecorator('partnerategory', {
                  rules: [{
                    required: true,
                    message: '请选择'
                  }],
                  initialValue: ""
                })(
                  <Select>
                  </Select>
                  )}
              </FormItem>
            </Col>

            <Col span={6}>
              <FormItem className="ant-col-offset-1">
                {getFieldDecorator('partnerd', {
                  rules: [{
                    required: true,
                    message: '请选择'
                  }]
                })(
                  <Select>

                  </Select>
                  )}
              </FormItem>
            </Col>
          </Row>

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


          <FormItem {...formItemLayout} label="银行账号">
            {getFieldDecorator('partnerCategory', {
              rules: [{
                required: true,
                message: '请选择'
              }]
            })(
              <Select placeholder="请选择">

              </Select>
              )}
          </FormItem>
          <FormItem {...formItemLayout} label="银行户名">
            {getFieldDecorator('partnerId', {
              rules: [{
                required: true,
                message: '请输入'
              }],
              initialValue: '911143733222408193'
            })(
              <Input />
              )}
          </FormItem>
          <FormItem {...formItemLayout} label="银行账户">
            {getFieldDecorator('rrrr', {
              rules: [{
                required: true,
                message: '请输入'
              }],
              initialValue: '911143733222408193'
            })(
              <Input />
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

          <Steps direction="vertical">
            <Steps.Step title="关联单据" description="" />
          </Steps>

          <div style={{ marginBottom: '16px', marginLeft: '60px' }}>
            <Button>+ 关联申请单</Button>
            <div style={{ marginTop: '8px' }}>
              申请单号:JK1234123412 申请单总金额:CNY 23,000.00
            </div>
          </div>
          <div style={{ marginBottom: '8px', marginLeft: '60px' }}>
            <Button>+ 关联合同</Button>
            <div style={{ marginTop: '8px' }}>
              合同单号：JK1234123412   付款计划序号： 序号1  付款计划日期：2017-12-12
            </div>
          </div>

          <div className="slide-footer">
            <Button type="primary" htmlType="submit" loading={loading}>保存</Button>
            <Button onClick={this.onCancel}>取消</Button>
          </div>
        </Form>
      </div>
    )
  }
}

const wrappedNewPrePaymentDetail = Form.create()(injectIntl(NewPrePaymentDetail));

export default wrappedNewPrePaymentDetail;
