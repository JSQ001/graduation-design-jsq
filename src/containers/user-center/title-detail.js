import React  from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import 'styles/title-center/generator.scss'

import httpFetch from 'share/httpFetch'
import Chooser from 'components/chooser'
import GeneratorEditor from 'containers/title-center/generator-editor'


import { Form, Row, Col, Input, Button, Icon, DatePicker, Radio, Checkbox, Select, Switch, Spin } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;

class Generator extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      showGeneratorEditorFlag: false,
      editMode: false,
      title:'新建题目',
      security: {},
      layout: {},
      forms: [],
      buttons: [],
      rules: {},
      generatedItem: {}
    }
  }

  componentWillMount(){
    this.setState(JSON.parse(this.props.json));
  }

  componentWillReceiveProps(nextProps){
    console.log(nextProps)
    this.setState(JSON.parse(nextProps.json))
    if(JSON.parse(nextProps.json).security.id !== this.state.security.id)
      this.setState(JSON.parse(nextProps.json))
  }

  getOptions = (item) => {
    if(item.options.length === 0 || (item.options.length === 1 && item.options[0].temp)){
      let url = item.getUrl;
      if(item.method === 'get' && item.getParams){
        url += '?';
        let keys = Object.keys(item.getParams);
        keys.map(paramName => {
          url += `&${paramName}=${item.getParams[paramName]}`
        })
      }
      httpFetch[item.method](url, item.getParams).then((res) => {
        let options = [];
        res.data.map(data => {
          options.push({label: item.labelRule ? this.formatLabel(data, item.labelRule) : data[item.labelKey], value: data[item.valueKey]})
        });
        let forms = this.state.forms;
        forms = forms.map(form => {
          if(form.id === item.id){
            form.options = options;
            form.fetched = true;
          }
          if(form.type === 'items')
            form.items.map(subForm => {
              if(subForm.id === item.id){
                subForm.fetched = true;
                subForm.options = options;
              }
            });
          return form;
        });
        this.setState({ forms });
      })
    }
  };

  /**
   * select内label的显示方案正则匹配，匹配字符串内 ${*} 样式的文字并替换成对象哪对应字段
   * @param object  需要显示的对象
   * @param rule  label规则
   */
  formatLabel = (object, rule) => {
    let reg = /\${([\S]+?)}/g;
    return rule.replace(reg, (matched, target) => object[target])
  };

  componentDidMount(){
    this.setSelectDefaultValueByList()
  }

  /**
   * 根据传入的list id值设置对应select的默认值
   * @param targets 目标id数组，不传则为全部
   */
  setSelectDefaultValueByList = (targets) => {
    this.state.forms.map(formItem => {
      if(formItem.type === 'select' && typeof formItem.defaultValue === 'object' && (!targets || targets.indexOf(formItem.id) > -1))
        this.setSelectDefaultValue(formItem);
      if(formItem.type === 'items')
        formItem.items.map(item => {
          if(item.type === 'select' && typeof item.defaultValue === 'object' && (!targets || targets.indexOf(formItem.id) > -1))
            this.setSelectDefaultValue(item, formItem.id)
        })
    })
  };

  /**
   * 当select的defaultValue为一个对象 {label , value} 时
   * 需要给select设置一个对应的假的选项，再设置默认value值
   * @param item 需要设置默认值的item
   * @param id 处于items类型内时的items id
   */
  setSelectDefaultValue = (item, id) => {
    let valueWillSet = {};
    let forms = this.state.forms;
    if(id === undefined)
      forms = forms.map(formItem => {
        if(formItem.id === item.id){
          valueWillSet[formItem.id] = (item.defaultValue.value + '');
          if(formItem.options.length === 0 || (formItem.options.length === 1 && formItem.options[0].temp)){
            formItem.options = [];
            formItem.options.push({label: item.defaultValue.label, value: item.defaultValue.value, temp: true})
          }
        }
        return formItem;
      });
    else{
      forms.map(formItem => {
        if(formItem.id === id){
          formItem.items = formItem.items.map(subItem => {
            if(subItem.id === item.id){
              valueWillSet[subItem.id] = subItem.defaultValue.value + '';
              if(subItem.options.length === 0 || (subItem.options.length === 1 && subItem.options[0].temp)){
                subItem.options = [];
                subItem.options.push({label: subItem.defaultValue.label, value: subItem.defaultValue.value, temp: true})
              }
            }
            return subItem;
          });
        }
      })
    }
    this.setState({ forms }, () => {
      this.props.form.setFieldsValue(valueWillSet);
    });
  };

  /**
   * 根据forms项渲染对应的表单项
   * @param item
   * @return {XML}
   */
  renderFormItem = (item) => {
    const { formatMessage } = this.props.intl;
    const { layout } = this.state;
    switch(item.type) {
      case 'plain': {
        return <span className="ant-form-text">{item.defaultValue}</span>
      }
      //输入组件
      case 'input': {
        return <Input placeholder={formatMessage({id: 'common.please.enter'})}
                      disabled={item.disabled}/>
      }
      //选择组件
      case 'select':{
        if(!item.options)
          item.options = [];
        return (
          <Select placeholder={formatMessage({id: 'common.please.select'})}
                  allowClear
                  notFoundContent={item.fetched ? null : <Spin size="small" />}
                  disabled={item.disabled}
                  onFocus={item.getUrl ? () => this.getOptions(item) : () => {}}>
            {item.options.map((option)=>{
              return <Option key={option.value}>{option.label}</Option>
            })}
          </Select>
        )
      }
      //日期组件
      case 'date':{
        return <DatePicker format="YYYY-MM-DD" disabled={item.disabled}/>
      }
      //单选组件
      case 'radio':{
        return  (
          <RadioGroup disabled={item.disabled}>
            {item.options.map((option)=>{
              return <Radio value={option.value} key={option.value}>{option.label}</Radio>
            })}
          </RadioGroup>
        )
      }
      //选择框
      case 'checkbox':{
        return <CheckboxGroup options={item.options} disabled={item.disabled}/>
      }
      //switch状态切换组件
      case 'switch':{
        return <Switch checkedChildren={<Icon type="check"/>}
                       unCheckedChildren={<Icon type="cross" />}
                       disabled={item.disabled}/>
      }
      //弹出框列表选择组件
      case 'list':{
        return <Chooser placeholder={item.placeholder ? item.placeholder : formatMessage({id: 'common.please.select'}) }
                        disabled={item.disabled}
                        type={item.listType}
                        labelKey={item.labelKey}
                        valueKey={item.valueKey}
                        listExtraParams={item.listExtraParams}
                        selectorItem={item.selectorItem}
                        single={item.single}/>
      }
      //同一单元格下多个表单项组件
      case 'items':{
        return (
          <Row gutter={10} key={item.id} type="flex" align={layout.align} justify={layout.justify}>
            {item.items.map(formItem => {
              const formItemLayout = {
                labelCol: layout.labelCol,
                wrapperCol: layout.wrapperCol
              };
              return (
                <Col span={parseInt(24 / item.items.length)} key={formItem.id}>
                  <FormItem {...formItemLayout} label={formItem.label}>
                    {this.props.form.getFieldDecorator(formItem.id, {
                      initialValue: (formItem.type === 'select' && typeof formItem.defaultValue === 'object') ? undefined : formItem.defaultValue,
                      rules: [{
                        required: formItem.isRequired,
                        message: this.props.intl.formatMessage({id: "common.can.not.be.empty"}, {name: formItem.label}),  //name 不可为空
                      }]
                    })(
                      this.renderFormItem(formItem)
                    )}
                  </FormItem>
                </Col>
              )}
            )}
          </Row>
        )
      }
    }
  };

  showEditor = (item) => {
    this.state.editMode && this.setState({showGeneratorEditorFlag : true, generatedItem: item})
  };

  //渲染表单组
  renderFields = () => {
    const { getFieldDecorator } = this.props.form;
    const { layout, forms, editMode } = this.state;
    const formItemLayout = {
      labelCol: layout.labelCol,
      wrapperCol: layout.wrapperCol
    };
    const children = [];
    console.log(forms)
    forms.map(item => {
      children.push(
        <Col span={layout.span} key={item.id}>
            <div className= 'form-item'>
              {
                <FormItem {...formItemLayout} label= {item.titleNumber}>
                  {getFieldDecorator(item.id, {
                    valuePropName: item.type === 'switch' ? 'checked' : 'value',
                    initialValue: item.defaultValue,
                    rules: [{
                      required: item.isRequired,
                      message: this.props.intl.formatMessage({id: "common.can.not.be.empty"}, {name: item.label}),  //name 不可为空
                    }]
                  })(
                    <div>
                      <b style={{marginLeft:10}}>{item.title}</b>
                      <div>
                        {item.type=='select'?
                          <RadioGroup value={item.defaultValue}>
                            {item.options.map((option)=>{
                              return <Radio value={option.value} key={option.value}>{option.label}</Radio>
                            })}
                          </RadioGroup>
                          : null
                        }
                      </div>
                    </div>

                  )}
                </FormItem>}
            </div>
        </Col>
      );
    });
    return children;
  };

  handleClickButton = (button) => {
    switch(button.type){
      case 'submit':{
        this.props.form.validateFieldsAndScroll(button.target, (err, values) => {
          if(!err){
            console.log(values)
          }
        });
        break;
      }
      case 'clear':{
        this.props.form.resetFields(button.target);
        this.setSelectDefaultValueByList(button.target);
        break;
      }
      case 'set':{
        break;
      }
    }
  };

  //渲染按钮组
  renderButtons = () => {
    const { buttons, layout, editMode } = this.state;
    let margin = layout.buttons === 'right' ? { marginLeft: layout.buttonsMargin } : { marginRight: layout.buttonsMargin };
    const operate = [];
    buttons.map(button => {
      operate.push(
        <span className={editMode ? "form-item edit-item edit-button-item" : 'form-item'} key={button.id}>
          <div className="edit-operate">
            <div>
              <Button shape="circle" icon="setting" onClick={() => this.showEditor(button)} ghost style={{marginRight: 10}}/>
              <Button shape="circle" icon="delete" ghost/>
            </div>
          </div>
          <Button type={button.surface} style={margin} key={button.id} onClick={() => this.handleClickButton(button)}
                  htmlType={ button.type === 'submit' ? 'submit' : 'button' }>{button.text}</Button>
        </span>
      )
    });
    return operate;
  };

  render(){
    const { security, layout, forms, buttons, rules, showGeneratorEditorFlag, generatedItem, editMode,title } = this.state;
    return(
      <Row type="flex" align="top" justify="center">
        <Form
          style={{ width: layout.width }}
          className="generator"
        >
          <Row gutter={layout.gutter} type="flex" align={layout.align} justify={layout.justify}>
            {this.renderFields()}
          </Row>
          <Row>
            <Col span={24} style={{ textAlign: layout.buttons }}>
              {this.renderButtons()}
            </Col>
          </Row>
        </Form>
      </Row>
    )
  }
}

function mapStateToProps(state) {
  return {}
}

Generator.propTypes = {
  json: React.PropTypes.string.isRequired,  //页面所需的JSON字符串
  trigger: React.PropTypes.func,  //页面传递的触发方法
  editMode: React.PropTypes.bool
};

const WrappedGenerator = Form.create()(injectIntl(Generator));

export default connect(mapStateToProps)(injectIntl(WrappedGenerator));
