import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import config from 'config'
import { Table, Badge, Button } from 'antd';
import menuRoute from 'share/menuRoute'
import httpFetch from 'share/httpFetch'

import SearchArea from 'components/search-area'

class BudgetOrganization extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: [],
      page: 0,
      pageSize: 10,
      columns: [
        {title: '预算组织代码', dataIndex: 'organizationCode', width: '25%'},
        {title: '预算组织名称', dataIndex: 'organizationName', width: '25%'},
        {title: '账套', dataIndex: 'setOfBooksId', width: '25%'},
        {title: '状态', key: 'enabled', width: '25%', render: isEnabled => <Badge status={isEnabled ? 'success' : 'error'} text={isEnabled ? '启用' : '禁用'} />}
      ],
      pagination: {
        total: 0
      },
      budgetDetailPage: menuRoute.getRouteItem('budget-detail','key'),    //组织定义详情的页面项
      newBudgetOrganization:  menuRoute.getRouteItem('new-budget-organization','key'),    //新建组织定义的页面项
      searchForm: [
        {type: 'select', id: 'setOfBooksId', label: '帐套', options: []},
        {type: 'input', id: 'organizationCode', label: '预算组织代码'},
        {type: 'input', id: 'organizationName', label: '预算组织名称'},
      ],
      searchParams: {
        setOfBooksId: 1,
        organizationCode: '',
        organizationName: ''
      }
    };
  }

  componentWillMount(){
    this.getList();
  }

  //得到列表数据
  getList(){
    let params = this.state.searchParams;
    let url = `${config.budgetUrl}/api/budget/organizations/query?&page=${this.state.page}&size=${this.state.pageSize}`;
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
          onChange: this.onChangePager
        }
      })
    });
  }

  //分页点击
  onChangePager = (page) => {
    if(page - 1 !== this.state.page)
      this.setState({
        page: page - 1,
        loading: true
      }, ()=>{
        this.getList();
      })
  };

  handleRowClick = (record) => {
    this.context.router.push(this.state.budgetDetailPage.url.replace(':id', record.id));
  };

  search = (result) => {
    this.setState({
      page: 0,
      searchParams: {
        setOfBooksId: result.setOfBooksId ? result.setOfBooksId : 1,
        organizationCode: result.organizationCode ? result.organizationCode : '',
        organizationName: result.organizationName ? result.organizationName : ''
      }
    }, ()=>{
      this.getList();
    })
  };

  clear = () => {
    this.setState({
      searchParams: {
        setOfBooksId: '',
        organizationCode: '',
        organizationName: ''
      }
    })
  };

  searchEventHandle = (event, value) => {
    console.log(event, value)
  };

  handleNew = () => {
    this.context.router.push(this.state.newBudgetOrganization.url);
  };

  render(){
    const { columns, data, loading,  pagination, searchForm } = this.state;
    return (
      <div className="budget-organization">
        <SearchArea
          searchForm={searchForm}
          submitHandle={this.search}
          clearHandle={this.clear}
          eventHandle={this.searchEventHandle}/>

        <div className="table-header">
          <div className="table-header-title">共 {pagination.total} 条数据</div>
          <div className="table-header-buttons">
            <Button type="primary" onClick={this.handleNew}>新建</Button>
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

BudgetOrganization.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps)(injectIntl(BudgetOrganization));
