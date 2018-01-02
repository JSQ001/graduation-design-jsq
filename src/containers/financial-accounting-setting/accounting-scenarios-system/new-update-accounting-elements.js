/**
 * created by jsq on 2017/12/28
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { Button, Input, Switch, Form, Icon, Select, notification } from 'antd'
import httpFetch from 'share/httpFetch';
import config from 'config'
import 'styles/financial-accounting-setting/accounting-scenarios-system/new-update-accounting-elements.scss'

const FormItem = Form.Item;
const Option = Select.Option;

class NewUpdateScenariosSystem extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      loading: false,
      isEnabled: true,
      visible: true,
      elements: [],
      section: {}
    }
  }

  componentWillMount(){

  }

  handleSubmit = (e)=> {
    e.preventDefault();
    /*this.setState({
     loading: true,
     });*/
    this.props.form.validateFieldsAndScroll((err, values) => {
      const { formatMessage } = this.props.intl;
      if (!err){
        console.log(values)
      }
    })
  };

  onCancel = ()=>{
    this.props.form.resetFields();
    this.props.close(false)
  };

  switchChange = () => {
    this.setState((prevState) => ({
      isEnabled: !prevState.isEnabled
    }))
  };

  handleClose = ()=>{
    this.setState({visible:true});
    notification.close('jsq')
  };

  openNotification = () => {
    if(this.state.visible){
      const args = {
        message: this.props.intl.formatMessage({id:"accounting.matching.group.field"}),
        description:
          <div>
            <div>{this.props.intl.formatMessage({id:"accounting.notification.content"})}</div>
            <Button style={{marginTop:20,float:'right'}} type="primary" onClick={this.handleClose} >{this.props.intl.formatMessage({id:"common.ok"})}</Button>
          </div>,
        duration: 0,
        key: 'jsq',
        onClose: ()=>this.setState({visible:true})
      };
      notification.open(args);
      this.setState({visible:false})
    }
  };


  render(){
    const { getFieldDecorator } = this.props.form;
    const { formatMessage } = this.props.intl;
    const { loading, isEnabled, elements } = this.state;

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14, offset: 1 },
    };

    return(
      <div className="new-update-accounting-elements">
        <Form onSubmit={this.handleSubmit} className="accounting-elements-form">
          <FormItem {...formItemLayout} label={formatMessage({id:'accounting.scenarios.elements'})  /*核算要素*/}>
            {getFieldDecorator('scenariosCode', {
              rules: [{
                required: true,
                message: formatMessage({id: "common.please.select"})
              }]
            })(
              <Select placeholder={formatMessage({id:"common.please.select"})}>
                {
                  elements.map((item)=><Option key={item.value}>{item.label}</Option>)
                }
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={formatMessage({id:'accounting.elements.name'})  /*核算要素名称*/}>
            {getFieldDecorator('scenariosName')(
              <lable>{'-'}</lable>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={formatMessage({id:'accounting.elements.nature'})  /*核算要素性质*/}>
            {getFieldDecorator('scenariosName', {
              rules: [{
                required: true,
                message: formatMessage({id: "common.please.enter"})
              }]
            })(
              <Input placeholder={formatMessage({id:"common.please.enter"})}/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={formatMessage({id:'accounting.matching.group.field'})  /*匹配组字段*/}>
            {getFieldDecorator('scenariosName')(
              <Input placeholder={formatMessage({id:"common.please.enter"})}/>
            )}
          </FormItem>
          <a onClick={this.openNotification} className="accounting-link-tips">{formatMessage({id:"accounting.link.tips"})}{/*什么是匹配组字段？*/}</a>
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

const WrappedNewUpdateScenariosSystem = Form.create()(NewUpdateScenariosSystem);
export default connect(mapStateToProps)(injectIntl(WrappedNewUpdateScenariosSystem));
