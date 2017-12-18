import React from 'React'
import { injectIntl } from 'react-intl';
import { Form, Button, Table, message } from 'antd'
import moment from 'moment'
import config from 'config'
import httpFetch from "../../share/httpFetch";

import SearchArea from 'components/search-area'

import 'styles/financial-management/finance-view.scss'

class FinanceView extends React.Component{
  constructor(props) {
    super(props);
    const {formatMessage} = this.props.intl;
    this.state = {
      loading: false,
      exportLoading: false,
      searchForm: [
        {type: 'combobox', id: 'userOID', label: formatMessage({id: 'finance.view.search.application'}),
          placeholder: formatMessage({id: 'common.please.enter'}) + formatMessage({id: 'finance.view.search.application'}),
          options: [], searchUrl: `${config.baseUrl}/api/search/users/all`,
          method: 'get', searchKey: 'keyword', labelKey: 'fullName', valueKey: 'userOID'}, //申请人姓名/工号
        {type: 'combobox', id: 'businessCode', label: formatMessage({id: 'finance.view.search.businessCode'}),
          placeholder: formatMessage({id: 'common.please.enter'}) + formatMessage({id: 'finance.view.search.businessCode'}),
          options: [], searchUrl: `${config.baseUrl}/api/expense/report/loanApplication/search`, method: 'get',
          searchKey: 'keyword', getParams: {type: '10021008'}, labelKey: '_self', valueKey: '_self'}, //父单/子单/借款单号
        {type: 'items', id: 'dateRange', items: [
          {type: 'date', id: 'beginDate', label: formatMessage({id: 'finance.view.search.dateFrom'})}, //提交日期从
          {type: 'date', id: 'endDate', label: formatMessage({id: 'finance.view.search.dateTo'})} //提交日期至
        ]},
        {type: 'checkbox', id: 'status', label: formatMessage({id: 'common.column.status'}), colSpan: 24, options: [ //状态
          {label: formatMessage({id: 'finance.view.search.submitted'}), value: 'submitted'}, //审批中
          {label: formatMessage({id: 'finance.view.search.pass'}), value: 'approval_pass'},  //已通过
          {label: formatMessage({id: 'finance.view.search.reject'}), value: 'approval_reject'}, //已驳回
          {label: formatMessage({id: 'finance.view.search.auditPass'}), value: 'audit_pass'}, //审核通过
          {label: formatMessage({id: 'finance.view.search.auditReject'}), value: 'audit_reject'}, //审核驳回
          {label: formatMessage({id: 'finance.view.search.paying'}), value: 'payment_in_process'}, //付款中
          {label: formatMessage({id: 'finance.view.search.payed'}), value: 'finance_loan'}, //已付款
          {label: formatMessage({id: 'finance.view.search.refund'}), value: 'paid_in_process'}, //还款中
          {label: formatMessage({id: 'finance.view.search.chargeOff'}), value: 'paid_finish'}, //已核销
        ]},
      ],
      checkboxListForm: [
        {id: 'entityType', items: [
          {label: '报销单', key: 'account', checked: ["1002"], options: [{label: '全部', value: '1002'}]},
          {label: '借款单', key: 'borrow', checked: ["1008"], options: [{label: '全部', value: '1008'}]}
        ]}
      ],
      searchParams: {
        entityType: '10021008',
        userOID: '',
        businessCode: '',
        beginDate: '',
        endDate: '',
        status: ''
      },
      columns: [
        {title: formatMessage({id: 'common.sequence'}), dataIndex: 'index', width: '7%', render: (text, record, index) => (this.state.page * 10 + index + 1)},  //序号
        {title: '申请人', dataIndex: 'applicant'},
        {title: '提交日期', dataIndex: 'createDate', render: date => moment(date).format('YYYY-MM-DD')},
        {title: '单据类型', dataIndex: 'formName'},
        {title: '单号', dataIndex: 'businessCode'},
        {title: '币种', dataIndex: 'currencyCode'},
        {title: '总金额', dataIndex: 'totalAmount', render: this.filterMoney},
        {title: formatMessage({id: 'common.column.status'}), dataIndex: 'statusView',
          render: (status, record) => {return this.handleStatus(status, record.rejectType)}} //状态
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
      if (paramsName === 'status') {
        params.status && params.status.map(value => { url += `&status=${value}` })
      } else if (paramsName === 'beginDate' && params.beginDate) {
        url += `&beginDate=${(params.beginDate).format('YYYY-MM-DD 00:00:00')}`
      } else if (paramsName === 'endDate' && params.endDate) {
        url += `&endDate=${(params.endDate).format('YYYY-MM-DD 23:59:59')}`;
      } else {
        url += params[paramsName] ? `&${paramsName}=${params[paramsName]}` : '';
      }
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
    }).catch((e) => {

    })
  }

  //列表"状态"返回值
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
      case 1006:
        return '还款中';
      case 1007:
        return '已核销';
      case 1008:
        return '付款中';
      default:
        return '';
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
      beginDate: result.beginDate,
      endDate: result.endDate,
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
    let searchParams = {
      entityType: '10021008',
      userOID: null,
      businessCode: null,
      beginDate: null,
      endDate: null,
      status: null
    };
    this.setState({ searchParams })
  };

  //顶部横条checkbox搜索框处理事件
  handleCheckbox = (values) => {
    let searchForm = this.state.searchForm;
    searchForm[1].getParams.type = (values.length === 1 ? values[0] : '10021008');
    this.setState({ searchForm })
  };

  //导出事件
  handleExport = () => {
    let url = `${config.baseUrl}/api/reimbursement/batch/detail/export/expensReportOrApplication?`;
    let params = this.state.searchParams;
    for(let paramsName in params) {
      if (paramsName === 'status') {
        params.status && params.status.map(value => { url += `&status=${value}` })
      } else if (paramsName === 'beginDate' && params.beginDate) {
        url += `&beginDate=${(params.beginDate).format('YYYY-MM-DD 00:00:00')}`
      } else if (paramsName === 'endDate' && params.endDate) {
        url += `&endDate=${(params.endDate).format('YYYY-MM-DD 23:59:59')}`;
      } else {
        url += params[paramsName] ? `&${paramsName}=${params[paramsName]}` : '';
      }
    }
    this.setState({ exportLoading: true });
    httpFetch.get(url).then((res) => {
      if (res.status === 200) {
        let b = new Blob([res], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
        console.log(b)
        // saveAs(b, "单据导出.xlsx");
        this.setState({ exportLoading: false });
        message.success('导出成功')
      }
    }).catch((e) => {
      if (e.response) {
        this.setState({ exportLoading: false });
        message.error(`导出失败，${e.response.message}`)
      }
    })
  };

  render() {
    const { loading, exportLoading, searchForm, checkboxListForm, columns, data, pagination } = this.state;
    return (
      <div className="finance-view">
        <SearchArea searchForm={searchForm}
                    checkboxListForm={checkboxListForm}
                    submitHandle={this.search}
                    clearHandle={this.clear}
                    checkboxChange={this.handleCheckbox}/>
        <div className="table-header">
          <div className="table-header-buttons">
            <Button type="primary" onClick={this.handleExport} loading={exportLoading}>导出搜索数据</Button>
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

