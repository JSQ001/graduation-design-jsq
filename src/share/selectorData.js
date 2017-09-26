import { Badge } from 'antd'
import config from 'config'
import { injectIntl } from 'react-intl';

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
  'company': {
    title: '添加公司',
    url: `${config.baseUrl}/api/budget/structures/query`,
    searchForm: [
      {
        type: 'input', id: 'companyCode', label: "公司代码"/*this.props.intl.formatMessage({id:'structure.companyCode'})*/ /*公司代码*/
      },
      {
        type: 'input', id: 'companyName', label: "公司名称"/*this.props.intl.formatMessage({id:'structure.companyName'})*/ /*公司名称*/
      },
      {
        type: 'input', id: 'companyCodeFrom', label:"公司代码从" /*this.props.intl.formatMessage({id:'structure.companyCodeFrom'})*/ /*公司代码从*/
      },
      {
        type: 'input', id: 'companyCodeTo', label: "公司代码至"/* this.props.intl.formatMessage({id:'structure.companyCodeTo'})*/ /*公司代码至*/
      }
    ],
    columns: [
      {title: "公司代码"/*this.props.intl.formatMessage({id:'structure.companyCode'})*/, dataIndex: 'companyCode'},/*公司代码*/
      {title: "公司明称"/*this.props.intl.formatMessage({id:'structure.companyName'})*/, dataIndex: 'companyName'}, /*公司明称*/
      {title: "公司类型" /*this.props.intl.formatMessage({id:'structure.companyType'})*/, dataIndex: 'companyCode'} /*公司类型*/
    ],
    key: 'companyOID'
  },
  'itemType': {
    title: "预算项目类型",
    url: `${config.baseUrl}/api/budget/itemType/query`,
    searchForm:[
      {type: 'input', id: 'itemTypeCode', label: '预算项目类型代码'},
      {type: 'input', id: 'itemTypeName', label: '预算项目类型代码'},
    ],
    columns: [
      {title: '预算项目类型代码', dataIndex: 'itemTypeCode'},
      {title: '预算项目类型名称', dataIndex: 'itemTypeName'},
    ],
    key: 'itemTypeOID'
  }
};

export default injectIntl(selectorData);
