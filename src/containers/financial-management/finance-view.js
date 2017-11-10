import React from 'React'
import { injectIntl } from 'react-intl';
import { Form, Button, Table } from 'antd'
import moment from 'moment'
import config from 'config'
import httpFetch from "../../share/httpFetch";

import SearchArea from 'components/search-area'

import 'styles/financial-management/finance-view.scss'

class FinanceView extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      searchForm: [
        {type: 'combobox', id: 'userOID', label: '申请人姓名/工号',  placeholder: '请输入姓名／工号', options: [],
          searchUrl: `${config.baseUrl}/api/search/users/all`, method: 'get',
          searchKey: 'keyword', labelKey: 'fullName', valueKey: 'userOID'},
        {type: 'combobox', id: 'businessCode', label: '单号',  placeholder: '请输入父单/子单/借款单号', options: [],
          searchUrl: `${config.baseUrl}/api/expense/report/loanApplication/search`, method: 'get',
          searchKey: 'keyword', getParams: {type: '10021008'}, labelKey: '_self', valueKey: '_self'},
        {type: 'items', id: 'dateRange', items: [
          {type: 'date', id: 'dateFrom', label: '提交日期从'},
          {type: 'date', id: 'dateTo', label: '提交日期至'}
        ]},
        {type: 'checkbox', id: 'status', label: '单号', options: this.checkboxOptions},
      ],
      checkboxListForm: [
        {id: 'entityType', items: [
          {label: '报销单', key: 'account', checked: ["1002"], options: [{label: '全部', value: '1002'}]},
          {label: '借款单', key: 'borrow', checked: ["1008"], options: [{label: '全部', value: '1008'}]}
        ]}
      ],
      checkboxOptions: [
        {label: '全部', value: 'all'},
        {label: '审批中', value: 'submitted'},
        {label: '已通过', value: 'approval_pass'},
        {label: '已驳回', value: 'approval_reject'},
        {label: '审核通过', value: 'audit_pass'},
        {label: '审核驳回', value: 'audit_reject'},
        {label: '付款中', value: 'payment_in_process'},
        {label: '已付款', value: 'finance_loan'},
        {label: '还款中', value: 'paid_in_process'},
        {label: '已核销', value: 'paid_finish'},
      ],
      searchParams: {
        entityType: '10021008',
        userOID: '',
        businessCode: '',
        dateFrom: '',
        dateTo: '',
        status: ''
      },
      columns: [
        {title: '序号', dataIndex: 'index', width: '7%', render: (text, record, index) => (this.state.page * 10 + index + 1)},
        {title: '申请人', dataIndex: 'applicant'},
        {title: '提交日期', dataIndex: 'createDate', render: date => moment(date).format('YYYY-MM-DD')},
        {title: '单据类型', dataIndex: 'formName'},
        {title: '单号', dataIndex: 'businessCode'},
        {title: '币种', dataIndex: 'currencyCode'},
        {title: '总金额', dataIndex: 'totalAmount', render: this.filterMoney},
        {title: '状态', dataIndex: 'statusView', render: (status, record) => {return this.handleStatus(status, record.rejectType)}},
      ],
      data: [],
      pagination: {
        total: 0
      },
      pageSize: 10,
      page: 0,
    }
  }

  componentWillMount() {
    this.getList()
  }

  getList() {
    let url = `${config.baseUrl}/api/approvals/filters/get?size=${this.state.pageSize}&page=${this.state.page}`;
    let params = this.state.searchParams;
    for(let paramsName in params) {
      url += params[paramsName] ? `&${paramsName}=${params[paramsName]}` : '';
    }
    this.setState({ loading: true });
    httpFetch.get(url).then((res) => {
      if (res.status === 200) {
        this.setState({
          loading: false,
          data: res.data,
          pagination: {
            total: Number(res.headers['x-total-count']),
            onChange: this.onChangePager,
            pageSize: this.state.pageSize
          }
        })
      }
    }).then((e) => {

    })
  }

  handleStatus = (status, rejectType) => {
    switch (status) {
      case 1001:
        switch (rejectType) {
          case 1001:
            return '已撤回';//已撤回
          case 1002:
            return '已驳回';//已驳回
          case 1003:
            return '审核驳回';
          case 1004:
            return '开票驳回';
          default:
            return '编辑中';
        }
      case 1002:
        return '审批中';
      case 1003:
        return '已通过';
      case 1004:
        return '审核通过';
      case 1005:
        return '已付款';
      case 1006:  // 借款申请还款中
        return '还款中';
      case 1007:
        // if($scope.applicationType === 2005){
        //   $scope.statusClass = 'PAYMENT';
        //   $scope.statusDisplayName = $filter('translate')('directives.approval.js.yetRepayment');//已还款
        // }else {
        //   $scope.statusClass = 'BILLED';
        //   $scope.statusDisplayName = $filter('translate')('directives.approval.js.invoicePass');//开票通过
        // }
        // break;
      case 1008:  // 借款申请付款中
        return '还款中';
      default:

    }
  };

  onChangePager = (page) => {
    if (page - 1 !== this.state.page) {
      this.setState({ page: page - 1 }, () => {
        this.getList()
      })
    }
  };

  search = (result) => {
    let searchParams = {
      entityType: this.state.searchForm[1].getParams.type,
      userOID: result.userOID,
      businessCode: result.businessCode,
      dateFrom: result.dateFrom,
      dateTo: result.dateTo,
      status: result.status
    };
    this.setState({
      searchParams:searchParams,
      page: 0,
      pagination: {
        current: 1
      }
    }, ()=>{
      this.getList();
    })
  };

  clear = () => {
    console.log(123)
    let searchParams = {
      entityType: '10021008',
      userOID: null,
      businessCode: null,
      dateFrom: null,
      dateTo: null,
      status: null
    };
    this.setState({ searchParams })
  };

  handleCheckbox = (values) => {
    let searchForm = this.state.searchForm;
    searchForm[1].getParams.type = (values.length === 1 ? values[0] : '10021008');
    this.setState({ searchForm })
  };

  handleExport = () => {};

  render() {
    const { loading, searchForm, checkboxListForm, columns, data, pagination } = this.state;
    return (
      <div className="finance-view">
        <SearchArea searchForm={searchForm}
                    checkboxListForm={checkboxListForm}
                    submitHandle={this.search}
                    clearHandle={this.clear}
                    checkboxChange={this.handleCheckbox}/>
        <div className="table-header">
          <div className="table-header-buttons">
            <Button type="primary" onClick={this.handleExport}>导出搜索数据</Button>
          </div>
          <div className="table-header-title">{`共搜索到 ${pagination.total || 0} 条数据`}</div>
        </div>
        <Table rowKey={record => record.entityOID}
               columns={columns}
               dataSource={data}
               loading={loading}
               pagination={pagination}
               bordered
               size="middle"/>
      </div>
    )
  }
}

const WrappedUploadFile= Form.create()(injectIntl(FinanceView));

export default WrappedUploadFile;

