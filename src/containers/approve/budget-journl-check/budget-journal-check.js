import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { Form, Tabs, Table, message } from 'antd'
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
        {type: 'input', id: 'journalCode', label: '日记账编号'},
        {type: 'input', id: 'employeeId', label: '申请人姓名/工号'},
        {type: 'select', id:'journalTypeId', label: '预算日记账类型', options: [], method: 'get',
          getUrl: `${config.budgetUrl}/api/budget/journals/journalType/selectByInput`, getParams: {organizationId:this.props.organization.id},
          labelKey: 'journalTypeName', valueKey: 'id'},
        {type: 'items', id: 'createdDate', items: [
          {type: 'date', id: 'createdDateStart', label: '提交日期从'},
          {type: 'date', id: 'createdDateEnd', label: '提交日期至'}
        ]},

      ],
      columns: [
        {title: '序号', dataIndex: 'index', width: '7%', render:(value, record, index) => index + 1},
        {title: '申请人', dataIndex: 'companyId'},
        {title: '提交时间', dataIndex: 'createdDate'},
        {title: '预算日记账类型', dataIndex: 'journalCodeTypeName'},
        {title: '预算日记账单号', dataIndex: 'journalCode'},
        {title: '币种', dataIndex: 'currency'},
        {title: '金额', dataIndex: 'amount'},
        {title: '状态', dataIndex: 'status'},
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
      message.error('数据加载失败，请重试')
    });
  }

  getUnJournalList = (resolve, reject) => {
    const { unapprovedPage, unapprovedPageSize } = this.state;
    let unJournalUrl = `{config.budgetUrl}/api/budget/journals/query/headers?organizationId=${this.props.organization.id}?page=${unapprovedPage}&size=${unapprovedPageSize}`;
    this.setState({ loading1: true });
    httpFetch.get(unJournalUrl).then((res) => {
      if (res.status === 200) {
        this.setState({
          unJournalData: res.data,
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
    let JournalUrl = `${config.budgetUrl}/api/budget/journals/query/headers?organizationId=${this.props.organization.id}?page=${approvedPage}&size=${approvedPageSize}`;
    this.setState({ loading2: true });
    httpFetch.get(JournalUrl).then((res) => {
      if (res.status === 200) {
        this.setState({
          journalData: res.data,
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
    const journalCode =value.journalCode;
    let path=this.state.budgetJournalDetailCheckDetailPage.url.replace(":journalCode",journalCode);
    this.context.router.push(path);

  }


  render() {
    const { loading1, loading2, SearchForm, columns, unJournalData, journalData, unJournalPagination, journalPagination } = this.state;
    return (
      <div className="budget-journal">
        <Tabs onChange={this.handleTabsChange}>
          <TabPane tab="未审批" key="unapproved">
            <SearchArea searchForm={SearchForm}
                        submitHandle={this.unapprovedSearch}/>
            <div className="table-header">
              <div className="table-header-title">{`共搜索到 ${unJournalPagination.total} 条数据`}</div>
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
          <TabPane tab="已审批" key="approved">
            <SearchArea searchForm={SearchForm}
                        submitHandle={this.approvedSearch}/>
            <div className="table-header">
              <div className="table-header-title">{`共搜索到 ${journalPagination.total} 条数据`}</div>
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

