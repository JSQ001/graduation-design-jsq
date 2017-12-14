import React from 'react'
import {connect} from 'react-redux'
import { injectIntl } from 'react-intl'
import { Form, Card, Input, Row, Col, Affix, Button, DatePicker, Select, message, Spin } from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;
import menuRoute from 'share/menuRoute'
import config from 'config'
import httpFetch from "share/httpFetch";

import moment from 'moment'
import Upload from 'components/upload'
import Chooser from 'components/chooser'

class NewContract extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      pageLoading: false,
      user: {},
      contractTypeDisabled: true,
      setOfBooksId: null,
      isNew: true, //新建 or 编辑
      data: [], //编辑的合同信息
      partnerCategoryOptions: [], //合同方类型选项
      currencyOptions: [], //币种
      companyIdOptions: [], //公司
      contractCategoryOptions: [], //合同大类选项
      uploadOIDs: "", //上传附件的OIDs
      employeeOptions: [], //员工选项
      venderOptions: [], //供应商选项
      contractCategoryValue: 'EMPLOYEE',
      unitIdOptions: [], //责任部门选项
      employeeIdOptions: [], //责任人选项
      selectorItem: {},
      extraParams: null,
      myContract:  menuRoute.getRouteItem('my-contract','key'),    //我的合同
      contractDetail:  menuRoute.getRouteItem('contract-detail','key'),    //合同详情
    }
  }

  componentWillMount() {
    Number(this.props.params.id) && this.getInfo(); //合同编辑

    this.setState({ user: this.props.user });
    this.getSystemValueList(2107).then(res => { //合同方类型
      let partnerCategoryOptions = res.data.values || [];
      this.setState({ partnerCategoryOptions })
    });
    this.getSystemValueList(2202).then(res => { //合同大类
      let contractCategoryOptions = res.data.values || [];
      this.setState({ contractCategoryOptions })
    });
    this.service.getCurrencyList().then((res) => {  //币种
      let currencyOptions = res.data;
      this.setState({ currencyOptions })
    });
    httpFetch.get(`${config.baseUrl}/api/setOfBooks/query/dto`).then((res) => { //账套
      this.setState({ setOfBooksId: res.data[0].setOfBooksId });
      httpFetch.get(`${config.baseUrl}/api/company/by/condition?setOfBooksId=${res.data[0].setOfBooksId}`).then((res) => {  //公司
        let companyIdOptions = res.data;
        this.setState({ companyIdOptions })
      })
    });
    httpFetch.get(`${config.baseUrl}/api/users/v2/search`).then(res => {  //获取员工列表
      res.status === 200 && this.setState({ employeeOptions: res.data })
    });
    httpFetch.get(`${config.baseUrl}/api/departments/root/v2?flag=1001`).then(res => {  //获取责任部门列表
      res.status === 200 && this.setState({ unitIdOptions: res.data })
    })
  }

  //获取合同信息
  getInfo = () => {
    let url = `${config.contractUrl}/contract/api/contract/header/${this.props.params.id}`;
    this.setState({ pageLoading: true });
    httpFetch.get(url).then(res => {
      this.setState({
        data: res.data,
        isNew: false,
        pageLoading: false,
        contractTypeDisabled: false
      }, () => {
        this.getContractType(this.state.data.contractTypeId);
      })
    })
  };

  //上传附件
  handleUpload = (OIDs) => {
    let uploadOIDs = OIDs.join();
    this.setState({ uploadOIDs })
  };

  //保存
  handleSave = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.amount = 0;
        values.attachmentOIDs = this.state.uploadOIDs;
        values.signDate && (values.signDate = values.signDate.format('YYYY-MM-DD'));
        values.startDate && (values.startDate = values.startDate.format('YYYY-MM-DD'));
        values.endDate && (values.endDate = values.endDate.format('YYYY-MM-DD'));
        values.contractTypeId = values.contractTypeId[0].id;
        this.setState({ loading: true });
        let url = `${config.contractUrl}/contract/api/contract/header`;
        httpFetch.post(url, values).then(res => {
          if (res.status === 200) {
            this.setState({ loading: false });
            message.success('保存成功');
            this.context.router.push(this.state.contractDetail.url.replace(':id', res.data.id));
          }
        }).catch(e => {
          message.error(`保存失败，${e.response.data.message}`);
          this.setState({ loading: false })
        })
      }
    })
  };

  //更新
  handleUpdate = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.attachmentOIDs = this.state.uploadOIDs;
        values.signDate && (values.signDate = values.signDate.format('YYYY-MM-DD'));
        values.startDate && (values.startDate = values.startDate.format('YYYY-MM-DD'));
        values.endDate && (values.endDate = values.endDate.format('YYYY-MM-DD'));
        values.contractTypeId = values.contractTypeId[0].id;
        values.id = this.state.data.id;
        values.versionNumber = this.state.data.versionNumber;
        this.setState({ loading: true });
        let url = `${config.contractUrl}/contract/api/contract/header`;
        httpFetch.put(url, values).then(res => {
          if (res.status === 200) {
            this.setState({ loading: false });
            message.success('修改成功');
            this.context.router.push(this.state.contractDetail.url.replace(':id', res.data.id));
          }
        }).catch(e => {
          message.error(`修改失败，${e.response.data.message}`);
          this.setState({ loading: false })
        })
      }
    })
  };

  //取消
  onCancel = () => {
    this.props.params.id ? this.context.router.push(this.state.contractDetail.url.replace(':id', this.props.params.id)) :
      this.context.router.push(this.state.myContract.url)
  };

  //获取合同类型
  getContractType = (value) => {
    let selectorItem = {
      title: "合同类型",
      url: `${config.contractUrl}/contract/api/contract/type/contract/type/by/company`,
      searchForm: [
        {type: 'input', id: 'contractTypeCode', label: '合同类型代码'},
        {type: 'input', id: 'contractTypeName', label: '合同类型名称'},
        {type: 'input', id: 'contractCategory', label: '合同大类'}
      ],
      columns: [
        {title: '合同类型代码', dataIndex: 'contractTypeCode'},
        {title: '合同类型名称', dataIndex: 'contractTypeName'},
        {title: '合同大类', dataIndex: 'contractCategoryName'},
      ],
      key: 'id'
    };
    this.setState({
      selectorItem,
      extraParams: value
    })
  };

  //选择公司
  handleCompanyId = (value) => {
    if (value) {
      this.props.form.setFieldsValue({ contractTypeId: undefined });
      this.getContractType(value);
      this.setState({ contractTypeDisabled: false })
    }
  };

  //选择合同方类型
  changePartnerCategory = (value) => {
    this.props.form.setFieldsValue({ partnerId: undefined });
    this.setState({ contractCategoryValue: value })
  };

  //选择责任部门
  changeUnitId = (value) => {
    this.props.form.setFieldsValue({ employeeId: undefined });
    let url = `${config.baseUrl}/api/departments/users/${value}`;
    httpFetch.get(url).then(res => {
      this.setState({ employeeIdOptions: res.data })
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { loading, pageLoading, user, contractTypeDisabled, isNew, data, partnerCategoryOptions, currencyOptions, companyIdOptions, contractCategoryOptions, employeeOptions, venderOptions, contractCategoryValue, unitIdOptions, employeeIdOptions, selectorItem, extraParams } = this.state;
    return (
      <div className="new-contract background-transparent" style={{marginBottom:40, marginTop:-35}}>
        <Spin spinning={pageLoading}>
          <Card title="基本信息" hoverable={false} style={{marginBottom:'20px'}}>
            <Row>
              <Col span={7}>
                <div style={{lineHeight: '32px'}}>合同编号:</div>
                <Input value={isNew ? '-' : data.id} disabled />
              </Col>
              <Col span={7} offset={1}>
                <div style={{lineHeight: '32px'}}>创建人:</div>
                <Input value={user.fullName} disabled />
              </Col>
              <Col span={7} offset={1}>
                <div style={{lineHeight: '32px'}}>创建日期:</div>
                <Input value={isNew ? new Date().format('yyyy-MM-dd') : moment(data.createdDate).format('YYYY-MM-DD')} disabled />
              </Col>
            </Row>
          </Card>
          <Form onSubmit={isNew ? this.handleSave : this.handleUpdate}>
            <Card title="合同信息" hoverable={false} style={{marginBottom:'20px'}}>
              <Row>
                <Col span={15}>
                  <FormItem label="合同名称">
                    {getFieldDecorator('contractName', {
                      rules: [{
                        required: true,
                        message: '请输入'
                      }],
                      initialValue: isNew ? '' : data.contractName
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
                      initialValue: isNew ? undefined : moment(data.signDate)
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
                      initialValue: isNew ? undefined : data.companyId
                    })(
                      <Select placeholder="请选择" onChange={this.handleCompanyId}>
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
                      initialValue: isNew ? undefined : [{id: data.contractTypeId, contractTypeName: data.contractTypeName}]
                    })(
                      <Chooser disabled={isNew ? contractTypeDisabled : false}
                               selectorItem={selectorItem}
                               listExtraParams={{companyId: extraParams}}
                               valueKey="id"
                               labelKey="contractTypeName"
                               single/>
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
                      initialValue: isNew ? undefined : data.contractCategory
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
                        {getFieldDecorator('currency', {
                          initialValue: isNew ? 'CNY' : data.currency
                        })(
                          <Select placeholder="请选择" disabled={!isNew}>
                            {currencyOptions.map((option) => {
                              return <Option key={option.currency}>{option.currency}</Option>
                            })}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col span={16} offset={1}>
                      <FormItem label=" " colon={false}>
                        {getFieldDecorator('amount', {
                          initialValue: isNew ? '0.00' : data.amount
                        })(
                          <Input style={{width: '100%'}} disabled/>
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                </Col>
                <Col span={7} offset={1}>
                  <Row>
                    <Col span={11}>
                      <FormItem label="有效期限">
                        {getFieldDecorator('startDate', {
                          initialValue: isNew ? undefined : (data.startDate ? moment(data.startDate) : undefined)
                        })(
                          <DatePicker placeholder="有效期限从"/>
                        )}
                      </FormItem>
                    </Col>
                    <Col span={12} offset={1}>
                      <FormItem label=" " colon={false}>
                        {getFieldDecorator('endDate', {
                          initialValue: isNew ? undefined : (data.endDate ? moment(data.endDate) : undefined)
                        })(
                          <DatePicker placeholder="有效期限至"/>
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Card>
            <Card title="合同方信息" hoverable={false} style={{marginBottom:'20px'}}>
              <Row>
                <Col span={7}>
                  <FormItem label="合同方类型">
                    {getFieldDecorator('partnerCategory', {
                      rules: [{
                        required: true,
                        message: '请选择'
                      }],
                      initialValue: isNew ? (partnerCategoryOptions[0] ? partnerCategoryOptions[0].value : '') : data.partnerCategory
                    })(
                      <Select placeholder="请选择" onChange={this.changePartnerCategory}>
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
                      initialValue: isNew ? undefined : data.partnerId
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
                </Col>
              </Row>
            </Card>
            <Card title="附件信息" hoverable={false} style={{marginBottom:'20px'}}>
              <Row>
                <Col span={7}>
                  <FormItem>
                    {getFieldDecorator('attachmentOIDs')(
                      <Upload uploadUrl={`${config.contractUrl}/contract/api/contract/header/attachment/upload/batch`}
                              attachmentType="CON_CONTRACT"
                              fileNum={9}
                              uploadHandle={this.handleUpload}/>
                    )}
                  </FormItem>
                </Col>
              </Row>
            </Card>
            <Card title="其他信息" hoverable={false}>
              <Row>
                <Col span={7}>
                  <FormItem label="责任部门">
                    {getFieldDecorator('unitId', {
                      initialValue: isNew ? undefined : (data.unitId || undefined)
                    })(
                      <Select placeholder="请选择" allowClear onChange={this.changeUnitId}>
                        {unitIdOptions.map((option) => {
                          return <Option key={option.departmentOID}>{option.name}</Option>
                        })}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={7} offset={1}>
                  <FormItem label="责任人">
                    {getFieldDecorator('employeeId', {
                      initialValue: isNew ? undefined : (data.employeeId || undefined)
                    })(
                      <Select placeholder="请选择" allowClear>
                        {employeeIdOptions.map((option) => {
                          return <Option key={option.userOID}>{option.fullName} - {option.employeeID}</Option>
                        })}
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={15}>
                  <FormItem label="备注">
                    {getFieldDecorator('remark', {
                      initialValue: isNew ? undefined : data.remark
                    })(
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
        </Spin>
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


