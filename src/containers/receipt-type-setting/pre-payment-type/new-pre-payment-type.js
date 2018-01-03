import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

import { Form, Switch, Icon, Input, Select, Button, Row, Col, message, Spin, Radio, Tooltip } from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

import httpFetch from 'share/httpFetch'
import config from 'config'

import SelectEmployeeGroup from './select-department'
import SelectCashTransaction from './select-cash-transaction'

class NewPrePaymentType extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      options: [],
      nowType: {},
      setOfBooks: [],
      showSelectEmployeeGroup: false,
      allType: true,
      allClass: true,
      needApply: true,
      transactionClassList: [],
      showSelectCashTransaction: false
    };
  }

  componentWillMount() {
    httpFetch.get(`${config.baseUrl}/api/setOfBooks/by/tenant?roleType=TENANT`).then(res => {
      this.setState({ setOfBooks: res.data })
    });
    this.getSystemValueList(2105).then(res => {
      this.setState({ options: res.data.values });
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ nowType: Object.assign({}, nextProps.params.prePaymentType) })
  }

  onCancel = () => {
    this.props.close();
  };

  handleSave = (e) => {
    e.preventDefault();

    this.props.form.validateFieldsAndScroll((err, values) => {

      if (!err) {

        values.allType = this.state.allType;
        values.allClass = this.state.allClass;
        values.applyEmployee = "BASIS_01";

        this.setState({ loading: true });

        let params = {
          cashPayRequisitionType: values,
          transactionClassList: this.state.transactionClassList.map(item => {
            let temp = {};
            temp.requisitionTypeId = item;
            return temp;
          })
        };

        params.requisitionTypeList = [];
        params.transactionClassList = [];
        params.departmentOrUserGroupIdList = [];
        httpFetch.post(`${config.prePaymentUrl}/api/cash/pay/requisition/types`, params).then((res) => {
          this.setState({ loading: false });
          message.success(this.props.intl.formatMessage({ id: 'common.save.success' }, { name: values.typeName }));  //保存成功
          this.props.close(true);
        }).catch((e) => {
          if (e.response) {
            message.error(`保存失败, ${e.response.data.message}`);
          }
          this.setState({ loading: false });
        })
      }
    });
  };

  handleListOk = (values) => {
    console.log(values);
    this.setState({ showSelectEmployeeGroup: false });
  }

  handleListCancel = () => {
    this.setState({ showSelectEmployeeGroup: false });
  }

  showSelectEmployeeGroup = () => {
    this.refs.selectEmployeeGroup.blur();
    this.setState({ showSelectEmployeeGroup: true });
  }

  showSelectCashTransaction = () => {
    this.refs.selectCashTransaction.blur();
    this.setState({ showSelectCashTransaction: true });
  }
  

  onAllTypeChange = (e) => {
    this.setState({ allType: e.target.value });
  }

  onAllClassChange = (e) => {
    this.setState({ allClass: e.target.value });
  }

  onAllClassListChange = (values) => {
    this.setState({ transactionClassList: values });
  }

  onNeedApply = (e) => {
    this.setState({ needApply: e.target.value });
  }

  render() {
    const { formatMessage } = this.props.intl;
    const { getFieldDecorator } = this.props.form;
    const {
      nowType,
      options,
      setOfBooks,
      showSelectEmployeeGroup,
      allClass,
      transactionClassList,
      needApply,
      showSelectCashTransaction } = this.state;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 10, offset: 1 },
    };
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };
    return (
      <div>
        <Form onSubmit={this.handleSave}>
          <div className="common-item-title">基本信息</div>

          <FormItem {...formItemLayout} label="类型">
            <span>预付款单</span>
          </FormItem>

          <FormItem {...formItemLayout} label="帐套">
            {getFieldDecorator('setOfBookId', {
              rules: [{
                required: true
              }],
              initialValue: nowType.setOfBookId
            })(
              <Select placeholder={formatMessage({ id: 'common.please.select' })/* 请选择 */}
                notFoundContent={<Spin size="small" />} disabled={!!nowType.setOfBookId}>
                {setOfBooks.map((option) => {
                  return <Option key={option.id}>{option.setOfBooksCode}</Option>
                })}
              </Select>
              )}
          </FormItem>

          <FormItem {...formItemLayout} label="表单代码">
            {getFieldDecorator('typeCode', {
              rules: [{
                required: true,
                message: formatMessage({ id: 'common.please.enter' }),  //请输入
              }],
              initialValue: nowType.typeCode
            })(
              <Input placeholder={formatMessage({ id: 'common.please.enter' })/* 请输入 */} />
              )}
          </FormItem>

          <FormItem {...formItemLayout} label="表单名称">
            {getFieldDecorator('typeName', {
              rules: [{
                required: true,
                message: formatMessage({ id: 'common.please.enter' }),  //请输入
              }],
              initialValue: nowType.typeName
            })(
              <Input placeholder={formatMessage({ id: 'common.please.enter' })/* 请输入 */} />
              )}
          </FormItem>

          <FormItem {...formItemLayout} label={(
            <span>
              关联表单类型&nbsp;
              <Tooltip title="关联表单设计器中的单据类型，用来使用工作流">
                <Icon type="info-circle-o" />
              </Tooltip>
            </span>
          )}>
            {getFieldDecorator('formId', {
              rules: [{
                required: true
              }],
              initialValue: nowType.setOfBookId
            })(
              <Select placeholder={formatMessage({ id: 'common.please.select' })/* 请选择 */}
                notFoundContent={<Spin size="small" />} disabled={!!nowType.setOfBookId}>
                {setOfBooks.map((option) => {
                  return <Option key={option.id}>{option.setOfBooksCode}</Option>
                })}
              </Select>
              )}
          </FormItem>

          <FormItem {...formItemLayout} label={formatMessage({ id: 'common.column.status' })/* 状态 */}>
            {getFieldDecorator('isEnabled', {
              initialValue: nowType.isEnabled,
              valuePropName: 'checked'
            })(
              <Switch checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="cross" />} />
              )}&nbsp;&nbsp;&nbsp;&nbsp;{this.props.form.getFieldValue('isEnabled') ? formatMessage({ id: "common.status.enable" }) : formatMessage({ id: "common.status.disable" })}
          </FormItem>

          <div className="common-item-title">付款方式</div>
          <FormItem {...formItemLayout} label="付款方式">
            {getFieldDecorator('paymentMethodCategory', {
              rules: [{
                required: true,
                message: formatMessage({ id: 'common.please.select' }),  //请选择
              }],
              initialValue: nowType.paymentMethodCategory
            })(
              <Select placeholder={formatMessage({ id: 'common.please.select' })/* 请选择 */}>
                {options.map(option => {
                  return <Option key={option.value}>{option.messageKey}</Option>
                })}
              </Select>
              )}
          </FormItem>

          <div className="common-item-title">关联申请设置</div>
          <FormItem {...formItemLayout} label="是否关联申请">
            <RadioGroup onChange={this.onNeedApply}>
              <RadioButton value={true}>关联</RadioButton>
              <RadioButton value={false}>不关联</RadioButton>
            </RadioGroup>
          </FormItem>

          <FormItem {...formItemLayout} label="关联依据">
            {getFieldDecorator('applicationFormBasis', {
              initialValue: ''
            })(
              <RadioGroup disabled={!needApply}>
                <Radio style={radioStyle} value="BASIS_01">预付款单头公司+头部门=申请单头公司+头部门</Radio>
                <Radio style={radioStyle} value="BASIS_02">预付款单头申请人=申请单头申请人</Radio>
              </RadioGroup>
              )}
          </FormItem>

          <FormItem {...formItemLayout} label="可关联申请类型">
            <div>
              <RadioGroup disabled={!needApply} onChange={this.onAllTypeChange}>
                <Radio value="BASIS_01">全部类型</Radio>
                <Radio value="BASIS_02">部分类型</Radio>
              </RadioGroup>

              <Select disabled={!needApply} placeholder={formatMessage({ id: 'common.please.select' })/* 请选择 */}>
                {options.map(option => {
                  return <Option key={option.value}>{option.messageKey}</Option>
                })}
              </Select>
            </div>
          </FormItem>

          <div className="common-item-title">现金事务设置</div>
          <FormItem {...formItemLayout} label="可用现金事务类型">
            <div>
              <RadioGroup value={allClass} onChange={this.onAllClassChange}>
                <Radio value={true}>全部类型</Radio>
                <Radio value={false}>部分类型</Radio>
              </RadioGroup>

              <Select ref="selectCashTransaction" mode="multiple" onFocus={this.showSelectCashTransaction} onChange={this.onAllClassListChange} disabled={allClass} value={allClass ? "全部类型" : transactionClassList} placeholder={formatMessage({ id: 'common.please.select' })/* 请选择 */}>
              </Select>
            </div>
          </FormItem>

          <div className="common-item-title">权限设置</div>
          <FormItem {...formItemLayout} label="适用人员">
            {getFieldDecorator('needApply', {
              initialValue: true,
              valuePropName: 'checked'
            })(
              <div>
                <RadioGroup>
                  <Radio value="a">全部人员</Radio>
                  <Radio value="b">按部门添加</Radio>
                  <Radio value="b">按人员组添加</Radio>
                </RadioGroup>
                <Select ref="selectEmployeeGroup" onFocus={this.showSelectEmployeeGroup} placeholder={formatMessage({ id: 'common.please.select' })/* 请选择 */}>
                </Select>
              </div>
              )}
          </FormItem>


          <div className="slide-footer">
            <Button type="primary" htmlType="submit" loading={this.state.loading}>{formatMessage({ id: 'common.save' })/* 保存 */}</Button>
            <Button onClick={this.onCancel}>{formatMessage({ id: 'common.cancel' })/* 取消 */}</Button>
          </div>
        </Form>

        <SelectEmployeeGroup visible={showSelectEmployeeGroup}
          onCancel={this.handleListCancel}
          onOk={this.handleListOk}
          single={true}
        />

        <SelectCashTransaction visible={showSelectCashTransaction}
          onCancel={this.handleListCancel}
          onOk={this.handleListOk}
          single={true}
        />



      </div>
    )
  }

}

function mapStateToProps() {
  return {}
}
const WrappedNewPrePaymentType = Form.create()(NewPrePaymentType);

export default connect(mapStateToProps)(injectIntl(WrappedNewPrePaymentType));
