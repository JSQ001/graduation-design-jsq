import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

import { Form, Select, message, Button } from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;
import debounce from 'lodash.debounce'
import httpFetch from 'share/httpFetch'
import config from 'config'
import menuRoute from 'share/menuRoute'
import NewAgencyRelation from 'containers/approve-setting/agency-setting/new-agency-relation'

import 'styles/approve-setting/agency-setting/new-agency.scss'

class NewAgency extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: [],
      principalValue: '孙七木 - 123999',
      selectPrincipal: false,
      agencySetting:  menuRoute.getRouteItem('agency-setting','key'),    //新建代理
    };
    this.handleChange = debounce(this.handleChange, 250);
  }

  handleSave = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      values = {
        "enabled":false,
        "status":1001,
        "principalOID":"53aabef8-340d-46fa-9765-d607a7296e12",
        "leavingDate":null,
        "billProxyRuleDTOs":[]
      };
      console.log(values);
      if (!err) {
        this.setState({loading: true});
        httpFetch.post(`${config.baseUrl}/api/bill/proxy/rules`, values).then((res)=>{
          this.setState({ loading: false, selectPrincipal:false });
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

  handleChange = (value) => {
    let url = `${config.baseUrl}/api/search/users/by/${value}`;
    value && httpFetch.get(url).then((response)=>{
      this.setState({
        data: response.data,
        principalValue: value
      })
    });
  };

  handleCancel = () => {
    this.context.router.replace(this.state.agencySetting.url);
  };

  toSelectPrincipal = () => {
    this.setState({ selectPrincipal: true })
  };

  render(){
    const { formatMessage } = this.props.intl;
    const { getFieldDecorator } = this.props.form;
    const { loading, data, principalValue, selectPrincipal} = this.state;
    const options = data.map(d => <Option key={d.userOID}>{d.fullName} - {d.employeeID}</Option>);
    let principal;
    let saveBtn;
    let agencyRelation;
    if (selectPrincipal) {
      principal =
        <Select placeholder={formatMessage({id: 'common.please.select'})/* 请选择 */}
                mode="combobox"
                onChange={this.handleChange}
                style={{width:'300px'}}>
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
      agencyRelation = <NewAgencyRelation/>
    }
    return (
      <div className="new-agency">
        <h3 className="header-title">{formatMessage({id:'agencySetting.chose-principal'})}</h3>{/*请选择被代理人*/}
        <Form onSubmit={this.handleSave}>
          <FormItem colon={false} label={
            <span>{formatMessage({id:'agencySetting.principal'})} : <span style={{color:'#999'}}>{formatMessage({id:'agencySetting.principal-explain'})}</span></span>
          }>{/*被代理人：需要他人帮助其填写、提交相应单据的人*/}
            {getFieldDecorator('principalOID', {
              rules: [{
                required: true,
                message: formatMessage({id: 'common.please.select'})  //请选择
              }],
              initialValue: {principalValue}
            })(
             <div>{principal}</div>
            )}
          </FormItem>
          {saveBtn}
        </Form>
        {agencyRelation}
      </div>
    )
  }

}

NewAgency.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps() {
  return {}
}

const WrappedNewAgency = Form.create()(NewAgency);

export default connect(mapStateToProps)(injectIntl(WrappedNewAgency));
