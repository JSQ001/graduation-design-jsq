/**
 * Created by zaranengap on 2017/7/5.
 */
import React from 'react'
import { Form, Row, Col, Input, Button, Icon, DatePicker,Radio, Checkbox, Select  } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;

import debounce from 'lodash.debounce';
import httpFetch from 'share/httpFetch'

import '../styles/components/search-area.scss'

/**
 * 搜索区域组件
 * @params searchForm   渲染表单所需要的配置项，见底端注释
 * @params submitHandle  点击搜索时的回调
 * @params clearHandle  点击重置时的回调
 * @params eventHandle  表单项onChange事件，于searchForm内的event有联动，见底端注释
 * TODO: 选项render函数、searchUrl和getUrl的method区分，时间段格式，ListSelector格式
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

  //收起下拉
  toggle = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand });
  };

  //点击搜索时的事件
  handleSearch = (e) => {
    e.preventDefault();
    this.props.submitHandle(this.props.form.getFieldsValue())
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

  setOptionsToFormItem = (item, url, key, handle) => {
    handle && handle();
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
          options.push({label: data[item.labelKey], value: data[item.valueKey]})
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

  //渲染搜索表单组件
  renderFormItem(item){
    let handle = item.event ? (event) => this.handleEvent(event,item.event) : ()=>{};
    switch(item.type){
      //输入组件
      case 'input':{
        return <Input placeholder="请输入" onChange={handle}/>
      }
      //选择组件
      case 'select':{
        return (
          <Select placeholder="请选择" onChange={handle}>
            {item.options.map((option)=>{
              return <Option value={option.value} key={option.value}>{option.label}</Option>
            })}
          </Select>
        )
      }
      //日期组件
      case 'date':{
        return <DatePicker format="YYYY-MM-DD" onChange={handle}/>
      }
      //单选组件
      case 'radio':{
        return  (
          <RadioGroup onChange={handle}>
            {item.options.map((option)=>{
              return <Radio value={option.value} key={option.value}>{option.label}</Radio>
            })}
          </RadioGroup>
        )
      }
      //单选组件（大）
      case 'big_radio':{
        return (
          <RadioGroup size="large" onChange={handle}>
            {item.options.map((option)=>{
              return <RadioButton value={option.value} key={option.value}>{option.label}</RadioButton>
            })}
          </RadioGroup>
        )
      }
      //选择框
      case 'checkbox':{
        return <CheckboxGroup options={item.options} onChange={handle}/>
      }
      //带搜索的选择组件
      case 'combobox':{
        return <Select
          labelInValue
          showSearch
          allowClear
          placeholder={item.placeholder}
          filterOption={!item.searchUrl}
          optionFilterProp='children'
          onFocus={item.getUrl ? () => this.setOptionsToFormItem(item, item.getUrl) : () => {}}
          onSearch={item.searchUrl ? (key) => this.setOptionsToFormItem(item, item.searchUrl, key,  handle) : handle}
        >
          {item.options.map((option)=>{
            return <Option value={option.value} key={option.value}>{option.label}</Option>
          })}
        </Select>
      }
      //带搜索的多选组件
      case 'multiple':{
        return <Select
          mode="multiple"
          labelInValue
          placeholder={item.placeholder}
          filterOption={!item.searchUrl}
          optionFilterProp='children'
          onFocus={item.getUrl ? () => this.setOptionsToFormItem(item, item.getUrl) : () => {}}
          onSearch={item.searchUrl ? (key) => this.setOptionsToFormItem(item, item.searchUrl, key, handle) : handle}
        >
          {item.options.map((option)=>{
            return <Option value={option.value} key={option.value}>{option.label}</Option>
          })}
        </Select>
      }
    }
  }

  getFields(){
    const count = this.state.expand ? this.state.searchForm.length : 6;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {};
    const children = [];
    this.state.searchForm.map((item, i)=>{
      children.push(
        <Col span={8} key={item.id} style={{ display: i < count ? 'block' : 'none' }}>
          <FormItem {...formItemLayout} label={item.label} colon={false}>
            {getFieldDecorator(item.id, {initialValue: item.defaultValue})(
              this.renderFormItem(item)
            )}
          </FormItem>
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
            {this.state.searchForm.length > 6 ? (
              <a className="toggle-button" onClick={this.toggle}>
                {this.state.expand ? '收起' : '更多'} <Icon type={this.state.expand ? 'up' : 'down'} />
              </a>
            ) : null}
            <Button type="primary" htmlType="submit">搜索</Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
              重置
            </Button>
          </Col>
        </Row>
      </Form>
    )
  }
}

/**
 *
 * @type searchForm 表单列表，如果项数 > 6 则自动隐藏多余选项到下拉部分，每一项的格式如下：
 * {
          type: '',    //必填，类型,为input、select、date、radio、big_radio、checkbox、combobox、multiple中的一种
          id: '',      //必填，表单id，搜索后返回的数据key
          label: '',   //必填，界面显示名称label
          options: [{label: '', value: ''}],    //可选，如果不为input、date时必填，为该表单选项数组，因为不能下拉刷新，所以如果可以搜索type请选择combobox或multiple，否则一次性传入所有值
          event: '',          //可选，自定的点击事件ID，将会在eventHandle回调内返回
          defaultValue: ''   //可选，默认值
          searchUrl: '',    //可选，当类型为combobox和multiple有效，搜索需要的接口，
          method: '',      //可选，接口所需要的接口类型get/post
          searchKey: '',  //搜索参数名
          labelKey: '',  //可选，接口返回的数据内所需要页面options显示名称label的参数名
          valueKey: ''  //可选，接口返回的数据内所需要options值value的参数名
        }
 */
SearchArea.propTypes = {
  searchForm: React.PropTypes.array.isRequired,  //传入的表单列表
  submitHandle: React.PropTypes.func.isRequired,  //搜索事件
  eventHandle: React.PropTypes.func,  //表单项点击事件
  clearHandle: React.PropTypes.func  //重置事件
};

SearchArea.defaultProps = {
  eventHandle: () => {}
};

const WrappedSearchArea= Form.create()(SearchArea);

export default WrappedSearchArea;
