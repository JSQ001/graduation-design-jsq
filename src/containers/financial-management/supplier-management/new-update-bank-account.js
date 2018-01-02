/**
 *  created by jsq on 2017/12/18
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { Button, Table, Badge, Input, Switch, Select, Form, Row, Col, Icon, Cascader } from 'antd';
import httpFetch from 'share/httpFetch';
import config from 'config'
import menuRoute from 'share/menuRoute'
import 'styles/financial-management/supplier-management/new-update-bank-account.scss'
const FormItem = Form.Item;
const Option = Select.Option;
const {TextArea} = Input;

class NewUpdateBankAccount extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      loading: false,
      isEnabled: true,
      isMainAccount: true,
      bank: [],
      country: [],
    };
  }

  componentWillMount(){
    //获取国家数据
    httpFetch.get(`${config.uatUrl}/location-service/api/localization/query/county?language=${this.props.language.locale ==='zh' ? "zh_cn" : "en_us"}`).then((response)=>{
      let country = [];
      response.data.map((item)=>{
        let option = {
          label: item.country,
          key: item.code+ "-"+item.country
        };
        country.push(option)
      });
      this.setState({
        country
      })
    });
  }

  statusChange = () => {
    this.setState((prevState) => ({
      isEnabled: !prevState.isEnabled
    }))
  };

  mainAccountChange = ()=>{
    this.setState((prevState) => ({
      isMainAccount: !prevState.isMainAccount
    }))
  };

  handleLinkBank= ()=>{
    this.context.router.push(menuRoute.getRouteItem('bank-definition', 'key').url)
  };

  //切换银行
  handleBankChange = (e)=>{
    console.log(e)
  };

  handleBankFocus = (e)=>{
    console.log(123)
    console.log(e)
    httpFetch.get(`${config.payUrl}/payment/api/cash/bank/queryAll`)
  };

  onCancel = ()=>{
    this.props.close();
  };

  render(){
    const {formatMessage} = this.props.intl;
    const { getFieldDecorator } = this.props.form;
    const {loading, isEnabled, isMainAccount, bank, country} = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14, offset: 0 },
    };
    return(
      <div className="new-update-bank-account">
        <Form>
          <div className="basic-title">
            {formatMessage({id:"supplier.management.basicInfo"})}
          </div>
          <Row gutter={24} className="new-update-bank-account-formItem1">
            <Col offset={4} span={7}>
              <FormItem {...formItemLayout}
                label={formatMessage({id:"common.column.status"})} colon={true}>
                {getFieldDecorator('isEnabled', {
                  valuePropName:"checked",
                  initialValue:isEnabled
                })(
                  <div>
                    <Switch defaultChecked={isEnabled}  checkedChildren={<Icon type="check"/>} unCheckedChildren={<Icon type="cross" />} onChange={this.statusChange}/>
                    <span className="enabled-type" style={{marginLeft:20,width:100}}>{ isEnabled ? formatMessage({id:"common.status.enable"}) : formatMessage({id:"common.disabled"}) }</span>
                  </div>)}
              </FormItem>
            </Col>
            <Col span={8} offset={1}>
              <FormItem {...formItemLayout}
                label={formatMessage({id:"supplier.main.account"})} colon={true}>
                {getFieldDecorator('isEnabled', {
                  valuePropName:"checked",
                  initialValue: isMainAccount
                })(
                  <div>
                    <Switch defaultChecked={isMainAccount}  checkedChildren={<Icon type="check"/>} unCheckedChildren={<Icon type="cross" />} onChange={this.mainAccountChange}/>
                    <span className="enabled-type" style={{marginLeft:20,width:100}}>{ isMainAccount ? formatMessage({id:"supplier.bank.yes"}) : formatMessage({id:"supplier.bank.no"}) }</span>
                  </div>)}
              </FormItem>
            </Col>
          </Row>
          <FormItem {...formItemLayout}
            label={formatMessage({id:"bank.bankName"})} colon={true}>
            {getFieldDecorator('isEnabled', {
              initialValue:isEnabled,
              rules:[
                {
                  required: true,
                  message: formatMessage({id:"common.please.select"})
                }
              ]
            })(
              <div>
                <Select onChange={this.handleBankChange} onFocus={this.handleBankFocus} placeholder={formatMessage({id:"common.please.select"})}>
                  {bank.map((item)=>(<Option value={item.key}>{item.label}</Option>))}
                </Select>
              </div>)}
          </FormItem>
          <FormItem {...formItemLayout}
            label={formatMessage({id:"supplier.management.bank.accountName"})} colon={true}>
            {getFieldDecorator('isEnabled', {
              initialValue:isEnabled,
              rules:[
                {
                  required: true,
                  message: formatMessage({id:"common.please.enter"})
                }
              ]
            })(
              <div>
                <Input placeholder={formatMessage({id:"common.please.enter"})}/>
              </div>)}
          </FormItem>
          <FormItem {...formItemLayout}
            label={formatMessage({id:"supplier.bank.account"})} colon={true}>
            {getFieldDecorator('isEnabled', {
              initialValue:isEnabled,
              rules:[
                {
                  required: true,
                  message: formatMessage({id:"common.please.enter"})
                }
              ]
            })(
              <div>
                <Input placeholder={formatMessage({id:"common.please.enter"})}/>
              </div>)}
          </FormItem>
          <FormItem {...formItemLayout}
            label={formatMessage({id:"bank.country"})} colon={true}>
            {getFieldDecorator('isEnabled', {
              initialValue:isEnabled,
              rules:[
                {
                  required: true,
                  message: formatMessage({id:"common.please.enter"})
                }
              ]
            })(
              <div>
                <Select placeholder={formatMessage({id:"common.please.select"})}>
                  {country.map((item)=>(<Option value={item.key}>{item.label}</Option>))}
                </Select>
              </div>)}
          </FormItem>
          <FormItem {...formItemLayout}
          label={formatMessage({id:"bank.address"})} colon={true}>
          {getFieldDecorator('isEnabled', {
            initialValue:isEnabled
          })(
            <div>
              <Cascader placeholder={formatMessage({id:"common.please.select"})}/>
            </div>)}
        </FormItem>
          <FormItem {...formItemLayout}
            label="Swift Code" colon={true}>
            {getFieldDecorator('isEnabled', {
              initialValue:isEnabled
            })(
              <div>
                <Input placeholder={formatMessage({id:"common.please.enter"})}/>
              </div>)}
          </FormItem>
          <FormItem {...formItemLayout}
            label={formatMessage({id:"supplier.management.remark"})} colon={true}>
            {getFieldDecorator('isEnabled', {
              initialValue:isEnabled
            })(
              <div>
                <TextArea placeholder={formatMessage({id:"common.please.enter"})}/>
              </div>)}
          </FormItem>
          <div className="bank-account-tips">
            {formatMessage({id:"bank.account.tips.left"})}
            <a target="#"  onClick={this.handleLinkBank}>{formatMessage({id:"bank.account.tips.center"})}</a>
            {formatMessage({id:"common.add"})}
          </div>
          <div className="form-footer-button">
            <Button type="primary" htmlType="submit"  loading={loading}>{formatMessage({id:"common.save"})}</Button>
            <Button style={{marginLeft:20}} onClick={this.onCancel}>{formatMessage({id:"common.cancel"})}</Button>
          </div>
        </Form>
      </div>
    )
  }
}

NewUpdateBankAccount.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
  return {
    language: state.main.language,
  }
}
const WrappedNewUpdateBankAccount = Form.create()(NewUpdateBankAccount);

export default connect(mapStateToProps)(injectIntl(WrappedNewUpdateBankAccount));
