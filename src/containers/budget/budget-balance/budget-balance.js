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
      queryLineListTypeOptions: [],
      queryLineListParamOptions: {},
      columns: [
        {title: '参数类型', dataIndex: 'type', width: '20%', render: (text, record, index) => this.renderColumns(index, 'type')},
        {title: '参数', dataIndex: 'params', width: '35%', render: (text, record, index) => this.renderColumns(index, 'params')},
        {title: '参数值', dataIndex: 'value', width: '35%', render: (text, record, index) => this.renderColumns(index, 'value')},
        {title: '类型', dataIndex: 'operation', width: '10%', render: (text, record, index) => (
          <span>
            <Popconfirm onConfirm={(e) => this.deleteItem(e, index)} title="你确定要删除这条数据吗?">
              <a href="#" onClick={(e) => {e.preventDefault();e.stopPropagation();}}>{formatMessage({id: "common.delete"})}</a>
            </Popconfirm>
          </span>)}
      ],
      searchForm: [],
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
      },
      paramsKey: 0,
      paramTypeMap: {
        'BGT_RULE_PARAMETER_BUDGET': 2015,
        'BGT_RULE_PARAMETER_ORG': 2016,
        'BGT_RULE_PARAMETER_DIM': 2017
      }
    };
    this.setOptionsToFormItem = debounce(this.setOptionsToFormItem, 250);
  }

  //TODO:进入该页面时或登录时获取默认组织ID放入state
  componentWillMount(){
    let { queryLineListTypeOptions } = this.state;
    this.getSystemValueList(2012).then(res => {
      queryLineListTypeOptions = [];
      res.data.values.map(data => {
        queryLineListTypeOptions.push({label: data.messageKey, value: data.code})
      });
      this.setState({ queryLineListTypeOptions })
    });
    let nowYear = new Date().getFullYear();
    let yearOptions = [];
    for(let i = nowYear - 20; i <= nowYear + 20; i++)
      yearOptions.push({label: i, key: i})
    let searchForm = [
      {type: 'select', id:'versionId', label: '预算版本', isRequired: true, options: [], method: 'get',
        getUrl: `${config.budgetUrl}/api/budget/versions/queryAll`, getParams: {organizationId: this.state.organizationId},
        labelKey: 'versionName', valueKey: 'id'},
      {type: 'select', id:'structureId', label: '预算表', isRequired: true, options: [], method: 'get',
        getUrl: `${config.budgetUrl}/api/budget/structures/queryAll`, getParams: {organizationId: this.state.organizationId},
        labelKey: 'structureName', valueKey: 'id'},
      {type: 'select', id:'scenarioId', label: '预算场景', isRequired: true, options: [], method: 'get',
        getUrl: `${config.budgetUrl}/api/budget/scenarios/queryAll`, getParams: {organizationId: this.state.organizationId},
        labelKey: 'scenarioName', valueKey: 'id'},
      {type: 'select', id:'yearLimit', label: '年度', isRequired: true, options: yearOptions},
      {type: 'items', id: 'dateRange', items: [
        {type: 'date', id: 'periodLowerLimit', label: '期间从', isRequired: true},
        {type: 'date', id: 'periodUpperLimit', label: '期间到'}
      ]},
      {type: 'value_list', id:'periodSummaryFlag', label: '期间汇总', isRequired: true, options: [], valueListCode: 2020},
      {type: 'items', id: 'seasonRange', items: [
        {type: 'value_list', id: 'quarterLowerLimit', label: '季度从', isRequired: true, options: [], valueListCode: 2021},
        {type: 'value_list', id: 'quarterUpperLimit', label: '季度到', options: [], valueListCode: 2021}
      ]},
      {type: 'value_list', id:'amountQuarterFlag', label: '金额/数量', isRequired: true, options: [], valueListCode: 2019}
    ];
    this.setState({ searchForm });
  }

  renderColumns = (index, dataIndex) => {
    const { queryLineListTypeOptions, queryLineListParamOptions, params } = this.state;
    switch(dataIndex){
      case 'type':{
        return (
          <Select placeholder={this.props.intl.formatMessage({id: 'common.please.select'})}
                  onChange={(value) => this.handleChangeType(value, index)}
                  value={params[index].type}>
            {queryLineListTypeOptions.map((option)=>{
              return <Option key={option.value}>{option.label}</Option>
            })}
          </Select>
        );
      }
      case 'params':{
        let paramOptions = queryLineListParamOptions[params[index].type];
        return (
          <Select placeholder={this.props.intl.formatMessage({id: 'common.please.select'})}
                  onChange={(value) => this.handleChangeParams(value, index)}
                  value={params[index].params}
                  onFocus={() => this.handleFocusParamSelect(index)}>
            {paramOptions ? paramOptions.map((option)=>{
              return <Option key={option.value}>{option.label}</Option>
            }) : null}
          </Select>
        );
      }
      case 'value':{
        return <Chooser/>;
      }
    }
  };

  handleChangeType = (value, index) => {
    let { params } = this.state;
    params[index].type = value;
    params[index].params = '';
    this.setState({ params });
  };

  handleChangeParams = (value, index) => {
    let { params } = this.state;
    params[index].params = value;
    this.setState({ params });
  };

  //点击参数选择框时的回调，若没有对应的值列表则获取
  handleFocusParamSelect = (index) => {
    let { params, queryLineListParamOptions, paramTypeMap } = this.state;
    let type = params[index].type;
    if(type !== ''){
      if(!queryLineListParamOptions[type]){
        this.getSystemValueList(paramTypeMap[type]).then(res => {
          let options = [];
          res.data.values.map(data => {
            options.push({label: data.messageKey, value: data.code})
          });
          queryLineListParamOptions[type] = options;
          this.setState({ queryLineListParamOptions });
        });
      }
    }
  };

  deleteItem = (e, index) => {
    let { params } = this.state;
    params.splice(index, 1);
    this.setState({ params });
  };

  handleNew = () => {
    let { params, paramsKey } = this.state;
    let newParams = {type: '', params: '', value: '', key: paramsKey};
    params.push(newParams);
    paramsKey++;
    this.setState({ params, paramsKey});
  };

  search = (e) => {
    e.preventDefault();
    let values = this.props.form.getFieldsValue();
    let searchForm = [].concat(this.state.searchForm);
    searchForm.map(item => {
      if(values[item.id] && item.entity){
        if(item.type === 'combobox' || item.type === 'select' || item.type === 'value_list'){
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
    console.log(values);
    values.queryLineList = [];
    console.log(this.state.params);
    // this.context.router.push(this.state.budgetBalanceResult.url);
  };

  clear = () => {
    this.props.form.resetFields();
  };

  //得到值列表的值增加options
  getValueListOptions = (item) => {
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
      //值列表选择组件
      case 'value_list':{
        return (
          <Select placeholder={this.props.intl.formatMessage({id: 'common.please.select'})}
                  onChange={handle}
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
