/**
 * created by jsq on 2017/9/18
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { Button, Table, Badge, notification  } from 'antd';
import SearchArea from 'components/search-area.js';
import httpFetch from 'share/httpFetch';
import config from 'config'

import menuRoute from 'share/menuRoute'

import 'styles/budget-setting/budget-organization/budget-structure/budget-structure.scss';

class BudgetStructure extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: [],
      params:{},
      pagination: {
        current:1,
        total:0,
        pageSize:10,
        showSizeChanger:true,
        showQuickJumper:true,
      },
      searchForm: [
        {type: 'input', id: 'structureCode', label: this.props.intl.formatMessage({id: 'budget.structureCode'}) }, /*预算表代码*/
        {type: 'input', id: 'description', label: this.props.intl.formatMessage({id: 'budget.structureDescription'}) }, /*预算表描述*/
      ],
      columns: [
        {          /*预算组织*/
          title: this.props.intl.formatMessage({id:"budget.organization"}), key: "organizationCode", dataIndex: 'organizationCode'
        },
        {          /*预算表代码*/
          title: this.props.intl.formatMessage({id:"budget.structureCode"}), key: "structureCode", dataIndex: 'structureCode'
        },
        {          /*预算表描述*/
          title: this.props.intl.formatMessage({id:"budget.structureDescription"}), key: "description", dataIndex: 'description'
        },
        {          /*编制期段*/
          title: this.props.intl.formatMessage({id:"periodStrategy"}), key: "periodStrategy", dataIndex: 'periodStrategy'
        },
        {           /*状态*/
          title: this.props.intl.formatMessage({id:"status"}),
          key: 'status',
          dataIndex: 'isEnabled',
          render: (recode) => {
            if (recode) {
              return (
                <div>
                  <Badge status="success"/>
                  { this.props.intl.formatMessage({id:"status.enabled"}) }  {/*启用*/}
                </div>
              );
            } else {
              if (recode === undefined) {
                return
              } else {
                return (
                  <div>
                    <Badge status="error"/>
                    { this.props.intl.formatMessage({id:"status.disabled"}) }  {/*禁用*/}
                  </div>
                );
              }
            }
          }
        }
      ],
    }
  }
  componentWillMount(){
    this.getList();
  }

  //获取预算表数据
  getList(){
    let params = this.state.params;
    let paramsIsExist = JSON.stringify(this.state.params) === "{}" || ( params.structureCode==""&&params.description=="");
    if(paramsIsExist){
      params = ""
    }else {
      if(typeof params.structureCode !=="undefined"){
        params = "?structureCode="+params.structureCode;
        if(typeof params.description !=="undefined"){
          params = params+"&description="+params.description
        }
      }else {
        if(typeof params.description !=="undefined"){
          params = "?description="+params.description
        }
      }
    }
    httpFetch.get(`${config.budgetUrl}/api/budget/structures/query?page=${this.state.pagination.current}&size=${this.state.pagination.pageSize}`,).then((response)=>{
      response.data.map((item,index)=>{
        item.key = item.id;
      })

      this.setState({
        data: response.data,
        pagination: {
          total: Number(response.headers['x-total-count']),
          //onChange: this.onChangePager
        },
        loading: false
      })
    })
  }

  handleSearch = (values) =>{
    this.setState({
      params:values,

    },()=>{
      this.getList()
    })
  };


  //分页点击
  onChangePager = (pagination,filters, sorter) =>{
    this.setState({
     // pagination:pagination,
      pagination:{
        current: pagination.current,
        pageSize: pagination.pageSize
      }
    }, ()=>{
      this.getList();
    })
  }
  handleCreate = () =>{
    if(this.props.organization.isEnabled) {
      this.context.router.push(menuRoute.getMenuItemByAttr('budget-organization', 'key').children.newBudgetStructure.url.replace(':id', this.props.id));
    }else{
      notification["error"]({
        description:this.props.intl.formatMessage({id:""})  /*请维护当前账套下的预算组织*/
      })
    }
  }

  render(){
    const { searchForm, loading, data, columns, pagination } = this.state;
    return (
      <div className="budget-structure">
        <SearchArea searchForm={searchForm} submitHandle={this.handleSearch}/>
        <div className="table-header">
          <div className="table-header-title">{this.props.intl.formatMessage({id:'search.total'},{total:`${pagination.total}`})}</div>  {/*共搜索到*条数据*/}
          <div className="table-header-buttons">
            <Button type="primary" onClick={this.handleCreate}>{this.props.intl.formatMessage({id: 'button.create'})}</Button>  {/*新 建*/}
          </div>
        </div>
        <Table
            loading={loading}
            dataSource={data}
            columns={columns}
            pagination={pagination}
            onChange={this.onChangePager}
            size="middle"
            bordered/>
      </div>
    )
  }

}

BudgetStructure.contextTypes = {
  router: React.PropTypes.object
}

function mapStateToProps(state) {
  return {
    organization: state.budget.organization
  }
}

export default connect(mapStateToProps)(injectIntl(BudgetStructure));
