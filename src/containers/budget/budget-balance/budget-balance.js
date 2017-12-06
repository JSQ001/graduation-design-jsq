/**
 * Created By zaranengap on 2017/09/25
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { Button, Form, Row, Col, Input, Select, Spin, Icon, Table, Popconfirm, Modal, message, Checkbox } from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;

import debounce from 'lodash.debounce';
import Chooser from 'components/chooser'
import SlideFrame from 'components/slide-frame'
import BudgetBalanceCondition from 'containers/budget/budget-balance/budget-balance-condition'
import menuRoute from 'share/menuRoute'
import selectorData from 'share/selectorData'

import 'styles/budget/budget-balance/budget-balance.scss'
import httpFetch from 'share/httpFetch'
import config from 'config'

class BudgetBalance extends React.Component {
  constructor(props) {
    super(props);
    const { formatMessage } = this.props.intl;
    this.state = {
      structureId: null,
      budgetBalanceResult: menuRoute.getRouteItem('budget-balance-result', 'key'),
      showSlideFrame: false,
      params: [],
      queryLineListTypeOptions: [],
      queryLineListParamOptions: {},
      columns: [
        {title: '参数类型', dataIndex: 'type', width: '20%', render: (text, record, index) => this.renderColumns(index, 'type')},
        {title: '参数', dataIndex: 'params', width: '35%', render: (text, record, index) => this.renderColumns(index, 'params')},
        {title: '参数值', dataIndex: 'value', width: '35%', render: (text, record, index) => this.renderColumns(index, 'value')},
        {title: '操作', dataIndex: 'operation', width: '10%', render: (text, record, index) => (
          <span>
            <Popconfirm onConfirm={(e) => this.deleteItem(e, index)} title="你确定要删除这条数据吗?">
              <a onClick={(e) => {e.preventDefault();e.stopPropagation();}}>{formatMessage({id: "common.delete"})}</a>
            </Popconfirm>
          </span>)}
      ],
      searchForm: [],
      organizationId: this.props.organization.id,
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
        'BGT_RULE_PARAMETER_ORG': 2016
      },
      paramValueMap: {},
      showSaveModal: false,
      conditionCode: '',
      conditionName: '',
      condition: null,
      saving: false,
      searching: false,
      saveNewCondition: true,
      costCenterSelectorItem: {  //成本中心所需要的selectorItem，url需要在params的onChange里手动添加
        listType: 'cost_center_item_by_id',
        labelKey: 'name',
        valueKey: 'id',
        codeKey: 'code',
        listExtraParams: undefined,
        selectorItem: undefined
      },
    };
    this.setOptionsToFormItem = debounce(this.setOptionsToFormItem, 250);
  }

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
        getUrl: `${config.budgetUrl}/api/budget/structures/queryAll`, getParams: organizationIdParams, event: 'STRUCTURE_CHANGE',
        labelKey: 'structureName', valueKey: 'id'},
      {type: 'select', id:'scenarioId', label: '预算场景', isRequired: true, options: [], method: 'get',
        getUrl: `${config.budgetUrl}/api/budget/scenarios/queryAll`, getParams: organizationIdParams,
        labelKey: 'scenarioName', valueKey: 'id'},
      {type: 'select', id:'yearLimit', label: '年度', options: yearOptions, event: 'YEAR_CHANGE', isRequired: true},
      {type: 'items', id: 'dateRange', items: [
        {type: 'select', id: 'periodLowerLimit', label: '期间从', options: [], method: 'get', disabled: true,
        getUrl: `${config.baseUrl}/api/company/group/assign/query/budget/periods`, getParams: {setOfBooksId: this.props.company.setOfBooksId},
          labelKey: 'periodName', valueKey: 'periodName'},
        {type: 'select', id: 'periodUpperLimit', label: '期间到', options: [], method: 'get', disabled: true,
          getUrl: `${config.baseUrl}/api/company/group/assign/query/budget/periods`, getParams: {setOfBooksId: this.props.company.setOfBooksId},
          labelKey: 'periodName', valueKey: 'periodName'}
      ]},
      {type: 'value_list', id:'periodSummaryFlag', label: '期间汇总', options: [], valueListCode: 2020, disabled: true},
      {type: 'items', id: 'seasonRange', items: [
        {type: 'value_list', id: 'quarterLowerLimit', label: '季度从', options: [], valueListCode: 2021, disabled: true},
        {type: 'value_list', id: 'quarterUpperLimit', label: '季度到', options: [], valueListCode: 2021, disabled: true}
      ]},
      {type: 'value_list', id:'amountQuarterFlag', label: '金额 / 数量', isRequired: true, options: [], valueListCode: 2019}
    ];

    let itemSelectorItem = selectorData['budget_item'];
    itemSelectorItem.listExtraParams = organizationIdParams;
    itemSelectorItem.searchForm[1].getParams = itemSelectorItem.searchForm[2].getParams = organizationIdParams;

    let userSelectorItem = selectorData['user'];
    userSelectorItem.key = 'employeeID';

    let paramValueMap = {
      'BUDGET_ITEM_TYPE': {
        listType: 'budget_item_type',
        labelKey: 'itemTypeName',
        valueKey: 'id',
        codeKey: 'itemTypeCode',
        listExtraParams: organizationIdParams,
        selectorItem: undefined
      },
      'BUDGET_ITEM_GROUP': {
        listType: 'budget_item_group',
        labelKey: 'itemGroupName',
        valueKey: 'id',
        codeKey: 'itemGroupCode',
        listExtraParams: organizationIdParams,
        selectorItem: undefined
      },
      'BUDGET_ITEM': {
        listType: 'budget_item',
        labelKey: 'itemName',
        valueKey: 'id',
        codeKey: 'itemCode',
        listExtraParams: organizationIdParams,
        selectorItem: itemSelectorItem
      },
      'CURRENCY': {
        listType: 'currency',
        labelKey: 'currencyName',
        valueKey: 'currency',
        codeKey: undefined,
        listExtraParams: {
          roleType: 'TENANT',
          language: 'chineseName'
        },
        selectorItem: undefined
      },
      'COMPANY': {
        listType: 'company',
        labelKey: 'name',
        valueKey: 'id',
        codeKey: 'companyCode',
        listExtraParams: {setOfBooksId: this.props.company.setOfBooksId},
        selectorItem: undefined
      },
      'COMPANY_GROUP': {
        listType: 'company_group',
        labelKey: 'companyGroupName',
        valueKey: 'id',
        codeKey: 'companyGroupCode',
        listExtraParams: {},
        selectorItem: undefined
      },
      'UNIT': {
        listType: 'journal_line_department',
        labelKey: 'name',
        valueKey: 'id',
        codeKey: 'code',
        listExtraParams: {companyId: this.props.company.id},
        selectorItem: undefined
      },
      'UNIT_GROUP': {
        listType: 'department_group',
        labelKey: 'description',
        valueKey: 'id',
        codeKey: 'deptGroupCode',
        listExtraParams: {},
        selectorItem: undefined
      },
      'EMPLOYEE': {
        listType: 'user',
        labelKey: 'fullName',
        valueKey: 'employeeID',
        codeKey: 'employeeID',
        listExtraParams: {roleType: 'TENANT'},
        selectorItem: userSelectorItem
      },
      'EMPLOYEE_GROUP': {
        listType: 'user_group',
        labelKey: 'name',
        valueKey: 'id',
        codeKey: 'id',
        listExtraParams: {roleType: 'TENANT'},
        selectorItem: undefined
      }
    };
    this.setState({ searchForm, paramValueMap });
  }

  //渲染下方表格内的选项框及Chooser
  renderColumns = (index, dataIndex) => {
    const { queryLineListTypeOptions, queryLineListParamOptions, params, paramValueMap } = this.state;
    switch(dataIndex){
      case 'type':{
        return (
          <Select placeholder={this.props.intl.formatMessage({id: 'common.please.select'})}
                  onChange={(value) => this.handleChangeType(value, index)}
                  value={params[index].type}
                  notFoundContent={<Spin size="small" />}>
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
        //如果为维度相关项目，则为成本中心selectorItem
        let param = params[index].params ? (params[index].type === 'BGT_RULE_PARAMETER_DIM' ? params[index].paramMap : paramValueMap[params[index].params]) : null;
        return <Chooser disabled={param === null}
                        onChange={(value) => this.handleChangeValue(value, index)}
                        type={param ? param.listType : null}
                        labelKey={param ? param.labelKey : null}
                        valueKey={param ? param.valueKey : null}
                        listExtraParams={param ? param.listExtraParams : null}
                        selectorItem={param ? param.selectorItem : null}
                        value={params[index].value}
                        single={param ? param.listType === 'currency' : false}
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

  //修改参数，同时清空参数值
  handleChangeParams = (value, index) => {
    let { params } = this.state;
    params[index].params = value;
    params[index].value = [];
    //手动添加成本中心selectorItem所需要的url
    if(params[index].type === 'BGT_RULE_PARAMETER_DIM'){
      params[index].paramMap = {  //成本中心所需要的selectorItem，url需要在params的onChange里手动添加
        listType: 'cost_center_item_by_id',
        labelKey: 'name',
        valueKey: 'id',
        codeKey: 'code',
        listExtraParams: { costCenterId: value },
        selectorItem: undefined
      };
    }
    this.setState({ params });
  };

  //修改参数值
  handleChangeValue = (value, index) => {
    let { params } = this.state;
    params[index].value = value;
    this.setState({ params });
  };

  //点击参数选择框时的回调，若没有对应的值列表则获取
  handleFocusParamSelect = (index, typeParam) => {
    let { params, queryLineListParamOptions, paramTypeMap } = this.state;
    let type = typeParam ? typeParam : params[index].type;
    if(type !== ''){
      if(type === 'BGT_RULE_PARAMETER_DIM'){
        let structureId = this.state.structureId;
        structureId && httpFetch.get(`${config.budgetUrl}/api/budget/structure/assign/layouts/queryAll?structureId=${structureId}`).then(res => {
          let options = [];
          res.data.map(data => {
            options.push({label: data.dimensionName, value: data.dimensionId})
          });
          queryLineListParamOptions[type] = options;
          this.setState({ queryLineListParamOptions });
        })
      } else {
        if(!queryLineListParamOptions[type] || queryLineListParamOptions[type].length === 0 ){
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
    }
  };

  //删除下方表格维度项
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
    this.setState({ searching: true });
    this.validate((values) => {
      httpFetch.post(`${config.budgetUrl}/api/budget/balance/query/header/user`, values).then(res => {
        this.setState({ searching: false });
        this.context.router.push(this.state.budgetBalanceResult.url.replace(':id', res.data));
      }).catch(e => {
        if(e.response.data){
          message.error(e.response.data.validationErrors ? e.response.data.validationErrors[0].message : e.response.data.message);
        }
        this.setState({ searching: false });
      })
    });
  };

  //验证并打开方案保存窗口
  showSaveModal = () => {
    this.validate(() => {
      const { condition } = this.state;
      if(this.state.condition)
        this.setState({ conditionName: condition.conditionName, conditionCode: condition.conditionCode, showSaveModal: true});
      else
        this.setState({ conditionName: '', conditionCode: '',showSaveModal: true })
    });
  };

  //保存方案
  handleSaveCondition = () => {
    this.validate((values) => {
      values.conditionCode = this.state.conditionCode;
      values.conditionName = this.state.conditionName;
      values.companyId = this.props.company.id;
      this.setState({ saving: true });
      let method;
      if(this.state.saveNewCondition || !this.state.condition)
        method = 'post';
      else {
        method = 'put';
        values.id = this.state.condition.id;
        values.versionNumber = this.state.condition.versionNumber;
      }
      httpFetch[method](`${config.budgetUrl}/api/budget/balance/query/header`, values).then(() => {
        message.success('保存成功');
        this.setState({ showSaveModal: false, saving: false});
      }).catch(e => {
        if(e.response.data){
          message.error(e.response.data.validationErrors ? e.response.data.validationErrors[0].message : e.response.data.message);
          this.setState({ saving: false })
        }
      })
    });
  };

  //验证通过后将state.params的值包装至values
  validate = (callback) => {
    const { costCenterSelectorItem } = this.state;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if(!err){
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
            let paramItem = param.type === 'BGT_RULE_PARAMETER_DIM' ? costCenterSelectorItem : paramValueMap[param.params];
            let queryParameter = {
              parameterValueId: paramItem.listType === 'currency' ? null : (paramItem.valueKey ? value[paramItem.valueKey] : null),
              parameterValueCode: paramItem.listType === 'currency' ? value[paramItem.valueKey] : (paramItem.codeKey ? value[paramItem.codeKey] : null),
              parameterValueName: paramItem.labelKey ? value[paramItem.labelKey] : null
            };
            queryLine.queryParameterList.push(queryParameter)
          });
          values.queryLineList.push(queryLine)
        });
        values.organizationId = this.state.organizationId;
        values.companyId = this.props.company.id;
        callback(values);
      } else {
        this.setState({ searching: false });
      }
    })
  };

  //应用方案后设置表单值
  setValues = (options) => {
    Object.keys(options).map(key => {
      let searchForm = this.state.searchForm;
      searchForm.map((searchItem, index) => {
        if(searchItem.id === key && options[key]){
          if((searchItem.type === 'select' || searchItem.type === 'value_list') && typeof options[key] === 'object')
            this.onChangeSelect(searchItem, options[key]);
          else{
            let value = {};
            value[key] = options[key] + '';
            this.props.form.setFieldsValue(value)
          }
        } else if(searchItem.type === 'items'){
          searchItem.items.map(subItem => {
            if(subItem.id === key && options[key]){
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
      searchForm[4].items[0].getParams = searchForm[4].items[1].getParams = {setOfBooksId: this.props.company.setOfBooksId, periodYear: options.yearLimit};
      searchForm[4].items[0].options = searchForm[4].items[1].options = [];
      this.setState({ searchForm })
    });
  };

  //应用方案，将数据填充至界面
  useCondition = (condition) => {
    this.setState({showSlideFrame : false});
    if(condition){
      //设置顶部表单的值
      this.setValues({
        versionId: {value: condition.versionId, label: condition.versionName},
        structureId: {value: condition.structureId, label: condition.structureName},
        scenarioId: {value: condition.scenarioId, label: condition.scenarioName},
        yearLimit: condition.yearLimit,
        periodLowerLimit: condition.periodLowerLimit ? {value: condition.periodLowerLimit, label: condition.periodLowerLimit} : null,
        periodUpperLimit: condition.periodUpperLimit ? {value: condition.periodUpperLimit, label: condition.periodUpperLimit} : null,
        periodSummaryFlag: {value: (condition.periodSummaryFlag + '').toUpperCase(), label: condition.periodSummaryFlag ? '汇总' : '不汇总' },
        quarterLowerLimit: condition.quarterLowerLimit ? {value: condition.quarterLowerLimit, label: condition.quarterLowerLimit} : null,
        quarterUpperLimit: condition.quarterUpperLimit ? {value: condition.quarterUpperLimit, label: condition.quarterUpperLimit} : null,
        amountQuarterFlag: {value: condition.amountQuarterFlag, label: condition.amountQuarterFlagName}
      });
      this.setState({ structureId: condition.structureId }, () => {this.setFieldsByStructureId()});
      //设置下方列表内的值
      let { paramsKey, paramValueMap } = this.state;
      let params = [];
      condition.queryLineList.map((item, index) => {
        let newParams = {type: item.parameterType, params: item.parameterCode, value: [], key: paramsKey};
        item.queryParameterList.map(queryParameter => {
          let val = {};
          let mapItem = item.parameterType === 'BGT_RULE_PARAMETER_DIM' ? this.state.costCenterSelectorItem : paramValueMap[item.parameterCode];
          if(item.parameterCode !== 'CURRENCY')
            val[mapItem.codeKey] = queryParameter.parameterValueCode;
          val[mapItem.valueKey] = item.parameterCode === 'CURRENCY' ? queryParameter.parameterValueCode : queryParameter.parameterValueId;
          val[mapItem.labelKey] = queryParameter.parameterValueName;
          newParams.value.push(val);
          if(item.parameterType === 'BGT_RULE_PARAMETER_DIM'){
            newParams.paramMap = {  //成本中心所需要的selectorItem，url需要在params的onChange里手动添加
              listType: 'cost_center_item_by_id',
              labelKey: 'name',
              valueKey: 'id',
              codeKey: 'code',
              listExtraParams: {costCenterId: item.parameterCode},
              selectorItem: undefined
            };
          }
        });
        params.push(newParams);
        paramsKey++;
        //获得参数列的选择项
        this.handleFocusParamSelect(index, item.parameterType)
      });
      this.setState({ params, paramsKey, condition, saveNewCondition: true });
    }
  };

  clear = () => {
    this.props.form.resetFields();
    this.setState({ params: [], paramsKey: 0, condition: null, conditionName: '', conditionCode: '' })
  };

  //得到值列表的值增加options
  getValueListOptions = (item) => {
    if(item.options.length === 0 || (item.options.length === 1 && item.options[0].temp)){
      this.getSystemValueList(item.valueListCode).then(res => {
        let options = [];
        res.data.values.map(data => {
          options.push({label: data.messageKey, key: data.code, value: data})
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

  setFieldsByStructureId = () => {
    let structureId = this.state.structureId;
    structureId && httpFetch.get(`${config.budgetUrl}/api/budget/structures/${structureId}`).then(res => {
      let periodStrategy = res.data.periodStrategy;
      let searchForm = this.state.searchForm;
      searchForm[4].items[0].isRequired = periodStrategy === 'MONTH';
      searchForm[4].items[0].disabled = searchForm[4].items[1].disabled = periodStrategy !== 'MONTH';
      searchForm[4].items[0].options = searchForm[4].items[1].options = [];
      searchForm[5].isRequired = periodStrategy === 'MONTH';
      searchForm[5].disabled = periodStrategy !== 'MONTH';
      searchForm[6].items[0].isRequired = searchForm[6].items[1].isRequired = periodStrategy === 'QUARTER';
      searchForm[6].items[0].disabled = searchForm[6].items[1].disabled = periodStrategy !== 'QUARTER';
      periodStrategy === 'YEAR' && this.props.form.setFieldsValue({
        periodLowerLimit: null,
        periodUpperLimit: null,
        periodSummaryFlag: null,
        quarterLowerLimit: null,
        quarterUpperLimit: null
      });
      periodStrategy === 'MONTH' && this.props.form.setFieldsValue({
        quarterLowerLimit: null,
        quarterUpperLimit: null
      });
      periodStrategy === 'QUARTER' && this.props.form.setFieldsValue({
        periodLowerLimit: null,
        periodUpperLimit: null,
        periodSummaryFlag: null
      });
      this.setState({ searchForm });
    });
  };

  handleEvent = (value, event) => {
    switch(event){
      case 'YEAR_CHANGE':
        let searchForm = this.state.searchForm;
        searchForm[4].items[0].getParams = searchForm[4].items[1].getParams = {setOfBooksId: this.props.company.setOfBooksId, periodYear: value};
        searchForm[4].items[0].options = searchForm[4].items[1].options = [];
        this.props.form.setFieldsValue({
          periodLowerLimit: null,
          periodUpperLimit: null
        });
        this.setState({ searchForm });
        break;
      case 'STRUCTURE_CHANGE':
        this.setState({ structureId : value }, () => {this.setFieldsByStructureId()});
        break;
    }
  };

  onChangeSelect = (item, value, index) => {
    let valueWillSet = {};
    let { searchForm }  = this.state;
    if(index !== undefined){
      searchForm[index].items = searchForm[index].items.map(searchItem => {
        if(searchItem.id === item.id){
          valueWillSet[searchItem.id] = value.value + '';
          if(searchItem.options.length === 0 || (searchItem.options.length === 1 && searchItem.options[0].temp)){
            let dataOption = {};
            dataOption[item.type === 'value_list' ? 'code' : item.valueKey] = value.value;
            dataOption[item.type === 'value_list' ? 'messageKey' : item.labelKey] = value.label;
            searchItem.options = [{label: value.label, key: value.value, value: dataOption, temp: true}];
          }
        }
        return searchItem;
      });
    } else {
      searchForm = searchForm.map(searchItem => {
        if(searchItem.id === item.id){
          valueWillSet[searchItem.id] = value.value + '';
          if(searchItem.options.length === 0 || (searchItem.options.length === 1 && searchItem.options[0].temp)){
            let dataOption = {};
            dataOption[item.type === 'value_list' ? 'code' : item.valueKey] = value.value;
            dataOption[item.type === 'value_list' ? 'messageKey' : item.labelKey] = value.label;
            searchItem.options = [{label: value.label, key: value.value, value: dataOption, temp: true}];
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
      //选择组件
      case 'select':{
        return (
          <Select placeholder={this.props.intl.formatMessage({id: 'common.please.select'})}
                  onChange={handle}
                  disabled={item.disabled}
                  allowClear
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
                  allowClear
                  labelInValue={!!item.entity}
                  onFocus={() => this.getValueListOptions(item)}>
            {item.options.map((option)=>{
              return <Option key={'' + option.key} title={option.value ? JSON.stringify(option.value) : ''}>{option.label}</Option>
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
    const { params, columns, showSlideFrame, showSaveModal, saving, condition , conditionCode, conditionName, saveNewCondition, searching } = this.state;
    return (
      <div className="budget-balance">
        <Form
          className="ant-advanced-search-form"
          onSubmit={this.search}
        >
          <div className="base-condition">
            <div className="base-condition-title">基本条件</div>
            <Row gutter={40} className="base-condition-content" type="flex" align="top">{this.getFields()}</Row>
          </div>
          <div className="footer-operate">
            <Button type="primary" htmlType="submit" loading={searching}>查询</Button>
            <Button style={{ marginLeft: 10, marginRight: 20 }} onClick={this.clear}>重置</Button>
            <Button style={{ marginRight: 10}} onClick={this.showSaveModal}>保存方案</Button>
            <Button onClick={() => {this.setState({showSlideFrame : true})}}>应用现有方案</Button>
            {condition ? <div className="condition-name">已应用: {condition.conditionName}</div> : null}
          </div>
          <div className="table-header">
            <div className="table-header-title">查询维度</div>
            <div className="table-header-buttons">
              <Button onClick={this.handleNew} disabled={params.length === 20}>添 加</Button>
            </div>
          </div>
          <Table columns={columns}
                 dataSource={params}
                 bordered
                 pagination={false}
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
            <Input onChange={this.handleChangeConditionCode} value={conditionCode}/>
            <div>方案名称</div>
            <Input onChange={(e) => this.setState({ conditionName: e.target.value })} value={conditionName}/>
            <br/>
            {condition ? <Checkbox checked={saveNewCondition} defaultValu={saveNewCondition} onChange={(e) => {this.setState({ saveNewCondition: e.target.checked })}}>保存为新方案</Checkbox> : null}
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
