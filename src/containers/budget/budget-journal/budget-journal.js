import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { Button, Table, Select } from 'antd';
import SearchArea from 'components/search-area.js';
import "styles/budget/budget-journal/budget-journal.scss"
import httpFetch from 'share/httpFetch';
import config from 'config'
import menuRoute from 'share/menuRoute'

const journalTypeCode = [];

class BudgetJournal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: [],
      params:{},
      pagination: {
        current:0,
        page:0,
        total:0,
        pageSize:10,
        showSizeChanger:true,
        showQuickJumper:true,
      },
      searchForm: [
        {type: 'list', id: 'journalTypeName',
          listType: 'budget_journal_type',
          labelKey: 'journalTypeName',
          valueKey: 'id',
          label:this.props.intl.formatMessage({id: 'budget.journalTypeId'}),  /*预算日记账类型*/
          listExtraParams:{organizationId: this.props.id}
        },
        {type: 'input', id: 'journalNumber',
          label: this.props.intl.formatMessage({id: 'budget.journalNumber'}), /*预算日记账编号*/
        },
        {type: 'select', id: 'periodStrategy',
          label:  this.props.intl.formatMessage({id: 'budget.journal'})+this.props.intl.formatMessage({id: 'budget.periodStrategy'}),
          options: journalTypeCode
        },
      ],

      columns: [
        {          /*预算日记账编号*/
          title: this.props.intl.formatMessage({id:"budget.journalNumber"}), key: "journalNumber", dataIndex: 'journalNumber'
        },
        {          /*预算日记账类型*/
          title: this.props.intl.formatMessage({id:"budget.journalTypeId"}), key: "journalTypeId", dataIndex: 'journalTypeId'
        },
        {          /*编制期段*/
          title: this.props.intl.formatMessage({id:"budget.periodStrategy"}), key: "periodStrategy", dataIndex: 'periodStrategy'
        },
        {          /*预算表*/
          title: this.props.intl.formatMessage({id:"budget.structureId"}), key: "structureId", dataIndex: 'structureId'
        },
        {          /*预算期间*/
          title: this.props.intl.formatMessage({id:"budget.periodName"}), key: "periodName", dataIndex: 'periodName'
        },
        {          /*状态*/
          title: this.props.intl.formatMessage({id:"budget.status"}), key: "status", dataIndex: 'status'
        },
      ],
      newBudgetJournalDetailPage: menuRoute.getRouteItem('new-budget-journal','key'),    //新建预算日记账的页面项
      budgetJournalDetailPage: menuRoute.getRouteItem('budget-journal-detail','key'),    //预算日记账详情
      selectedEntityOIDs: []    //已选择的列表项的OIDs
    };
  }

  componentWillMount(){
    this.getList();
  }

  //获取预算日记账数据
  getList(){
    httpFetch.get(`${config.budgetUrl}/api/budget/journals/query/headers?page=${this.state.pagination.page}&size=${this.state.pagination.pageSize}`).then((response)=>{
      this.setState({
        loading: false,
        data: response.data,
        pagination: {
          page: this.state.pagination.page,
          current: this.state.pagination.current,
          pageSize:this.state.pagination.pageSize,
          showSizeChanger:true,
          showQuickJumper:true,
          total: Number(response.headers['x-total-count']),
        }
      },()=>{

      })
    })
  }

  //分页点击
  onChangePager = (pagination,filters, sorter) =>{
    this.setState({
      pagination:{
        page: pagination.current-1,
        current: pagination.current,
        pageSize: pagination.pageSize
      }
    }, ()=>{
      this.getList();
    })
  };

  handleSearch = (values) =>{
    this.setState({
      params:values,
    },()=>{
      this.getList()
    })
  };

  //新建
  handleCreate = () =>{
    let path=this.state.newBudgetJournalDetailPage.url;
    this.context.router.push(path)
  };

  render(){
    const { loading, searchForm ,data, selectedRowKeys, pagination, columns, batchCompany} = this.state;
    return (
      <div className="budget-journal">
        <SearchArea searchForm={searchForm} submitHandle={this.handleSearch}/>
        <div className="table-header">
          <div className="table-header-title">{this.props.intl.formatMessage({id:'common.total'},{total:`${pagination.total}`})}</div>  {/*共搜索到*条数据*/}
          <div className="table-header-buttons">
            <Button type="primary" onClick={this.handleCreate}>{this.props.intl.formatMessage({id: 'common.create'})}</Button>  {/*新 建*/}
          </div>
        </div>
        <Table
          loading={loading}
          dataSource={data}
          columns={columns}
          pagination={pagination}
          size="middle"
          bordered/>
      </div>
    )
  }

}

BudgetJournal.contextTypes ={
  router: React.PropTypes.object
}

function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps)(injectIntl(BudgetJournal));
