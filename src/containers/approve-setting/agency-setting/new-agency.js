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

class NewAgency extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: [],
      principalValidateStatus: '',  //被代理人校验
      principalHelp: '', //被代理人校验内容
      fetching: false,
      agencySetting:  menuRoute.getRouteItem('agency-setting','key'),    //代理设置
      agencyDetail:  menuRoute.getRouteItem('agency-detail','key'),    //代理详情
    };
    this.handleSearch = debounce(this.handleSearch, 250);
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
      values.principalOID = JSON.parse(values.principalObj).userOID;
      console.log(values);
      if (this.state.principalValidateStatus != 'error') {
        this.setState({loading: true});
        httpFetch.post(`${config.baseUrl}/api/bill/proxy/rules`, values).then((res)=>{
          this.setState({ loading: false });
          message.success(this.props.intl.formatMessage({id: 'common.create.success'}, {name: values.organizationName}));  //新建成功
          this.context.router.push(this.state.agencyDetail.url.replace(':principalOID', values.principalOID));
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
      principalHelp: '',
      fetching: true
    });
    let url = `${config.baseUrl}/api/search/users/by/${value}`;
    value && httpFetch.get(url).then((response)=>{
      let data = response.data;
      this.setState({ data, fetching: false })
    });
  };

  handleChange = (value) => {
    console.log(value);

  };

  handleSelect = (obj) => {
    obj = JSON.parse(obj);
    let url = `${config.baseUrl}/api/bill/proxy/principals/check/${obj.userOID}`;
    obj.userOID && httpFetch.get(url).then((response)=>{
      if (response.data) {
        this.setState({
          principalValidateStatus: 'error',
          principalHelp: '此员工已存在被代理信息，请返回至前一页面搜索该员工并编辑'
        })
      } else {
        if (obj.status == 1002) {
          this.setState({
            principalValidateStatus: 'warning',
            principalHelp: `该员工将于${obj.leavingDate}离职，离职后此代理将自动禁用`
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

  handleCancel = () => {
    this.context.router.replace(this.state.agencySetting.url);
  };


  render(){
    const { formatMessage } = this.props.intl;
    const { getFieldDecorator } = this.props.form;
    const { loading, data, principalValidateStatus, principalHelp, fetching } = this.state;
    // const options = data.map(d => <Option key={d.userOID} value={d.text}>{d.text}</Option>);
    const options = data.map(d => <Option key={JSON.stringify(d)}>{d.fullName} - {d.employeeID}</Option>);
    return (
      <div className="new-agency">
        <h3 className="header-title">{formatMessage({id:'agencySetting.chose-principal'})}</h3>{/*请选择被代理人*/}
        <Form onSubmit={this.handleSave}>
          <FormItem colon={false}
                    hasFeedback
                    validateStatus={principalValidateStatus}
                    help={principalHelp}
                    style={{width:'300px'}}
                    label={<span>{formatMessage({id:'agencySetting.principal'})} :
                      <span style={{color:'#999'}}>{formatMessage({id:'agencySetting.principal-explain'})}</span></span>
                    }>{/*被代理人：需要他人帮助其填写、提交相应单据的人*/}
            {getFieldDecorator('principalObj', {
              rules: [{
                required: true,
                message: formatMessage({id: 'common.please.select'})  //请选择
              }]})(
              <Select placeholder={formatMessage({id: 'common.please.select'})/* 请选择 */}
                      mode="multiple"
                      notFoundContent={fetching ? <Spin size="small" /> : '无匹配结果'}
                      onSearch={this.handleSearch}
                      onChange={this.handleChange}
                      onSelect={this.handleSelect}>
                {options}
              </Select>
            )}
          </FormItem>
          <FormItem>
            <Button type="primary"
                    htmlType="submit"
                    loading={loading}
                    style={{marginRight:'10px'}}>{formatMessage({id: 'common.save'})/* 保存 */}</Button>
            <Button onClick={this.handleCancel}>{formatMessage({id: 'common.cancel'})/* 取消 */}</Button>
          </FormItem>
        </Form>
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
