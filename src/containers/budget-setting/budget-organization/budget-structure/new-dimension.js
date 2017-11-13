import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

import { Form, Input, Switch, Button, Icon, Checkbox, Alert, message, Select, InputNumber } from 'antd'

import ListSelector from 'components/list-selector.js'
import Chooser from 'components/chooser.js'
import httpFetch from 'share/httpFetch'
import config from 'config'
import 'styles/budget-setting/budget-organization/budget-structure/new-dimension.scss'

const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;

class NewDimension extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      isEnabled: true,
      showSelectDimension: false,
      listSelectedData: [],
      layoutPosition:[], //值列表：布局位置
      extraParams: {},
      loading: false,
      dimensionCode: {}
    };
  }

  componentWillMount(){
    //获取布局位置的值列表
    this.getSystemValueList(2003).then((response)=>{
      let layoutPosition = [];
      console.log(response.data)
      response.data.values.map((item)=>{
        let option = {
          id: item.code,
          value: item.messageKey
        };
        layoutPosition.push(option);
      });
      this.setState({
        layoutPosition: layoutPosition
      })
    });
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
  };

  //chooser选值
  handleValueChange = (value)=>{
    console.log(value)
    this.setState({
      dimensionCode: value
    })
  };

  render(){
    const { getFieldDecorator } = this.props.form;
    const {formatMessage} =this.props.intl;
    const { isEnabled, dimensionCode, showSelectDimension, listExtraParams, listSelectedData, layoutPosition } = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14, offset: 1 },
    };

    const options = layoutPosition.map((item)=><Option key={item.id}>{item.value}</Option>)
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
              initialValue: dimensionCode,
              rules: [
                {required: true, message: formatMessage({id:"common.please.enter"}) }
              ],
            })(<Chooser
                  type="select_dimension"
                  single={true}
                  labelKey="name"
                  valueKey="code"
                  value={dimensionCode}
                  onChange={this.handleValueChange}
                />)}
          </FormItem>
          <FormItem {...formItemLayout} label="维度名称:" >
            {getFieldDecorator('dimensionName', {
              initialValue: dimensionCode.name

            })(
              <Input disabled/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="布局位置:">
            {getFieldDecorator('layoutPosition', {
              rules: [{

              }],
            })(
              <Select placeholder={this.props.intl.formatMessage({id:"common.please.enter"})}>
                {options}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="布局顺序:">
            {getFieldDecorator('layoutPriority', {
              rules: [{
                validator:(item,value,callback)=>{
                  callback()
                }
              }],
            })(
              <InputNumber placeholder={this.props.intl.formatMessage({id:"common.please.enter"})}/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="默认维度代码:">
            {getFieldDecorator('defaultDimensionCode', {
              initialValue: 1,
              rules: [{

              }],
            })(
              <Chooser
                type="select_dimension"
                placeholder={this.props.intl.formatMessage({id:"common.please.enter"})}/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="默认维度名称:" >
            {getFieldDecorator('defaultDimensionName', {
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
