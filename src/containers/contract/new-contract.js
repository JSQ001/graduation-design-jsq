import React from 'react'
import {connect} from 'react-redux'
import { injectIntl } from 'react-intl'
import { Form, Card, Input, Row, Col, Affix, Button, DatePicker, Select, InputNumber, message } from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

import menuRoute from 'share/menuRoute'
import config from 'config'
import httpFetch from "share/httpFetch";

import Upload from 'components/upload'

class NewContract extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      user: {},
      partnerCategoryOptions: [], //合同方类型选项
      currencyOptions: [], //币种
      companyIdOptions: [], //公司
      contractCategoryOptions: [], //合同大类选项
      uploadOIDs: [], //上传附件的OIDs
      employeeOptions: [], //员工选项
      venderOptions: [], //供应商选项
      myContract:  menuRoute.getRouteItem('my-contract','key'),    //我的合同
      contractDetail:  menuRoute.getRouteItem('contract-detail','key'),    //合同详情
    }
  }

  componentWillMount() {
    this.setState({ user: this.props.user });
    this.getSystemValueList(2107).then(res => { //合同方类型
      let partnerCategoryOptions = res.data.values;
      this.setState({ partnerCategoryOptions })
    });
    this.getSystemValueList(2202).then(res => { //合同大类
      let contractCategoryOptions = res.data.values;
      this.setState({ contractCategoryOptions })
    });
    this.service.getCurrencyList().then((res) => {  //币种
      let currencyOptions = res.data;
      this.setState({ currencyOptions })
    });
    httpFetch.get(`${config.baseUrl}/api/setOfBooks/query/dto`).then((res) => { //账套
      httpFetch.get(`${config.baseUrl}/api/company/by/condition?setOfBooksId=${res.data[0].setOfBooksId}`).then((res) => {  //公司
        let companyIdOptions = res.data;
        this.setState({ companyIdOptions })
      })
    });
  }

  //上传附件
  handleUpload = (OIDs) => {
    this.setState({ uploadOIDs: OIDs })
  };

  handleSave = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.attachmentOID = this.state.uploadOIDs;
        values.signDate && (values.signDate = values.signDate.format('YYYY-MM-DD'));
        values.rangePicker && (values.startDate = values.rangePicker[0].format('YYYY-MM-DD'));
        values.rangePicker && (values.endDate = values.rangePicker[1].format('YYYY-MM-DD'));
        this.setState({ loading: true });
        let url = `${config.contractUrl}/contract/api/contract/header`;
        httpFetch.post(url, values).then(res => {
          if (res.status === 200) {
            this.setState({ loading: false });
            message.success('保存成功');
            this.context.router.push(this.state.contractDetail.url.replace(':id', res.data.id));
          }
        }).catch(e => {
          message.error(`保存失败，${e.response.data.message}`)
        })
      }
    })
  };

  onCancel = () => {
    this.context.router.push(this.state.myContract.url);
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { loading, user, partnerCategoryOptions, currencyOptions, companyIdOptions, contractCategoryOptions } = this.state;
    return (
      <div className="new-contract background-transparent" style={{marginBottom:'40px'}}>
        <Card title="基本信息" noHovering style={{marginBottom:'20px'}}>
          <Row>
            <Col span={7}>
              <div style={{lineHeight: '32px'}}>合同编号:</div>
              <Input value="-" disabled />
            </Col>
            <Col span={7} offset={1}>
              <div style={{lineHeight: '32px'}}>创建人:</div>
              <Input value={user.fullName} disabled />
            </Col>
            <Col span={7} offset={1}>
              <div style={{lineHeight: '32px'}}>创建日期:</div>
              <Input value={new Date().format('yyyy-MM-dd')} disabled />
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
                      {companyIdOptions.map((option) => {
                        return <Option key={option.id}>{option.name}</Option>
                      })}
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
                      <Option key="911143733222408193">合同类型</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={7} offset={1}>
                <FormItem label="合同大类">
                  {getFieldDecorator('contractCategory', {
                    rules: [{
                      required: true,
                      message: '请选择'
                    }],
                  })(
                    <Select placeholder="请选择">
                      {contractCategoryOptions.map(option => {
                        return <Option key={option.value}>{option.messageKey}</Option>
                      })}
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={7}>
                <Row>
                  <Col span={7}>
                    <FormItem label="合同金额">
                      {getFieldDecorator('currency')(
                        <Select placeholder="请选择">
                          {/*{currencyOptions.map((option) => {*/}
                            {/*return <Option value={option.otherCurrency} key={option.otherCurrency}>{option.otherCurrency}</Option>*/}
                          {/*})}*/}
                          <Option key="CNY">CNY</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={16} offset={1}>
                    <FormItem label=" " colon={false}>
                      {getFieldDecorator('amount')(
                        <InputNumber placeholder="请输入" style={{width: '100%'}}/>
                      )}
                    </FormItem>
                  </Col>
                </Row>
              </Col>
              <Col span={7} offset={1}>
                <FormItem label="有效期限">
                  {getFieldDecorator('rangePicker')(
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
                      message: '请选择'
                    }],
                    initialValue: partnerCategoryOptions[0] ? partnerCategoryOptions[0].value : ''
                  })(
                    <Select placeholder="请选择">
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
                      message: '请选择'
                    }],
                  })(
                    <Select placeholder="请选择">
                      <Option key="911143733222408193">lucky</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
          </Card>
          <Card title="附件信息" noHovering style={{marginBottom:'20px'}}>
            <Row>
              <Col span={7}>
                <FormItem>
                  {getFieldDecorator('attachmentOID')(
                    <Upload attachmentType="CONTRACT"
                            fileNum={9}
                            uploadHandle={this.handleUpload}/>
                  )}
                </FormItem>
              </Col>
            </Row>
          </Card>
          <Card title="其他信息" noHovering>
            <Row>
              <Col span={7}>
                <FormItem label="责任部门">
                  {getFieldDecorator('unitId')(
                    <Input placeholder="请输入"/>
                  )}
                </FormItem>
              </Col>
              <Col span={7} offset={1}>
                <FormItem label="责任人">
                  {getFieldDecorator('employeeId')(
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
                 style={{position:'fixed',bottom:0,marginLeft:'-35px', width:'100%', height:'50px',
                   boxShadow:'0px -5px 5px rgba(0, 0, 0, 0.067)', background:'#fff',lineHeight:'50px'}}>
            <Button type="primary" htmlType="submit" loading={loading} style={{margin:'0 20px'}}>下一步</Button>
            <Button onClick={this.onCancel}>取消</Button>
          </Affix>
        </Form>
      </div>
    )
  }
}

NewContract.contextTypes = {
  router: React.PropTypes.object
};

const wrappedNewContract = Form.create()(injectIntl(NewContract));

function mapStateToProps(state) {
  return {
    user: state.login.user
  }
}

export default connect(mapStateToProps)(wrappedNewContract);


