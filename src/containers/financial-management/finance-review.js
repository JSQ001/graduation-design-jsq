import React from 'react'
import {connect} from 'react-redux'
import {injectIntl} from 'react-intl';

import {Table, message, Tabs, Popover} from 'antd'

const TabPane = Tabs.TabPane;

import httpFetch from 'share/httpFetch'
import config from 'config'
import SearchArea from 'components/search-area'
import menuRoute from 'share/menuRoute'

class FinanceReview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      page: 0,
      pageSize: 10,
      data: [],
      pagination: {
        total: 0
      },
      invoiceColumns: [
        {title: "序号", dataIndex: "index", width: '8%'},
        {title: "申请人", dataIndex: "applicantName", width: '8%'},
        {title: "提交日期", dataIndex: "submittedDate", width: '10%', render: date => new Date(date).format('yyyy-MM-dd')},
        {
          title: '单据类型', dataIndex: 'formName', width: '13%', render: formName => (
          <Popover content={formName}>
            {formName}
          </Popover>
        )
        },
        {title: '报销单号', dataIndex: 'parentBusinessCode', width: '15%'},
        {title: "币种", dataIndex: "currencyCode", width: '8%'},
        {title: "总金额", dataIndex: "totalAmount", width: '15%', render: this.filterMoney},
        {title: "支付币种", key: "currency", width: '8%', render: text => this.props.companyConfiguration.currencyCode},
        {title: "待支付金额", dataIndex: "baseCurrencyRealPaymentAmount", width: '15%', render: this.filterMoney},
      ],
      borrowColumns: [
        {title: "序号", dataIndex: "index", width: '10%'},
        {title: "申请人", dataIndex: "applicantName", width: '10%'},
        {title: "提交日期", dataIndex: "submittedDate", width: '20%', render: date => new Date(date).format('yyyy-MM-dd')},
        {
          title: '单据类型', dataIndex: 'formName', width: '20%', render: formName => (
          <Popover content={formName}>
            {formName}
          </Popover>
        )
        },
        {title: '报销单号', dataIndex: 'businessCode', width: '20%'},
        {title: "币种", dataIndex: "currencyCode", width: '10%', render: text => this.props.companyConfiguration.currencyCode},
        {title: "借款金额", dataIndex: "paymentAmount", width: '10%', render: this.filterMoney}
      ],
      status: 'prending_audit',   //当前状态
      tabs: [
        {key: 'prending_audit', name: '待审核'},
        {key: 'audit_pass', name: '已审核'}],
      searchParams: {
        applicantOID: null,
        businessCode: null,
        corporationOIDs: [],
        endDate: null,
        startDate: null
      },
      searchForm: [
        {
          type: 'radio',
          id: 'type',
          label: '单据类型',
          options: [{label: '报销单', value: 'INVOICE'}, {label: '借款单', value: 'BORROW'}],
          event: 'CHANGE_TYPE',
          defaultValue: 'INVOICE'
        },
        {type: 'date', id: 'dateFrom', label: '日期从'},
        {type: 'date', id: 'dateTo', label: '日期到'},
        {type: 'input', id: 'formID', label: '单号'},
        {
          type: 'combobox',
          id: 'user',
          label: '员工',
          placeholder: '请输入姓名／工号',
          options: [],
          searchUrl: `${config.baseUrl}/api/search/users`,
          method: 'get',
          searchKey: 'keyword',
          labelKey: 'fullName',
          valueKey: 'userOID'
        },
        {
          type: 'multiple',
          id: 'legalEntity',
          label: '法人实体',
          options: [],
          getUrl: `${config.baseUrl}/api/v2/my/company/receipted/invoices?page=0&size=100`,
          method: 'get',
          labelKey: 'companyName',
          valueKey: 'companyReceiptedOID'
        }
      ],
      nowType: 'INVOICE',
      count: {},
      expenseDetailReview: menuRoute.getRouteItem('expense-report-detail-review', 'key'),
      loanDetailReview: menuRoute.getRouteItem('loan-request-detail-review', 'key')
    };
  }

  componentWillMount() {
    let countResult = {};
    this.state.tabs.map(item => {
      countResult[item.key] = {
        expenseReportCount: 0,
        loanApplicationCount: 0
      }
    });
    this.setState({count: countResult});
    this.getCount();
    this.getList();
  }

  //得到单据数量
  getCount() {
    let result = {};
    let fetchArray = [];
    this.state.tabs.map(type => {
      fetchArray.push(httpFetch.get(`${config.baseUrl}/api/finance/statistics/by/staus?status=${type.key}`).then(response => {
        result[type.key] = {
          expenseReportCount: response.data.expenseReportCount,
          loanApplicationCount: response.data.loanApplicationCount
        }
      }));
    });
    return Promise.all(fetchArray).then(() => {
      this.setState({count: result});
      this.refreshSearchCount(result[this.state.status].expenseReportCount, result[this.state.status].loanApplicationCount);
    })
  }

  //刷新单据数量（搜索区域和分页）
  refreshSearchCount(expenseReportCount, loanApplicationCount) {
    let temp = this.state.searchForm;
    temp[0].options = [
      {label: `报销单（共${expenseReportCount}笔）`, value: 'INVOICE'},
      {label: `借款单（共${loanApplicationCount}笔）`, value: 'BORROW'}];
    this.setState({
      searchForm: temp,
      pagination: {
        total: this.state.nowType === 'INVOICE' ? expenseReportCount : loanApplicationCount,
        onChange: this.onChangePager.bind(this)
      }
    });
  }

  onChangePager = (page) => {
    if (page - 1 !== this.state.page)
      this.setState({
        page: page - 1,
        loading: true
      }, () => {
        this.getList();
      })
  };

  getList = () => {
    this.setState({loading: true});
    let temp = this.state.searchParams;
    temp.status = this.state.status;
    httpFetch.post(`${config.baseUrl}/api/${this.state.nowType === 'INVOICE' ? 'v2/expense/reports' : 'loan/application'}/finance/admin/search?page=${this.state.page}&size=${this.state.pageSize}`, temp).then(res => {
      let data = res.data.map((item, index) => {
        item.index = this.state.page * this.state.pageSize + index + 1;
        return item;
      });
      this.setState({
        loading: false,
        data,
        pagination: {
          total: Number(res.headers['x-total-count']),
          onChange: this.onChangePager,
          current: this.state.page + 1
        }
      });
    })
  };

  //渲染Tab头
  renderTabs() {
    return (
      this.state.tabs.map(tab => {
        let typeCount = this.state.count[tab.key];
        return <TabPane tab={`${tab.name}（${typeCount.expenseReportCount + typeCount.loanApplicationCount}）`}
                        key={tab.key}/>
      })
    )
  }

  //Tab点击事件
  onChangeTabs = (key) => {
    let temp = this.state.searchParams;
    temp.status = key;
    this.refreshSearchCount(this.state.count[key].expenseReportCount, this.state.count[key].loanApplicationCount);
    this.setState({
      loading: true,
      page: 0,
      status: key
    }, () => {
      this.getList()
    });
  };

  search = (result) => {
    result.dateFrom = result.dateFrom ? result.dateFrom.format('YYYY-MM-DD hh:mm:ss') : undefined;
    result.dateTo = result.dateTo ? result.dateTo.format('YYYY-MM-DD hh:mm:ss') : undefined;
    let searchParams = {
      applicantOID: result.user,
      businessCode: result.formID,
      corporationOIDs: result.legalEntity,
      endDate: result.dateTo,
      startDate: result.dateFrom
    };
    this.setState({
      searchParams: searchParams,
      loading: true,
      page: 0
    }, () => {
      this.getList();
    })
  };

  clear = () => {
    this.setState({
      searchParams: {
        applicantOID: "",
        businessCode: "",
        corporationOIDs: [],
        endDate: null,
        startDate: null
      }
    })
  };

  searchEventHandle = (event, value) => {
    switch (event) {
      case 'CHANGE_TYPE': {
        if (value === this.state.nowType)
          return;
        this.setState({page: 0, nowType: value, loading: true}, () => {
          this.getList();
        });
        break;
      }
    }
  };

  handleRowClick = (record) => {
    const { nowType } = this.state;
    if(nowType === 'INVOICE')
      this.context.router.push(this.state.expenseDetailReview.url.replace(':id', record.expenseReportOID));
    else
      this.context.router.push(this.state.loanDetailReview.url.replace(':id', record.applicationOID));
  };

  render() {
    const {data, loading, invoiceColumns ,borrowColumns, pagination, searchForm, nowType} = this.state;
    const {formatMessage} = this.props.intl;
    return (
      <div>
        <Tabs onChange={this.onChangeTabs}>
          {this.renderTabs()}
        </Tabs>
        <SearchArea searchForm={searchForm}
                    submitHandle={this.search}
                    clearHandle={this.clear}
                    eventHandle={this.searchEventHandle}/>
        <div className="divider"/>
        <div className="table-header">
          <div className="table-header-title">{formatMessage({id: "common.total"}, {total: pagination.total})}</div>
          {/* 共total条数据 */}
        </div>
        <Table columns={nowType === 'INVOICE' ? invoiceColumns : borrowColumns}
               dataSource={data}
               bordered
               pagination={pagination}
               onRowClick={this.handleRowClick}
               loading={loading}
               size="middle"
               rowKey={nowType === 'INVOICE' ? 'expenseReportOID' : 'applicationOID'}/>
      </div>
    )
  }

}

FinanceReview.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
  return {
    companyConfiguration: state.login.companyConfiguration,
    profile: state.login.profile
  }
}

export default connect(mapStateToProps)(injectIntl(FinanceReview));
