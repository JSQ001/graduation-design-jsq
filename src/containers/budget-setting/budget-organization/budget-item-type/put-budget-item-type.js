/**
 * Created by 13576 on 2017/9/22.
 */
/**
 * Created by 13576 on 2017/9/21.
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import {Button,Table,Badge,Popconfirm,Form,DatePicker,Col,Row,Switch,notification,Input,message,Icon} from 'antd'
const FormItem = Form.Item;

import config from 'config'
import httpFetch from 'share/httpFetch'
import menuRoute from 'share/menuRoute'

import 'styles/budget-setting/budget-organization/buget-item-type/budget-item-type.scss'


class PutBudgetItemType extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      params: {},
      isEnabled: true,
      loading:false,

    };
  }

  componentWillMount(){
    console.log(this.state.params)
    this.setState({
      params: this.props.params,
      isEnabled: this.props.params.isEnabled,
    })
  }

//修改
  handlePut= (e) =>{
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({loading: true});
        console.log(values);
        const data ={
          'isEnabled':this.state.isEnabled,
          'itemTypeName':values.itemTypeName,
          'id':this.state.params.id,
          'versionNumber':this.state.params.versionNumber,
        }
        console.log(data);
        httpFetch.put(`${config.budgetUrl}/api/budget/itemType`, data).then((res)=>{

          this.setState({loading: false});
            this.props.close(true);
            message.success(this.props.intl.formatMessage({id:"common.operate.success"}));


        }).catch((e)=>{
          this.setState({loading: false});
          message.error(e.response.data.validationErrors[0].message);
        })
      }
    });
  };




  onCancel = () =>{
    this.props.close();
  };

  switchChange = () => {
    this.setState((prevState) => ({
      isEnabled: !prevState.isEnabled
    }))
  }

  render(){
    const { getFieldDecorator } = this.props.form;
    const { params,isEnabled} = this.state;
    const formItemLayout = {
      labelCol: { span: 6,offset: 1  },
      wrapperCol: { span: 14, offset: 1 },
    };
    return (


      <div className="new-value">
        <Form onSubmit={this.handlePut}>
          <FormItem {...formItemLayout}
            label={this.props.intl.formatMessage({id:"budget.isEnabled"})}>
            {getFieldDecorator('isEnabled', {
            })(
              <div>
                <Switch  defaultChecked={params.isEnabled} checkedChildren={<Icon type="check"/>} unCheckedChildren={<Icon type="cross" />} onChange={this.switchChange}/>
                <span className="enabled-type" style={{marginLeft:20,width:100}}>{ isEnabled ?this.props.intl.formatMessage({id:"common.statusEnable"}) : this.props.intl.formatMessage({id:"common.statusDisable"}) }</span>
              </div>
            )}
          </FormItem>
          <FormItem {...formItemLayout}      label={this.props.intl.formatMessage({id:"budget.organizationName"})}>
            {getFieldDecorator('organizationName', {
              initialValue:this.props.organization.organizationName

            })(
              <Input disabled/>
            )}
          </FormItem>
          <FormItem {...formItemLayout}  label={this.props.intl.formatMessage({id:"budget.itemTypeCode"})}>
            {getFieldDecorator('itemTypeCode', {
              rules: [{
                required: true
              }],
              initialValue:this.props.params.itemTypeCode
            })(
              <Input disabled/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={this.props.intl.formatMessage({id:"budget.itemTypeName"})}>
            {getFieldDecorator('itemTypeName', {
              rules: [{
                required: true,
                message: this.props.intl.formatMessage({id:"common.please.enter"})
              }],
              initialValue: this.props.params.itemTypeName
            })(
              <Input placeholder={this.props.intl.formatMessage({id:"common.please.enter"})} />
            )}
          </FormItem>

          <div className="slide-footer">
            <Button type="primary" htmlType="submit" loading={this.state.loading}>{this.props.intl.formatMessage({id:"common.save"})}</Button>
            <Button onClick={this.onCancel}>{this.props.intl.formatMessage({id:"common.cancel"})}</Button>
          </div>
        </Form>
      </div>
    )
  }
}

const WrappedPutBudgetItemType = Form.create()(PutBudgetItemType);
function mapStateToProps(state) {
  return {
    organization:state.budget.organization
  }
}
export default connect(mapStateToProps)(injectIntl(WrappedPutBudgetItemType));
