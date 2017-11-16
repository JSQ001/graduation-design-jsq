import React from 'react'
import {connect} from 'react-redux'
import { injectIntl } from 'react-intl'
import { Form, Card, Input, Row, Col, Affix, Button, DatePicker, Select, InputNumber } from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

import Upload from 'components/upload'

class NewContract extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      user: {},
      partnerCategoryOptions: [], //合同方类型选项
      currencyOptions: [], //币种
    }
  }

  componentWillMount() {
    this.setState({ user: this.props.user });
    this.getSystemValueList(2107).then(res => { //合同方类型
      let partnerCategoryOptions = res.data.values;
      this.setState({ partnerCategoryOptions })
    });
    this.service.getCurrencyList().then((res) => {  //币种
      let currencyOptions = res.data;
      this.setState({ currencyOptions })
    })
  }

  handleSave = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log(values)
      }
    })
  };

  onCancel = () => {

  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { loading, user, partnerCategoryOptions, currencyOptions } = this.state;
    return (
      <div className="new-contract" style={{marginBottom:'80px'}}>
        <Card title="基本信息" noHovering style={{marginBottom:'20px'}}>
          <Row>
            <Col span={7}>
              <div style={{lineHeight: '32px'}}>创建人:</div>
              <Input value={user.fullName} disabled />
            </Col>
          </Row>
        </Card>
        <Form onSubmit={this.handleSave}>
          <Card title="合同信息" noHovering style={{marginBottom:'20px'}}>
            <Row>
              <Col span={15}>
                <FormItem label="合同名称">
                  {getFieldDecorator('contractName', {
                    rules: [{
                      required: true,
                      message: '请输入'
                    }],
                  })(
                    <Input placeholder="请输入"/>
                  )}
                </FormItem>
              </Col>
              <Col span={7} offset={1}>
                <FormItem label="签署日期">
                  {getFieldDecorator('signDate', {
                    rules: [{
                      required: true,
                      message: '请选择'
                    }],
                  })(
                    <DatePicker style={{width:'100%'}}/>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={7}>
                <FormItem label="公司">
                  {getFieldDecorator('companyId', {
                    rules: [{
                      required: true,
                      message: '请选择'
                    }],
                  })(
                    <Select placeholder="请选择">

                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={7} offset={1}>
                <FormItem label="合同类型">
                  {getFieldDecorator('contractTypeId', {
                    rules: [{
                      required: true,
                      message: '请选择'
                    }],
                  })(
                    <Select placeholder="请选择">

                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={7} offset={1}>
                <FormItem label="合同大类">
                  {getFieldDecorator('contractCategory', {
                    rules: [{
                      required: true,
                      message: '请输入'
                    }],
                  })(
                    <Input disabled/>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={7}>
                <Row>
                  <Col span={7}>
                    <FormItem label="币种">
                      {getFieldDecorator('currency', {
                        rules: [{
                          required: true,
                          message: '请选择'
                        }]
                      })(
                        <Select placeholder="请选择">
                          {currencyOptions.map((option) => {
                            return <Option value={option.otherCurrency} key={option.otherCurrency}>{option.otherCurrency}</Option>
                          })}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={16} offset={1}>
                    <FormItem label="金额">
                      {getFieldDecorator('amount', {
                        rules: [{
                          required: true,
                          message: '请输入'
                        }],
                      })(
                        <InputNumber placeholder="请输入" style={{width: '100%'}}/>
                      )}
                    </FormItem>
                  </Col>
                </Row>
              </Col>
              <Col span={7} offset={1}>
                <FormItem label="有效期限">
                  {getFieldDecorator('startDate')(
                    <RangePicker placeholder={['请选择', '请选择']} style={{width:'100%'}}/>
                  )}
                </FormItem>
              </Col>
            </Row>
          </Card>
          <Card title="合同方信息" noHovering style={{marginBottom:'20px'}}>
            <Row>
              <Col span={7}>
                <FormItem label="合同方类型">
                  {getFieldDecorator('partnerCategory', {
                    rules: [{
                      required: true,
                      message: '请输入'
                    }],
                  })(
                    <Select placeholder="请输入">
                      {partnerCategoryOptions.map((option) => {
                        return <Option key={option.value}>{option.messageKey}</Option>
                      })}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={7} offset={1}>
                <FormItem label="合同方">
                  {getFieldDecorator('partnerId', {
                    rules: [{
                      required: true,
                      message: '请输入'
                    }],
                  })(
                    <Input placeholder="请输入"/>
                  )}
                </FormItem>
              </Col>
            </Row>
          </Card>
          <Card title="附件信息" noHovering style={{marginBottom:'20px'}}>
            <Row>
              <Col span={7}>
                <FormItem>
                  {getFieldDecorator('attachmentOID', {
                    initialValue: user.fullName
                  })(
                    <Upload attachmentType="CONTRACT" fileNum={9}/>
                  )}
                </FormItem>
              </Col>
            </Row>
          </Card>
          <Card title="其他信息" noHovering>
            <Row>
              <Col span={7}>
                <FormItem label="责任部门">
                  {getFieldDecorator('partnerCategory1')(
                    <Input placeholder="请输入"/>
                  )}
                </FormItem>
              </Col>
              <Col span={7} offset={1}>
                <FormItem label="责任人">
                  {getFieldDecorator('partnerId')(
                    <Input placeholder="请输入"/>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={15}>
                <FormItem label="备注">
                  {getFieldDecorator('remark')(
                    <Input placeholder="请输入"/>
                  )}
                </FormItem>
              </Col>
            </Row>
          </Card>
          <Affix offsetBottom={0}
                 style={{position:'absolute',bottom:0,left: 0, width:'100%', height:'50px', boxShadow:'0px -5px 5px rgba(0, 0, 0, 0.067)', background:'#fff',lineHeight:'50px'}}>
            <Button type="primary" htmlType="submit" loading={loading} style={{margin:'0 20px 0 230px'}}>下一步</Button>
            <Button onClick={this.onCancel}>取消</Button>
          </Affix>
        </Form>
      </div>
    )
  }
}

const wrappedNewContract = Form.create()(injectIntl(NewContract));

function mapStateToProps(state) {
  return {
    user: state.login.user
  }
}

export default connect(mapStateToProps)(wrappedNewContract);


