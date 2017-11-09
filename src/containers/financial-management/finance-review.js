import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

import { Table, message, Tabs, Popover } from 'antd'
const TabPane = Tabs.TabPane;

import httpFetch from 'share/httpFetch'
import config from 'config'
import SearchArea from 'components/search-area'

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
      columns: [
        {title: "序号", dataIndex: "index", width: '8%'},
        {title: "申请人", dataIndex: "applicantName", width: '8%'},
        {title: "提交日期", dataIndex: "submittedDate", width: '10%', render: date => new Date(date).format('yyyy-MM-dd')},
        {title: '单据类型', dataIndex: 'formName', width: '13%', render: formName => (
          <Popover content={formName}>
            {formName}
          </Popover>
        )},
        {title: '报销单号', dataIndex: 'parentBusinessCode', width: '15%'},
        {title: "币种", dataIndex: "currencyCode", width: '8%'},
        {title: "总金额", dataIndex: "totalAmount", width: '15%', render: this.filterMoney},
        {title: "支付币种", key: "currency", width: '8%', render: text => this.props.companyConfiguration.currencyCode},
        {title: "待支付金额", dataIndex: "baseCurrencyRealPaymentAmount", width: '15%', render: this.filterMoney},
      ],
      status: 'prending_audit',   //当前状态
      tabs: [
        {key: 'prending_audit', name:'待审核'},
        {key: 'audit_pass', name:'已审核'}],
      searchParams: {
        applicantOID: null,
        businessCode: null,
        corporationOIDs: [],
        endDate: null,
        startDate: null
      },
      searchForm: [
        {
          type: 'radio', id: 'type', label: '单据类型', options: [{label: '报销单', value: 'INVOICE'}, {label: '借款单', value: 'BORROW'}],
          event: 'CHANGE_TYPE', defaultValue: 'INVOICE'
        },
        {type: 'date', id: 'dateFrom', label: '日期从'},
        {type: 'date', id: 'dateTo', label: '日期到'},
        {type: 'input', id: 'formID', label: '单号'},
        {
          type: 'combobox', id: 'user', label: '员工', placeholder: '请输入姓名／工号', options: [],
          searchUrl: `${config.baseUrl}/api/search/users`, method: 'get', searchKey: 'keyword', labelKey: 'fullName', valueKey: 'userOID'
        },
        {
          type: 'multiple', id: 'legalEntity', label: '法人实体', options: [],
          getUrl: `${config.baseUrl}/api/v2/my/company/receipted/invoices?page=0&size=100`, method: 'get', labelKey: 'companyName', valueKey: 'companyReceiptedOID'
        }
      ],
      nowType: 'INVOICE',
      count: {},
    };
  }

  componentWillMount(){
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
  getCount(){
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
    return Promise.all(fetchArray).then(()=>{
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
    if(page - 1 !== this.state.page)
      this.setState({
        page: page - 1,
        loading: true
      }, ()=>{
        this.getList();
      })
  };

  getList = () => {
    this.setState({ loading: true });
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
        }});
    })
  };

  //渲染Tab头
  renderTabs(){
    return (
      this.state.tabs.map(tab => {
        let typeCount = this.state.count[tab.key];
        return <TabPane tab={`${tab.name}（${typeCount.expenseReportCount + typeCount.loanApplicationCount}）`} key={tab.key}/>
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
    },()=>{
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
    }, ()=>{
      this.getList();
    })
  };

  clear = () => {
    this.setState({searchParams: {
      applicantOID: "",
      businessCode: "",
      corporationOIDs: [],
      endDate: null,
      startDate: null
    }})
  };

  searchEventHandle = (event, value) => {
    switch(event){
      case 'CHANGE_TYPE': {
        if(value === this.state.nowType)
          return;
        this.setState({page: 0, nowType: value, loading: true}, ()=>{
          this.getList();
        });
        break;
      }
    }
  };

  render(){
    const { data, loading, columns, pagination, searchForm } = this.state;
    return (
      <div>
        <Tabs type="card" onChange={this.onChangeTabs}>
          {this.renderTabs()}
        </Tabs>
        <SearchArea searchForm={searchForm}
                    submitHandle={this.search}
                    clearHandle={this.clear}
                    eventHandle={this.searchEventHandle}/>
        <div className="table-header">
          <div className="table-header-title">共 {pagination.total} 条数据</div>
        </div>
        <Table columns={columns}
               dataSource={data}
               bordered
               pagination={pagination}
               loading={loading}
               size="middle"
               rowKey="expenseReportOID"/>
      </div>
    )
  }

}

function mapStateToProps(state) {
  return {
    companyConfiguration: state.login.companyConfiguration
  }
}

export default connect(mapStateToProps)(injectIntl(FinanceReview));
