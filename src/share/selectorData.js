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
  'budget_structure': {
    title: '选择预算表',
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
  }
};

export default selectorData;
