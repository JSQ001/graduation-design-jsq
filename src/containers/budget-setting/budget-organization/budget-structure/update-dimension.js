import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

import { Form, Input, Switch, Button, Icon, Checkbox, message, Select, InputNumber } from 'antd'

import Chooser from 'components/chooser.js'
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
      dimension:{},
      layoutPosition:[],
      extraParams: {},
      loading: false,
      selectorItem:{
        title: '选择默认维值',
        url: `${config.baseUrl}api/my/cost/center/items/by/costcenterid`,
        searchForm: [
          {type: 'input', id: 'code', label: '维值代码'},
          {type: 'input', id: 'name', label: '维值名称'},
        ],
        columns: [
          {title: '维值代码', dataIndex: 'code', width: '25%'},
          {title: '维值名称', dataIndex: 'name', width: '25%'},
        ],
        key: 'id'
      },
    };
  }

  componentWillMount(){
    console.log(this.props)
    let dimension = this.props.params;
    let extraParams = this.state.extraParams;
    if(typeof dimension.id !== 'undefined'){
      extraParams = {id: dimension.dimensionId}
    }

    this.setState({
      dimension,
      selectorItem
    });
    //获取布局位置的值列表
    this.getSystemValueList(2003).then((response)=>{
      let layoutPosition = [];
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
  componentWillReceiveProps(nextprops){
    console.log(nextprops)
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
    const { isEnabled, showSelectDimension, dimension, layoutPosition ,selectorItem, extraParams} = this.state;
    const options = layoutPosition.map((item)=><Option key={item.id}>{item.value}</Option>);
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
              initialValue: dimension.isEnabled
            })(
              <div>
                <Switch defaultChecked={dimension.isEnabled}  checkedChildren={<Icon type="check"/>} unCheckedChildren={<Icon type="cross" />} onChange={this.switchChange}/>
                <span className="enabled-type" style={{marginLeft:20,width:100}}>{ dimension.isEnabled ? '启用' : '禁用' }</span>
              </div>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="维度代码:">
            {getFieldDecorator('dimensionCode', {
              initialValue: dimension.defaultDimensionCode,
              rules: [
                {
                  required: true, message: formatMessage({id:"common.please.select"})
                }
              ],
            })(
              <Chooser
                placeholder={ formatMessage({id:"common.please.enter"}) }
                type={"select_dimension"}
                single={true}
                labelKey="code"
                valueKey="code"
                onChange={this.handleDimensionCode}/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="维度名称:" >
            {getFieldDecorator('dimensionName', {
              initialValue: dimension.dimensionName
            })(
              <Input disabled/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="布局位置:">
            {getFieldDecorator('layoutPosition', {
              initialValue: dimension.layoutPosition,
              rules: [{
                required: true, message: formatMessage({id:"common.please.select"})
              }],
            })(
              <Select placeholder={formatMessage({id:"common.please.enter"})}>
                {options}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="布局顺序:">
            {getFieldDecorator('layoutPriority', {
              initialValue: dimension.layoutPriority,
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
              initialValue:typeof this.props.form.getFieldValue("dimensionCode") === 'undefined' ? 1 : 2 //dimension.defaultDimensionValue
            })(
              <Chooser
                placeholder={formatMessage({id:"common.please.select"})}
                type={"select_dimensionValue"}
                single={true}
                labelKey="code"
                valueKey="code"
                selectorItem={selectorItem}
                listExtraParams={extraParams}
                value={dimension.defaultDimensionValue}
                onChange={this.handleDimensionValue}/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="默认维值名称:" >
            {getFieldDecorator('dimensionName', {
              initialValue: dimension.dimensionCode
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
