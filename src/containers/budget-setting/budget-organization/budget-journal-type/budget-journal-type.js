import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

import { Table, Badge, Button } from 'antd'

import SearchArea from 'components/search-area'
import httpFetch from 'share/httpFetch'
import config from 'config'

import menuRoute from "share/menuRoute";

class BudgetJournalType extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: [],
      page: 0,
      pageSize: 10,
      columns: [
        {title: '类型代码', dataIndex: 'journalTypeCode', width: '30%'},
        {title: '类型名称', dataIndex: 'journalTypeName', width: '30%'},
        {title: '预算业务类型', dataIndex: 'businessType', width: '25%'},
        {title: '状态', dataIndex: 'isEnabled', width: '15%', render: isEnabled => <Badge status={isEnabled ? 'success' : 'error'} text={isEnabled ? '启用' : '禁用'} />}
      ],
      pagination: {
        total: 0
      },
      searchForm: [
        {type: 'input', id: 'journalTypeCode', label: '类型代码'},
        {type: 'input', id: 'journalTypeName', label: '类型名称'}
      ],
      searchParams: {
        journalTypeCode: '',
        journalTypeName: ''
      },
      newBudgetJournalTypePage: menuRoute.getRouteItem('new-budget-journal-type', 'key'),
      budgetJournalTypeDetailPage: menuRoute.getRouteItem('budget-journal-type-detail', 'key')
    };
  }

  componentWillMount(){
    this.getList();
  }

  getList(){
    let params = this.state.searchParams;
    let url = `${config.budgetUrl}/api/budget/journal/types/query?&page=${this.state.page}&size=${this.state.pageSize}&organizationId=${this.props.organization.id}`;
    for(let paramsName in params){
      url += params[paramsName] ? `&${paramsName}=${params[paramsName]}` : '';
    }
    return httpFetch.get(url).then((response)=>{
      response.data.map((item)=>{
        item.key = item.id;
      });
      this.setState({
        data: response.data,
        loading: false,
        pagination: {
          total: Number(response.headers['x-total-count']),
          onChange: this.onChangePager,
          current: this.state.page + 1
        }
      })
    });
  };

  onChangePager = (page) => {
    if(page - 1 !== this.state.page)
      this.setState({
        page: page - 1,
        loading: true
      }, ()=>{
        this.getList();
      })
  };

  search = (result) => {
    console.log(result);
    this.setState({
      page: 0,
      searchParams: {
        journalTypeCode: result.journalTypeCode ? result.journalTypeCode : '',
        journalTypeName: result.journalTypeName ? result.journalTypeName : ''
      }
    }, ()=>{
      this.getList();
    })
  };

  clear = () => {
    this.setState({
      searchParams: {
        journalTypeCode: '',
        journalTypeName: ''
      }
    })
  };

  handleNew = () => {
    this.context.router.push(this.state.newBudgetJournalTypePage.url.replace(':id', this.props.organization.id));
  };

  handleRowClick = (record) => {
    this.context.router.push(this.state.budgetJournalTypeDetailPage.url.replace(':id', this.props.organization.id).replace(':typeId', record.id));
  };

  render(){
    const { searchForm, pagination, columns, data, loading } = this.state;
    return (
      <div>
        <SearchArea
          searchForm={searchForm}
          submitHandle={this.search}
          clearHandle={this.clear}/>
        <div className="table-header">
          <div className="table-header-title">共 {pagination.total} 条数据</div>
          <div className="table-header-buttons">
            <Button type="primary" onClick={this.handleNew}>新 建</Button>
          </div>
        </div>
        <Table columns={columns}
               dataSource={data}
               pagination={pagination}
               loading={loading}
               bordered
               onRowClick={this.handleRowClick}
               size="middle"/>
      </div>
    )
  }

}

BudgetJournalType.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps)(injectIntl(BudgetJournalType));
