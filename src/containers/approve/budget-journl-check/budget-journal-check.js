import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { Form,Popover, Tabs, Table, message } from 'antd'
const TabPane = Tabs.TabPane;
import config from 'config'
import httpFetch from 'share/httpFetch'
import menuRoute from 'share/menuRoute'
import SearchArea from 'components/search-area'

class BudgetJournalCheck extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      loading1: false,
      loading2: false,
      SearchForm: [
        {type: 'input', id: 'businessCode', label: this.props.intl.formatMessage({id:"budgetJournal.budgetHistory"})},/*日记账编号*/
        {type: 'input', id: 'fullName', label: this.props.intl.formatMessage({id:"budgetJournal.employeeNameOrNumber"})},/*申请人姓名/工号*/
        {type: 'select', id:'journalTypeId', label: this.props.intl.formatMessage({id:"budgetJournal.journalTypeId"}), options: [], method: 'get',/*预算日记账类型*/
          getUrl: `${config.budgetUrl}/api/budget/journals/journalType/selectByInput`, getParams: {organizationId:this.props.organization.id},
          labelKey: 'journalTypeName', valueKey: 'id'},
        {type: 'items', id: 'createdDate', items: [
          {type: 'date', id: 'beginDate', label:  this.props.intl.formatMessage({id:"budgetJournal.beginDate"})},/*提交日期从*/
          {type: 'date', id: 'endDate', label: this.props.intl.formatMessage({id:"budgetJournal.endDate"})}/*提交日期至*/
        ]},

      ],
      columns: [
        {title:this.props.intl.formatMessage({id:"budgetJournal.sequenceNumber"}), dataIndex: 'index', width: '7%', render:(value, record, index) => index + 1},/*序号*/
        {title:this.props.intl.formatMessage({id:"budgetJournal.employeeId"}), dataIndex: 'applicantName',/*申请人*/
          render: recode => (
            <Popover content={recode}>
              {recode}
            </Popover>)
        },
        {title: this.props.intl.formatMessage({id:"budgetJournal.submittedDate"}), dataIndex: 'submittedDate'},/*提交时间*/
        {title: this.props.intl.formatMessage({id:"budgetJournal.type"}), dataIndex: 'formName'},/*类型*/
        {title: this.props.intl.formatMessage({id:"budgetJournal.journalCode"}), dataIndex: 'journalCode'},/*预算日记账编号*/
        {title: this.props.intl.formatMessage({id:"budgetJournal.currency"}), dataIndex: 'currencyCode'},/*币种*/
        {title:this.props.intl.formatMessage({id:"budgetJournal.amount"}), dataIndex: 'totalBudget'},/*金额*/
        {title:this.props.intl.formatMessage({id:"budgetJournal.status"}), dataIndex: 'status'},/*状态*/
      ],
      budgetJournalDetailCheckDetailPage: menuRoute.getRouteItem('budget-journal-check-detail','key'),    //预算日记账复核详情
      unJournalData: [],
      journalData: [],
      unJournalPagination: {
        total: 0
      },
      journalPagination: {
        total: 0
      },
      unapprovedPage: 0,
      unapprovedPageSize: 10,
      approvedPage: 0,
      approvedPageSize: 10,
    }
  }

  componentWillMount() {
    return new Promise((resolve, reject) => {
      this.getUnJournalList(resolve, reject);
      this.getJournalList(resolve, reject)
    }).catch(() => {
      message.error(this.props.intl.formatMessage({id:"budgetJournal.getDataFail"}))
    });
  }

  getUnJournalList = (resolve, reject) => {
    const { unapprovedPage, unapprovedPageSize } = this.state;
    let unJournalUrl = `${config.baseUrl}/api/approvals/budget/journal/filters?fullName&businessCode&beginDate&finished=false&endDate&page=${unapprovedPage}&size=${unapprovedPageSize}`;
    this.setState({ loading1: true });
    const budgetJournalApprovalViewArray = [];
    httpFetch.get(unJournalUrl).then((res) => {
      if (res.status === 200) {
        res.data.map((item)=>{
          budgetJournalApprovalViewArray.push(item.budgetJournalApprovalView);
        })
        this.setState({
          unJournalData:budgetJournalApprovalViewArray,
          loading1: false,
          unJournalPagination: {
            total: Number(res.headers['x-total-count']) ? Number(res.headers['x-total-count']) : 0,
            current: unapprovedPage + 1,
            onChange: this.onUnJournalChangePaper
          }
        });
        resolve()
      }
    }).catch(() => {
      this.setState({ loading1: false });
      reject()
    })
  };


  getJournalList = (resolve, reject) => {
    const { approvedPage, approvedPageSize } = this.state;
    let JournalUrl = `${config.baseUrl}/api/approvals/budget/journal/filters?fullName&businessCode&beginDate&finished=true&endDate&page=${approvedPage}&size=${approvedPageSize}`;
    this.setState({ loading2: true });
    const budgetJournalApprovalViewArray = [];
    httpFetch.get(JournalUrl).then((res) => {
      res.data.map((item)=>{
        budgetJournalApprovalViewArray.push(item.budgetJournalApprovalView);
      })
      if (res.status === 200) {
        this.setState({
          journalData:budgetJournalApprovalViewArray,
          loading2: false,
          journalPagination: {
            total: Number(res.headers['x-total-count']) ? Number(res.headers['x-total-count']) : 0,
            current: approvedPage + 1,
            onChange: this.onJournalChangePaper
          }
        });
        resolve()
      }
    }).catch(() => {
      this.setState({ loading2: false });
      reject()
    })
  };

  onUnJournalChangePaper = (page) => {
    if (page - 1 !== this.state.page) {
      this.setState({ unapprovedPage: page - 1 }, () => {
        this.getUnJournalList()
      })
    }
  };

  onJournalChangePaper = (page) => {
    if (page - 1 !== this.state.page) {
      this.setState({ approvedPage: page - 1 }, () => {
        this.getJournalList()
      })
    }
  };

  unapprovedSearch = (values) => {
    console.log(values)
  };

  approvedSearch = (values) => {
    console.log(values)
  };

  //跳转到详情
  HandleRowClick=(value)=>{
    console.log(value);
    const journalCode =value.journalCode;
    let path=this.state.budgetJournalDetailCheckDetailPage.url.replace(":journalCode",journalCode);
    this.context.router.push(path);

  }


  render() {
    const { loading1, loading2, SearchForm, columns, unJournalData, journalData, unJournalPagination, journalPagination } = this.state;
    return (
      <div className="budget-journal">
        <Tabs onChange={this.handleTabsChange}>
          <TabPane tab={this.props.intl.formatMessage({id:'budgetJournal.unapproved'})} key="unapproved">
            <SearchArea searchForm={SearchForm}
                        submitHandle={this.unapprovedSearch}/>
            <div className="table-header">
              <div className="table-header-title">{this.props.intl.formatMessage({id:'common.total'},{total:` ${unJournalPagination.total} `})}</div>
            </div>
            <Table rowKey={record => record.id}
                   columns={columns}
                   dataSource={unJournalData}
                   padination={unJournalPagination}
                   loading={loading1}
                   bordered
                   onRowClick={this.HandleRowClick}
                   size="middle"/>
          </TabPane>
          <TabPane tab={this.props.intl.formatMessage({id:'budgetJournal.approved'})} key="approved">
            <SearchArea searchForm={SearchForm}
                        submitHandle={this.approvedSearch}/>
            <div className="table-header">
              <div className="table-header-title">{this.props.intl.formatMessage({id:'common.total'},{total:` ${journalPagination.total} `})}</div>
            </div>
            <Table rowKey={record => record.id}
                   columns={columns}
                   dataSource={journalData}
                   padination={journalPagination}
                   loading={loading2}
                   bordered
                   onRow={record => ({
                     onClick: () => this.HandleRowClick(record)
                   })}
                   size="middle"/>
          </TabPane>
        </Tabs>
      </div>
    )
  }
}

BudgetJournalCheck.contextTypes ={
  router: React.PropTypes.object
}

function mapStateToProps(state) {
  return {
    organization: state.login.organization
  }
}


export default connect(mapStateToProps)(injectIntl(BudgetJournalCheck));

