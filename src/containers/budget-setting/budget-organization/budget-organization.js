import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import config from 'config'
import { Table, Badge, Button, Popover, message, Popconfirm } from 'antd';
import menuRoute from 'share/menuRoute'
import httpFetch from 'share/httpFetch'

import UpdateBudgetOrganization from 'containers/budget-setting/budget-organization/update-budget-organization'
import SearchArea from 'components/search-area'
import SlideFrame from 'components/slide-frame'

class BudgetOrganization extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: [],
      page: 0,
      pageSize: 10,
      columns: [
        {title: '预算组织代码', dataIndex: 'organizationCode', width: '20%'},
        {title: '预算组织名称', dataIndex: 'organizationName', width: '30%', render: organizationName => <Popover content={organizationName}>{organizationName}</Popover>},
        {title: '账套', dataIndex: 'setOfBooksId', width: '20%'},
        {title: '状态', dataIndex: 'isEnabled', width: '15%', render: isEnabled => <Badge status={isEnabled ? 'success' : 'error'} text={isEnabled ? '启用' : '禁用'} />},
        {title: '操作', key: 'operation', width: '15%', render: (text, record) => (
          <span>
            <a href="#" onClick={(e) => this.editItem(e, record)}>编辑</a>
            <span className="ant-divider" />
            <Popconfirm onConfirm={(e) => this.deleteItem(e, record)} title={`你确认要删除预算组织 ${record.organizationName} 吗？`}>
              <a href="#" onClick={(e) => {e.preventDefault();e.stopPropagation();}}>删除</a>
            </Popconfirm>
          </span>)},
      ],
      pagination: {
        total: 0
      },
      budgetOrganizationDetailPage: menuRoute.getRouteItem('budget-organization-detail','key'),    //组织定义详情的页面项
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
      },
      nowOrganization: {},
      showSlideFrame: false
    };
  }

  componentWillMount(){
    this.getList();
  }

  editItem = (e, record) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      nowOrganization: record,
      showSlideFrame: true
    })
  };

  deleteItem = (e, record) => {
    httpFetch.delete(`${config.budgetUrl}/api/budget/organizations/${record.id}`).then(response => {
      message.success(`${record.organizationName}删除成功`);
      this.getList();
    })
  };

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
          onChange: this.onChangePager,
          current: this.state.page + 1
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
    this.context.router.push(this.state.budgetOrganizationDetailPage.url.replace(':id', record.id));
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

  handleCloseSlide = (success) => {
    success && this.getList();
    this.setState({showSlideFrame : false});
  };

  render(){
    const { columns, data, loading,  pagination, searchForm, nowOrganization, showSlideFrame } = this.state;
    return (
      <div className="budget-organization">
        <h3 className="header-title">预算组织定义</h3>
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
        <SlideFrame title="编辑预算组织"
                    show={showSlideFrame}
                    content={UpdateBudgetOrganization}
                    afterClose={this.handleCloseSlide}
                    onClose={() => this.setState({showSlideFrame : false})}
                    params={nowOrganization}/>
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
