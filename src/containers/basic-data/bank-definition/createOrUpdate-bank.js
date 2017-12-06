/**
 * created by jsq on 2017/10/9
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

import { Button, Form, Input, Select, message, Cascader, Row, Col,Switch, Icon } from 'antd';

import httpFetch from 'share/httpFetch';
import config from 'config'
import 'styles/basic-data/bank-definition/createOrUpdate-bank-definition.scss'

const FormItem = Form.Item;
const Option = Select.Option;

class CreateOrUpdateBank extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      loading: false,
      isEnabled: true,
      bankTypeHelp: "",
      bank:{},
      isEditor: false,
      countryCode: 'CHN000000000-中国',//默认国家是中国
      country:[],
      address:[],

    };
  }

  componentWillMount(){
    let params = this.props.params;
    //获取国家
    httpFetch.get(`http://192.168.1.77:13001/location-service/api/localization/query/county?language=${this.props.language.locale ==='zh' ? "zh_cn" : "en_us"}`).then((response)=>{
      console.log(response)
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
    if(typeof params.id !== 'undefined'){
      let accountAddress = [];
      accountAddress.push(params.provinceCode+"-"+params.provinceName);
      accountAddress.push(params.cityCode+"-"+params.cityName);
      accountAddress.push(params.districtCode+"-"+params.districtName);
      params.accountAddress = accountAddress;
      console.log(params)
      this.setState({
        address: params.addressDetail,
        bank: params,
        isEnabled: params.isEnabled
      })
    }
  }


  componentWillReceiveProps(nextprops){
    console.log(nextprops.params);
    if(typeof nextprops.params.id === 'undefined'){
      this.setState({
        address: nextprops.params.addressDetail
      })
    }
  }

  handleCreate = ()=>{
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log(values)
        values.countryCode = values.country.split("-")[0];
        values.countryName = values.country.split("-")[1];
        values.provinceCode = values.accountAddress[0].split("-")[0];
        values.provinceName = values.accountAddress[0].split("-")[1];
        values.cityCode = values.accountAddress[1].split("-")[0];
        values.cityName = values.accountAddress[1].split("-")[1];
        if(typeof values.accountAddress[2] !== 'undefined'){
          values.districtCode = values.accountAddress[2].split("-")[0];
          values.districtName = values.accountAddress[2].split("-")[1];
        }
        httpFetch.post(`${config.payUrl}/api/cash/bank/user/defineds`,values).then((response)=>{
          message.success(this.props.intl.formatMessage({id:"common.create.success"},{name:values.bankName}));
          this.props.close(response.data);
          this.props.form.resetFields();
          this.setState({
            loading: false
          })
        }).catch((e)=>{
          if(e.response){
            message.error(`${this.props.intl.formatMessage({id:"common.create.filed"})}, ${e.response.data.message}`);
          }
          this.setState({loading: false});
        })
      }
    })
  };

  handleUpdate = ()=>{
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log(values)
        values.id = this.state.bank.id;
        values.versionNumber = this.state.bank.versionNumber;
        values.countryCode = values.country.split("-")[0];
        values.countryName = values.country.split("-")[1];
        values.provinceCode = values.accountAddress[0].split("-")[0];
        values.provinceName = values.accountAddress[0].split("-")[1];
        values.cityCode = values.accountAddress[1].split("-")[0];
        values.cityName = values.accountAddress[1].split("-")[1];
        if(typeof values.accountAddress[2] !== 'undefined'){
          values.districtCode = values.accountAddress[2].split("-")[0];
          values.districtName = values.accountAddress[2].split("-")[1];
        }
        httpFetch.put(`${config.payUrl}/api/cash/bank/user/defineds`,values).then((response)=>{
          message.success(this.props.intl.formatMessage({id:"common.operate.success"}));
          this.props.close(response.data);
          this.props.form.resetFields();
          this.setState({
            loading: false
          })
        }).catch((e)=>{
          if(e.response){
            message.error(`${this.props.intl.formatMessage({id:"common.operate.filed"})}, ${e.response.data.message}`);
          }
          this.setState({loading: false});
        })
      }
    })
  };

  //换选国家，查询出省份
  countryChange = (value)=>{
    httpFetch.get(`http://192.168.1.77:13001/location-service/api/localization/query/all/address?code=${value.split("-")[0]}&language=${this.props.language.locale ==='zh' ? "zh_cn" : "en_us"}`).then((response)=>{
      console.log(response.data)
      this.setState({
        countryCode: value,
        address: response.data
      })
    });
  };

  handleSubmit = (e)=>{
    e.preventDefault();
    this.setState({
      loading: true
    });
    typeof this.state.bank.id === 'undefined'?
      this.handleCreate()
      :
      this.handleUpdate();
  };

  onCancel = () =>{
    this.props.form.resetFields();
    this.props.close();
  };

  handleFormChange =()=>{
    this.setState({
      loading: false
    })
  };

  switchChange = () => {
    this.setState((prevState) => ({
      isEnabled: !prevState.isEnabled
    }))
  };

  render(){
    const { formatMessage } = this.props.intl;
    const { getFieldDecorator } = this.props.form;

    const { defaultStatus, isEnabled, loading, bankTypeHelp, bank, country, countryCode,address, isEditor} = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14, offset: 1 },
    };

    const bankTypeOptions = country.map((item)=><Option key={item.id}>{item.value}</Option>)
    return(
      <div className="new-bank-definition">
        <Form onSubmit={this.handleSubmit} onChange={this.handleFormChange} >
          <FormItem {...formItemLayout}
                    label={formatMessage({id:"common.column.status"})} colon={true}>
            {getFieldDecorator('isEnabled', {
              valuePropName:"defaultChecked",
              initialValue:isEnabled
            })(
              <div>
                <Switch defaultChecked={isEnabled}  checkedChildren={<Icon type="check"/>} unCheckedChildren={<Icon type="cross" />} onChange={this.switchChange}/>
                <span className="enabled-type" style={{marginLeft:20,width:100}}>{ isEnabled ? formatMessage({id:"common.status.enable"}) : formatMessage({id:"common.disabled"}) }</span>
              </div>)}
          </FormItem>
          <FormItem {...formItemLayout}
            label={formatMessage({id:"bank.bankCode"})}>
            {getFieldDecorator('bankCode', {
              initialValue: bank.bankCode,
              rules: [
                {
                  required: true,
                  message: formatMessage({id:"common.please.enter"})
                }
              ],
            })(
              <Input disabled={isEditor} placeholder={formatMessage({id:"common.please.enter"})} /> /*请输入*/
            )}
          </FormItem>
          <FormItem {...formItemLayout}
            label='Swift Code'>
            {getFieldDecorator('swiftCode', {
              initialValue: bank.swiftCode,
              rules: [{
                required: true,
                message: formatMessage({id:"common.please.select"})
              }],
            })(
              <Input disabled={isEditor} placeholder={formatMessage({id:"common.please.enter"})}/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={formatMessage({id:"bank.bankName"})} >
            {getFieldDecorator('bankName', {
              initialValue: bank.bankName,
              rules: [
                {
                  required: true,
                  message: formatMessage({id:"common.please.enter"})
                },

              ],
            })(
              <Input placeholder={formatMessage({id:"common.please.enter"})} />
            )}
          </FormItem>
          <FormItem {...formItemLayout}
            label={formatMessage({id:"bank.country"})} //国家
            help={bankTypeHelp}>
            {getFieldDecorator('country', {
              initialValue: countryCode,
              rules: [
                {
                  required: true,
                  message: formatMessage({id:"common.please.select"})
                },
                {
                  validator:(item,value,callback)=>{
                    callback()
                  }
                }
              ],
            })(
              <Select onChange={this.countryChange} allowClear showSearch placeholder={ formatMessage({id:"common.please.select"})}>
                {
                  country.map((item)=><Option key={item.key}>{item.label}</Option>)
                }
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout}
                    label={formatMessage({id:"bank.address"})}
                    help={bankTypeHelp}>
            {getFieldDecorator('accountAddress', {
              initialValue: bank.accountAddress,
              rules: [
                {
                  required: true,
                  message: formatMessage({id:"common.please.select"})
                }
              ],
            })(
             <Cascader  placeholder={ formatMessage({id:"common.please.select"})}
                        showSearch
                  options={address}/>
            )}
          </FormItem>
          <FormItem {...formItemLayout}
                    label={formatMessage({id:"bank.detailAddress"})}
                    help={bankTypeHelp}>
            {getFieldDecorator('address', {
              initialValue: bank.address,
              rules: [
                {
                  required: true,
                  message: formatMessage({id:"common.please.enter"})
                }
              ],
            })(
              <Input placeholder={ formatMessage({id:"common.please.enter"})}/>
            )}
          </FormItem>
          <div className="slide-footer">
            <Button type="primary" htmlType="submit"  loading={loading}>{formatMessage({id:"common.save"})}</Button>
            <Button onClick={this.onCancel}>{formatMessage({id:"common.cancel"})}</Button>
          </div>
        </Form>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    organization: state.budget.organization,
    company: state.login.company,
    language: state.main.language,
  }
}
const WrappedCreateOrUpdateBank = Form.create()(CreateOrUpdateBank);

export default connect(mapStateToProps)(injectIntl(WrappedCreateOrUpdateBank));

