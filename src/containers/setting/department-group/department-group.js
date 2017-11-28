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

import 'styles/setting/department-group/department-group.scss';


class DepartmentGroup extends React.Component {
  constructor(props) {
    super(props);
    const { formatMessage } = this.props.intl;
    this.state = {
      loading: true,
      data: [],
      searchParams: {
        deptGroupCode: "",
        description: ""
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
        {type: 'input', id: 'deptGroupCode', label: "部门组代码" }, /*预算表代码*/
        {type: 'input', id: 'description', label: "部门组名称" }, /*预算表名称*/
      ],
      columns: [
        {          /*部门组代码*/
          title: "部门组代码", key: "deptGroupCode", dataIndex: 'deptGroupCode'
        },
        {          /*部门组名称*/
          title: "部门组名称", key: "description", dataIndex: 'description'
        },

        {           /*状态*/
          title: formatMessage({id:"common.column.status"}),
          key: 'status',
          width: '10%',
          dataIndex: 'enabled',
          render: enabled => (
            <Badge status={enabled ? 'success' : 'error'}
                   text={enabled ? formatMessage({id: "common.status.enable"}) : formatMessage({id: "common.status.disable"})} />
          )
        }
      ],
    }
  }

  componentWillMount(){

    this.getList();
  }

  //获取部门组数据
  getList(){
    const {searchParams, pagination} = this.state;
    let url = `${config.baseUrl}/api/DepartmentGroup/selectByInput?deptGroupCode=${searchParams.deptGroupCode}&description=${searchParams.description}&page=${pagination.page}&size=${pagination.pageSize}`;
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
      deptGroupCode: values.deptGroupCode,
      description: values.description
    };
    this.setState({
      searchParams,
      loading: true,
      page: 1
    }, ()=>{
      this.getList();
    })
  };

  //分页点击
  onChangePager = (pagination,filters, sorter) =>{
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
    this.context.router.push(menuRoute.getMenuItemByAttr('department-group', 'key').children.newDepartmentGroup.url);
  };

  //点击行，进入该行详情页面
  handleRowClick = (record, index, event) =>{
    this.context.router.push(menuRoute.getMenuItemByAttr('department-group', 'key').children.departmentGroupDetail.url.replace(':id',record.id));
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

DepartmentGroup.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
  return {
    organization: state.budget.organization
  }
}

export default connect(mapStateToProps)(injectIntl(DepartmentGroup));
