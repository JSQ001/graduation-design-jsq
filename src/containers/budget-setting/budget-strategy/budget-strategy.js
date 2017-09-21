import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { Button, Table, Modal, Badge } from 'antd'

import SearchArea from 'components/search-area'
import menuRoute from 'share/menuRoute'

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
        {title: '预算控制策略代码', dataIndex: 'strategyCode', key: 'strategyCode'},
        {title: '预算控制策略描述', dataIndex: 'strategyDesc', key: 'strategyDesc'},
        {title: '状态', dataIndex: 'state', key: 'state'}
      ],
      data: [],    //列表值
      newBudgetStrategy:  menuRoute.getRouteItem('new-budget-strategy','key'),    //新建控制策略的页面项
    };
  }

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

  render(){
    const { searchForm, columns, data } = this.state;
    return (
      <div className="budget-strategy">
        <SearchArea
          searchForm={searchForm}
          submitHandle={this.search}
          clearHandle={this.clear}
          eventHandle={this.searchEventHandle}/>
        <div className="table-header">
          <div className="table-header-title">{`共搜索到 0 条数据`}</div>
          <div className="table-header-buttons">
            <Button type="primary" onClick={this.handleNew}>新 建</Button>
          </div>
        </div>
        <Table columns={columns}
               dataSource={data}
               // pagination={pagination}
               // Loading={Loading}
               //onRowClick={this.handleRowClick}
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
