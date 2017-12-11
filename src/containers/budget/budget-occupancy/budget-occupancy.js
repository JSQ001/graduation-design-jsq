import React from 'react'
import { injectIntl } from 'react-intl'
import menuRoute from 'share/menuRoute'
import config from 'config'
import httpFetch from 'share/httpFetch'
import { Form, Button, Table, message } from 'antd'

import moment from 'moment'
import SearchArea from 'components/search-area'

class BudgetOccupancy extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      searchParams: {},
      searchForm: [
        {type: 'input', id: 'num', label: '导入批次号'},
        {type: 'select', id: 'people', label: '创建人', options: [], getUrl: `${config.budgetUrl}/api/budget/reserve/adjust/getEmployee`, method: 'get'},
        {type: 'items', id: 'rangeDate', items: [
          {type: 'date', id: 'dateFrom', label: '导入日期从'},
          {type: 'date', id: 'dateTo', label: '导入日期至'}
        ]}
      ],
      columns: [
        {title: '导入批次号', dataIndex: '1'},
        {title: '说明', dataIndex: '2', width: '40%'},
        {title: '创建人', dataIndex: '3', render: (value, record) => value + ' - ' + record.employeeId},
        {title: '导入日期', dataIndex: '4', render: value => moment(value).format('YYYY-MM-DD')},
        {title: '操作', dataIndex: 'id', render: id => <a>查看详情</a>},
      ],
      data: [],
      page: 0,
      pageSize: 10,
      pagination: {
        total: 0
      },
      newBudgetOccupancy:  menuRoute.getRouteItem('new-budget-occupancy','key'),    //新建预算占用调整
      importDetail:  menuRoute.getRouteItem('export-detail','key'),    //导入详情
    }
  }

  componentWillMount() {
    this.getList()
  }

  getList = () => {
    const { page, pageSize, searchParams } = this.state;
    let url = `${config.budgetUrl}/api/budget/reserve/adjust?page=${page}&size=${pageSize}`;
    for(let paramsName in searchParams) {
      url += searchParams[paramsName] ? `&${paramsName}=${searchParams[paramsName]}` : ''
    }
    this.setState({ loading: true });
    httpFetch.get(url).then(res => {
      this.setState({
        loading: false,
        data: res.data,
        pagination: {
          total: Number(res.headers['x-total-count']) ? Number(res.headers['x-total-count']) : 0,
          onChange: this.onChangePager,
          current: page + 1
        }
      })
    }).catch(() => {
      this.setState({ loading: false });
      message.error('数据加载失败，请重试')
    })
  };

  //分页点击
  onChangePager = (page) => {
    if(page - 1 !== this.state.page)
      this.setState({ page: page - 1 }, ()=>{
        this.getList();
      })
  };

  search = (values) => {
    values.dateFrom = values.dateFrom ? moment(values.dateFrom).format('YYYY-MM-DD') : null;
    values.dateTo = values.dateTo ? moment(values.dateTo).format('YYYY-MM-DD') : null;
    this.setState({ searchParams: values },() => {
      this.getList()
    })
  };

  clear = () => {
    this.setState({ searchParams: {} })
  };

  //新建
  handleNew = () => {
    this.context.router.push(this.state.newBudgetOccupancy.url);
  };

  //导入详情页
  toImportDetail = () => {
    this.context.router.push(this.state.importDetail.url);
  };

  render() {
    const { loading, searchForm, pagination, columns, data } = this.state;
    return (
      <div className="budget-occupancy">
        <SearchArea searchForm={searchForm}
                    submitHandle={this.search}
                    clearHandle={this.clear}/>
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
               onRow={record => ({
                 onClick: () => this.toImportDetail(record)
               })}
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
