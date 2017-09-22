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
  }
};

export default selectorData;
