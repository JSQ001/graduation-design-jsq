/**
 * Created by 13576 on 2017/9/22.
 */
import React from 'react'
import {connect} from 'react-redux'
import {injectIntl} from 'react-intl';
import {Button,Form,Switch,Input,message,Icon}from 'antd'
const FormItem = Form.Item;

import config from 'config'
import httpFetch from 'share/httpFetch'

import 'styles/budget-setting/budget-organization/buget-item-type/budget-item-type.scss'

class PutBudgetItemType extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      params: {},
      isEnabled: true,
      loading: false,

    };
  }

  //获取数据
  componentWillMount() {
    console.log(this.state.params)
    this.setState({
      params: this.props.params,
      isEnabled: this.props.params.isEnabled,
    })
  }

//状态变化时,获取默认值数据
  componentWillReceiveProps (nextProps){
    if (nextProps.params && nextProps.params.length > 0)
      this.setState({
        params: this.props.params,
        isEnabled: this.props.params.isEnabled,
      })
    else
      this.setState({params: {}});

  };


//修改
  handlePut = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log(values);
        this.setState({loading: true});
        console.log(values);
        const data = {
          ...this.props.params,
          'isEnabled': this.state.isEnabled,
          'itemTypeName': values.itemTypeName,
        }
        console.log(data);
        httpFetch.put(`${config.budgetUrl}/api/budget/itemType`, data).then((res) => {
          this.setState({loading: false});
          this.props.close(true);
          message.success(  this.props.intl.formatMessage({id: "common.operate.success"}));
        }).catch((e) => {
          this.setState({loading: false});
          message.error(e.response.data.message);
        })
      }
    });
  };


  onCancel = () => {
    this.props.close();
  };

  switchChange = () => {
    this.setState((prevState) => ({
      isEnabled: !prevState.isEnabled
    }))
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    const {params, isEnabled} = this.state;
    const formItemLayout = {
      labelCol: {span: 6, offset: 1},
      wrapperCol: {span: 14, offset: 1},
    };
    return (


      <div className="new-value">
        <Form onSubmit={this.handlePut}>
          <FormItem {...formItemLayout}
                    label={this.props.intl.formatMessage({id: "budget.isEnabled"})}>
            {getFieldDecorator('isEnabled', {})(
              <div>
                <Switch defaultChecked={params.isEnabled} checkedChildren={<Icon type="check"/>}
                        unCheckedChildren={<Icon type="cross"/>} onChange={this.switchChange}/>
                <span className="enabled-type" style={{
                  marginLeft: 20,
                  width: 100
                }}>{ isEnabled ? this.props.intl.formatMessage({id: "common.enabled"}) : this.props.intl.formatMessage({id: "common.disabled"}) }</span>
              </div>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={this.props.intl.formatMessage({id: "budget.organization"})}>
            {getFieldDecorator('organizationName', {
              initialValue: this.props.organization.organizationName

            })(
              <Input disabled/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={this.props.intl.formatMessage({id: "budget.itemTypeCode"})}>
            {getFieldDecorator('itemTypeCode', {
              rules: [{
                required: true
              }],
              initialValue: this.props.params.itemTypeCode
            })(
              <Input disabled/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={this.props.intl.formatMessage({id: "budget.itemTypeName"})}>
            {getFieldDecorator('itemTypeName', {
              rules: [{
                required: true,
                message: this.props.intl.formatMessage({id: "common.please.enter"})
              }],
              initialValue: this.props.params.itemTypeName
            })(
              <Input placeholder={this.props.intl.formatMessage({id: "common.please.enter"})}/>
            )}
          </FormItem>

          <div className="slide-footer">
            <Button type="primary" htmlType="submit"
                    loading={this.state.loading}>{this.props.intl.formatMessage({id: "common.save"})}</Button>
            <Button onClick={this.onCancel}>{this.props.intl.formatMessage({id: "common.cancel"})}</Button>
          </div>
        </Form>
      </div>
    )
  }
}

const WrappedPutBudgetItemType = Form.create()(PutBudgetItemType);
function mapStateToProps(state) {
  return {
    organization: state.budget.organization
  }
}
export default connect(mapStateToProps)(injectIntl(WrappedPutBudgetItemType));
