import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import config from 'config'
import { Table, Badge, Button, Popover, message } from 'antd';
import menuRoute from 'share/menuRoute'
import httpFetch from 'share/httpFetch'
import budgetService from 'service/budgetService'

import UpdateBudgetOrganization from 'containers/budget-setting/budget-organization/update-budget-organization'
import SearchArea from 'components/search-area'
import SlideFrame from 'components/slide-frame'

class BudgetOrganization extends React.Component {
  constructor(props) {
    super(props);
    const { formatMessage } = this.props.intl;
    this.state = {
      loading: true,
      data: [],
      page: 0,
      pageSize: 10,
      columns: [
        {title: formatMessage({id:"budget.organization.code"}), dataIndex: 'organizationCode', width: '20%'},  //预算组织代码
        {title: formatMessage({id:"budget.organization.name"}), dataIndex: 'organizationName', width: '30%',   //预算组织名称
          render: organizationName => (
            <Popover content={organizationName}>
              {organizationName}
            </Popover>)
        },
        {title: formatMessage({id:"budget.organization.set.of.books"}), dataIndex: 'setOfBooksCode', width: '20%'},  //账套
        {title: formatMessage({id:"common.column.status"}), dataIndex: 'isEnabled', width: '15%',
          render: isEnabled => (
            <Badge status={isEnabled ? 'success' : 'error'}
                   text={isEnabled ? formatMessage({id: "common.status.enable"}) : formatMessage({id: "common.status.disable"})} />
          )}, //状态
        {title: formatMessage({id:"common.operation"}), key: 'operation', width: '15%', render: (text, record) => (
          <span>
            <a href="#" onClick={(e) => this.editItem(e, record)}>{formatMessage({id: "common.edit"})}</a>
          </span>)},  //操作
      ],
      pagination: {
        total: 0
      },
      budgetOrganizationDetailPage: menuRoute.getRouteItem('budget-organization-detail','key'),    //组织定义详情的页面项
      newBudgetOrganization:  menuRoute.getRouteItem('new-budget-organization','key'),    //新建组织定义的页面项
      searchForm: [
        {type: 'select', id: 'setOfBooksId', label: formatMessage({id:"budget.organization.set.of.books"}), options: [],
          getUrl: `${config.baseUrl}/api/setOfBooks/by/tenant`, method: 'get', labelKey: 'setOfBooksCode', valueKey: 'id', getParams: {roleType: 'TENANT'}}, //账套
        {type: 'input', id: 'organizationCode', label: formatMessage({id:"budget.organization.code"})},  //预算组织代码
        {type: 'input', id: 'organizationName', label: formatMessage({id:"budget.organization.name"})}  //预算组织名称
      ],
      searchParams: {
        setOfBooksId: '',
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

  //得到列表数据
  getList(){
    this.setState({ loading: true });
    let params = this.state.searchParams;
    let url = `${config.budgetUrl}/api/budget/organizations/query?&page=${this.state.page}&size=${this.state.pageSize}`;
    for(let paramsName in params){
      !params[paramsName] && delete params[paramsName];
    }
    params.page = this.state.page;
    params.pageSize = this.state.pageSize;
    return budgetService.getOrganization(params).then((response)=>{
      response.data.map((item)=>{
        item.key = item.id;
      });
      this.setState({
        data: response.data,
        loading: false,
        pagination: {
          total: Number(response.headers['x-total-count']) ? Number(response.headers['x-total-count']) : 0,
          onChange: this.onChangePager,
          current: this.state.page + 1
        }
      })
    }).catch(e => {
      message.error(this.props.intl.formatMessage({id: 'common.error'}));
      this.setState({loading: false});
    });
  }

  //分页点击
  onChangePager = (page) => {
    if (page - 1 !== this.state.page)
      this.setState({
        page: page - 1,
        loading: true
      }, () => {
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
        setOfBooksId: result.setOfBooksId ? result.setOfBooksId : '',
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
    const { formatMessage } = this.props.intl;
    const { columns, data, loading,  pagination, searchForm, nowOrganization, showSlideFrame } = this.state;
    return (
      <div className="budget-organization">
        <h3 className="header-title">{formatMessage({id:"menu.budget-organization"})}</h3> {/* 预算组织定义 */}
        <SearchArea
          searchForm={searchForm}
          submitHandle={this.search}
          clearHandle={this.clear}
          eventHandle={this.searchEventHandle}/>

        <div className="table-header">
          <div className="table-header-title">{formatMessage({id:"common.total"}, {total: pagination.total ? pagination.total : '0'})}</div> {/* 共total条数据 */}
          <div className="table-header-buttons">
            <Button type="primary" onClick={this.handleNew}>{formatMessage({id:"common.create"})}</Button> {/* 新建 */}
          </div>
        </div>
        <Table columns={columns}
               dataSource={data}
               pagination={pagination}
               loading={loading}
               bordered
               onRow={record => ({onClick: () => this.handleRowClick(record)})}
               size="middle"/>
        {/* 编辑预算组织 */}
        <SlideFrame title={formatMessage({id:"budget.organization.edit"})}
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
