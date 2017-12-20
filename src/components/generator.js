import React  from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import 'styles/components/gennerator.scss'

import httpFetch from 'share/httpFetch'

import { Form, Row, Col, Input, Button, Icon, DatePicker, Radio, Checkbox, Select, Switch, Cascader, Spin } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;

/**
 * 页面生成器组件，模式如下：
 * 1、初始页面为空白页面，每一个页面保存为一个JSON文件，用JSON文件进行页面渲染
 * 2、（待定）初始页面为有内容的页面，传入JSON配置项控制页面内容渲染结果
 *
 * 目标：消除过多profile，PaaS模式以减少售前的工作量
 * 细分：
 * 1、页面所有表单项目可配置：标题、类型、数据内容、是否显示、接口字段名称、是否必输、默认值、联动效果（配置在JSON内或传递出页面方法待定）
 * 2、页面基础项目可配置：页面标题、操作按钮及对应的是否显示与接口方法调用（配置在JSON内或传递出页面方法待定）
 * 3、页面可进入编辑模式，可修改对应项目表单项标题、是否显示、必输、接口等基础值，可修改页面基础项目标题、按钮等配置，保存后形成新的JSON
 *
 * JSON文件包括：
 * 1、页面基础与安全security: 统一存放页面属性与安全性问题，如更新后的hash或时间戳的存放与是否开启正则字段匹配进行字段强筛选等等
 * 2、表单布局layout: 以 ant-design 的栅栏模式为基础，可配置对应Row的gutter、Col的Span、FormItem的layout
 * 3、表单内容forms: 以 ant-design 的一套表单控件为基础，根据不同的JSON生成不同的组件与对应的属性
 * 4、操作内容buttons: 页面的操作回执以按钮的形式触发，配置对应的按钮布局、按钮事件、异常处理
 * 5、表单规则rules: 最终提交的数据是否满足具体规则，如范围、长度、数据接口匹配等问题，在触发后进行规则认定
 *
 * @param security 属性与安全
 * @requires key: 页面的唯一标识
 * @requires hash: 版本的唯一标识，高级模式后变更此值，如有变更则重新渲染页面
 */
class Generator extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      editMode: false,
      security: {},
      layout: {},
      forms: [],
      buttons: {},
      rules: {}
    }
  }

  componentWillMount(){
    this.setState(this.props.json);
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.json.security.id !== this.state.security.id)
      this.setState(nextProps.json)
  }

  /**
   * 给select增加options
   * select可能需要的参数
   * @params id: 对应的表单id
   * @params options: 传入的select选项，如果有则不触发onFocus
   * @params getUrl: 如果选项是接口调用的，则次为接口地址
   * @params method: 接口的请求方法 get/post
   * @params optionKey: 接口请求成功后的数组字段，支持a.b.c的形式
   * @params TODO labelKey: Select内选项的显示字段名，label的渲染字段或模式
   * @params valueKey: Select内选项的数据字段名
   */
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
          //TODO: label渲染模式
          options.push({label: data[item.labelKey], value: data[item.valueKey], data: data})
        });
        let searchForm = this.state.searchForm;
        searchForm = searchForm.map(searchItem => {
          if(searchItem.id === item.id)
            searchItem.options = options;
          if(searchItem.type === 'items')
            searchItem.items.map(subItem => {
              if(subItem.id === item.id)
                subItem.options = options;
            });
          return searchItem;
        });
        this.setState({ searchForm });
      })
    }
  };


  renderFormItem = (item) => {
    const { formatMessage } = this.props.intl;
    switch(item.type) {
      //输入组件
      case 'input': {
        return <Input placeholder={formatMessage({id: 'common.please.enter'})}
                      disabled={item.disabled}/>
      }
      //选择组件
      case 'select':{
        if(!item.options)
          item.options = [];
        //TODO: fetching 下的Spin loading图标
        // if(item.getUrl && !item.fetching && item.options.length === 0)
        //   item.fetching = true;
        // notFoundContent={item.fetching ? <Spin size="small" /> : null}
        return (
          <Select placeholder={formatMessage({id: 'common.please.select'})}
                  allowClear
                  disabled={item.disabled}
                  onFocus={item.getUrl ? () => this.getOptions(item) : () => {}}>
            {item.options.map((option)=>{
              return <Option key={option.key}>{option.label}</Option>
            })}
          </Select>
        )
      }
      //同一单元格下多个表单项组件
      case 'items':{
        return (
          <Row gutter={10} key={item.id}>
            {item.items.map(searchItem => {
              return (
                <Col span={parseInt(24 / item.items.length)} key={searchItem.id}>
                  <FormItem label={searchItem.label}>
                    {this.props.form.getFieldDecorator(searchItem.id, {
                      initialValue: searchItem.defaultValue,
                      rules: [{
                        required: searchItem.isRequired,
                        message: this.props.intl.formatMessage({id: "common.can.not.be.empty"}, {name: searchItem.label}),  //name 不可为空
                      }]
                    })(
                      this.renderFormItem(searchItem)
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

  renderFields = () => {
    const { getFieldDecorator } = this.props.form;
    const { layout, forms } = this.state;
    const formItemLayout = {
      labelCol: layout.labelCol,
      wrapperCol: layout.wrapperCol
    };
    const children = [];
    forms.map(item => {
      children.push(
        <Col span={layout.span} key={item.id}>
          {item.type === 'items' ? this.renderFormItem(item) :
            <FormItem {...formItemLayout} label={item.label}>
              {getFieldDecorator(item.id, {
                valuePropName: item.type === 'switch' ? 'checked' : 'value',
                initialValue: item.defaultValue,
                rules: [{
                  required: item.isRequired,
                  message: this.props.intl.formatMessage({id: "common.can.not.be.empty"}, {name: item.label}),  //name 不可为空
                }]
              })(
                this.renderFormItem(item)
              )}
            </FormItem>
          }
        </Col>
      );
    });
    return children;
  };

  render(){
    const { security, layout, forms, buttons, rules } = this.state;
    return(
      <Row type="flex" align="top" justify="center">
        <Form
          style={{ width: layout.width }}
          className="generator"
          onSubmit={this.handleSearch}
        >
          <Row gutter={layout.gutter} type="flex" align={layout.align} justify={layout.justify}>
            {this.renderFields()}
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
  trigger: React.PropTypes.func  //页面传递的触发方法
};

const WrappedGenerator = Form.create()(injectIntl(Generator));

export default connect(mapStateToProps)(injectIntl(WrappedGenerator));
