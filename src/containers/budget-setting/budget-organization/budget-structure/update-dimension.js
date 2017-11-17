import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

import { Form, Input, Switch, Button, Icon, Checkbox, Alert, message, Select, InputNumber } from 'antd'

import ListSelector from 'components/list-selector.js'
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
      showSelectDimension: false,
      extraParams: {},
      loading: false
    };
  }

  componentWillMount(){

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
          }
          this.setState({loading: false});
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
  };

  handleFocus = () => {
    console.log(1)
    //this.refs.blur.focus();
    this.showList(true)
  };

  showList = (flag) =>{
    this.setState({
      showSelectDimension: flag,
    })
  };

  /**
   * ListSelector确认点击事件，返回的结果包装为form需要的格式
   * @param result
   */
  handleListOk = (result) => {
    let formItem = {};
    console.log(result)
    let values = [];
    result.result.map(item => {
      values.push({
        key: item[formItem.valueKey],
        label: item[formItem.labelKey],
        value: item
      })
    });
    let value = {};
    value[formItem.id] = values;
    console.log(this.props.form)
    this.props.form.setFieldsValue(value);
    this.setState({ showListSelector: false });
    formItem.handle && formItem.handle();
  };

  render(){
    const { getFieldDecorator } = this.props.form;
    const {formatMessage} = this.props.intl;
    const { isEnabled, showSelectDimension, defaultDimension } = this.state;
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
              rules: [
              ],
            })(
              <Select
                mode="multiple"
                labelInValue
                onFocus={this.handleFocus}
                placeholder={formatMessage({id:"common.please.enter"})}/>
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
                required: true, message: formatMessage({id:"common.please.select"})
              }],
            })(
              <Select placeholder={formatMessage({id:"common.please.enter"})}/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="布局顺序:">
            {getFieldDecorator('layoutPriority', {
              rules: [
                {
                  required: true, message: formatMessage({id:"common.please.enter"})
                },{
                validator:(item,value,callback)=>{
                  callback()
                }
              }],
            })(
              <InputNumber placeholder={this.props.intl.formatMessage({id:"common.please.enter"})}/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="默认维值代码:">
            {getFieldDecorator('defaultDimensionCode', {
              rules: [{
                required: true
              }],
            })(
              <Select
                mode="multiple"
                labelInValue
                onFocus={this.handleFocus}
                placeholder={this.props.intl.formatMessage({id:"common.please.enter"})}/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="默认维值名称:" >
            {getFieldDecorator('dimensionName', {
              initialValue: defaultDimension
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
