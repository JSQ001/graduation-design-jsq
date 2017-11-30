import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

import { Form, Input, Switch, Button, Icon, Checkbox, message, Select, InputNumber, Row, Col } from 'antd'

import Chooser from 'components/chooser.js'
import httpFetch from 'share/httpFetch'
import config from 'config'
import 'styles/budget-setting/budget-organization/budget-structure/new-dimension.scss'

const FormItem = Form.Item;
const { TextArea } = Input;

class NewDimension extends React.Component{
  constructor(props) {
    super(props);
    const { formatMessage} = this.props.intl;
    this.state = {
      isEnabled: true,
      showSelectDimension: false,
      dimension:{},
      layoutPosition:[],
      extraParams: {},
      loading: false,
      dimensionSelectorItem:{
        title: formatMessage({id:"structure.selectDim"}),
        url: `${config.budgetUrl}/api/budget/structure/assign/layouts/queryNotSaveDimension`,
        searchForm: [
          {type: 'input', id: 'dimensionCode', label: formatMessage({id:"structure.dimensionCode"})},
          {type: 'input', id: 'dimensionName', label: formatMessage({id:"structure.dimensionName"})},
        ],
        columns: [
          {title: formatMessage({id:"structure.dimensionCode"}), dataIndex: 'dimensionCode', width: '25%'},
          {title: formatMessage({id:"structure.dimensionName"}), dataIndex: 'dimensionName', width: '25%'},
        ],
        key: 'dimensionId'
      },
      selectorItem:{
        title: formatMessage({id:"structure.selectDefaultDim"}),
        url: `${config.budgetUrl}/api/budget/structure/assign/layouts/queryDefaultDimValue`,
        searchForm: [
          {type: 'input', id: 'defaultDimValueCode', label: formatMessage({id:"structure.dimensionValueCode"})},
          {type: 'input', id: 'defaultDimValueName', label: formatMessage({id:"structure.dimensionValueName"})},
        ],
        columns: [
          {title: formatMessage({id:"structure.dimensionValueCode"}), dataIndex: 'defaultDimValueCode', width: '25%'},
          {title: formatMessage({id:"structure.dimensionValueName"}), dataIndex: 'defaultDimValueName', width: '25%'},
        ],
        key: 'defaultDimValueId'
      },

    };
  }

