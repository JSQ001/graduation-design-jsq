import React from 'React'
import { injectIntl } from 'react-intl';
import { Form, Row, Col, Checkbox } from 'antd'
const CheckboxGroup = Checkbox.Group;
import config from 'config'

import SearchArea from 'components/search-area'

import 'styles/financial-management/finance-view.scss'

class FinanceView extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      searchForm: [
        {type: 'combobox', id: 'userOID', label: '申请人姓名/工号',  placeholder: '请输入姓名／工号', options: [],
          searchUrl: `${config.baseUrl}/api/search/users/all`, method: 'get',
          searchKey: 'keyword', labelKey: 'fullName', valueKey: 'userOID'},
        {type: 'combobox', id: 'businessCode', label: '单号',  placeholder: '请输入父单/子单/借款单号', options: [],
          searchUrl: `${config.baseUrl}/api/expense/report/loanApplication/search`, method: 'get',
          searchKey: 'keyword', getParams: {type: '10021008'}, labelKey: 'fullName', valueKey: 'userOID'},
        {type: 'items', id: 'dateRange', items: [
          {type: 'date', id: 'dateFrom', label: '提交日期从'},
          {type: 'date', id: 'dateTo', label: '提交日期至'}
        ]},
        {type: 'checkbox', id: 'status', label: '单号', options: [{label:'全部', value:'all'}]},
      ],
      checkboxListForm: [
        {id: 'entityType', items: [
          {label: '报销单', key: 'account', checked: ["1002"], options: [{label: '全部', value: '1002'}]},
          {label: '借款单', key: 'borrow', checked: ["1008"], options: [{label: '全部', value: '1008'}]}
        ]}
      ],
      searchParams: {
        entityType: '',
        userOID: '',
        businessCode: '',
        dateFrom: '',
        dateTo: '',
        status: ''
      }
    }
  }

  componentWillMount() {

  }

  getList() {
    let url = `${config.baseUrl}/api/approvals/filters/get`;
  }

  search = (result) => {
    console.log(result)
  };

  clear = () => {

  };

  handleCheckbox = (values) => {
    console.log(values);
    // let searchForm = this.state.searchForm;
    // searchForm[0].getParams = (values.length === 1 ?values[0] : '10021008');
    // this.setState({ searchForm })
  };

  render() {
    const { searchForm, checkboxListForm } = this.state;
    return (
      <div className="finance-view">
        <SearchArea searchForm={searchForm}
                    checkboxListForm={checkboxListForm}
                    submitHandle={this.search}
                    clearHandle={this.clear}
                    checkboxChange={this.handleCheckbox}/>

      </div>
    )
  }
}

const WrappedUploadFile= Form.create()(injectIntl(FinanceView));

export default WrappedUploadFile;

