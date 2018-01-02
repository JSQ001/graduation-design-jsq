import React from 'react'
import { injectIntl } from 'react-intl'
import config from 'config'
import httpFetch from 'share/httpFetch'
import { contractService } from 'service'
import { Form, Button, Input, Row, Col, Select, InputNumber, DatePicker, message } from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;

import moment from 'moment'

class NewPayPlan extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      currency: null,
      contractCategoryValue: 'EMPLOYEE',
      partnerCategoryOptions: [], //合同方类型选项
      employeeOptions: [], //员工选项
      venderOptions: [], //供应商选项
    }
  }

  componentWillMount() {
    this.getSystemValueList(2107).then(res => { //合同方类型
      let partnerCategoryOptions = res.data.values || [];
      this.setState({ partnerCategoryOptions })
    });
    httpFetch.get(`${config.baseUrl}/api/users/v2/search`).then(res => {  //获取员工列表
      res.status === 200 && this.setState({ employeeOptions: res.data })
    });
  }

  componentWillReceiveProps(nextProps) {
    const currency = nextProps.params.currency;
    const record = nextProps.params.record;
    this.setState({ currency });
    if (record.id && !nextProps.params.flag) {  //编辑
      nextProps.params.flag = true;
      let values = this.props.form.getFieldsValue();
      for(let name in values){
        let result = {};
        name !== 'currency' && (result[name] = record[name]);
        name === 'dueDate' && (result[name] = moment(record[name]));
        this.props.form.setFieldsValue(result)
      }
    } else if (!record.id && !nextProps.params.flag) {  //新建
      nextProps.params.flag = true;
      this.props.form.resetFields();
    }
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
        this.setState({loading: true});
        contractService.newPayPlan(values).then(res => {
          if (res.status === 200) {
            this.props.close(true);
            message.success('保存成功');
            this.setState({ loading: false })
          }
        }).catch(e => {
          this.setState({loading: false});
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
        this.setState({loading: true});
        contractService.updatePayPlan(values).then(res => {
          if (res.status === 200) {
            this.props.close(true);
            message.success('修改成功');
            this.setState({ loading: false })
          }
        }).catch(e => {
          this.setState({loading: false});
          message.error(`修改失败, ${e.response.data.message}`);
        })
      }
    })
  };

  //选择合同方类型
  changePartnerCategory = (value) => {
    this.props.form.setFieldsValue({ partnerId: undefined });
    this.setState({ contractCategoryValue: value })
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { loading, currency, partnerCategoryOptions, employeeOptions, venderOptions, contractCategoryValue } = this.state;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 10, offset: 1 },
    };
    return (
      <div className="new-pay-plan">
        <Form onSubmit={this.props.params.record.id ? this.handleUpdate : this.handleSave}>
          <Row>
            <Col span={8} className="ant-form-item-label label-style">计划金额： </Col>
            <Col span={4} className="ant-col-offset-1">
              <FormItem>
                {getFieldDecorator('currency', {
                  rules: [{
                    required: true,
                    message: '请选择'
                  }],
                  initialValue: currency
                })(
                  <Input disabled/>
                )}
              </FormItem>
            </Col>
            <Col span={6} style={{marginLeft:3}}>
              <FormItem className="ant-col-offset-1">
                {getFieldDecorator('amount', {
                  rules: [{
                    required: true,
                    message: '请输入'
                  }]
                })(
                  <InputNumber placeholder="请输入" style={{width:'100%'}}/>
                )}
              </FormItem>
            </Col>
          </Row>
          <FormItem {...formItemLayout} label="合同方类型">
            {getFieldDecorator('partnerCategory', {
              rules: [{
                required: true,
                message: '请选择'
              }]
            })(
              <Select placeholder="请选择" onChange={this.changePartnerCategory}>
                {partnerCategoryOptions.map((option) => {
                  return <Option key={option.value}>{option.messageKey}</Option>
                })}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="合同方">
            {getFieldDecorator('partnerId', {
              rules: [{
                required: true,
                message: '请输入'
              }]
            })(
              <Select placeholder="请选择">
                {contractCategoryValue === 'EMPLOYEE' ?
                  employeeOptions.map(option => {
                    return <Option key={option.id}>{option.fullName} - {option.employeeID}</Option>
                  }) :
                  venderOptions.map(option => {
                    return <Option key={option.id}>{option.fullName}</Option>
                  })
                }
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="计划付款日期">
            {getFieldDecorator('dueDate', {
              rules: [{
                required: true,
                message: '请选择'
              }]})(
              <DatePicker style={{width:'100%'}}/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="备注">
            {getFieldDecorator('remark')(
              <TextArea autosize={{minRows: 2}}
                        style={{minWidth:'100%'}}
                        placeholder="请输入"/>
            )}
          </FormItem>
          <div className="slide-footer">
            <Button type="primary" htmlType="submit" loading={loading}>保存</Button>
            <Button onClick={this.onCancel}>取消</Button>
          </div>
        </Form>
      </div>
    )
  }
}

const wrappedNewPayPlan = Form.create()(injectIntl(NewPayPlan));

export default wrappedNewPayPlan;
