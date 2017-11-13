/**
 * Created by 13576 on 2017/9/21.
 */
import React from 'react';
import {connect} from 'react-redux';
import {injectIntl} from 'react-intl';
import {Button,Form,Switch, Input,message, Icon} from 'antd';
const FormItem = Form.Item;

import config from 'config';
import httpFetch from 'share/httpFetch';

import 'styles/budget-setting/budget-organization/buget-item-type/budget-item-type.scss'


class NewBudgetItemType extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      params: {},
      isEnabled: true,
      isPut: false,
      loading: false,

    };
  }

  componentWillMount() {
    console.log(this.props.organization)
  }


  //新建
  handleSave = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({loading: true});
        let toValue = {
          'isEnabled': values.isEnabled,
          'itemTypeName': values.itemTypeName,
          'itemTypeCode': values.itemTypeCode,
          'organizationId': this.props.organization.id
        }
        console.log(toValue);
        httpFetch.post(`${config.budgetUrl}/api/budget/itemType`, toValue).then((res) => {
          this.setState({loading: false});
          this.props.form.resetFields();
          this.props.close(true);
          message.success(this.props.intl.formatMessage({id: "common.create.success"}, {name: `${this.props.intl.formatMessage({id: "budget.itemType"})}`}));
          console.log(this.props.id);
        }).catch((e) => {
          this.setState({loading: false});

          message.error(this.props.intl.formatMessage({id: "common.save.filed"}));
        })
      }
    });
  }

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
    const {params, isEnabled, isPut} = this.state;
    const formItemLayout = {
      labelCol: {span: 6, offset: 1},
      wrapperCol: {span: 14, offset: 1},
    };
    return (


      <div className="new-value">
        <Form onSubmit={this.handleSave}>
          <FormItem {...formItemLayout}
                    label={this.props.intl.formatMessage({id: "budget.isEnabled"})}>
            {getFieldDecorator('isEnabled', {
              valuePropName: "defaultChecked",
              initialValue: isEnabled
            })(
              <div>
                <Switch defaultChecked={isEnabled} checkedChildren={<Icon type="check"/>}
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
              rules: [{}],
              initialValue: this.props.organization.organizationName

            })(
              <Input disabled/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={this.props.intl.formatMessage({id: "budget.itemTypeCode"})}>
            {getFieldDecorator('itemTypeCode', {
              rules: [{
                required: true,
                message: this.props.intl.formatMessage({id: "common.please.enter"})
              }],
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={this.props.intl.formatMessage({id: "budget.itemTypeName"})}>
            {getFieldDecorator('itemTypeName', {
              rules: [{
                required: true,
                message: this.props.intl.formatMessage({id: "common.please.enter"})
              }],
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


/*NewBudgetItemType.propTypes = {
 isPut:React.PropTypes.bool,
 text:React.PropTypes.object
 };*/


const WrappedNewBudgetItemType = Form.create()(NewBudgetItemType);
function mapStateToProps(state) {
  return {
    organization: state.budget.organization
  }
}
export default connect(mapStateToProps)(injectIntl(WrappedNewBudgetItemType));
