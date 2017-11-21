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
      {type: 'select', id: 'structureCodeFrom', label: '预算表代码从', options: [], getUrl: `${config.budgetUrl}/api/budget/structures/queryAll`, labelKey: 'structureCode', valueKey: 'structureCode', method: 'get'},
      {type: 'select', id: 'structureCodeTo', label: '预算表代码至', options: [], getUrl: `${config.budgetUrl}/api/budget/structures/queryAll`, labelKey: 'structureCode', valueKey: 'structureCode', method: 'get'}
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
      {type: 'select', id: 'itemCodeFrom', label: '预算项目从', options: [], getUrl: `${config.budgetUrl}/api/budget/items/find/all`, labelKey: 'itemCode', valueKey: 'itemCode', method: 'get'},
      {type: 'select', id: 'itemCodeTo', label: '预算项目至', options: [], getUrl: `${config.budgetUrl}/api/budget/items/find/all`, labelKey: 'itemCode', valueKey: 'itemCode', method: 'get'}
    ],
    columns: [
      {title: '预算项目代码', dataIndex: 'itemCode', width: '45%'},
      {title: '预算项目描述', dataIndex: 'itemName', width: '55%'}
    ],
    key: 'itemCode'
  },
  'budget_journal_company': {
    title: '选择预算日记账所需的公司',
    url: `${config.budgetUrl}/api/budget/journal/type/assign/companies/filter`,
    searchForm: [
      {type: 'input', id: 'companyCode', label: "公司代码"},
      {type: 'input', id: 'companyName', label: "公司名称"}
    ],
    columns: [
      {title: "公司代码", dataIndex: 'code'},
      {title: "公司名称", dataIndex: 'name'},
      {title: "公司描述", dataIndex: 'description'}
    ],
    key: 'id'
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
      {title: "公司名称", dataIndex: 'name'},
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
      {title: "公司名称", dataIndex: 'name'},
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
    url: `${config.baseUrl}/api/cost/center/company`,
    searchForm: [
      {type: 'input', id: 'code', label: '维度代码'},
      {type: 'input', id: 'name', label: '维度名称'},
    ],
    columns: [
      {title: '维度代码', dataIndex: 'code', width: '25%'},
      {title: '维度名称', dataIndex: 'name', width: '25%'},
      {title: '公司级别', dataIndex: 'companyLevel', width: '25%'},
      {title: '系统级别', dataIndex: 'systemLevel', width: '25%'},
    ],
    key: 'id'
  },
  'select_dimensionValue':{
    title: '选择默认维值',
    searchForm: [
      {type: 'input', id: 'code', label: '维值代码'},
      {type: 'input', id: 'name', label: '维值名称'},
    ],
    columns: [
      {title: '维值代码', dataIndex: 'code', width: '25%'},
      {title: '维值名称', dataIndex: 'name', width: '25%'},
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
    searchForm:[
      {type: 'input', id: 'itemGroupCode', label: "预算项目组代码"},
      {type: 'input', id: 'itemGroupName', label: "预算项目组名称"},
      {type: 'input', id: 'itemGroupCodeFrom', label:"预算项目组代码从"},
      {type: 'input', id: 'itemGroupNameTo', label: "预算项目组名称至"}
    ],
    columns: [
      {title: '预算项目组代码', dataIndex: 'itemGroupCode'},
      {title: '预算项目组名称', dataIndex: 'itemGroupName'},
    ],
    key: 'id'
  },
  'currency': {
    title: "币种",
    url: `${config.baseUrl}/api/company/standard/currency`,
    searchForm: [
      {type: 'input', id: 'currencyName', label: "币种名"},
      {type: 'input', id: 'currency', label: "代码"},
      {type: 'rate', id: 'currency', label: "生效汇率"},
    ],
    columns: [
      {title: '币种名', dataIndex: 'currencyName'},
      {title: '代码', dataIndex: 'currency'},
      {title: '生效汇率', dataIndex: 'rate'}
    ],
    key: 'currency'
  },
  'company_structure':{
    title: '添加公司',
    url: `${config.budgetUrl}/api/budget/structure/assign/companies/filter`,
    searchForm: [
      {type: 'input', id: 'companyCode', label: "公司代码"},
      {type: 'input', id: 'companyName', label: "公司名称"},
      {type: 'input', id: 'companyCodeFrom', label:"公司代码从"},
      {type: 'input', id: 'companyCodeTo', label: "公司代码至"}
    ],
    columns: [
      {title: "公司代码", dataIndex: 'companyCode'},
      {title: "公司名称", dataIndex: 'name'},
      {title: "公司类型", dataIndex: 'companyTypeName'}
    ],
    key: 'id'
  },
  'company_item':{
    title: '添加公司',
    url: `${config.budgetUrl}/api/budget/item/companies/query/filter`,
    searchForm: [
      {type: 'input', id: 'companyCode', label: "公司代码"},
      {type: 'input', id: 'companyName', label: "公司名称"},
      {type: 'input', id: 'companyCodeFrom', label:"公司代码从"},
      {type: 'input', id: 'companyCodeTo', label: "公司代码至"}
    ],
    columns: [
      {title: "公司代码", dataIndex: 'companyCode'},
      {title: "公司名称", dataIndex: 'name'},
      {title: "公司类型", dataIndex: 'companyTypeName'}
    ],
    key: 'id'
  },
  'company_group': {
    title: "公司组",
    url: `${config.baseUrl}/api/company/group/query/dto`,
    searchForm: [
      {type: 'select', id: 'setOfBooksId', label: '帐套', options: [],
        getUrl: `${config.baseUrl}/api/setOfBooks/by/tenant`, method: 'get', labelKey: 'setOfBooksCode', valueKey: 'id', getParams: {roleType: 'TENANT'}},
      {type: 'input', id: 'companyGroupCode', label: '公司组代码'},
      {type: 'input', id: 'companyGroupName', label: '公司组描述'},
    ],
    columns: [
      {title: '公司组代码', dataIndex: 'companyGroupCode'},
      {title: '公司组描述', dataIndex: 'companyGroupName'}
    ],
    key: 'id'
  },
  'department':{
    title: "部门",
    url: `${config.baseUrl}/api/DepartmentGroup/selectDepartmentByTenantId`,
    searchForm: [
      {type: 'input', id: 'custDeptNumber', label: '部门号', defaultValue: ''},
      {type: 'input', id: 'name', label: '部门名称', defaultValue: ''},
    ],
    columns: [
      {title: '部门号', dataIndex: 'custDeptNumber'},
      {title: '部门名称', dataIndex: 'name'}
    ],
    key: 'id'
  },
  'department_group': {
    title: "部门组",
    url: `${config.baseUrl}/api/DepartmentGroup/selectByInput`,
    searchForm: [
      {type: 'input', id: 'deptGroupCode', label: '部门组代码', defaultValue: ''},
      {type: 'input', id: 'description', label: '部门组描述', defaultValue: ''},
    ],
    columns: [
      {title: '部门组代码', dataIndex: 'deptGroupCode'},
      {title: '部门组描述', dataIndex: 'description'}
    ],
    key: 'id'
  },
  'version_company': {
    title: '添加公司',
    url: `${config.budgetUrl}/api/budget/version/assign/companies/query/filter`,
    searchForm: [
      {type: 'input', id: 'code', label: "公司代码"},
      {type: 'input', id: 'name', label: "公司名称"},
      {type: 'input', id: 'companyCodeFrom', label:"公司代码从"},
      {type: 'input', id: 'companyCodeTo', label: "公司代码至"}
    ],
    columns: [
      {title: "公司代码", dataIndex: 'code'},
      {title: "公司名称", dataIndex: 'name'},
      {title:"描述",dataIndex:'description'}
      /* {title: "公司类型", dataIndex: 'companyTypeName'}*/
    ],
    key: 'id'
  },
  'company_group_lov': {
    title: '添加公司',
    url: `${config.baseUrl}/api/company/by/condition`,
    searchForm: [
      {type: 'input', id: 'code', label: "公司代码"},
      {type: 'input', id: 'name', label: "公司名称"},
      {type: 'input', id: 'companyCodeFrom', label:"公司代码从"},
      {type: 'input', id: 'companyCodeTo', label: "公司代码至"}
    ],
    columns: [
      {title: "公司代码", dataIndex: 'code'},
      {title: "公司明称", dataIndex: 'name'},
      {title:"描述",dataIndex:'description'}
      /* {title: "公司类型", dataIndex: 'companyTypeName'}*/
    ],
    key: 'id'
  },
  'cost_center_item': {
    title: '成本中心',
    url: `${config.baseUrl}/api/my/cost/center/items/`,
    searchForm: [],
    columns: [
      {title: "成本中心代码", dataIndex: 'code'},
      {title: "成本中心名称", dataIndex: 'name'}
    ],
    key: 'costCenterItemOID'
  },


  'journal_line_company': {
    title: '选择公司',
    url: `${config.baseUrl}/api/company/by/condition`,
    searchForm: [
      {type: 'input', id: 'companyCode', label: "公司代码"},
      {type: 'input', id: 'name', label: "公司名称"},
    ],
    columns: [
      {title: "公司代码", dataIndex: 'companyCode'},
      {title: "公司名称", dataIndex: 'name'},
      {title:"描述",dataIndex:'description'}
    ],
  key: 'id'
},
  'journal_line_department':{

    title: "选择部门",
    url: `${config.budgetUrl}/api/budget/journals/selectDepartmentsByCompanyAndTenant`,
    searchForm: [
      {type: 'input', id:'deptCode', label: '部门代码',defaultValue: ''},
      {type: 'input', id:'deptName', label: '部门名称',defaultValue: ''},
    ],
    columns: [
      {title: '部门代码', dataIndex: 'code'},
      {title: '部门名称', dataIndex: 'name'}
    ],
    key: 'id'
  },


};

export default selectorData;
