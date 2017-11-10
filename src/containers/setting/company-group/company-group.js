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

import 'styles/budget-setting/budget-organization/budget-structure/budget-structure.scss';


let setOfBook = [];

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
        {type: 'select', options: setOfBook, id: 'setOfBook', label: "账套"},
        {type: 'input', id: 'structureCode', label: formatMessage({id: 'budget.structureCode'}) }, /*预算表代码*/
        {type: 'input', id: 'structureName', label: formatMessage({id: 'budget.structureName'}) }, /*预算表名称*/
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
    httpFetch.delete(`${config.budgetUrl}/api/company/group/${record.id}`).then(response => {
      message.success(this.props.intl.formatMessage({id:"common.delete.success"}, {name: record.companyGroupName})); // name删除成功
      this.getList();
    })
  };

  componentWillMount(){
    //获取账套
    httpFetch.get(`${config.baseUrl}/api/setOfBooks/by/tenant?roleType=TENANT`).then((response)=>{
      console.log(response)
      response.data.map((item)=>{
        let option = {
          label: item.setOfBooksCode +" "+item.setOfBooksName,
          value: item.id
        };
        setOfBook.addIfNotExist(option)
      })
    });
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
        item.key = item.structureCode;
      });
      this.setState({
        data: response.data,
        pagination: {
          total: Number(response.headers['x-total-count']),
          current: this.state.pagination.current,
          page: this.state.pagination.page,
          pageSize:this.state.pagination.pageSize,
          showSizeChanger:true,
          showQuickJumper:true,
        },
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

  handleCreate = () =>{
    if(this.props.organization.isEnabled) {
      this.context.router.push(menuRoute.getMenuItemByAttr('budget-organization', 'key').children.newBudgetStructure.url.replace(':id', this.props.id));
    }else{
      notification["error"]({
        description: this.props.intl.formatMessage({id:"structure.validateCreate"})  /*请维护当前账套下的预算组织*/
      })
    }
  };

  //点击行，进入该行详情页面
  handleRowClick = (record, index, event) =>{
    this.context.router.push(menuRoute.getMenuItemByAttr('budget-organization', 'key').children.budgetStructureDetail.url.replace(':id', this.props.id).replace(':structureId', record.id));
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
