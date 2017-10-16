import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

import { Form, Select, message, Button } from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;
import httpFetch from 'share/httpFetch'
import config from 'config'
import menuRoute from 'share/menuRoute'

class NewAgency extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: [],
      agencySetting:  menuRoute.getRouteItem('agency-setting','key'),    //新建代理
    };
  }

  handleSave = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      console.log(values);
      if (!err) {
        this.setState({loading: true});
        httpFetch.post(`${config.baseUrl}/api/bill/proxy/rules`, values).then((res)=>{
          this.setState({loading: false});
          message.success(this.props.intl.formatMessage({id: 'common.create.success'}, {name: values.organizationName}));  //新建成功
        }).catch((e)=>{
          if(e.response){
            message.error(`新建失败, ${e.response.data.validationErrors[0].message}`);
            this.setState({loading: false});
          } else {
            console.log(e)
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
      })
    });
  };

  handleCancel = () => {
    this.context.router.replace(this.state.agencySetting.url);
  };

  render(){
    const { formatMessage } = this.props.intl;
    const { getFieldDecorator } = this.props.form;
    const { loading, data} = this.state;
    const options = data.map(d => <Option key={d.userOID}>{d.fullName} - {d.employeeID}</Option>);
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
                message: formatMessage({id: 'common.please.enter'}),  //请输入
              }]})(
              <Select placeholder={formatMessage({id: 'common.please.enter'})/* 请输入 */}
                      mode="combobox"
                      onChange={this.handleChange}
                      style={{width:'300px'}}>
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
