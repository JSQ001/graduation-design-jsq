import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { Button, Form, Row, Col, Input, Select, DatePicker, Switch, Icon, Table, Popconfirm } from 'antd'
const FormItem = Form.Item;

import debounce from 'lodash.debounce';
import Chooser from 'components/chooser'

import 'styles/budget/budget-balance/budget-balance.scss'
import httpFetch from 'share/httpFetch'

class BudgetBalance extends React.Component {
  constructor(props) {
    super(props);
    const { formatMessage } = this.props.intl;
    this.state = {
      params: [],
      columns: [
        {title: '参数类型', dataIndex: 'type', width: '10%', render: (text, record, index) => this.renderColumns(index, 'type')},
        {title: '参数', dataIndex: 'params', width: '40%', render: (text, record, index) => this.renderColumns(index, 'params')},
        {title: '参数值', dataIndex: 'value', width: '40%', render: (text, record, index) => this.renderColumns(index, 'value')},
        {title: '类型', dataIndex: 'operation', width: '10%', render: (text, record, index) => (
          <span>
            <Popconfirm onConfirm={(e) => this.deleteItem(e, index)} title={formatMessage({id:"budget.are.you.sure.to.delete.rule"}, {controlRule: ''})}>{/* 你确定要删除organizationName吗 */}
              <a href="#" onClick={(e) => {e.preventDefault();e.stopPropagation();}}>{formatMessage({id: "common.delete"})}</a>
            </Popconfirm>
          </span>)}
      ],
      searchForm: [
        {type: 'list', id:'company', label: '公司', listType: 'company',isRequired: true, labelKey: 'companyName', valueKey: 'companyCode'},
        {type: 'select', id:'version', label: '版本', isRequired: true, options: []},
        {type: 'select', id:'budgetStructure', label: '预算表', isRequired: true, options: []},
        {type: 'select', id:'budgetScenarios', label: '预算场景', isRequired: true, options: []},
        {type: 'select', id:'year', label: '年度', isRequired: true, options: []},
        {type: 'items', id: 'dateRange', items: [
          {type: 'date', id: 'dateFrom', label: '期间从', isRequired: true},
          {type: 'date', id: 'dateTo', label: '期间到'}
        ]},
        {type: 'switch', id:'total', label: '期间汇总', isRequired: true, defaultValue: false},
        {type: 'items', id: 'seasonRange', items: [
          {type: 'select', id: 'seasonFrom', label: '季度从', isRequired: true, options: []},
          {type: 'select', id: 'seasonTo', label: '季度到', options: []}
        ]},
        {type: 'select', id:'type', label: '金额/数量', isRequired: true, options: []}
      ],
      typeOptions: []
    };
    this.setOptionsToFormItem = debounce(this.setOptionsToFormItem, 250);
  }

  renderColumns = (index, dataIndex) => {
    switch(dataIndex){
      case 'type':{
        return (
          <Select placeholder={this.props.intl.formatMessage({id: 'common.please.select'})}>
            {this.state.typeOptions.map((option)=>{
              return <Option key={option.value}>{option.label}</Option>
            })}
          </Select>
        );
      }
      case 'params':{
        return <Chooser/>;
      }
      case 'value':{
        return <Chooser/>;
      }
    }
  };

  deleteItem = (e, index) => {
    let { params } = this.state;
    params.splice(index, 1);
    this.setState({ params });
  };

  handleNew = () => {
    let newParams = {type: '', params: '', value: ''};
    let { params } = this.state;
    params.push(newParams);
    this.setState({ params });
  };

  search = (e) => {
    e.preventDefault();
    let values = this.props.form.getFieldsValue();
    for(let id in values){
      this.state.searchForm.map(item => {
        if(item.id === id){
          if(item.type === 'multiple'){
            values[id].map(value => {
              value.value = JSON.parse(value.key);
              value.key = value.value[item.valueKey];
              delete value.title;
              return value
            })
          }
          if(item.type === 'combobox'){
            if(values[id]){
              values[id].value = JSON.parse(values[id].key);
              values[id].key = values[id].value[item.valueKey];
              delete values[id].title;
            }
          }
        }
      });
    }
    console.log(values);
  };

  clear = () => {
    this.props.form.resetFields();
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
          options.push({label: data[item.labelKey], key: data[item.valueKey], value: data})
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
        return <Input placeholder={this.props.intl.formatMessage({id: 'common.please.enter'})} onChange={handle} disabled={item.disabled}/>
      }
      //选择组件
      case 'select':{
        return (
          <Select placeholder={this.props.intl.formatMessage({id: 'common.please.select'})} onChange={handle} disabled={item.disabled}>
            {item.options.map((option)=>{
              return <Option key={option.value}>{option.label}</Option>
            })}
          </Select>
        )
      }
      //日期组件
      case 'date':{
        return <DatePicker format="YYYY-MM-DD" onChange={handle} disabled={item.disabled}/>
      }
      case 'switch':{
        return <Switch defaultChecked={item.defaultValue} checkedChildren={<Icon type="check"/>} unCheckedChildren={<Icon type="cross" />} onChange={handle} disabled={item.disabled}/>
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
          disabled={item.disabled}
        >
          {item.options.map((option)=>{
            return <Option key={option.key} value={JSON.stringify(option.value)}>{option.label}</Option>
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
          disabled={item.disabled}
        >
          {item.options.map((option)=>{
            return <Option key={option.key} value={JSON.stringify(option.value)}>{option.label}</Option>
          })}
        </Select>
      }
      //弹出框列表选择组件
      case 'list':{
        return <Chooser placeholder={item.placeholder}
                        disabled={item.disabled}
                        type={item.listType}
                        labelKey={item.labelKey}
                        valueKey={item.labelKey}
                        listExtraParams={item.listExtraParams}
                        selectorItem={item.selectorItem}/>
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
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {};
    const children = [];
    this.state.searchForm.map((item, i)=>{
      children.push(
        <Col span={8} key={item.id}>
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
    const { params, columns } = this.state;
    return (
      <div className="budget-balance">

        <Form
          className="ant-advanced-search-form"
          onSubmit={this.search}
        >
          <div className="base-condition">
            <div className="base-condition-title">基本条件</div>
            <Row gutter={40} className="base-condition-content">{this.getFields()}</Row>
          </div>
          <div className="footer-operate">
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{ marginLeft: 10, marginRight: 20 }}>重置</Button>
            <Button style={{ marginRight: 10}}>保存方案</Button>
            <Button>应用现有方案</Button>
          </div>
          <div className="table-header">
            <div className="table-header-title">查询维度</div>
            <div className="table-header-buttons">
              <Button onClick={this.handleNew}>添 加</Button>
            </div>
          </div>
          <Table columns={columns}
                 dataSource={params}
                 bordered
                 size="middle"/>
        </Form>
      </div>
    )
  }

}

function mapStateToProps() {
  return {}
}

const WrappedBudgetBalance = Form.create()(BudgetBalance);

export default connect(mapStateToProps)(injectIntl(WrappedBudgetBalance));
