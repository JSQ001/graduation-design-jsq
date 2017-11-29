import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

import { Form, Input, Row, Col, Switch, Button, Icon, Checkbox, Alert, message, Select, InputNumber } from 'antd'
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
    const { formatMessage} = this.props.intl;
    this.state = {
      isEnabled: true,
      showSelectDimension: false,
      layoutPosition:[], //值列表：布局位置
      extraParams: {},
      loading: false,
      dimensionCode: [],
      defaultDimension: [],
      dimensionValue:{},
      selectorItem:{
        title: formatMessage({id:"structure.selectDefaultDim"}),
        url: `${config.baseUrl}/api/cost/center/item/`,
        searchForm: [
          {type: 'input', id: 'code', label: formatMessage({id:"structure.dimensionValueCode"})},
          {type: 'input', id: 'name', label: formatMessage({id:"structure.dimensionValueName"})},
        ],
        columns: [
          {title: formatMessage({id:"structure.dimensionValueCode"}), dataIndex: 'code', width: '25%'},
          {title: formatMessage({id:"structure.dimensionValueName"}), dataIndex: 'name', width: '25%'},
        ],
        key: 'id'
      },
    };
  }

  componentWillMount(){
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

  handleSave = (e) =>{
    const { defaultDimension} = this.state;
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({loading: true});
        values.dimensionId = values.dimensionCode[0].id;
        values.structureId = this.props.params.id;
        if(defaultDimension.length>0){
          values.defaultDimValueId = defaultDimension[0].id;
        }

        httpFetch.post(`${config.budgetUrl}/api/budget/structure/assign/layouts`, values).then((res)=>{
          this.setState({loading: false});
          if(res.status == 200){
            this.props.close(true);
            message.success(`${this.props.intl.formatMessage({id:"common.save.success"},{name: res.data.id})}`);
          }
        }).catch((e)=>{
          if(e.response){
            message.error(`${this.props.intl.formatMessage({id:"common.save.filed"})}, ${e.response.data.message}`);
          }
          this.setState({loading: false});
        })
      }
    });
  };

  onCancel = () =>{
    this.props.form.resetFields();
    this.props.form.setFieldsValue({"dimensionCode":[]});
    this.setState({
      defaultDimension: [],
      dimensionCode: []
    });
    this.props.close();
  };

  switchChange = () => {
    this.setState((prevState) => ({
      isEnabled: !prevState.isEnabled
    }))
  };

  handleDimensionCode = (value)=>{
    if(value.length>0){
      let selectorItem = this.state.selectorItem;
      selectorItem.url = `${config.baseUrl}/api/my/cost/center/items/${value[0].costCenterOID}`;
      this.setState({
        dimensionCode: value,
        selectorItem,
        dimensionValue:{},
        defaultDimension: []
      });
    }
  };

  handleDimensionValue = (value)=>{
    this.setState({
      defaultDimension:value
    })
  };

  //没有选择维度时，提示
  validateValue = ()=>{
    let dimensionValue = {
      help: "请先选择维度代码",
      validateStatus: 'warning'
    };
    this.setState({
      dimensionValue
    })
  };

  render(){
    const { getFieldDecorator } = this.props.form;
    const {formatMessage} = this.props.intl;
    const {dimensionValue, isEnabled, dimensionCode, defaultDimension, layoutPosition, selectorItem } = this.state;
    const formItemLayout = {
      labelCol: { span: 9 },
      wrapperCol: { span: 14, offset: 1 },
    };
    const options = layoutPosition.map((item)=><Option key={item.id}>{item.value}</Option>);

    return (
      <div className="new-budget-scenarios">
        <Form onSubmit={this.handleSave}>
          <Row gutter={18}>
            <Col span={18}>
              <FormItem {...formItemLayout}
                label="状态:">
                {getFieldDecorator('isEnabled', {
                  valuePropName:"defaultChecked",
                  initialValue:isEnabled
                })(
                <div>
                  <Switch defaultChecked={isEnabled}  checkedChildren={<Icon type="check"/>} unCheckedChildren={<Icon type="cross" />} onChange={this.switchChange}/>
                  <span className="enabled-type" style={{marginLeft:20,width:100}}>{ isEnabled ? '启用' : '禁用' }</span>
                </div>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={18}>
            <Col span={18}>
              <FormItem {...formItemLayout} label="维度代码:">
                {getFieldDecorator('dimensionCode', {
                  rules: [{
                   required: true, message: formatMessage({id:"common.please.select"})
                  },{
                    validator:(item,value,callback)=>{
                      callback();
                    }
                  }
                  ],
                })(
                <Chooser
                  placeholder={ formatMessage({id:"common.please.enter"}) }
                  type={"select_dimension"}
                  single={true}
                  labelKey="code"
                  valueKey="code"
                  onChange={this.handleDimensionCode}/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={18}>
            <Col span={18}>
              <FormItem {...formItemLayout} label="维度名称:" >
                {getFieldDecorator('dimensionName', {
                  initialValue: dimensionCode.length>0 ? dimensionCode[0].name : null,
                })(
                  <Input disabled/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={18}>
            <Col span={18}>
              <FormItem {...formItemLayout} label="布局位置:">
                {getFieldDecorator('layoutPosition', {
                  initialValue: "DOCUMENTS_LINE",
                  rules: [{
                    required: true, message:formatMessage({id:"common.please.select"})
                  }],
                })(
                  <Select disabled  placeholder={formatMessage({id:"common.please.select"})}>
                    {options}
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={18}>
            <Col span={18}>
              <FormItem {...formItemLayout} label="布局顺序:">
                {getFieldDecorator('layoutPriority', {
                  rules: [
                    {
                      required: true, message: formatMessage({id:"common.please.enter"})
                    },
                    {
                    validator:(item,value,callback)=>{
                      callback()
                    }
                  }],
                })(
                  <InputNumber placeholder={formatMessage({id:"common.please.enter"})}/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={18}>
            <Col span={18}>
              <FormItem {...formItemLayout} label="默认维值代码:"
                help={dimensionValue.help}
                validateStatus={dimensionValue.validateStatus}>
                {getFieldDecorator('defaultDimensionCode', {
                  rules: [
                    {
                      validator:(item,value,callback)=>{
                        callback()
                      }
                    }],
                })(
                  <div>
                    {
                      typeof this.props.form.getFieldValue("dimensionCode") === 'undefined' ?
                        <Input onFocus={this.validateValue} placeholder={formatMessage({id:"common.please.select"})}/>
                        :
                        <Chooser
                          placeholder={formatMessage({id:"common.please.select"})}
                          type={"select_dimensionValue"}
                          single={true}
                          labelKey="code"
                          valueKey="code"
                          selectorItem={selectorItem}
                         // value={defaultDimension}
                          onChange={this.handleDimensionValue}/>
                    }
                  </div>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={18}>
            <Col span={18}>
             <FormItem {...formItemLayout} label="默认维值名称:" >
              {getFieldDecorator('dimensionName', {
                initialValue: defaultDimension.length>0 ? defaultDimension[0].name : null
              })(
                <Input disabled/>
              )}
             </FormItem>
            </Col>
          </Row>
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
  return {}
}

const WrappedNewDimension = Form.create()(NewDimension);

export default connect(mapStateToProps)(injectIntl(WrappedNewDimension));
