import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

import { Form, Select, message, Button } from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;
import debounce from 'lodash.debounce'
import httpFetch from 'share/httpFetch'
import config from 'config'
import NewAgencyRelation from 'containers/approve-setting/agency-setting/new-agency-relation'

import 'styles/approve-setting/agency-setting/agency-detail.scss'

class AgencyDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: [],
      principalOID: this.props.params.principalOID,
      principalValue: '',   //被代理人
      selectPrincipal: false,
      principalValidateStatus: '',  //被代理人校验
      principalHelp: '', //被代理人校验内容
      billProxyRuleDTOs: [],
    };
    this.handleSearch = debounce(this.handleSearch, 250);
  }

  componentWillMount() {
    httpFetch.get(`${config.baseUrl}/api/bill/proxy/rules/${this.state.principalOID}`).then((res)=>{
      if (res.status == 200) {
        res = res.data;
        this.setState({
          principalValue: res.userName + ' - ' + res.emplyeeId,
          billProxyRuleDTOs: res.billProxyRuleDTOs
        },()=>{

        })
      }
    }).catch((e)=>{

    })
  }

  handleSave = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        this.setState({
          principalValidateStatus: 'error',
          principalHelp: '请选择'
        });
        return;
      }
      values.billProxyRuleDTOs = [];
      values.leavingDate = null;
      values.status = 1001;
      values.enabled = false;
      values.principalOID = JSON.parse(values.principalOID).userOID;
      console.log(values);
      if (this.state.principalValidateStatus != 'error') {
        this.setState({loading: true});
        httpFetch.post(`${config.baseUrl}/api/bill/proxy/rules`, values).then((res)=>{
          this.setState({
            loading: false,
            selectPrincipal:false,
            principalOID: values.principalOID
          });
          message.success(this.props.intl.formatMessage({id: 'common.create.success'}, {name: values.organizationName}));  //新建成功
        }).catch((e)=>{
          this.setState({loading: false});
          if(e.response.data.validationErrors){
            message.error(`新建失败, ${e.response.data.validationErrors[0].message}`);
          } else {
            message.error('呼，服务器出了点问题，请联系管理员或稍后再试:(');
          }
        })
      }
    });
  };

  handleSearch = (value) => {
    if (!value) {
      this.setState({
        principalValidateStatus: 'error',
        principalHelp: '请选择'
      });
      return;
    }
    this.setState({
      principalValidateStatus: '',
      principalHelp: ''
    });
    let url = `${config.baseUrl}/api/search/users/by/${value}`;
    value && httpFetch.get(url).then((response)=>{
      let data = response.data;
      data.map(item => {
        item.text = item.fullName + '-' + item.employeeID;
      });
      this.setState({ data })
    });
  };

  handleSelect = (obj) => {
    obj = JSON.parse(obj);
    let url = `${config.baseUrl}/api/bill/proxy/principals/check/${obj.userOID}`;
    obj.userOID && httpFetch.get(url).then((response)=>{
      if (response.data) {
        this.setState({
          principalValue: obj.fullName + ' - ' + obj.employeeID,
          principalValidateStatus: 'error',
          principalHelp: '此员工已存在被代理信息，请返回至前一页面搜索该员工并编辑'
        })
      } else {
        if (obj.status == 1002) {
          this.setState({
            principalValue: obj.fullName + ' - ' + obj.employeeID,
            principalValidateStatus: 'warning',
            principalHelp: `该员工将于${obj.leavingDate}离职，离职后此代理将自动禁用`
          })
        } else {
          this.setState({
            principalValue: obj.fullName + ' - ' + obj.employeeID,
            principalValidateStatus: '',
            principalHelp: ''
          })
        }
      }
    });
  };

  handleCancel = () => {
    this.setState({ selectPrincipal: false })
  };

  toSelectPrincipal = () => {
    this.setState({ selectPrincipal: true })
  };

  render(){
    const { formatMessage } = this.props.intl;
    const { getFieldDecorator } = this.props.form;
    const { loading, data, principalOID, principalValue, selectPrincipal, principalValidateStatus, principalHelp, billProxyRuleDTOs } = this.state;
    // const options = data.map(d => <Option key={d.userOID} value={d.text}>{d.text}</Option>);
    const options = data.map(d => <Option key={JSON.stringify(d)}>{d.text}</Option>);
    let principal;
    let saveBtn;
    let agencyRelation;
    if (selectPrincipal) {
      principal =
        <Select placeholder={formatMessage({id: 'common.please.select'})/* 请选择 */}
                mode="multiple"
                onSearch={this.handleSearch}
                onSelect={this.handleSelect}>
          {options}
        </Select>;
      saveBtn =
        <FormItem>
          <Button type="primary"
                  htmlType="submit"
                  loading={loading}
                  style={{marginRight:'10px'}}>{formatMessage({id: 'common.save'})/* 保存 */}</Button>
          <Button onClick={this.handleCancel}>{formatMessage({id: 'common.cancel'})/* 取消 */}</Button>
        </FormItem>;
      agencyRelation = ""
    } else {
      principal =
        <div style={{fontSize:'14px'}}>
          <span style={{color:'#333'}}>已选：</span>
          <span style={{fontSize:'20px',color:'#000'}}>{principalValue}</span>
          <a style={{color:'#108EE9',marginLeft:'20px'}} onClick={this.toSelectPrincipal}>修改</a>
        </div>;
      saveBtn = "";
      agencyRelation = <NewAgencyRelation principalOID={principalOID} billProxyRuleDTOs={billProxyRuleDTOs} />
    }
    return (
      <div className="agency-detail">
        <h3 className="header-title">{formatMessage({id:'agencySetting.principal'})}</h3>{/*被代理人*/}
        <Form onSubmit={this.handleSave}>
          <FormItem colon={false}
                    hasFeedback
                    validateStatus={principalValidateStatus}
                    help={principalHelp}
                    style={{width:'300px'}}
                    label={<span>{formatMessage({id:'agencySetting.principal'})} : <span style={{color:'#999'}}>{formatMessage({id:'agencySetting.principal-explain'})}</span></span>}>{/*被代理人：需要他人帮助其填写、提交相应单据的人*/}
            {getFieldDecorator('principalOID', {
              rules: [{
                required: true,
                message: formatMessage({id: 'common.please.select'})  //请选择
              }],
              initialValue: principalValue
            })(
              principal
            )}
          </FormItem>
          {saveBtn}
        </Form>
        {agencyRelation}
      </div>
    )
  }

}


AgencyDetail.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps() {
  return {}
}

const WrappedAgencyDetail = Form.create()(AgencyDetail);

export default connect(mapStateToProps)(injectIntl(WrappedAgencyDetail));
