/**
 * Created by zaranengap on 2017/7/4.
 */
import React from 'react'
import { connect } from 'react-redux'
import { Tabs, Table, Button, notification, Icon } from 'antd';
const TabPane = Tabs.TabPane;
import httpFetch from 'share/httpFetch'
import config from 'config'

import SearchArea from 'components/search-area'

import 'styles/financial-payment/confirm-payment.scss'

class ConfirmPayment extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
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
      columns: [
        {title: '序号', dataIndex: 'index'},
        {title: '申请人', dataIndex: 'applicantName'},
        {title: '提交日期', dataIndex: 'submittedDate'},
        {title: '单据类型', dataIndex: 'formName'},
        {title: '报销单号', dataIndex: 'parentBusinessCode'},
        {title: '币种', dataIndex: 'currencyCode'},
        {title: '总金额', dataIndex: 'baseCurrencyTotalamount', render: this.filterMoney},
        {title: '支付币种', dataIndex: 'currencyCode', key: 'realCurrencyCode'},
        {title: '待支付金额', dataIndex: 'baseCurrencyRealPaymentAmount', render: this.filterMoney},
        {title: '凭证编号', dataIndex: 'origDocumentSequence'}
      ],
      status: 'prending_pay',   //当前状态
      searchParams: {
        applicantOID: "",
        businessCode: "",
        corporationOIDs: [],
        endDate: null,
        startDate: null,
        status: "prending_pay"
      },
      data: [],    //列表值
      page: 0,
      pageSize: 10,
      loading: true,
      tabs: [
        {key: 'prending_pay', name:'待确认'},
        {key: 'pay_in_process', name:'待付款'},
        {key: 'pay_finished', name:'已付款'}],
      count: {},
      nowType: 'INVOICE',
      pagination: {
        total: 0
      },
      selectedData: [], //已选择的列表项
      rowSelection: {
        selectedRowKeys: [],
        onChange: this.onSelectChange,
        onSelect: this.onSelectItem,
        onSelectAll: this.onSelectAll
      }
    };
  }

  //渲染Tab头
  renderTabs(){
    return (
      this.state.tabs.map(tab => {
        let typeCount = this.state.count[tab.key];
        return <TabPane tab={`${tab.name}（${typeCount.expenseReportCount + typeCount.loanApplicationCount}）`} key={tab.key}/>
      })
    )
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

  //Tab点击事件
  onChangeTabs = (key) => {
    let temp = this.state.searchParams;
    temp.status = key;
    this.refreshSearchCount(this.state.count[key].expenseReportCount, this.state.count[key].loanApplicationCount);
    this.setState({
      loading: true,
      searchParams: temp,
      page: 0,
      status: key
    },()=>{
      this.clearRowSelection();
      this.getList()
    });
  };

  //得到对应单据列表数据
  getList(){
    return httpFetch.post(`${config.baseUrl}/api/${this.state.nowType === 'INVOICE' ? 'v2/expense/reports' : 'loan/application'}/finance/admin/search?page=${this.state.page}&size=${this.state.pageSize}`,
      this.state.searchParams).then((response)=>{
      response.data.map((item, index)=>{
        item.index = this.state.page * this.state.pageSize + index + 1;
      });
      this.setState({
        data: response.data,
        loading: false,
        current: this.state.page + 1
      }, ()=>{
        this.refreshRowSelection()
      })
    })
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

  //搜索
  search = (result) => {
    result.dateFrom = result.dateFrom ? result.dateFrom.format('YYYY-MM-DD') : undefined;
    result.dateTo = result.dateTo ? result.dateTo.format('YYYY-MM-DD') : undefined;
    let searchParams = {
      applicantOID: result.user,
      businessCode: result.formID,
      corporationOIDs: result.legalEntity,
      endDate: result.dateTo,
      startDate: result.dateFrom,
      status: this.state.status
    };
    this.setState({
      searchParams: searchParams,
      loading: true,
      page: 0
    }, ()=>{
      this.clearRowSelection();
      this.getList();
    })
  };

  //清空搜索区域
  clear = () => {
    this.setState({searchParams: {
      applicantOID: "",
      businessCode: "",
      corporationOIDs: [],
      endDate: null,
      startDate: null,
      status: this.state.status
    }})
  };

  //搜索区域点击事件
  searchEventHandle = (event, value) => {
    switch(event){
      case 'CHANGE_TYPE': {
        if(value === this.state.nowType)
          return;
        this.setState({page: 0, nowType: value, loading: true}, ()=>{
          this.clearRowSelection();
          this.getList();
        });
        break;
      }
    }
  };

  //点击页码
  onChangePager(page){
    if(page - 1 !== this.state.page)
      this.setState({
        page: page - 1,
        loading: true
      }, ()=>{
        this.getList();
      })
  }

  //列表选择更改
  onSelectChange = (selectedRowKeys) => {
    let { rowSelection } = this.state;
    rowSelection.selectedRowKeys = selectedRowKeys;
    this.setState({ rowSelection });
  };

  /**
   * 选择单个时的方法，遍历selectedData，根据是否选中进行插入或删除操作
   * @param record 被改变的项
   * @param selected 是否选中
   */
  onSelectItem = (record, selected) => {
    let { selectedData } = this.state;
    if(this.props.single){
      selectedData = [record];
    } else {
      if(!selected){
        selectedData.map((selected, index) => {
          if(selected.expenseReportOID === record.expenseReportOID){
            selectedData.splice(index, 1);
          }
        })
      } else {
        selectedData.push(record);
      }
    }
    this.setState({ selectedData });
  };

  //选择当页全部时的判断
  onSelectAll = (selected, selectedRows, changeRows) => {
    changeRows.map(changeRow => this.onSelectItem(changeRow, selected));
  };


  //换页后根据OIDs刷新选择框
  refreshRowSelection(){
    let { selectedData, data, rowSelection } = this.state;
    let nowSelectedRowKeys = [];
    selectedData.map(selected => {
      data.map(item => {
        if(item.expenseReportOID === selected.expenseReportOID)
          nowSelectedRowKeys.push(item.expenseReportOID)
      })
    });

    rowSelection.selectedRowKeys = nowSelectedRowKeys;
    this.setState({ rowSelection });
  }

  //清空选择框
  clearRowSelection(){
    this.setState({selectedData: [],selectedRowKeys: []});
  }

  //提交成功
  confirmSuccess(){
    notification.open({
      message: '确认付款成功！',
      description: `您有${this.state.selectedData.length}笔单据确认付款成功:)`,
      icon: <Icon type="smile-circle" style={{ color: '#108ee9' }} />,
    });
    this.setState({loading: true});
    this.getCount();
    this.clearRowSelection();
    this.getList();
  }

  //提交
  confirm = () => {
    this.setState({confirmLoading: true});
    let selectedEntityOIDs = [];
    this.state.selectedData.map(item => {
      selectedEntityOIDs.push(item.expenseReportOID);
    });
    httpFetch.post(`${config.baseUrl}/api/reimbursement/batch/pay/${this.state.status === 'prending_pay' ? 'processing' : 'finished'}/confirm`, {
      businessCode: null,
      comment: null,
      corporationOIDs: [],
      endDate: null,
      entityOIDs: selectedEntityOIDs,
      entityType: 1001,
      excludedEntityOIDs: [],
      selectMode: "current_page",
      startDate: null,
      status: this.state.status
    }).then(()=>{
      this.setState({confirmLoading: false});
      this.confirmSuccess();
    }).catch((e)=>{
      this.setState({confirmLoading: false});
      if(e.name == 'SyntaxError')
        this.confirmSuccess();
      else
        notification.open({
          message: '确认付款失败！',
          description: '可能是服务器出了点问题:(',
          icon: <Icon type="frown-circle" style={{ color: '#e93652' }} />,
        });
    })
  };

  render(){
    const { searchForm, columns, data, loading, pagination, selectedData, status, confirmLoading, rowSelection } = this.state;
    return (
      <div className="confirm-payment">
        <Tabs type="card" onChange={this.onChangeTabs}>
          {this.renderTabs()}
        </Tabs>
        <SearchArea
          searchForm={searchForm}
          submitHandle={this.search}
          clearHandle={this.clear}
          eventHandle={this.searchEventHandle}/>
        <div className="table-header">
          <div className="table-header-title">共 {pagination.total} 条数据 <span>/</span> 已选 {selectedData.length} 条</div>
          <div className="table-header-buttons">
            { status === 'pay_finished' ? null :
              <Button type="primary" onClick={this.confirm} disabled={selectedData.length === 0}
                      loading={confirmLoading}>确认已付款</Button>
            }
            <Button>导入报盘文件</Button>
          </div>
        </div>
        <Table columns={columns}
               dataSource={data}
               rowSelection={rowSelection}
               pagination={pagination}
               loading={loading}
               bordered
               rowKey="expenseReportOID"
               size="middle"/>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {}
}

export default connect(mapStateToProps)(ConfirmPayment);
