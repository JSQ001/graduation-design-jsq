import { Badge } from 'antd'
import config from 'config'

const selectorData = {
  'user': {
    title: '选择人员',
    url: `${config.baseUrl}/api/users/v2/search`,
    searchForm: [
      {type: 'input', id: 'keyword', label: '员工工号、姓名、手机号、邮箱'}
    ],
    columns: [
      {title: '工号', dataIndex: 'employeeID', width: '25%'},
      {title: '姓名', dataIndex: 'fullName', width: '25%'},
      {title: '部门名称', dataIndex: 'departmentName', width: '25%'},
      {title: '职务', dataIndex: 'title', width: '25%'},
    ],
    key: 'userOID'
  },
  'budget_journal_structure': {
    title: '选择预算日记账所需的预算表',
    url: `${config.budgetUrl}/api/budget/journal/type/assign/structures/queryStructure`,
    searchForm: [
      {type: 'input', id: 'structureCode', label: '预算表代码'},
      {type: 'input', id: 'structureName', label: '预算表描述'},
      {type: 'select', id: 'structureCodeFrom', label: '预算表代码从', options: []},
      {type: 'select', id: 'structureCodeTo', label: '预算表代码至', options: []}
    ],
    columns: [
      {title: '预算表代码', dataIndex: 'structureCode', width: '45%'},
      {title: '预算表描述', dataIndex: 'structureName', width: '55%'}
    ],
    key: 'structureCode'
  },
  'budget_journal_item': {
    title: '选择预算日记账所需的预算项目',
    url: `${config.budgetUrl}/api/budget/journal/type/assign/items/queryItem`,
    searchForm: [
      {type: 'input', id: 'itemCode', label: '预算项目代码'},
      {type: 'input', id: 'itemName', label: '预算项目描述'},
      {type: 'select', id: 'itemCodeFrom', label: '预算项目从', options: []},
      {type: 'select', id: 'itemCodeTo', label: '预算项目至', options: []}
    ],
    columns: [
      {title: '预算项目代码', dataIndex: 'itemCode', width: '45%'},
      {title: '预算项目描述', dataIndex: 'itemName', width: '55%'}
    ],
    key: 'itemCode'
  },
  'budget_item': {
    title: '选择预算项目',
    url: `${config.budgetUrl}/api/budget/items/query`,
    searchForm: [
      {type: 'input', id: 'itemCode', label: '预算项目代码'},
      {type: 'select', id: 'itemCodeFrom', label: '预算项目从', options: [], getUrl: `${config.budgetUrl}/api/budget/items/find/all`, labelKey: 'itemCode', valueKey: 'itemCode', method: 'get'},
      {type: 'select', id: 'itemCodeTo', label: '预算项目至', options: [], getUrl: `${config.budgetUrl}/api/budget/items/find/all`, labelKey: 'itemCode', valueKey: 'itemCode', method: 'get'}
    ],
    columns: [
      {title: '预算项目代码', dataIndex: 'itemCode', width: '45%'},
      {title: '预算项目描述', dataIndex: 'itemName', width: '55%'}
    ],
    key: 'id'
  },
  'company': {
    title: '添加公司',
    url: `${config.baseUrl}/api/company/by/term`,
    searchForm: [
      {type: 'input', id: 'companyCode', label: "公司代码"},
      {type: 'input', id: 'companyName', label: "公司名称"},
      {type: 'input', id: 'companyCodeFrom', label:"公司代码从"},
      {type: 'input', id: 'companyCodeTo', label: "公司代码至"}
    ],
    columns: [
      {title: "公司代码", dataIndex: 'companyCode'},
      {title: "公司明称", dataIndex: 'name'},
      {title: "公司类型", dataIndex: 'companyTypeName'}
    ],
    key: 'id'
  },
  'available_company': {
    title: '切换公司',
    url: `${config.baseUrl}/api/company/available`,
    searchForm: [
      {type: 'input', id: 'keyword', label: "公司名称"}
    ],
    columns: [
      {title: "公司代码", dataIndex: 'companyCode'},
      {title: "公司明称", dataIndex: 'name'},
      {title: "公司类型", dataIndex: 'companyTypeName'}
    ],
    key: 'id'
  },
  'budget_item_type': {
    title: "预算项目类型",
    url: `${config.budgetUrl}/api/budget/itemType/query`,
    searchForm:[
      {type: 'input', id: 'itemTypeCode', label: '预算项目类型代码'},
      {type: 'input', id: 'itemTypeName', label: '预算项目类型名称'},
    ],
    columns: [
      {title: '预算项目类型代码', dataIndex: 'itemTypeCode'},
      {title: '预算项目类型名称', dataIndex: 'itemTypeName'},
    ],
    key: 'id'
  },
  'budget_item_filter':{
    title: '选择当前项目组中未被添加的项目',
    searchForm: [
      {type: 'input', id: 'itemCode', label: '预算项目代码'},
      {type: 'input', id: 'itemName', label: '预算项目描述'},
      {type: 'select', id: 'itemCodeFrom', label: '预算项目从', options: []},
      {type: 'select', id: 'itemCodeTo', label: '预算项目至', options: []}
    ],
    columns: [
      {title: '预算项目代码', dataIndex: 'itemCode', width: '25%'},
      {title: '预算项目描述', dataIndex: 'itemName', width: '40%'},
      {title: '预算项目类型', dataIndex: 'itemTypeName', width: '35%'}
    ],
    key: 'id'
  },
  'select_dimension':{
    title: '选择维度',
    searchForm: [
      {type: 'input', id: 'dimensionCode', label: '维度代码'},
      {type: 'input', id: 'dimensionName', label: '维度名称'},
    ],
    columns: [
      {title: '维度代码', dataIndex: 'dimensionCode', width: '25%'},
      {title: '维度名称', dataIndex: 'dimensionName', width: '25%'},
      {title: '公司级别', dataIndex: 'companyLevel', width: '25%'},
      {title: '系统级别', dataIndex: 'systemLevel', width: '25%'},
    ],
    key: 'id'
  },
  'budget_journal_type':{
    title: "预算日记账类型",
    url: `${config.budgetUrl}/api/budget/journals/journalType/selectByInput`,
    searchForm:[
      {type: 'input', id: 'journalTypeCode', label: '预算日记账类型代码'},
      {type: 'input', id: 'journalTypeName', label: '预算日记账类型名称'},
    ],
    columns: [
      {title: '预算日记账类型代码', dataIndex: 'journalTypeCode'},
      {title: '预算日记账类型名称', dataIndex: 'journalTypeName'},
    ],
    key: 'id'
  },
  'budget_versions':{
    title:"预算版本",
    url:`${config.budgetUrl}/api/budget/versions/query`,
    searchForm:[
      {type: 'input', id: 'versionCode', label: '预算版本代码'},
      {type: 'input', id: 'versionName', label: '预算版本名称'},
    ],
    columns: [
      {title: '预算版本代码', dataIndex: 'versionCode'},
      {title: '预算版本名称', dataIndex: 'versionName'},
    ],
    key: 'id'
  },
  'budget_scenarios':{
    title:"预算场景",
    url:`${config.budgetUrl}/api/budget/scenarios/query`,
    searchForm:[
      {type: 'input', id: 'scenarioCode', label: '预算场景代码'},
      {type: 'input', id: 'scenarioName', label: '预算场景名称'},
    ],
    columns: [
      {title: '预算场景代码', dataIndex: 'scenarioCode'},
      {title: '预算场景名称', dataIndex: 'scenarioName'},
    ],
    key: 'id'
  },
  'budget_item_group':{
    title:"预算项目组",
    url:`${config.budgetUrl}/api/budget/groups/query`,
    searchForm:[],
    columns: [
      {title: '预算项目组代码', dataIndex: 'itemGroupCode'},
      {title: '预算项目组名称', dataIndex: 'itemGroupName'},
    ],
    key: 'id'
  },
  'budget_item':{
    title:"预算项目",
    url: `${config.budgetUrl}/api/budget/items/query`,
    searchForm:[
      {type: 'input', id: 'itemCode', label: '预算项目代码'},
      {type: 'input', id: 'itemName', label: '预算项目名称'},
    ],
    columns: [
      {title: '预算项目代码', dataIndex: 'itemCode'},
      {title: '预算项目名称', dataIndex: 'itemName'},
    ],
    key: 'id'
  },
  'currency': {
    title: "币种",
    url: `${config.baseUrl}/api/company/standard/currency`,
    searchForm: [],
    columns: [
      {title: '币种名', dataIndex: 'currencyName'},
      {title: '代码', dataIndex: 'currency'},
      {title: '生效汇率', dataIndex: 'rate'}
    ]
  }

};

export default selectorData;