  componentWillMount(){
    let dimension = this.props.params;
    let extraParams = this.state.extraParams;
    console.log(dimension)
    if(typeof dimension.id !== 'undefined'){
      extraParams = {dimensionId: dimension.dimensionId}
    }
    this.setState({
      dimension,
      extraParams,
      defaultDimension: dimension.defaultDimensionValue
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
        layoutPosition: layoutPosition,

      })
    });

  }
  componentWillReceiveProps(nextprops){
    if(nextprops.params.versionNumber !== this.state.dimension){
      let dimension = this.props.params;
      let extraParams = this.state.extraParams;
      if(typeof dimension.id !== 'undefined'){
        extraParams = {dimensionId: dimension.dimensionId}
      }
      this.setState({
        dimension,
        extraParams,
        defaultDimension: dimension.defaultDimensionValue
      });
    }
  }

  handleSave = (e) =>{
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({loading: true});
        values.id = this.state.dimension.id;
        values.dimensionId = values.dimensionCode[0].id;
        values.defaultDimValueId = values.defaultDimensionCode[0].id;
        values.versionNumber = this.state.dimension.versionNumber;
        httpFetch.put(`${config.budgetUrl}/api/budget/structure/assign/layouts`, values).then((res)=>{
          this.setState({loading: false});
          if(res.status == 200){
            this.props.close(true);
            message.success(`${this.props.intl.formatMessage({id:"common.operate.success"})}`);
          }
        }).catch((e)=>{
          if(e.response){
            message.error(`${this.props.intl.formatMessage({id:"common.operate.filed"})}, ${e.response.data.message}`);
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
    this.props.form.setFieldsValue(value);
    this.setState({ showListSelector: false });
    formItem.handle && formItem.handle();
  };


  handleDimensionValue = (value)=>{
    this.props.form.setFieldsValue({"defaultDimValueName":value[0].name});
    this.setState({
      defaultDimension:value
    })
  };

  render(){
    const { getFieldDecorator } = this.props.form;
    const {formatMessage} = this.props.intl;
    const { dimensionSelectorItem, showSelectDimension, dimension, layoutPosition ,selectorItem, extraParams} = this.state;
    const options = layoutPosition.map((item)=><Option key={item.id}>{item.value}</Option>);
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14, offset: 1 },
    };
    return (
      <div className="new-budget-scenarios">
        <Form onSubmit={this.handleSave}>
          <Row gutter={30}>
            <Col span={20}>
              <FormItem {...formItemLayout} label={formatMessage({id:"common.column.status"})} colon={true}>
                {getFieldDecorator('isEnabled', {
                  valuePropName:"defaultChecked",
                  initialValue: dimension.isEnabled
                })(
                  <div>
                    <Switch defaultChecked={dimension.isEnabled}  checkedChildren={<Icon type="check"/>} unCheckedChildren={<Icon type="cross" />} onChange={this.switchChange}/>
                    <span className="enabled-type" style={{marginLeft:20,width:100}}>{ dimension.isEnabled ? formatMessage({id:"common.status.enable"}) : formatMessage({id:"common.status.disable"}) }</span>
                  </div>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={30}>
            <Col span={20}>
             <FormItem {...formItemLayout} label={formatMessage({id:"structure.dimensionCode"})} colon={true}>
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
                    single={true}
                    labelKey="dimensionCode"
                    valueKey="dimensionId"
                    selectorItem={dimensionSelectorItem}
                    listExtraParams={{structureId: this.props.params.id, setOfBooksId: this.props.company.setOfBooksId}}
                    onChange={this.handleDimensionCode}/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={30}>
            <Col span={20}>
              <FormItem {...formItemLayout} label={formatMessage({id:"structure.dimensionName"})} colon={true}>
                {getFieldDecorator('dimensionName', {
                  initialValue: dimension.dimensionName
                })(
                  <Input disabled/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={30}>
            <Col span={20}>
              <FormItem {...formItemLayout} label={formatMessage({id:"structure.layoutPosition"})} colon={true}>
                {getFieldDecorator('layoutPosition', {
                  initialValue: dimension.layoutPosition,
                  rules: [{
                    required: true, message: formatMessage({id:"common.please.select"})
                  }],
                })(
                  <Select disabled placeholder={formatMessage({id:"common.please.enter"})}>
                    {options}
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={30}>
            <Col span={20}>
              <FormItem {...formItemLayout} label={formatMessage({id:"structure.layoutPriority"})} colon={true}>
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
            </Col>
          </Row>
          <Row gutter={30}>
            <Col span={20}>
              <FormItem {...formItemLayout} label={formatMessage({id:"structure.defaultDimValueCode"})} colon={true}>
                {getFieldDecorator('defaultDimensionCode', {
                  initialValue: dimension.defaultDimensionValue
                })(
                  <Chooser
                    placeholder={formatMessage({id:"common.please.select"})}
                    single={true}
                    labelKey="defaultDimValueCode"
                    valueKey="defaultDimValueId"
                    selectorItem={selectorItem}
                    listExtraParams={extraParams}
                    onChange={this.handleDimensionValue}/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={30}>
            <Col span={20}>
              <FormItem {...formItemLayout} label={formatMessage({id:"structure.defaultDimValueName"})} colon={true}>
                {getFieldDecorator('defaultDimValueName', {
                  initialValue: dimension.defaultDimValueName
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
  return {
    organization: state.login.organization,
    company: state.login.company,
  }
}

const WrappedNewDimension = Form.create()(NewDimension);

export default connect(mapStateToProps)(injectIntl(WrappedNewDimension));
