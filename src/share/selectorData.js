import { Badge } from 'antd'
import config from 'config'

const selectorData = {
  'user': {
    title: '选择人员',
    url: `${config.baseUrl}/api/users/v2/search`,
    searchForm: [
      {type: 'input', id: 'keyword', label: '员工工号、姓名'}
    ],
    columns: [
      {title: '工号', dataIndex: 'employeeID', width: '25%'},
      {title: '姓名', dataIndex: 'fullName', width: '25%'},
      {title: '部门名称', dataIndex: 'departmentName', width: '25%'},
      {title: '职务', dataIndex: 'title', width: '25%'},
    ],
    key: 'userOID'
  },
  'user_group': {
    title: '选择人员组',
    url: `${config.baseUrl}/api/user/groups/search`,
    searchForm: [
      {type: 'input', id: 'name', label: '人员组名称'}
    ],
    columns: [
      {title: '代码', dataIndex: 'code', width: '30%'},
      {title: '名称', dataIndex: 'name', width: '30%'},
      {title: '描述', dataIndex: 'comment', width: '40%'}
    ],
    key: 'id'
  },
  'budget_journal_structure': {
    title: '选择预算日记账所需的预算表',
    url: `${config.budgetUrl}/api/budget/journal/type/assign/structures/queryStructure`,
    searchForm: [
      {type: 'input', id: 'structureCode', label: '预算表代码'},
      {type: 'input', id: 'structureName', label: '预算表名称'},
      {type: 'select', id: 'structureCodeFrom', label: '预算表代码从', options: [], getUrl: `${config.budgetUrl}/api/budget/structures/queryAll`,
        labelKey: 'structureCode', valueKey: 'structureCode', method: 'get', renderOption: (data) => `${data.structureCode}(${data.structureName})`},
      {type: 'select', id: 'structureCodeTo', label: '预算表代码至', options: [], getUrl: `${config.budgetUrl}/api/budget/structures/queryAll`,
        labelKey: 'structureCode', valueKey: 'structureCode', method: 'get', renderOption: (data) => `${data.structureCode}(${data.structureName})`}
    ],
    columns: [
      {title: '预算表代码', dataIndex: 'structureCode', width: '45%'},
      {title: '预算表名称', dataIndex: 'structureName', width: '55%'}
    ],
    key: 'structureCode'
  },
  'budget_journal_item': {
    title: '选择预算日记账所需的预算项目',
    url: `${config.budgetUrl}/api/budget/journal/type/assign/items/queryItem`,
    searchForm: [
      {type: 'input', id: 'itemCode', label: '预算项目代码'},
      {type: 'input', id: 'itemName', label: '预算项目名称'},
      {type: 'select', id: 'itemCodeFrom', label: '预算项目从', options: [], getUrl: `${config.budgetUrl}/api/budget/items/find/all`,
        labelKey: 'itemCode', valueKey: 'itemCode', method: 'get', renderOption: (data) => `${data.itemCode}(${data.itemName})`},
      {type: 'select', id: 'itemCodeTo', label: '预算项目至', options: [], getUrl: `${config.budgetUrl}/api/budget/items/find/all`,
        labelKey: 'itemCode', valueKey: 'itemCode', method: 'get', renderOption: (data) => `${data.itemCode}(${data.itemName})`}
    ],
    columns: [
      {title: '预算项目代码', dataIndex: 'itemCode', width: '45%'},
      {title: '预算项目名称', dataIndex: 'itemName', width: '55%'}
    ],
    key: 'itemCode'
  },
  'budget_journal_company': {
    title: '选择预算日记账所需的公司',
    url: `${config.budgetUrl}/api/budget/journal/type/assign/companies/filter`,
    searchForm: [
      {type: 'input', id: 'companyCode', label: "公司代码"},
      {type: 'input', id: 'companyName', label: "公司名称"},
      {type: 'input', id: 'companyCodeFrom', label: '公司代码从'},
      {type: 'input', id: 'companyCodeTo', label: '公司代码至'},
    ],
    columns: [
      {title: "公司代码", dataIndex: 'code'},
      {title: "公司名称", dataIndex: 'name'},
      {title: "公司类型", dataIndex: 'attribute4'}
    ],
    key: 'id'
  },
  'budget_item': {
    title: '选择预算项目',
    url: `${config.budgetUrl}/api/budget/items/query`,
    searchForm: [
      {type: 'input', id: 'itemCode', label: '预算项目代码'},
      {type: 'select', id: 'itemCodeFrom', label: '预算项目从', options: [], getUrl: `${config.budgetUrl}/api/budget/items/find/all`,
        labelKey: 'itemCode', valueKey: 'itemCode', method: 'get', renderOption: (data) => `${data.itemCode}(${data.itemName})`},
      {type: 'select', id: 'itemCodeTo', label: '预算项目至', options: [], getUrl: `${config.budgetUrl}/api/budget/items/find/all`,
        labelKey: 'itemCode', valueKey: 'itemCode', method: 'get', renderOption: (data) => `${data.itemCode}(${data.itemName})`}
    ],
    columns: [
      {title: '预算项目代码', dataIndex: 'itemCode', width: '45%'},
      {title: '预算项目名称', dataIndex: 'itemName', width: '55%'}
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
      {title: '预算项目名称', dataIndex: 'itemName', width: '40%'},
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
      {type: 'input', id: 'journalTypeCode', label: '预算日记账类型代码',},
      {type: 'input', id: 'journalTypeName', label: '预算日记账类型名称',},
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
      {type: 'input', id: 'itemGroupName', label: "预算项目组名称"}
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
    searchForm: [],
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
      {title: "公司代码", dataIndex: 'code'},
      {title: "公司名称", dataIndex: 'name'},
      {title: "公司类型", dataIndex: 'attribute4'}
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
      {title: "公司代码", dataIndex: 'code'},
      {title: "公司名称", dataIndex: 'name'},
      {title: "公司类型", dataIndex: 'attribute4'}
    ],
    key: 'id'
  },
  'company_group': {
    title: "公司组",
    url: `${config.baseUrl}/api/company/group/query/section/dto`,
    searchForm: [
      /*{type: 'select', id: 'setOfBooksId', label: '帐套', options: [],
        getUrl: `${config.baseUrl}/api/setOfBooks/by/tenant`, method: 'get', labelKey: 'setOfBooksCode', valueKey: 'id', getParams: {roleType: 'TENANT'}},
 */     {type: 'input', id: 'companyGroupCode', label: '公司组代码'},
      {type: 'input', id: 'companyGroupName', label: '公司组名称'},
    ],
    columns: [
      {title: '公司组代码', dataIndex: 'companyGroupCode'},
      {title: '公司组描述', dataIndex: 'companyGroupName'}
    ],
    key: 'id'
  },
  'department':{
    title: "部门",
    url: `${config.baseUrl}/api/DepartmentGroup/selectDept/enabled`,
    searchForm: [
      {type: 'input', id: 'deptCode', label: '部门号', defaultValue: ''},
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
    url: `${config.baseUrl}/api/DepartmentGroup/selectByInputAndEnabled`,
    searchForm: [
      {type: 'input', id: 'deptGroupCode', label: '部门组代码', defaultValue: ''},
      {type: 'input', id: 'description', label: '部门组描述', defaultValue: ''},
    ],
    columns: [
      {title: '部门组代码', dataIndex: 'deptGroupCode'},
      {title: '部门组名称', dataIndex: 'description'}
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
    ],
    key: 'id'
  },
  'company': {
    title: '选择公司',
    url: `${config.baseUrl}/api/company/by/condition`,
    searchForm: [
      {type: 'input', id: 'companyCode', label: "公司代码"},
      {type: 'input', id: 'name', label: "公司名称"},
      {type: 'input', id: 'companyCodeFrom', label:"公司代码从"},
      {type: 'input', id: 'companyCodeTo', label: "公司代码至"}
    ],
    columns: [
      {title: "公司代码", dataIndex: 'companyCode'},
      {title: "公司名称", dataIndex: 'name'},
      {title: "公司类型", dataIndex:'companyTypeName'}
    ],
    key: 'id'
  },
  'cost_center_item_by_id': {
    title: '成本中心',
    url: `${config.baseUrl}/api/my/cost/center/items/by/costcenterid`,
    searchForm: [],
    columns: [
      {title: "成本中心代码", dataIndex: 'code'},
      {title: "成本中心名称", dataIndex: 'name'}
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
    key: 'id'
  },
  'journal_line_department':{
    title: "选择部门",
    url: `${config.budgetUrl}/api/budget/journals/selectDepartmentsByCompanyAndTenant`,
    searchForm: [
      {type: 'input', id:'deptCode', label: '部门代码', defaultValue: ''},
      {type: 'input', id:'deptName', label: '部门名称', defaultValue: ''},
    ],
    columns: [
      {title: '部门代码', dataIndex: 'code'},
      {title: '部门名称', dataIndex: 'name'}
    ],
    key: 'id'
  },
  'user_move_select_company': {
    title: '选择公司',
    url: `${config.baseUrl}/api/company/available`,
    searchForm: [
      {type: 'input', id: 'keyword', label: "公司代码/公司名称",defaultValue:''},
    ],
    columns: [
      {title: "公司代码", dataIndex: 'companyCode'},
      {title: "公司名称", dataIndex: 'name'},
      {title:"描述",dataIndex:'description'}
    ],
    key: 'companyOID'
  },
  'cash_flow_item': {
    title: '现金流量项',
    url: `${config.payUrl}/api/cash/flow/items/query`,
    searchForm: [
      {type: 'input', id:'flowCode', label: '	现金流量项代码', defaultValue: ''},
      {type: 'input', id:'description', label: '现金流量项名称', defaultValue: ''},
    ],
    columns: [
      {title: "现金流量项代码", dataIndex: 'flowCode'},
      {title: "现金流量项名称", dataIndex: 'description'},
    ],
    key: 'id'
  },
  'assign-transaction': {
    title: '分配现金事务',
    url: `${config.payUrl}/api/cash/transaction/classes/query`,
    searchForm: [
      {type: 'input', id: 'setOfBookId', label: "账套",defaultValue:''},
      {type: 'input', id: 'classCode', label: "现金事务分类代码",},
      {type: 'input', id: 'description', label: "现金流量项描述",},
    ],
    columns: [
      {title: "账套", dataIndex: 'setOfBookId'},
      {title: "现金事务类型",dataIndex:"typeCode"},
      {title: "现金事务分类代码",dataIndex:"classCode"},
      {title: "	现金流量项描述", dataIndex: 'description'}
    ],
    key: 'id'
  },
  'journal_item': {
    title: '预算项目',
    url: `${config.budgetUrl}/api/budget/journals/selectItemsByJournalTypeAndCompany`,
    searchForm: [
      {type: 'input', id: 'itemCode', label: "预算项目代码",defaultValue: ''},
      {type: 'input', id: 'itemName', label: "预算项目名称",defaultValue: ''},
    ],
    columns: [
      {title: "预算项目代码", dataIndex: 'itemCode'},
      {title: "预算项目名称",dataIndex:"itemName"},
    ],
    key: 'id'
  },
  'budget_structure':{
    title: '预算表',
    url: `${config.budgetUrl}/api/budget/structures/query`,
    searchForm: [
      {type: 'input', id: 'structureCode', label: "预算表代码",defaultValue: ''},
      {type: 'input', id: 'structureName', label: "预算表名称",defaultValue: ''},
    ],
    columns: [
      {title: "预算表代码", dataIndex: 'structureCode'},
      {title: "预算表名称",dataIndex:"structureName"},
    ],
    key: 'id'
  },
  'pre_payment_type': {
    title: '预付款单类型选择',
    url: `${config.prePaymentUrl}/api/cash/pay/requisition/types/query`,
    searchForm: [
      {type: 'input', id: 'typeCode', label: "预付款单类型代码",defaultValue: ''},
      {type: 'input', id: 'typeName', label: "预付款单类型名称",defaultValue: ''},
    ],
    columns: [
      {title: "预付款单类型代码", dataIndex: 'typeCode'},
      {title: "预付款单类型名称",dataIndex:"typeName"},

    ],
    key: 'id'
  },
  'pre_payment_type': {
    title: '预付款单类型选择',
    url: `${config.prePaymentUrl}/api/cash/pay/requisition/types/query`,
    searchForm: [
      {type: 'input', id: 'typeCode', label: "预付款单类型代码",defaultValue: ''},
      {type: 'input', id: 'typeName', label: "预付款单类型名称",defaultValue: ''},
    ],
    columns: [
      {title: "预付款单类型代码", dataIndex: 'typeCode'},
      {title: "预付款单类型名称",dataIndex:"typeName"},

    ],
    key: 'id'
  },
  'bank_account': {
    title: '银行信息',
    url: `${config.payUrl}/api/cash/bank/user/defineds/query`,
    searchForm: [
      { type: 'input', id: 'keyword', label: "银行名称", defaultValue: '' },
    ],
    columns: [
      { title: "银行名称", dataIndex: 'bankName' },
      { title: "国家", dataIndex: "countryName" },
      { title: "城市", dataIndex: "cityName" },
      { title: "银行详细地址", dataIndex: "address" },
    ],
    key: 'id'
  },
  'select_authorization_company': {
    title: '选择公司',
    url: `${config.baseUrl}/api/company/available`,
    searchForm: [
      { type: 'input', id: 'keyword', label: "公司代码/公司名称", defaultValue: '' },
    ],
    columns: [
      { title: "公司代码", dataIndex: 'companyCode' },
      { title: "公司名称", dataIndex: 'name' },
      { title: "描述", dataIndex: 'description' }
    ],
    key: 'id'
  },
  'select_authorization_user': {
    title: '选择员工',
    url: `${config.baseUrl}/api/DepartmentGroup/get/users/by/department/and/company`,
    searchForm: [
      { type: 'input', id: 'companyId', label: '公司', defaultValue: ''},
      { type: 'input', id: 'departmentId', label: '部门', defaultValue: ''}
    ],
    columns: [
      { title: '用户代码', dataIndex: 'userCode', width: '25%' },
      { title: '姓名', dataIndex: 'userName', width: '25%' }
    ],
    key: 'userOID'
  },
  'year': {
    title: '年度',
    url: `${config.baseUrl}/api/periods/select/years/by/setOfBooksId`,
    searchForm:[],
    columns: [
      {title: "年", dataIndex: 'year'},
    ],
    key: 'year',
    isValue: true
  },
  'period': {
    title: '期间',
    searchForm:[],
    url: `${config.baseUrl}/api/periods/query/open/periods/by/setOfBook/id`,
    columns: [
      {title: "期间名称",dataIndex:"periodName"},
    ],
    key: 'id'
  },
  'quarter': {
    title: '季度',
    searchForm:[],
    url: `${config.baseUrl}/api/custom/enumeration/system/by/type`,
    columns: [
      {title: "季度", dataIndex: 'messageKey'},
    ],
    key: 'id',
    listKey: 'values',
  },
  'journal_employee': {
    title: '选择人员',
    url: `${config.baseUrl}/api/DepartmentGroup/get/users/by/department/and/company`,
    searchForm: [],
    columns: [
      {title: '代码', dataIndex: 'userCode'},
      {title: '姓名', dataIndex: 'userName'},
    ],
    key: 'userId'
  },
  'tenant_company': {
    title: '批量分配公司',
    url: `${config.baseUrl}/api/company/by/condition`,
    searchForm: [
      {type: 'select', id: 'setOfBook', label: "账套",options: [], getUrl: `${config.baseUrl}/api/setOfBooks/by/tenant?roleType=TENANT`, labelKey: 'setOfBooksName', valueKey: 'setOfBooksCode', method: 'get'},
      {type: 'input', id: 'keyWords', label: "公司代码/名称"},
      {type: 'input', id: 'companyCodeFrom', label:"公司代码从"},
      {type: 'input', id: 'companyCodeTo', label: "公司代码至"}
    ],
    columns: [
      {title: "公司代码", dataIndex: 'companyCode'},
      {title: "公司名称", dataIndex: 'name'},
      {title: "公司类型", dataIndex:'companyTypeName'},
      {title: "账套", dataIndex:'setOfBook'}
    ],
    key: 'id'
  },
  'section':{
    title: '科目段',
    url: `${config.baseUrl}/api/company/by/condition`,
    searchForm: [
      {type: 'input', id: 'sectionCode', label:"科目段代码"},
      {type: 'input', id: 'sectionName', label: "科目段名称"}
    ],
    columns: [
      {title: "科目段代码", dataIndex: 'sectionCode'},
      {title: "科目段代码", dataIndex: 'sectionName'},
    ],
    key: 'id'
  },
  'contract_type': {
    title: "合同类型",
    url: `${config.contractUrl}/contract/api/contract/type/contract/type/by/company`,
    searchForm: [
      {type: 'input', id: 'contractTypeCode', label: '合同类型代码'},
      {type: 'input', id: 'contractTypeName', label: '合同类型名称'},
      {type: 'input', id: 'contractCategory', label: '合同大类'}
    ],
    columns: [
      {title: '合同类型代码', dataIndex: 'contractTypeCode'},
      {title: '合同类型名称', dataIndex: 'contractTypeName'},
      {title: '合同大类', dataIndex: 'contractCategoryName'},
    ],
    key: 'id'
  }
};

export default selectorData;
