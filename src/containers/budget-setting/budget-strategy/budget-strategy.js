import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { Button, Table, Modal, Badge } from 'antd'

import SearchArea from 'components/search-area'
import menuRoute from 'share/menuRoute'
import httpFetch from 'share/httpFetch'
import config from 'config'

class BudgetStrategy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchForm: [
        {type: 'input', id: 'strategyCode', label: '预算控制策略代码'},
        {type: 'input', id: 'strategyDesc', label: '预算控制策略描述'}
      ],
      searchParams: {
        strategyCode: "",
        strategyDesc: ""
      },
      columns: [
        {title: '预算控制策略代码', dataIndex: 'controlStrategyCode', key: 'controlStrategyCode'},
        {title: '预算控制策略描述', dataIndex: 'controlStrategyName', key: 'controlStrategyName'},
        {title: '状态', dataIndex: 'isEnabled', key: 'isEnabled', render: isEnabled => <Badge status={isEnabled ? 'success' : 'error'} text={isEnabled ? '启用' : '禁用'} />}
      ],
      data: [],    //列表值
      pagination: {
        total: 0
      },
      loading: true,
      page: 0,
      pageSize: 10,
      newBudgetStrategy:  menuRoute.getRouteItem('new-budget-strategy','key'),    //新建控制策略
      budgetStrategyDetail:  menuRoute.getRouteItem('budget-strategy-detail','key'),    //预算控制策略详情
    };
  }

  componentWillMount(){
    this.getList();
  }

  getList() {
    return httpFetch.get(`${config.budgetUrl}/api/budget/control/strategies/query?size=${this.state.pageSize}&page=${this.state.page+1}&controlStrategyCode=${this.state.searchParams.strategyCode||''}&controlStrategyName=${this.state.searchParams.strategyDesc||''}`).then((response)=>{
      if(response.status==200){
        response.data.map((item, index)=>{
          item.index = this.state.page * this.state.pageSize + index + 1;
          item.key = item.index;
        });
        this.setState({
          data: response.data,
          loading: false,
          pagination: {
            total: Number(response.headers['x-total-count']),
            onChange: this.onChangePager,
            pageSize: this.state.pageSize
          }
        })
      }
    }).catch((e)=>{

    })
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

  //搜索
  search = (result) => {
    let searchParams = {
      strategyCode: result.strategyCode,
      strategyDesc: result.strategyDesc
    };
    this.setState({
      searchParams:searchParams,
      loading: true,
      page: 0
    }, ()=>{
      this.getList();
    })
  };

  //清空搜索区域
  clear = () => {
    this.setState({searchParams: {
      strategyCode: "",
      strategyDesc: ""
    }})
  };

  handleNew = () => {
    this.context.router.push(this.state.newBudgetStrategy.url);
  };

  handleRowClick = (record) => {
    console.log(record);
    this.context.router.push(this.state.budgetStrategyDetail.url.replace(':id', record.id));
  };

  render(){
    const { searchForm, columns, data, pagination, loading } = this.state;
    return (
      <div className="budget-strategy">
        <SearchArea
          searchForm={searchForm}
          submitHandle={this.search}
          clearHandle={this.clear}
          eventHandle={this.searchEventHandle}/>
        <div className="table-header">
          <div className="table-header-title">{`共搜索到 ${this.state.pagination.total} 条数据`}</div>
          <div className="table-header-buttons">
            <Button type="primary" onClick={this.handleNew}>新 建</Button>
          </div>
        </div>
        <Table columns={columns}
               dataSource={data}
               pagination={pagination}
               loading={loading}
               onRowClick={this.handleRowClick}
               bordered
               size="middle"/>
      </div>
    )
  }

}

BudgetStrategy.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps)(injectIntl(BudgetStrategy));
