import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

import { Form, Select, message, Button, Spin } from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;
import debounce from 'lodash.debounce'
import httpFetch from 'share/httpFetch'
import config from 'config'
import menuRoute from 'share/menuRoute'
import AgencyRelation from 'containers/approve-setting/agency-setting/agency-relation'

import 'styles/approve-setting/agency-setting/agency-detail.scss'

class AgencyDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: [],
      principalOID: this.props.params.principalOID,
      principalValue: '',   //被代理人
      principalEditNum: 0,  //被代理人点击"修改"次数
      selectPrincipal: false,
      principalValidateStatus: '',  //被代理人校验
      principalHelp: '', //被代理人校验内容
      billProxyRuleDTOs: [],
      fetching: false,
      principalInfo: {},
      agencyDetail:  menuRoute.getRouteItem('agency-detail','key'),    //代理详情
    };
    this.handleSearch = debounce(this.handleSearch, 250);
  }

  componentWillMount() {
    this.getInfo(this.state.principalOID);
  }

  //获取被代理人及代理关系信息
  getInfo= (principalOID) => {
    httpFetch.get(`${config.baseUrl}/api/bill/proxy/rules/${principalOID}`).then((res)=>{
      if (res.status == 200) {
        res = res.data;
        this.setState({
          principalValue: res.userName + ' - ' + res.emplyeeId,
          billProxyRuleDTOs: res.billProxyRuleDTOs,
          principalInfo: res
        })
      }
    }).catch((e)=>{

    })
  };

  //修改被代理人
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
      if (this.state.principalValidateStatus != 'error') {
        let principalObj = values[`principalObj-${this.state.principalEditNum}`];
        try {
          principalObj = JSON.parse(principalObj)
        } catch(e) {
          this.handleCancel();
          return;
        }
        values  = this.state.principalInfo;
        values.leavingDate = principalObj.leavingDate;
        values.status = principalObj.status;
        values.enabled = false;
        values.principalOID = principalObj.userOID;
        values.billProxyRuleDTOs = this.state.billProxyRuleDTOs;
        values.billProxyRuleDTOs.length > 0 && values.billProxyRuleDTOs.map(item => { item.customFormDTOs=[] });
        console.log(values);
        this.setState({loading: true});

        httpFetch.post(`${config.baseUrl}/api/bill/proxy/rules`, values).then((res)=>{
          this.setState({
            loading: false,
            selectPrincipal:false,
            principalOID: res.data.principalOID
          }, () => {
            this.getInfo(this.state.principalOID);
            message.success(this.props.intl.formatMessage({id: 'common.save.success'}, {name: values.organizationName}));  //保存成功
            this.context.router.push(this.state.agencyDetail.url.replace(':principalOID', this.state.principalOID));
          });
        }).catch((e)=>{
          this.setState({loading: false});
          if(e.response.data.message){
            message.error(`操作失败, ${e.response.data.message}`);
          } else {
            message.error('呼，服务器出了点问题，请联系管理员或稍后再试:(');
          }
        })
      }
    });
  };

  //查询被代理人下拉列表
  handleSearch = (value) => {
    value && this.setState({
      principalValidateStatus: '',
      principalHelp: '',
      fetching: true
    });
    let url = `${config.baseUrl}/api/search/users/by/${value}`;
    value && httpFetch.get(url).then((response)=>{
      let data = response.data;
      data.map(item => {
        item.text = `${item.fullName} - ${item.employeeID}`
      });
      this.setState({ data, fetching: false })
    });
  };

  //选中被代理人后查询该被代理人状态（是否已存在、是否将离职）
  handleSelect = (values) => {
    let principalInfo = JSON.parse(values);
    let url = `${config.baseUrl}/api/bill/proxy/principals/check/${principalInfo.userOID}`;
    principalInfo.userOID && httpFetch.get(url).then((response)=>{
      if (response.data) {
        this.setState({
          principalValidateStatus: 'error',
          principalHelp: '此员工已存在被代理信息，请返回至前一页面搜索该员工并编辑'
        })
      } else {
        if (principalInfo.status == 1002) {
          this.setState({
            principalValidateStatus: 'warning',
            principalHelp: `该员工将于${principalInfo.leavingDate}离职，离职后此代理将自动禁用`
          })
        } else {
          this.setState({
            principalValidateStatus: '',
            principalHelp: ''
          })
        }
      }
    });
  };

  //取消新建代理
  handleCancel = () => {
    this.setState({ selectPrincipal: false })
  };

  //修改代理人
  toSelectPrincipal = () => {
    this.setState({ selectPrincipal: true });
    this.setState((prevState)=>{
      principalEditNum: prevState.principalEditNum++
    })
  };

  render(){
    const { formatMessage } = this.props.intl;
    const { getFieldDecorator } = this.props.form;
    const { loading, data, principalOID, principalValue, selectPrincipal, principalEditNum , principalValidateStatus, principalHelp, billProxyRuleDTOs, principalInfo, fetching } = this.state;
    const options = data.map(d => <Option key={JSON.stringify(d)}>{d.text}</Option>);
    let principalItem;
    let saveBtn;
    if (selectPrincipal) {  //选择被代理人
      principalItem =
        <FormItem colon={false}
                  hasFeedback
                  validateStatus={principalValidateStatus}
                  help={principalHelp}
                  style={{width:'300px'}}
                  label={<span>{formatMessage({id:'agencySetting.principal'})} :
                    <span style={{color:'#999'}}>{formatMessage({id:'agencySetting.principal-explain'})}</span>
                  </span>}>{/*被代理人：需要他人帮助其填写、提交相应单据的人*/}
          {getFieldDecorator(`principalObj-${principalEditNum}`, {
            rules: [{
              required: true,
              message: formatMessage({id: 'common.please.select'})  //请选择
            }],
            initialValue: principalValue
          })(
            <Select placeholder={formatMessage({id: 'common.please.select'})/* 请选择 */}
                    showSearch
                    optionFilterProp='children'
                    notFoundContent={fetching ? <Spin size="small" /> : '无匹配结果'}
                    onSearch={this.handleSearch}
                    onSelect={this.handleSelect}>
              {options}
            </Select>
          )}
        </FormItem>;
      saveBtn =
        <FormItem>
          <Button type="primary"
                  htmlType="submit"
                  loading={loading}
                  style={{marginRight:'10px'}}>{formatMessage({id: 'common.save'})/* 保存 */}</Button>
          <Button onClick={this.handleCancel}>{formatMessage({id: 'common.cancel'})/* 取消 */}</Button>
        </FormItem>;
    } else {  //新建代理关系
      principalItem =
        <FormItem>
          <div style={{fontSize:'14px'}}>
            <span style={{color:'#333'}}>已选：</span>
            <span style={{fontSize:'20px',color:'#000'}}>{principalValue}</span>
            <a style={{color:'#108EE9',marginLeft:'20px'}} onClick={this.toSelectPrincipal}>{formatMessage({id: 'common.edit'})/* 编辑 */}</a>
          </div>
        </FormItem>;
      saveBtn = "";
    }
    return (
      <div className="agency-detail">
        <h3 className="header-title">{formatMessage({id:'agencySetting.principal'})}</h3>{/*被代理人*/}
        <Form onSubmit={this.handleSave}>
          {principalItem}
          {saveBtn}
        </Form>
        <AgencyRelation
          principalOID={principalOID}
          billProxyRuleDTOs={billProxyRuleDTOs}
          principalInfo={principalInfo} />
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
