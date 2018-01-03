import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { Table, Badge, Button } from 'antd';
import menuRoute from 'routes/menuRoute'
import { budgetService } from 'service'

import SearchArea from 'components/search-area'

class BudgetGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: [],
      page: 0,
      pageSize: 10,
      columns: [
        {title: '预算项目组代码', dataIndex: 'itemGroupCode', width: '35%'},
        {title: '预算项目组名称', dataIndex: 'itemGroupName', width: '50%'},
        {title: '状态', dataIndex: 'isEnabled', width: '15%', render: isEnabled => <Badge status={isEnabled ? 'success' : 'error'} text={isEnabled ? '启用' : '禁用'} />}
      ],
      pagination: {
        total: 0
      },
      searchForm: [
        {type: 'input', id: 'itemGroupCode', label: '预算项目组代码'},
        {type: 'input', id: 'itemGroupName', label: '预算项目组名称'}
      ],
      searchParams: {
        groupCode: '',
        groupName: ''
      },
      newBudgetGroupPage: menuRoute.getRouteItem('new-budget-group','key'),    //新建预算组的页面项
      budgetGroupDetail: menuRoute.getRouteItem('budget-group-detail', 'key')  //预算组详情
    };
  }

  componentWillMount(){
    this.getList();
  }

  getList(){
    this.setState({loading: true});
    let params = Object.assign({}, this.state.searchParams);
    for(let paramsName in params){
      !params[paramsName] && delete params[paramsName];
    }
    params.page = this.state.page;
    params.pageSize = this.state.pageSize;
    params.organizationId = this.props.organization.id;
    return budgetService.getOrganizationGroups(params).then(response => {
      response.data.map(item => {
        item.key = item.id
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
    })
  }

  clear = () => {
    this.setState({
      searchParams: {
        groupCode: '',
        groupName: ''
      }
    })
  };

  search = (result) => {
    this.setState({
      page: 0,
      searchParams: {
        itemGroupCode: result.itemGroupCode ? result.itemGroupCode : '',
        itemGroupName: result.itemGroupName ? result.itemGroupName : ''
      }
    }, ()=>{
      this.getList();
    })
  };

  handleNew = () => {
    this.context.router.push(this.state.newBudgetGroupPage.url.replace(":id", this.props.organization.id))
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

  handleRowClick = (record) => {
    this.context.router.replace(this.state.budgetGroupDetail.url.replace(":id", this.props.organization.id).replace(":groupId", record.id));
  };

  render(){
    const { columns, data, loading,  pagination, searchForm } = this.state;
    return (
      <div>
        <SearchArea
          searchForm={searchForm}
          submitHandle={this.search}
          clearHandle={this.clear}/>
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
               onRow={record => ({onClick: () => this.handleRowClick(record)})}
               size="middle"/>
      </div>
    )
  }

}

BudgetGroup.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
  return {}
}

export default connect(mapStateToProps)(injectIntl(BudgetGroup));
