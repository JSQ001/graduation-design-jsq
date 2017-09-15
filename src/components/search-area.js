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

import '../styles/components/search-area.scss'

class SearchArea extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      expand: false
    };
  }

  toggle = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand });
  };

  handleSearch = (e) => {
    e.preventDefault();
    this.props.submitHandle(this.props.form.getFieldsValue())
  };

  handleReset = () => {
    this.props.form.resetFields();
    this.props.clearHandle();
  };

  handleEvent = (e, event) => {
    this.props.eventHandle(event, e ? (e.target? e.target.value : e) : null)
  };

  renderFormItem(item){
    let handle = item.event ? (event) => this.handleEvent(event,item.event) : ()=>{};
    switch(item.type){
      case 'input':{
        return <Input placeholder="请输入" onChange={handle}/>
      }
      case 'select':{
        return (
          <Select placeholder="请选择" onChange={handle}>
            {item.options.map((option)=>{
              return <Option value={option.value} key={option.value}>{option.label}</Option>
            })}
          </Select>
        )
      }
      case 'date':{
        return <DatePicker format="YYYY-MM-DD" onChange={handle}/>
      }
      case 'radio':{
        return  (
          <RadioGroup onChange={handle}>
            {item.options.map((option)=>{
              return <Radio value={option.value} key={option.value}>{option.label}</Radio>
            })}
          </RadioGroup>
        )
      }
      case 'big_radio':{
        return (
          <RadioGroup size="large" onChange={handle}>
            {item.options.map((option)=>{
              return <RadioButton value={option.value} key={option.value}>{option.label}</RadioButton>
            })}
          </RadioGroup>
        )
      }
      case 'checkbox':{
        return <CheckboxGroup options={item.options} onChange={handle}/>
      }
      case 'combobox':{
        return <Select
          labelInValue={true}
          showSearch
          allowClear
          placeholder={item.placeholder}
          filterOption={false}
          onSearch={handle}
        >
          {item.options.map((option)=>{
            return <Option value={option.value} key={option.value}>{option.label}</Option>
          })}
        </Select>
      }
      case 'multiple':{
        return <Select
          mode="multiple"
          labelInValue
          placeholder={item.placeholder}
          optionFilterProp={item.needSearch ? false :"children"}
          onFocus={item.needSearch ? ()=>{} : handle}
          onSearch={item.needSearch ? handle : ()=>{}}
        >
          {item.options.map((option)=>{
            return <Option value={option.value} key={option.value}>{option.label}</Option>
          })}
        </Select>
      }
    }
  }

  getFields(){
    const count = this.state.expand ? this.props.searchForm.length : 6;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {};
    const children = [];
    this.props.searchForm.map((item, i)=>{
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
            <a className="toggle-button" onClick={this.toggle}>
              {this.state.expand ? '收起' : '更多'} <Icon type={this.state.expand ? 'up' : 'down'} />
            </a>
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

SearchArea.propTypes = {
  searchForm: React.PropTypes.array.isRequired,
  submitHandle: React.PropTypes.func.isRequired,
  eventHandle: React.PropTypes.func,
  clearHandle: React.PropTypes.func
};

const WrappedSearchArea= Form.create()(SearchArea);

export default WrappedSearchArea;
