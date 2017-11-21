/**
 * created by jsq on 2017/11/9
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { Button, Table, Badge, notification, Popover, Popconfirm, message  } from 'antd';
import SearchArea from 'components/search-area.js';
import httpFetch from 'share/httpFetch';
import config from 'config'

import menuRoute from 'share/menuRoute'

import 'styles/setting/company-group/company-group.scss';

class CompanyGroup extends React.Component {
  constructor(props) {
    super(props);
    const { formatMessage } = this.props.intl;
    this.state = {
      loading: true,
      data: [],
      searchParams: {
        structureCode: "",
        structureName: ""
      },
      pagination: {
        current: 1,
        page: 0,
        total:0,
        pageSize:10,
        showSizeChanger:true,
        showQuickJumper:true,
      },
      searchForm: [
        {type: 'select', id: 'setOfBook', label: formatMessage({id:"budget.set.of.books"}), options: [],
          getUrl: `${config.baseUrl}/api/setOfBooks/by/tenant`, method: 'get', labelKey: 'setOfBooksCode', valueKey: 'id', getParams: {roleType: 'TENANT'}},
        {type: 'input', id: 'companyGroupCode', label: "公司组代码" }, /*预算表代码*/
        {type: 'input', id: 'companyGroupName', label: "公司组名称" }, /*预算表名称*/
      ],
      columns: [
        {          /*公司组代码*/
          title: "公司组代码", key: "companyGroupCode", dataIndex: 'companyGroupCode'
        },
        {          /*公司组描述*/
          title: "公司组描述", key: "companyGroupName", dataIndex: 'companyGroupName'
        },
        {          /*账套*/
          title: "账套", key: "setOfBooksId", dataIndex: 'setOfBooksId'
        },

        {           /*状态*/
          title: formatMessage({id:"common.column.status"}),
          key: 'status',
          width: '10%',
          dataIndex: 'isEnabled',
          render: isEnabled => (
            <Badge status={isEnabled ? 'success' : 'error'}
                   text={isEnabled ? formatMessage({id: "common.status.enable"}) : formatMessage({id: "common.status.disable"})} />
          )
        },
        {title: formatMessage({id:"common.operation"}), key: 'operation', width: '15%', render: (text, record) => (
          <span>
            <a href="#" onClick={(e) => this.editItem(e, record)}>{formatMessage({id: "common.edit"})}</a>
            <span className="ant-divider" />
            <Popconfirm onConfirm={(e) => this.deleteItem(e, record)} title={formatMessage({id:"budget.are.you.sure.to.delete.rule"}, {controlRule: record.controlRuleName})}>{/* 你确定要删除organizationName吗 */}
              <a href="#" onClick={(e) => {e.preventDefault();e.stopPropagation();}}>{formatMessage({id: "common.delete"})}</a>
            </Popconfirm>
          </span>)},  //操作
      ],
    }
  }


  editItem = (e, record) =>{
    console.log(record)

  };

  deleteItem = (e, record) => {
    this.setState({loading: true});
    httpFetch.delete(`${config.baseUrl}/api/company/group/${record.id}`).then(response => {
      message.success(this.props.intl.formatMessage({id:"common.delete.success"}, {name: record.companyGroupName})); // name删除成功
      this.setState({
        loading: false
      },this.getList());
    })
  };

  componentWillMount(){
    this.getList();
  }

  //获取公司组数据
  getList(){
    let params = this.state.searchParams;
    let url = `${config.baseUrl}/api/company/group/query?page=${this.state.pagination.page}&size=${this.state.pagination.pageSize}`;
    for(let paramsName in params){
      url += params[paramsName] ? `&${paramsName}=${params[paramsName]}` : '';
    }
    httpFetch.get(url).then((response)=>{
      response.data.map((item,index)=>{
        item.key = item.id;
      });
      let pagination = this.state.pagination;
      pagination.total = Number(response.headers['x-total-count']);
      this.setState({
        data: response.data,
        pagination,
        loading: false
      })
    })
  };

  handleSearch = (values) =>{
    let searchParams = {
      structureName: values.structureName,
      structureCode: values.structureCode
    };
    this.setState({
      searchParams:searchParams,
      loading: true,
      page: 1
    }, ()=>{
      this.getList();
    })
  };

  //分页点击
  onChangePager = (pagination,filters, sorter) =>{
    console.log(pagination)
    this.setState({
      pagination:{
        current: pagination.current,
        page: pagination.current-1,
        pageSize: pagination.pageSize,
        total: pagination.total
      }
    }, ()=>{
      this.getList();
    })
  };

  //新建公司组
  handleCreate = () =>{
    this.context.router.push(menuRoute.getMenuItemByAttr('company-group', 'key').children.newCompanyGroup.url);
  };

  //点击行，进入该行详情页面
  handleRowClick = (record, index, event) =>{
    console.log(record)
    this.context.router.push(menuRoute.getMenuItemByAttr('company-group', 'key').children.companyGroupDetail.url.replace(':id',record.id));
  };

  render(){
    const { formatMessage } = this.props.intl;
    const { searchForm, loading, data, columns, pagination } = this.state;
    return (
      <div className="budget-structure">
        <SearchArea searchForm={searchForm} submitHandle={this.handleSearch}/>
        <div className="table-header">
          <div className="table-header-title">{formatMessage({id:'common.total'},{total:`${pagination.total}`})}</div>  {/*共搜索到*条数据*/}
          <div className="table-header-buttons">
            <Button type="primary" onClick={this.handleCreate}>{formatMessage({id: 'common.create'})}</Button>  {/*新 建*/}
          </div>
        </div>
        <Table
          loading={loading}
          dataSource={data}
          columns={columns}
          pagination={pagination}
          onChange={this.onChangePager}
          onRowClick={this.handleRowClick}
          size="middle"
          bordered/>
      </div>
    )
  }

}

CompanyGroup.contextTypes = {
  router: React.PropTypes.object
}

function mapStateToProps(state) {
  return {
    organization: state.budget.organization
  }
}

export default connect(mapStateToProps)(injectIntl(CompanyGroup));
