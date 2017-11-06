/**
 * Created by zaranengap on 2017/7/5.
 */
import React from 'react'
import { injectIntl, FormattedMessage } from 'react-intl';

import { Form, Row, Col, Input, Button, Icon, DatePicker,Radio, Checkbox, Select, Switch  } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;

import Chooser from 'components/chooser'
import moment from 'moment'

import debounce from 'lodash.debounce';
import httpFetch from 'share/httpFetch'

import 'styles/components/search-area.scss'

/**
 * 搜索区域组件
 * @params searchForm   渲染表单所需要的配置项，见底端注释
 * @params submitHandle  点击搜索时的回调
 * @params clearHandle  点击重置时的回调
 * @params eventHandle  表单项onChange事件，于searchForm内的event有联动，见底端注释
 * TODO: 选项render函数、searchUrl和getUrl的method区分
 */
class SearchArea extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      expand: false,
      searchForm: []
    };
    this.setOptionsToFormItem = debounce(this.setOptionsToFormItem, 250);
  }

  componentWillMount(){
    this.setState({ searchForm: this.props.searchForm })
  };

  componentWillReceiveProps = (nextProps) => {
    this.setState({ searchForm: nextProps.searchForm })
  };

  //收起下拉
  toggle = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand });
  };

  /**
   * 搜索区域点击确认时的事件
   * 返回为form包装形成的格式，
   * 其中如果type为 combobox、multiple、list时返回的单项格式为
   * {
   *   label: '',  //数据显示值，与传入的labelKey挂钩
   *   key: '',    //数据需要值，与传入的valueKey挂钩
   *   value: {}   //数据整体值
   * }
   * @param e
   */
  handleSearch = (e) => {
    e.preventDefault();
    let values = this.props.form.getFieldsValue();
    let searchForm = [].concat(this.state.searchForm);
    searchForm.map(item => {

      if(values[item.id] && item.entity) {
        if (item.type === 'combobox' || item.type === 'select' || item.type === 'value_list') {
          values[item.id] = JSON.parse(values[item.id].title);
        } else if (item.type === 'multiple') {
          let result = [];
          values[item.id].map(value => {
            result.push(JSON.parse(value.title));
          });
          values[item.id] = result;
        }
      }
      if(item.type === 'list' && values[item.id]){
        if(item.entity){
          let result = [];
          values[item.id].map(value => {
            result.push(value);
          });
          values[item.id] = result;
        } else {
          let result = [];
          values[item.id].map(value => {
            result.push(value[item.valueKey]);
          });
          values[item.id] = result;
        }
      }
    });
    this.props.submitHandle(values)
  };

  //点击重置的事件，清空值为初始值
  handleReset = () => {
    this.props.form.resetFields();
    this.props.clearHandle();
  };

  //区域点击事件，返回事件给父级进行处理
  handleEvent = (e, event) => {
    this.props.eventHandle(event, e ? (e.target? e.target.value : e) : null)
  };

  //给select增加options
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

  //得到值列表的值增加options
  getValueListOptions = (item) => {
    if(item.options.length === 0 || (item.options.length === 1 && item.options[0].temp)){
      this.getSystemValueList(item.valueListCode).then(res => {
        let options = [];
        res.data.values.map(data => {
          options.push({label: data.messageKey, value: data.code, data: data})
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

  //根据接口返回数据重新设置options
  setOptionsToFormItem = (item, url, key) => {
    let params = {};
    if(key){
      params[item.searchKey] = key;
      if(item.method === 'get')
        url += `?${item.searchKey}=${key}`;
    }
    if( (key !== undefined && key !== '') || key === undefined){
      httpFetch[item.method](url, params).then((res) => {
        let options = [];
        res.data.map(data => {
          options.push({label: data[item.labelKey], value: data[item.valueKey], data: data})
        });
        let searchForm = this.state.searchForm;
        searchForm = searchForm.map(searchItem => {
          if(searchItem.id === item.id)
            searchItem.options = options;
          return searchItem;
        });
        this.setState({ searchForm });
      })
    }
  };

  /**
   * 如果是select的设置值，如果options内没有值时应先增加一个默认的对应option
   * @param item  对应searchForm的表单项
   * @param value 需要设置的值 {label: '', value: ''}
   * @param index 当type为items时的序列
   */
  onSetSelectValue = (item, value, index) => {
    let valueWillSet = {};
    let searchForm = this.state.searchForm;
    if(index === undefined)
      searchForm = searchForm.map(searchItem => {
        if(searchItem.id === item.id){
          valueWillSet[searchItem.id] = value.value + '';
          if(searchItem.options.length === 0 || (searchItem.options.length === 1 && searchItem.options[0].temp)){
            let dataOption = {};
            dataOption[item.valueKey] = value.value;
            dataOption[item.labelKey] = value.label;
            searchItem.options.push({label: value.label, key: value.value, value: dataOption, temp: true})
          }
        }
        return searchItem;
      });
    else
      searchForm[index].items = searchForm[index].items.map(searchItem => {
        if(searchItem.id === item.id){
          valueWillSet[searchItem.id] = value.value + '';
          if(searchItem.options.length === 0 || (searchItem.options.length === 1 && searchItem.options[0].temp)){
            let dataOption = {};
            dataOption[item.valueKey] = value.value;
            dataOption[item.labelKey] = value.label;
            searchItem.options.push({label: value.label, key: value.value, value: dataOption, temp: true})
          }
        }
        return searchItem;
      });
    this.setState({ searchForm }, () => {
      this.props.form.setFieldsValue(valueWillSet);
    });
    let handle = item.event ? (event) => this.handleEvent(event,item.event) : ()=>{};
    handle();
  };

  /**
   * 设置searchForm的值
   * @param options 需要设置的值，与form.setFieldsValue值格式一致
   * input、switch、data、radio、big_radio、checkbox直接传入对应字符串value即可
   * select、value_list 所需的默认值需要哦为 {label: '', value: ''}
   * list 所需格式为包含显示值与数据值的对象数组，根据valueKey与labelKey对应
   * TODO: combobox 与 multiple 模式待开发
   *
   * @example：
   *
   * <SearchArea wrappedComponentRef={(inst) => this.formRef = inst} {...props} />
   *
   * this.formRef._reactInternalInstance._renderedComponent._instance.setValues({
      listId: [{user: '', userOID: ''}, ...],
      selectId: {label: '', value: ''},
      inputId: 'value',
      value_listId: {label: '', value: ''}
    });
   *
   */
  setValues = (options) => {
    Object.keys(options).map(key => {
      let searchForm = this.state.searchForm;
      searchForm.map((searchItem, index) => {
        console.log(options)
        if(searchItem.id === key){
          if((searchItem.type === 'select' || searchItem.type === 'value_list') && typeof options[key] === 'object')
            this.onSetSelectValue(searchItem, options[key]);
          else if(searchItem.type === 'list'){
            let value = {};
            value[key] = options[key];
            this.props.form.setFieldsValue(value)
          } else if(searchItem.type === 'date'){
            let value = {};
            value[key] = moment(options[key]);
            this.props.form.setFieldsValue(value)
          } else {
            let value = {};
            value[key] = options[key] + '';
            this.props.form.setFieldsValue(value)
          }
        } else if(searchItem.type === 'items'){
          searchItem.items.map(subItem => {
            if(subItem.id === key){
              if((subItem.type === 'select' || subItem.type === 'value_list') && typeof options[key] === 'object')
                this.onSetSelectValue(subItem, options[key], index);
              else if(subItem.type === 'list'){
                let value = {};
                value[key] = options[key];
                this.props.form.setFieldsValue(value)
              } else {
                let value = {};
                value[key] = options[key] + '';
                this.props.form.setFieldsValue(value)
              }
            }
          })
        }
      })
    });
  };

  //渲染搜索表单组件
  renderFormItem(item){
    let handle = item.event ? (event) => this.handleEvent(event,item.event) : ()=>{};
    switch(item.type){
      //输入组件
      case 'input':{
        return <Input placeholder={this.props.intl.formatMessage({id: 'common.please.enter'})} onChange={handle} disabled={item.disabled}/>
      }
      //选择组件
      case 'select':{
        return (
          <Select placeholder={this.props.intl.formatMessage({id: 'common.please.select'})}
                  onChange={handle}
                  allowClear
                  disabled={item.disabled}
                  labelInValue={!!item.entity}
                  onFocus={item.getUrl ? () => this.getOptions(item) : () => {}}>
            {item.options.map((option)=>{
              return <Option key={option.value} title={option.data ? JSON.stringify(option.data) : ''}>{option.label}</Option>
            })}
          </Select>
        )
      }
      //值列表选择组件
      case 'value_list':{
        return (
          <Select placeholder={this.props.intl.formatMessage({id: 'common.please.select'})}
                  onChange={handle}
                  allowClear
                  disabled={item.disabled}
                  labelInValue={!!item.entity}
                  onFocus={() => this.getValueListOptions(item)}>
            {item.options.map((option)=>{
              return <Option key={option.value} title={option.data ? JSON.stringify(option.data) : ''}>{option.label}</Option>
            })}
          </Select>
        )
      }
      //日期组件
      case 'date':{
        return <DatePicker format="YYYY-MM-DD" onChange={handle} disabled={item.disabled}/>
      }
      //单选组件
      case 'radio':{
        return  (
          <RadioGroup onChange={handle} disabled={item.disabled}>
            {item.options.map((option)=>{
              return <Radio value={option.value} key={option.value}>{option.label}</Radio>
            })}
          </RadioGroup>
        )
      }
      //单选组件（大）
      case 'big_radio':{
        return (
          <RadioGroup size="large" onChange={handle} disabled={item.disabled}>
            {item.options.map((option)=>{
              return <RadioButton value={option.value} key={option.value}>{option.label}</RadioButton>
            })}
          </RadioGroup>
        )
      }
      //选择框
      case 'checkbox':{
        return <CheckboxGroup options={item.options} onChange={handle} disabled={item.disabled}/>
      }
      //带搜索的选择组件
      case 'combobox':{
        return <Select
          labelInValue={!!item.entity}
          showSearch
          allowClear
          placeholder={item.placeholder}
          filterOption={!item.searchUrl}
          optionFilterProp='children'
          onChange={handle}
          onFocus={item.getUrl ? () => this.setOptionsToFormItem(item, item.getUrl) : () => {}}
          onSearch={item.searchUrl ? (key) => this.setOptionsToFormItem(item, item.searchUrl, key) : () => {}}
          disabled={item.disabled}
        >
          {item.options.map((option)=>{
            return <Option key={option.value} title={option.data ? JSON.stringify(option.data) : ''}>{option.label}</Option>
          })}
        </Select>
      }
      //带搜索的多选组件
      case 'multiple':{
        return <Select
          mode="multiple"
          labelInValue={!!item.entity}
          placeholder={item.placeholder}
          filterOption={!item.searchUrl}
          optionFilterProp='children'
          onChange={handle}
          onFocus={item.getUrl ? () => this.setOptionsToFormItem(item, item.getUrl) : () => {}}
          onSearch={item.searchUrl ? (key) => this.setOptionsToFormItem(item, item.searchUrl, key) : () => {}}
          disabled={item.disabled}
        >
          {item.options.map((option)=>{
            return <Option key={option.value} title={option.data ? JSON.stringify(option.data) : ''}>{option.label}</Option>
          })}
        </Select>
      }
      //弹出框列表选择组件
      case 'list':{
        return <Chooser placeholder={item.placeholder}
                        disabled={item.disabled}
                        type={item.listType}
                        labelKey={item.labelKey}
                        valueKey={item.valueKey}
                        listExtraParams={item.listExtraParams}
                        selectorItem={item.selectorItem}
                        single={item.single}/>
      }
      //switch状态切换组件
      case 'switch':{
        return <Switch defaultChecked={item.defaultValue}
                       checkedChildren={<Icon type="check"/>}
                       unCheckedChildren={<Icon type="cross" />}
                       onChange={handle}
                       disabled={item.disabled}/>
      }
      //同一单元格下多个表单项组件
      case 'items':{
        return (
          <Row gutter={10} key={item.id}>
            {item.items.map(searchItem => {
              return (
                <Col span={parseInt(24 / item.items.length)} key={searchItem.id}>
                  <FormItem label={searchItem.label} colon={false}>
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
  }

  getFields(){
    const count = this.state.expand ? this.state.searchForm.length : this.props.maxLength;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {};
    const children = [];
    this.state.searchForm.map((item, i)=>{
      children.push(
        <Col span={8} key={item.id} style={{ display: i < count ? 'block' : 'none' }}>
          {item.type === 'items' ? this.renderFormItem(item) :
            <FormItem {...formItemLayout} label={item.label} colon={false}>
              {getFieldDecorator(item.id, {
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
  }

  render(){
    return (
      <Form
        className="ant-advanced-search-form common-top-area"
        onSubmit={this.handleSearch}
      >
        <Row gutter={40}>{this.getFields()}</Row>
        <Row>
          <Col span={24} style={{ textAlign: 'right' }}>
            {this.state.searchForm.length > this.props.maxLength ? (
              <a className="toggle-button" onClick={this.toggle}>
                {this.state.expand ? this.props.intl.formatMessage({id: "common.fold"}) : this.props.intl.formatMessage({id: "common.more"})} <Icon type={this.state.expand ? 'up' : 'down'} />
              </a>
            ) : null}
            <Button type="primary" htmlType="submit">{this.props.okText}</Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>{this.props.clearText}</Button>
          </Col>
        </Row>
      </Form>
    )
  }
}

/**
 *
 * @type searchForm 表单列表，如果项数 > maxLength 则自动隐藏多余选项到下拉部分，每一项的格式如下：
 * {
          type: '',                     //必填，类型,为input、select、date、radio、big_radio、checkbox、combobox、multiple, list, items, value_list中的一种
          id: '',                      //必填，表单id，搜索后返回的数据key
          label: '',                  //必填，界面显示名称label
          listType: '',              //可选，当type为list时必填，listSelector的type类型
          listExtraParams: '',      //可选，当type为list时有效，listSelector的extraParams
          disabled: false          //可选，是否可用
          isRequired: false,      //可选，是否必填
          options: [{label: '',  value: ''}],    //可选，如果不为input、date时必填，为该表单选项数组，因为不能下拉刷新，所以如果可以搜索type请选择combobox或multiple，否则一次性传入所有值
          selectorItem: {}      //可选，当type为list时有效，当listType满足不了一些需求时，可以使用次参数传入listSelector的配置项
          event: '',           //可选，自定的点击事件ID，将会在eventHandle回调内返回
          defaultValue: ''    //可选，默认值
          searchUrl: '',      ╲╲可选，当类型为combobox和multiple有效，搜索需要的接口，
          getUrl: '',          ╲╲可选，初始显示的值需要的接口,适用与select、multiple、combobox
          method: '',           ╲╲可选，getUrl接口所需要的接口类型get/post
          searchKey: '',         ╲╲可选，搜索参数名
          labelKey: '',           ╲╲可选，接口返回或list返回的数据内所需要页面options显示名称label的参数名，
          valueKey: ''             ╲╲可选，接口返回或list返回的数据内所需要options值key的参数名
          items:[]                  ╲╲可选，当type为items时必填，type为items时代表在一个单元格内显示多个表单项，数组元素属性与以上一致
          entity: false              ╲╲可选，select、combobox、multiple、list选项下是否返回实体类，如果为true则返回整个选项的对象，否则返回valueKey对应的值
          getParams: {}               ╲╲可选,getUrl所需要的参数
          single: false                ╲╲可选,当type为list时是否为单选
          valueListCode: ''             ╲╲可选，当type为value_list时的值列表coode
        }
 */
SearchArea.propTypes = {
  searchForm: React.PropTypes.array.isRequired,  //传入的表单列表
  submitHandle: React.PropTypes.func.isRequired,  //搜索事件
  eventHandle: React.PropTypes.func,  //表单项点击事件
  clearHandle: React.PropTypes.func,  //重置事件
  okText:  React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.object]),  //左侧ok按钮的文本
  clearText: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.object]),  //右侧重置按钮的文本
  maxLength: React.PropTypes.number,  //搜索区域最大表单数量
};

SearchArea.defaultProps = {
  maxLength: 6,
  eventHandle: () => {},
  okText: <FormattedMessage id='common.search'/>,  //搜索
  clearText: <FormattedMessage id='common.clear'/>  //重置
};

const WrappedSearchArea = Form.create()(injectIntl(SearchArea));

export default WrappedSearchArea;
