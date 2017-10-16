import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { Button, Form, Row, Col, Input, Select, DatePicker, Switch, Icon, Table, Popconfirm } from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;

import debounce from 'lodash.debounce';
import Chooser from 'components/chooser'
import SlideFrame from 'components/slide-frame'
import BudgetBalanceScheme from 'containers/budget/budget-balance/budget-balance-scheme'
import menuRoute from 'share/menuRoute'

import 'styles/budget/budget-balance/budget-balance.scss'
import httpFetch from 'share/httpFetch'
import config from 'config'

class BudgetBalance extends React.Component {
  constructor(props) {
    super(props);
    const { formatMessage } = this.props.intl;
    this.state = {
      budgetBalanceResult: menuRoute.getRouteItem('budget-balance-result', 'key'),
      showSlideFrame: false,
      params: [],
      columns: [
        {title: '参数类型', dataIndex: 'type', width: '10%', render: (text, record, index) => this.renderColumns(index, 'type')},
        {title: '参数', dataIndex: 'params', width: '40%', render: (text, record, index) => this.renderColumns(index, 'params')},
        {title: '参数值', dataIndex: 'value', width: '40%', render: (text, record, index) => this.renderColumns(index, 'value')},
        {title: '类型', dataIndex: 'operation', width: '10%', render: (text, record, index) => (
          <span>
            <Popconfirm onConfirm={(e) => this.deleteItem(e, index)} title="你确定要删除这条数据吗?">
              <a href="#" onClick={(e) => {e.preventDefault();e.stopPropagation();}}>{formatMessage({id: "common.delete"})}</a>
            </Popconfirm>
          </span>)}
      ],
      searchForm: [],
      typeOptions: [],
      organizationId: '908139656192442369', //TODO:默认组织ID
      searchParams: {
        periodSummaryFlag: false,
        amountQuarterFlag: '',
        yearLimit: '',
        quarterLowerLimit: '',
        quarterUpperLimit: '',
        periodLowerLimit: '',
        periodUpperLimit: '',
        queryLineList: []
      }
    };
    this.setOptionsToFormItem = debounce(this.setOptionsToFormItem, 250);
  }

  //TODO:进入该页面时或登录时获取默认组织ID放入state
  componentWillMount(){
    let searchForm = [
      {type: 'list', id:'companyId', label: '公司', listType: 'company',isRequired: true, labelKey: 'name', valueKey: 'id'},
      {type: 'select', id:'version', label: '预算版本', isRequired: true, options: [], method: 'get',
        getUrl: `${config.budgetUrl}/api/budget/versions/queryAll`, getParams: {organizationId: this.state.organizationId},
        labelKey: 'versionName', valueKey: 'versionCode'},
      {type: 'select', id:'budgetStructure', label: '预算表', isRequired: true, options: [], method: 'get',
        getUrl: `${config.budgetUrl}/api/budget/structures/queryAll`, getParams: {organizationId: this.state.organizationId},
        labelKey: 'structureName', valueKey: 'structureCode'},
      {type: 'select', id:'budgetScenarios', label: '预算场景', isRequired: true, options: [], method: 'get',
        getUrl: `${config.budgetUrl}/api/budget/scenarios/queryAll`, getParams: {organizationId: this.state.organizationId},
        labelKey: 'scenariosName', valueKey: 'scenariosCode'},
      {type: 'select', id:'yearLimit', label: '年度', isRequired: true, options: []},
      {type: 'items', id: 'dateRange', items: [
        {type: 'date', id: 'periodLowerLimit', label: '期间从', isRequired: true},
        {type: 'date', id: 'periodUpperLimit', label: '期间到'}
      ]},
      {type: 'select', id:'periodSummaryFlag', label: '期间汇总', isRequired: true, options: []},
      {type: 'items', id: 'seasonRange', items: [
        {type: 'select', id: 'quarterLowerLimit', label: '季度从', isRequired: true, options: [{key: '1', label: '2'}]},
        {type: 'select', id: 'quarterUpperLimit', label: '季度到', options: []}
      ]},
      {type: 'select', id:'amountQuarterFlag', label: '金额/数量', isRequired: true, options: []}
    ];
    this.setState({ searchForm });
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
    let searchForm = [].concat(this.state.searchForm);
    searchForm.map(item => {
      if(values[item.id] && item.entity){
        if(item.type === 'combobox' || item.type === 'select'){
          values[item.id] = JSON.parse(values[item.id].title)
        } else if(item.type === 'multiple') {
          let result = [];
          values[item.id].map(value => {
            result.push(JSON.parse(value.title));
          });
          values[item.id] = result;
        }
      }
    });
    console.log(values)
    // this.context.router.push(this.state.budgetBalanceResult.url);
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

  //给select增加options
  getOptions = (item) => {
    if(item.options.length === 0){
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
          <Select placeholder={this.props.intl.formatMessage({id: 'common.please.select'})}
                  onChange={handle}
                  disabled={item.disabled}
                  labelInValue={!!item.entity}
                  onFocus={item.getUrl ? () => this.getOptions(item) : () => {}}>
            {item.options.map((option)=>{
              return <Option key={option.key} title={JSON.stringify(option.value)}>{option.label}</Option>
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
          labelInValue={!!item.entity}
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
            return <Option key={option.key} title={JSON.stringify(option.value)}>{option.label}</Option>
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
    const { params, columns, showSlideFrame } = this.state;
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
            <Button onClick={() => {this.setState({showSlideFrame : true})}}>应用现有方案</Button>
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
        <SlideFrame content={BudgetBalanceScheme}
                    title="我的查询方案"
                    show={showSlideFrame}
                    onClose={() => this.setState({showSlideFrame : false})}/>
      </div>
    )
  }

}

function mapStateToProps(state) {
  return {
    company: state.login.company
  }
}

BudgetBalance.contextTypes = {
  router: React.PropTypes.object
};


const WrappedBudgetBalance = Form.create()(BudgetBalance);

export default connect(mapStateToProps)(injectIntl(WrappedBudgetBalance));
