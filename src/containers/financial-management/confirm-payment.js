/**
 * Created by zaranengap on 2017/7/4.
 */
import React from 'react'
import debounce from 'lodash.debounce';
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
          type: 'big_radio',
          id: 'type',
          label: '单据类型',
          options: [{label: '报销单', value: 'INVOICE'}, {label: '借款单', value: 'BORROW'}],
          event: 'CHANGE_TYPE',
          defaultValue: 'INVOICE'
        },
        {type: 'date', id: 'dateFrom', label: '日期从'},
        {type: 'date', id: 'dateTo', label: '日期到'},
        {type: 'input', id: 'formID', label: '单号'},
        {type: 'combobox',
          id: 'user',
          label: '员工',
          placeholder: '请输入姓名／工号',
          options: [],
          event: 'SEARCH_USER'
        },
        {
          type: 'multiple',
          id: 'legalEntity',
          label: '法人实体',
          options: [],
          event: 'SEARCH_ENTITY',
          needSearch: false
        },
        {
          type: 'radio',
          id: 'dateRange',
          label: '日期',
          options: [{label: '全选', value: 'ALL'}, {label: '当月', value: 'MONTH'}, {label: '近三个月', value: '3MONTH'}]
        },
        {
          type: 'checkbox',
          id: 'checkbox',
          label: '多选样式',
          options: [{label: '多选1', value: 'C1'}, {label: '多选2', value: 'C2'}, {label: '多选3', value: 'C3'}]
        }
      ],
      columns: [
        {title: '序号', dataIndex: 'index'},
        {title: '申请人', dataIndex: 'applicantName'},
        {title: '提交日期', dataIndex: 'submittedDate'},
        {title: '单据类型', dataIndex: 'formName'},
        {title: '报销单号', dataIndex: 'parentBusinessCode'},
        {title: '币种', dataIndex: 'currencyCode'},
        {title: '总金额', dataIndex: 'baseCurrencyTotalamount'},
        {title: '支付币种', dataIndex: 'currencyCode', key: 'realCurrencyCode'},
        {title: '待支付金额', dataIndex: 'baseCurrencyRealPaymentAmount'},
        {title: '凭证编号', dataIndex: 'origDocumentSequence'}
      ],
      status: 'prending_pay',
      searchParams: {
        applicantOID: "",
        businessCode: "",
        corporationOIDs: [],
        endDate: null,
        startDate: null,
        status: "prending_pay"
      },
      data: [],
      page: 0,
      pageSize: 10,
      loading: true,
      selectedRowKeys: [],
      tabs: [
        {key: 'prending_pay', name:'待确认'},
        {key: 'pay_in_process', name:'待付款'},
        {key: 'pay_finished', name:'已付款'}],
      count: {},
      nowType: 'INVOICE',
      pagination: {
        total: 0
      },
      selectedEntityOIDs: []
    };
    this.addOptionsToForm = debounce(this.addOptionsToForm, 250);
  }

  renderTabs(){
    return (
      this.state.tabs.map(tab => {
        let typeCount = this.state.count[tab.key];
        return <TabPane tab={`${tab.name}（共${typeCount.expenseReportCount + typeCount.loanApplicationCount}笔）`} key={tab.key}/>
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

  onChangeTabs(key){
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
  }

  getList(){
    return httpFetch.post(`${config.baseUrl}/api/${this.state.nowType === 'INVOICE' ? 'v2/expense/reports' : 'loan/application'}/finance/admin/search?page=${this.state.page}&size=${this.state.pageSize}`,
      this.state.searchParams).then((response)=>{
      response.map((item, index)=>{
        item.index = this.state.page * this.state.pageSize + index + 1;
        item.key = item.index;
      });
      this.setState({
        data: response,
        loading: false
      }, ()=>{
        this.refreshRowSelection()
      })
    })
  }

  getCount(){
    let result = {};
    let fetchArray = [];
    this.state.tabs.map(type => {
      fetchArray.push(httpFetch.get(`${config.baseUrl}/api/finance/statistics/by/staus?status=${type.key}`).then(response => {
        result[type.key] = {
          expenseReportCount: response.expenseReportCount,
          loanApplicationCount: response.loanApplicationCount
        }
      }));
    });
    return Promise.all(fetchArray).then(()=>{
      this.setState({count: result});
      this.refreshSearchCount(result[this.state.status].expenseReportCount, result[this.state.status].loanApplicationCount);
    })
  }

  refreshSearchCount(expenseReportCount, loanApplicationCount) {
    let temp = this.state.searchForm;
    temp[0].options = [
      {label: `报销单（共${expenseReportCount}笔）`, value: 'INVOICE'},
      {label: `借款单（共${loanApplicationCount}笔）`, value: 'BORROW'}]
    this.setState({
      searchForm: temp,
      pagination: {
        total: this.state.nowType === 'INVOICE' ? expenseReportCount : loanApplicationCount,
        onChange: this.onChangePager.bind(this)
      }
    });
  }

  search(result){
    result.dateFrom = result.dateFrom ? result.dateFrom.format('YYYY-MM-DD') : undefined;
    result.dateTo = result.dateTo ? result.dateTo.format('YYYY-MM-DD') : undefined;
    let corporationOIDs = [];
    result.legalEntity ? result.legalEntity.map(corporation => {
      corporationOIDs.push(corporation.key)
    }) : null;
    let searchParams = {
      applicantOID: result.user ? result.user.key : undefined,
      businessCode: result.formID,
      corporationOIDs: corporationOIDs,
      endDate: result.dateTo,
      startDate: result.dateFrom,
      status: this.state.status
    };
    this.setState({
      searchParams:searchParams,
      loading: true,
      page: 0
    }, ()=>{
      this.clearRowSelection();
      this.getList();
    })
  }

  clear(){
    this.setState({searchParams: {
      applicantOID: "",
      businessCode: "",
      corporationOIDs: [],
      endDate: null,
      startDate: null,
      status: this.state.status
    }})
  }

  getFormItemFromStateByID(id){
    for(let i = 0; i < this.state.searchForm.length; i++){
      if(this.state.searchForm[i].id === id)
        return this.state.searchForm[i]
    }
  }

  setFormItem(item, callback){
    let temp = this.state.searchForm;
    for(let i = 0; i < temp.length; i++){
      if(temp[i].id === item.id){
        temp[i] = item;
        this.setState({searchForm: temp}, ()=>{
          if(callback)
            callback()
        })
      }
    }
  }

  addOptionsToForm(formId, url, labelName, valueName){
    let result = [];
    httpFetch.get(url).then(response => {
      response.map(item => {
        result.push({label: item[labelName], value: item[valueName]})
      });
      let formItem = this.getFormItemFromStateByID(formId);
      formItem.options = result;
      this.setFormItem(formItem);
    });
  }

  searchEventHandle(event, value){
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
      case 'SEARCH_USER': {
        let url = `${config.baseUrl}/api/search/users?keyword=${value}`;
        this.addOptionsToForm('user', url, 'fullName', 'userOID');
        break;
      }
      case 'SEARCH_ENTITY': {
        let url = `${config.baseUrl}/api/v2/my/company/receipted/invoices?page=0&size=100`;
        this.addOptionsToForm('legalEntity', url, 'companyName', 'companyReceiptedOID');
        break;
      }
    }
  }

  onChangePager(page){
    if(page - 1 !== this.state.page)
      this.setState({
        page: page - 1,
        loading: true
      }, ()=>{
        this.getList();
      })
  }

  onSelectChange(selectedRowKeys){
    this.setState({ selectedRowKeys });
  }

  onSelectRow(record, selected){
    let temp = this.state.selectedEntityOIDs;
    if(selected)
      temp.push(record.expenseReportOID);
    else
      temp.delete(record.expenseReportOID);
    this.setState({selectedEntityOIDs: temp})
  }

  onSelectAllRow(selected){
    let temp = this.state.selectedEntityOIDs;
    if(selected){
      this.state.data.map(item => {
        temp.addIfNotExist(item.expenseReportOID)
      })
    } else {
      this.state.data.map(item => {
        temp.delete(item.expenseReportOID)
      })
    }
    this.setState({selectedEntityOIDs: temp})
  }

  refreshRowSelection(){
    let selectedRowKeys = [];
    this.state.selectedEntityOIDs.map(selectedEntityOID => {
      this.state.data.map((item, index) => {
        if(item.expenseReportOID === selectedEntityOID)
          selectedRowKeys.push(index);
      })
    });
    this.setState({ selectedRowKeys });
  }

  clearRowSelection(){
    this.setState({selectedEntityOIDs: [],selectedRowKeys: []});
  }

  confirmSuccess(){
    notification.open({
      message: '确认付款成功！',
      description: `您有${this.state.selectedEntityOIDs.length}笔单据确认付款成功:)`,
      icon: <Icon type="smile-circle" style={{ color: '#108ee9' }} />,
    });
    this.setState({loading: true});
    this.getCount();
    this.clearRowSelection();
    this.getList();
  }

  confirm(){
    this.setState({confirmLoading: true});
    httpFetch.post(`${config.baseUrl}/api/reimbursement/batch/pay/${this.state.status === 'prending_pay' ? 'processing' : 'finished'}/confirm`, {
      businessCode: null,
      comment: null,
      corporationOIDs: [],
      endDate: null,
      entityOIDs: this.state.selectedEntityOIDs,
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
  }

  render(){
    const { searchForm, columns, data, loading, selectedRowKeys, pagination, selectedEntityOIDs, status, confirmLoading } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange.bind(this),
      onSelect: this.onSelectRow.bind(this),
      onSelectAll: this.onSelectAllRow.bind(this)
    };
    return (
      <div className="confirm-payment">
        <Tabs type="card" onChange={this.onChangeTabs.bind(this)}>
          {this.renderTabs()}
        </Tabs>
        <SearchArea
          searchForm={searchForm}
          submitHandle={this.search.bind(this)}
          clearHandle={this.clear.bind(this)}
          eventHandle={this.searchEventHandle.bind(this)}/>
        <div className="table-header">
          <div className="table-header-title">{`共${pagination.total}条数据 / 已选${selectedEntityOIDs.length}条`}</div>
          <div className="table-header-buttons">
            { status === 'pay_finished' ? null :
              <Button type="primary" onClick={this.confirm.bind(this)} disabled={selectedEntityOIDs.length === 0}
                      loading={confirmLoading}>确认已付款</Button>
            }
            <Button>导入报盘文件</Button>
          </div>
        </div>
        <Table columns={columns}
               dataSource={data}
               rowSelection={rowSelection}
               pagination={pagination}
               loading={loading}/>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {}
}

export default connect(mapStateToProps)(ConfirmPayment);
