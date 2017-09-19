import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import config from 'config'
import { Table, Badge } from 'antd';
import menuRoute from 'share/menuRoute'
import httpFetch from 'share/httpFetch'

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
      budgetDetailPage: menuRoute.getMenuItemByAttr('budget-organization','key').children.budgetDetail    //新建值列表的页面项
    };
  }

  componentWillMount(){
    this.getList();
  }

  //得到值列表数据
  getList(){
    return httpFetch.get(`${config.budgetUrl}/api/budget/organizations/query?&page=${this.state.page}&size=${this.state.pageSize}&setOfBooksId=1`).then((response)=>{
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
    console.log(record);
    console.log(this.state.budgetDetailPage);
    this.context.router.push(this.state.budgetDetailPage.url.replace(':id', record.id));
  };

  render(){
    const { columns, data, loading,  pagination } = this.state;
    return (
      <div>
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
