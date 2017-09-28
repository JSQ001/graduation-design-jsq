import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

import { Form, Input, Switch, Button, Icon, Checkbox, Alert, message, Select, InputNumber } from 'antd'


import httpFetch from 'share/httpFetch'
import config from 'config'
import 'styles/budget-setting/budget-organization/budget-structure/new-dimension.scss'

const FormItem = Form.Item;
const { TextArea } = Input;

class NewDimension extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      isEnabled: true,
      organizationName: '',
      loading: false
    };
  }

  componentWillMount(){
    this.setState({
      organizationName: this.props.params.organizationName
    })
  }

  handleSave = (e) =>{
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({loading: true});
        httpFetch.post(`${config.budgetUrl}/api/budget/scenarios`, values).then((res)=>{
          console.log(res);
          this.setState({loading: false});
          if(res.status == 200){
            this.props.close(true);
            message.success('操作成功');
          }
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
    const { isEnabled, organizationName } = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14, offset: 1 },
    };
    return (
      <div className="new-budget-scenarios">
        <Form onSubmit={this.handleSave}>
          <FormItem {...formItemLayout}
                    label="状态:">
            {getFieldDecorator('isEnabled', {
              valuePropName:"defaultChecked",
              initialValue:isEnabled
            })(
              <div>
                <Switch defaultChecked={isEnabled}  checkedChildren={<Icon type="check"/>} unCheckedChildren={<Icon type="cross" />} onChange={this.switchChange}/>
                <span className="enabled-type" style={{marginLeft:20,width:100}}>{ isEnabled ? '启用' : '禁用' }</span>
              </div>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="维度代码:">
            {getFieldDecorator('dimensionCode', {
              rules: [{

              }],
            })(
              <Select placeholder={this.props.intl.formatMessage({id:"common.please.enter"})}/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="维度名称:" >
            {getFieldDecorator('dimensionName', {
              initialValue: 111
            })(
              <Input disabled/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="布局位置:">
            {getFieldDecorator('layoutPosition', {
              rules: [{

              }],
            })(
              <Select placeholder={this.props.intl.formatMessage({id:"common.please.enter"})}/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="布局顺序:">
            {getFieldDecorator('layoutPriority', {
              rules: [{

              }],
            })(
              <InputNumber placeholder={this.props.intl.formatMessage({id:"common.please.enter"})}/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="默认维度代码:">
            {getFieldDecorator('defaultDimensionCode', {
              rules: [{

              }],
            })(
              <Select placeholder={this.props.intl.formatMessage({id:"common.please.enter"})}/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="默认维度名称:" >
            {getFieldDecorator('dimensionName', {
              initialValue: 111
            })(
              <Input disabled/>
            )}
          </FormItem>
          <div className="slide-footer">
            <Button type="primary" htmlType="submit"  loading={this.state.loading}>保存</Button>
            <Button onClick={this.onCancel}>取消</Button>
          </div>
        </Form>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {}
}

const WrappedNewDimension = Form.create()(NewDimension);

export default connect(mapStateToProps)(injectIntl(WrappedNewDimension));
