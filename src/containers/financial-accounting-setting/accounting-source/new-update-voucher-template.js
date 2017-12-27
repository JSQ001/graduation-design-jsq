/**
 * created by jsq on 2017/12/27
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { Button, Input, Switch, Select, Form, Icon, notification, Alert, Row, Col } from 'antd'
import httpFetch from 'share/httpFetch';
import config from 'config'
import 'styles/financial-accounting-setting/accounting-source/new-update-voucher-template.scss'
import Chooser from 'components/chooser'

const FormItem = Form.Item;
const Option = Select.Option;

class NewUpdateSection extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      loading: false,
      isEnabled: true,
      setOfBook: [],
      section: {}
    }
  }

  componentWillMount(){

  }

  handleNotification = ()=>{
    notification.close('section')
  };

  handleSubmit = (e)=> {
    e.preventDefault();
    /*this.setState({
     loading: true,
     });*/
    this.props.form.validateFieldsAndScroll((err, values) => {
      const { formatMessage } = this.props.intl;
      if (!err){
        console.log(values)
        notification.open({
          message: `${formatMessage({id:"section.notification.left"},{setOfBook: 1})}`+1,
          description: `${formatMessage({id:"section.notification.right"},{section: 1})}`,
          icon: <Icon type="exclamation-circle" style={{ color: '#faad14' }} />,
          duration: 0,
          key: 'section',
          btn:
            <div>
              <Button size="small" onClick={() => notification.close('section')}>
                {formatMessage({id:"common.cancel"})}
              </Button>
              <Button type="primary" style={{marginLeft:10}} size="small" onClick={this.handleNotification}>
                {formatMessage({id:"section.continue"})}
              </Button>
            </div>
        });
      }
    })
  };

  onCancel = ()=>{
    this.props.close(false)
  };

  switchChange = () => {
    this.setState((prevState) => ({
      isEnabled: !prevState.isEnabled
    }))
  };

  renderMessage(){
    return (
      <ul>
        <li className="header-tips-li"><span className="header-tips-content">{this.props.intl.formatMessage({id:"voucher.template.tips1"})}</span></li>
        <li className="header-tips-li"><span className="header-tips-content">{this.props.intl.formatMessage({id:"voucher.template.tips2"})}</span></li>
      </ul>)
  }

  render(){
    const { getFieldDecorator } = this.props.form;
    const { formatMessage } = this.props.intl;
    const { loading, section, setOfBook, isEnabled } = this.state;

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14, offset: 1 },
    };

    return(
      <div className="new-update-voucher-template">
        <Alert message={this.renderMessage()} type="warning" />
        <Form onSubmit={this.handleSubmit} className="voucher-template-form">
          <FormItem {...formItemLayout} label={formatMessage({id:'voucher.template.code'})  /*凭证模板行代码*/}>
            {getFieldDecorator('templateCode', {
              rules: [{
                required: true,
                message: formatMessage({id: "common.please.enter"})
              }]
            })(
              <Input className="input-disabled-color" placeholder={ formatMessage({id:"common.please.enter"})}/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={formatMessage({id:'voucher.template.name'})  /*凭证模板行名称*/}>
            {getFieldDecorator('templateCode', {
              rules: [{
                required: true,
                message: formatMessage({id: "common.please.enter"})
              }]
            })(
              <Input className="input-disabled-color" placeholder={ formatMessage({id:"common.please.enter"})}/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={formatMessage({id:'accounting.scenarios'})  /*核算场景*/}>
            {getFieldDecorator('templateCode', {
              rules: [{
                required: true,
                message: formatMessage({id: "common.please.select"})
              }]
            })(
              <Select className="input-disabled-color" placeholder={ formatMessage({id:"common.please.select"})}>
                {
                  setOfBook.map((item)=><Option key={item.value}>{item.label}</Option>)
                }
              </Select>
            )}
          </FormItem>
          <Row gutter={30}>
            <Col span={20}>
              <FormItem {...formItemLayout} label={formatMessage({id:'accounting.scenarios.name'})  /*核算场景名称*/}>
                {getFieldDecorator('scenariosName')(
                  <lable>{'-'}</lable>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={30}>
            <Col span={20}>
              <FormItem {...formItemLayout} label={formatMessage({id:'basic.data.sheet'})  /*基础数据表*/}>
                {getFieldDecorator('sectionName', {
                  rules: [{
                    required: true,
                    message: formatMessage({id: "common.please.select"})
                  }]
                })(
                  <Chooser
                    placeholder={formatMessage({id:"common.please.select"})}
                    type="source_transactions_data"
                    single={true}
                    labelKey="defaultDimValueCode"
                    valueKey="defaultDimValueId"
                    //selectorItem={selectorItem}
                    // listExtraParams={{dimensionId: dimensionCode.length>0? dimensionCode[0].dimensionId : null}}
                    onChange={()=>{}}/>
                )}
              </FormItem>
            </Col>
          </Row>
          <FormItem {...formItemLayout}
                    label={formatMessage({id:"common.column.status"})} colon={true}>
            {getFieldDecorator('isEnabled', {
              valuePropName:"checked",
              initialValue: isEnabled
            })(
              <div>
                <Switch defaultChecked={isEnabled}  checkedChildren={<Icon type="check"/>} unCheckedChildren={<Icon type="cross" />} onChange={this.switchChange}/>
                <span className="enabled-type" style={{marginLeft:20,width:100}}>{ isEnabled ? formatMessage({id:"common.status.enable"}) : formatMessage({id:"common.disabled"}) }</span>
              </div>)}
          </FormItem>
          <div className="slide-footer">
            <Button type="primary" htmlType="submit"  loading={this.state.loading}>{formatMessage({id:"common.save"})}</Button>
            <Button onClick={this.onCancel}>{formatMessage({id:"common.cancel"})}</Button>
          </div>
        </Form>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    company: state.login.company,
  }
}

const WrappedNewUpdateSection = Form.create()(NewUpdateSection);
export default connect(mapStateToProps)(injectIntl(WrappedNewUpdateSection));
