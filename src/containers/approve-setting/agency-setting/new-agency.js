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

  //保存被代理人
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
      let principalInfo = JSON.parse(values.principalInfo);
      principalInfo.billProxyRuleDTOs = [];
      principalInfo.enabled = false;
      principalInfo.principalOID = principalInfo.userOID;
      if (this.state.principalValidateStatus != 'error') {
        this.setState({loading: true});
        httpFetch.post(`${config.baseUrl}/api/bill/proxy/rules`, principalInfo).then((res)=>{
          this.setState({ loading: false });
          message.success(this.props.intl.formatMessage({id: 'common.create.success'}, {name: ''}));  //代理新建成功
          this.context.router.push(this.state.agencyDetail.url.replace(':principalOID', res.data.principalOID));
        }).catch((e)=>{
          if(e.response){
            message.error(`新建失败, ${e.response.data.message}`);
            this.setState({loading: false});
          } else {
            console.log(e);
          }
        })
      }
    });
  };

  //取消新建代理
  handleCancel = () => {
    this.context.router.replace(this.state.agencySetting.url);
  };

  render(){
    const { formatMessage } = this.props.intl;
    const { getFieldDecorator } = this.props.form;
    const { loading, data, principalValidateStatus, principalHelp, fetching } = this.state;
    const options = data.map(d => <Option key={JSON.stringify(d)}>{d.text}</Option>);
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
            {getFieldDecorator('principalInfo', {
              rules: [{
                required: true,
                message: formatMessage({id: 'common.please.select'})  //请选择
              }]})(
              <Select placeholder={formatMessage({id: 'common.please.select'})/* 请选择 */}
                      showSearch
                      optionFilterProp='children'
                      notFoundContent={fetching ? <Spin size="small" /> : '无匹配结果'}
                      onSearch={this.handleSearch}
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
