import React from 'react'
import { injectIntl } from 'react-intl'
import menuRoute from 'share/menuRoute'
import { Form, Button, Table } from 'antd'

import SearchArea from 'components/search-area'

class BudgetOccupancy extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      searchForm: [
        {type: 'input', id: 'num', label: '导入批次号'},
        {type: 'select', id: 'people', label: '创建人', options: []},
        {type: 'items', id: 'rangeDate', items: [
          {type: 'date', id: 'dateFrom', label: '导入日期从'},
          {type: 'date', id: 'dateTo', label: '导入日期至'}
        ]}
      ],
      columns: [
        {title: '导入批次号', dataIndex: '1'},
        {title: '说明', dataIndex: '2', width: '40%'},
        {title: '创建人', dataIndex: '3'},
        {title: '导入日期', dataIndex: '4'},
        {title: '操作', dataIndex: '5'},
      ],
      data: [],
      page: 0,
      pageSize: 10,
      pagination: {
        total: 0
      },
      newBudgetOccupancy:  menuRoute.getRouteItem('new-budget-occupancy','key'),    //新建预算占用调整
    }
  }

  search = (values) => {
    console.log(values)
  };

  //新建
  handleNew = () => {
    this.context.router.push(this.state.newBudgetOccupancy.url);
  };

  render() {
    const { loading, searchForm, pagination, columns, data } = this.state;
    return (
      <div className="budget-occupancy">
        <SearchArea searchForm={searchForm}
                    submitHandle={this.search}/>
        <div className="table-header">
          <div className="table-header-buttons">
            <Button type="primary" onClick={this.handleNew}>新 建</Button>
          </div>
          <div className="table-header-title">共搜索到 {pagination.total} 条数据</div>
        </div>
        <Table rowKey={record => record.id}
               columns={columns}
               dataSource={data}
               pagination={pagination}
               loading={loading}
               bordered
               size="middle"/>
      </div>
    )
  }
}

BudgetOccupancy.contextTypes = {
  router: React.PropTypes.object
};

const wrappedBudgetOccupancy = Form.create()(injectIntl(BudgetOccupancy));

export default wrappedBudgetOccupancy;
