import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { Button, Form, Row, Col, Input, Select, DatePicker, Switch, Icon, Table, Popconfirm, Modal, message } from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;

import debounce from 'lodash.debounce';
import Chooser from 'components/chooser'
import SlideFrame from 'components/slide-frame'
import BudgetBalanceCondition from 'containers/budget/budget-balance/budget-balance-condition'
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
      },
      paramValueMap: {},
      showSaveModal: false,
      conditionCode: '',
      conditionName: '',
      saving: false
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
    let organizationIdParams = {organizationId : this.state.organizationId};
    let searchForm = [
      {type: 'select', id:'versionId', label: '预算版本', isRequired: true, options: [], method: 'get',
        getUrl: `${config.budgetUrl}/api/budget/versions/queryAll`, getParams: organizationIdParams,
        labelKey: 'versionName', valueKey: 'id'},
      {type: 'select', id:'structureId', label: '预算表', isRequired: true, options: [], method: 'get',
        getUrl: `${config.budgetUrl}/api/budget/structures/queryAll`, getParams: organizationIdParams,
        labelKey: 'structureName', valueKey: 'id'},
      {type: 'select', id:'scenarioId', label: '预算场景', isRequired: true, options: [], method: 'get',
        getUrl: `${config.budgetUrl}/api/budget/scenarios/queryAll`, getParams: organizationIdParams,
        labelKey: 'scenarioName', valueKey: 'id'},
      {type: 'select', id:'yearLimit', label: '年度', isRequired: true, options: yearOptions, event: 'YEAR_CHANGE'},
      {type: 'items', id: 'dateRange', items: [
        {type: 'select', id: 'periodLowerLimit', label: '期间从', isRequired: true, options: [], method: 'get', disabled: true,
        getUrl: `${config.baseUrl}/api/periods/query/periods/year`, getParams: {year: new Date().getFullYear()},
          labelKey: 'periodSetCode', valueKey: 'periodSetCode'},
        {type: 'select', id: 'periodUpperLimit', label: '期间到', options: [], method: 'get', disabled: true,
          getUrl: `${config.baseUrl}/api/periods/query/periods/year`, getParams: {year: new Date().getFullYear()},
          labelKey: 'periodSetCode', valueKey: 'periodSetCode'}
      ]},
      {type: 'value_list', id:'periodSummaryFlag', label: '期间汇总', isRequired: true, options: [], valueListCode: 2020},
      {type: 'items', id: 'seasonRange', items: [
        {type: 'value_list', id: 'quarterLowerLimit', label: '季度从', isRequired: true, options: [], valueListCode: 2021},
        {type: 'value_list', id: 'quarterUpperLimit', label: '季度到', options: [], valueListCode: 2021}
      ]},
      {type: 'value_list', id:'amountQuarterFlag', label: '金额/数量', isRequired: true, options: [], valueListCode: 2019}
    ];
    let paramValueMap = {
      'BUDGET_ITEM_TYPE': {
        listType: 'budget_item_type',
        labelKey: 'id',
        valueKey: 'itemTypeName',
        codeKey: 'itemTypeCode',
        listExtraParams: organizationIdParams,
        selectorItem: undefined
      },
      'BUDGET_ITEM_GROUP': {
        listType: 'budget_item_group',
        labelKey: 'id',
        valueKey: 'itemGroupName',
        codeKey: 'itemGroupCode',
        listExtraParams: organizationIdParams,
        selectorItem: undefined
      },
      'BUDGET_ITEM': {},
      'CURRENCY': {},

      'COMPANY': {},
      'COMPANY_GROUP': {},
      'UNIT': {},
      'UNIT_GROUP': {},
      'EMPLOYEE': {},
      'EMPLOYEE_GROUP': {}
    };
    this.setState({ searchForm, paramValueMap });
  }

  renderColumns = (index, dataIndex) => {
    const { queryLineListTypeOptions, queryLineListParamOptions, params, paramValueMap } = this.state;
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
        let param = params[index].params ? paramValueMap[params[index].params] : null;
        return <Chooser disabled={param === null}
                        onChange={(value) => this.handleChangeValue(value, index)}
                        type={param ? param.listType : null}
                        labelKey={param ? param.labelKey : null}
                        valueKey={param ? param.valueKey : null}
                        listExtraParams={param ? param.listExtraParams : null}
                        selectorItem={param ? param.selectorItem : null}
                        value={params[index].value}
                        showNumber/>;
      }
    }
  };

  //修改参数类型，同时清空参数和参数值
  handleChangeType = (value, index) => {
    let { params } = this.state;
    params[index].type = value;
    params[index].params = '';
    params[index].value = [];
    this.setState({ params });
  };

  //修改参数，同时晴空参数值
  handleChangeParams = (value, index) => {
    let { params } = this.state;
    params[index].params = value;
    params[index].value = [];
    this.setState({ params });
  };

  //修改参数值
  handleChangeValue = (value, index) => {
    let { params } = this.state;
    params[index].value = value;
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

  //新增维度
  handleNew = () => {
    let { params, paramsKey } = this.state;
    let newParams = {type: '', params: '', value: [], key: paramsKey};
    params.push(newParams);
    paramsKey++;
    this.setState({ params, paramsKey});
  };

  //查询，统一保存为临时方案后跳转
  search = (e) => {
    e.preventDefault();
    this.validate((values) => {
      console.log(values);
    });
    // this.context.router.push(this.state.budgetBalanceResult.url.replace(':id', '922281746635608065'));
  };

  //验证并打开方案保存窗口
  showSaveModal = () => {
    this.setState({ showSaveModal: true })
    // this.validate((values) => {
    //   console.log(values);
    // });
  };

  //保存方案
  handleSaveCondition = () => {
    this.validate((values) => {
      console.log(values);
      values.conditionCode = this.state.conditionCode;
      values.conditionName = this.state.conditionName;
      values.companyId = this.props.company.id;
      this.setState({ saving: true });
      httpFetch.post(`${config.budgetUrl}/api/budget/balance/query/header`, values).then(res => {
        message.success('保存成功');
        this.setState({ showSaveModal: false, saving: false})
      })
    });
  };

  //验证通过后将state.params的值包装至values
  validate = (callback) => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      console.log(values);
      if(!err){
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
        const { paramValueMap } = this.state;
        values.queryLineList = [];
        values.periodSummaryFlag = values.periodSummaryFlag === 'TRUE';
        this.state.params.map(param => {
          let queryLine = {
            parameterType: param.type,
            parameterCode: param.params,
            queryParameterList: []
          };
          param.value.map(value => {
            queryLine.queryParameterList.push({
              parameterValueId: value[paramValueMap[param.params].valueKey],
              parameterValueCode: value[paramValueMap[param.params].codeKey],
              parameterValueName: value[paramValueMap[param.params].labelKey]
            })
          });
          values.queryLineList.push(queryLine)
        });
        values.organizationId = this.state.organizationId;
        callback(values);
      }
    })
  };

  //应用方案后设置表单值
  setValues = (options) => {
    Object.keys(options).map(key => {
      let searchForm = this.state.searchForm;
      searchForm.map((searchItem, index) => {
        if(searchItem.id === key){
          if((searchItem.type === 'select' || searchItem.type === 'value_list') && typeof options[key] === 'object')
            this.onChangeSelect(searchItem, options[key]);
          else{
            let value = {};
            value[key] = options[key] + '';
            this.props.form.setFieldsValue(value)
          }
        } else if(searchItem.type === 'items'){
          searchItem.items.map(subItem => {
            if(subItem.id === key){
              if((subItem.type === 'select' || subItem.type === 'value_list') && typeof options[key] === 'object')
                this.onChangeSelect(subItem, options[key], index);
              else {
                let value = {};
                value[key] = options[key] + '';
                this.props.form.setFieldsValue(value)
              }
            }
          })
        }
      });
      searchForm[4].items[0].getParams = searchForm[4].items[1].getParams = {year: options.yearLimit};
      searchForm[4].items[0].disabled =  searchForm[4].items[1].disabled = false;
      searchForm[4].items[0].options = searchForm[4].items[1].options = [];
      this.setState({ searchForm })
    });
  };

  //应用方案
  useCondition = (condition) => {
    console.log(condition);
    this.setState({showSlideFrame : false});
    condition && this.setValues({
      versionId: {key: condition.versionId, label: condition.versionName},
      structureId: {key: condition.structureId, label: condition.structureName},
      scenarioId: {key: condition.scenarioId, label: condition.scenarioName},
      yearLimit: condition.yearLimit,
      periodLowerLimit: {key: condition.periodLowerLimit, label: condition.periodLowerLimit},
      periodUpperLimit: {key: condition.periodUpperLimit, label: condition.periodUpperLimit},
      periodSummaryFlag: {key: condition.periodSummaryFlag, label: condition.periodSummaryFlag},
      quarterLowerLimit: {key: condition.quarterLowerLimit, label: condition.quarterLowerLimit},
      quarterUpperLimit: {key: condition.quarterUpperLimit, label: condition.quarterUpperLimit},
      amountQuarterFlag: {key: condition.amountQuarterFlag, label: condition.amountQuarterFlag}
    })
  };

  clear = () => {
    this.props.form.resetFields();
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

  handleEvent = (value, event) => {
    switch(event){
      case 'YEAR_CHANGE':
        let searchForm = this.state.searchForm;
        searchForm[4].items[0].getParams = searchForm[4].items[1].getParams = {year: value};
        searchForm[4].items[0].disabled =  searchForm[4].items[1].disabled = false;
        searchForm[4].items[0].options = searchForm[4].items[1].options = [];
        this.setState({ searchForm })
    }
  };

  onChangeSelect = (item, value, index) => {
    let valueWillSet = {};
    let searchForm = this.state.searchForm;
    if(index !== undefined){
      searchForm[index].items = searchForm[index].items.map(searchItem => {
        if(searchItem.id === item.id){
          valueWillSet[searchItem.id] = value.key + '';
          if(searchItem.options.length === 0 || (searchItem.options.length === 1 && searchItem.options[0].temp)){
            let dataOption = {};
            dataOption[item.valueKey] = value.key;
            dataOption[item.labelKey] = value.label;
            searchItem.options.push({label: value.label, key: value.key, value: dataOption, temp: true})
          }
        }
        return searchItem;
      });
    } else {
      searchForm = searchForm.map(searchItem => {
        if(searchItem.id === item.id){
          valueWillSet[searchItem.id] = value.key + '';
          if(searchItem.options.length === 0 || (searchItem.options.length === 1 && searchItem.options[0].temp)){
            let dataOption = {};
            dataOption[item.valueKey] = value.key;
            dataOption[item.labelKey] = value.label;
            searchItem.options.push({label: value.label, key: value.key, value: dataOption, temp: true})
          }
        }
        return searchItem;
      });
    }
    this.setState({ searchForm }, () => {
      this.props.form.setFieldsValue(valueWillSet);
    });
    let handle = item.event ? (event) => this.handleEvent(event,item.event) : ()=>{};
    handle();
  };

  //渲染搜索表单组件
  renderFormItem(item){
    let handle = item.event ? (event) => this.handleEvent(event, item.event) : ()=>{};
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
              return <Option key={'' + option.key} title={JSON.stringify(option.value)}>{option.label}</Option>
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
                        valueKey={item.value}
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

  handleChangeConditionCode = (e) => {
    this.setState({ conditionCode: e.target.value })
  };

  render(){
    const { params, columns, showSlideFrame, showSaveModal, saving } = this.state;
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
            <Button style={{ marginRight: 10}} onClick={this.showSaveModal}>保存方案</Button>
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
        <SlideFrame content={BudgetBalanceCondition}
                    title="我的查询方案"
                    show={showSlideFrame}
                    onClose={() => this.setState({showSlideFrame : false})}
                    afterClose={this.useCondition}/>
        <Modal title="保存方案"
               visible={showSaveModal}
               onCancel={() => {this.setState({ showSaveModal: false })}}
               onOk={this.handleSaveCondition}
               confirmLoading={saving}>
          <div className="save-modal-content">
            <div>方案代码</div>
            <Input onChange={this.handleChangeConditionCode}/>
            <div>方案名称</div>
            <Input onChange={(e) => this.setState({ conditionName: e.target.value })}/>
          </div>
        </Modal>
      </div>
    )
  }

}

function mapStateToProps(state) {
  return {
    company: state.login.company,
    organization: state.login.organization
  }
}

BudgetBalance.contextTypes = {
  router: React.PropTypes.object
};


const WrappedBudgetBalance = Form.create()(BudgetBalance);

export default connect(mapStateToProps)(injectIntl(WrappedBudgetBalance));
