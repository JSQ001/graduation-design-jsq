/**
 * created by jsq on 2017/9/18
 */
import React from 'react';
import httpFetch from 'share/httpFetch'
import config from 'config'
import { connect } from 'react-redux'
import { Table, Button } from 'antd'

import { injectIntl } from 'react-intl';
import SearchArea from 'components/search-area.js'


class BudgetOrganization extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      loading: true,
      data: [],

      page: 0,
      pageSize: 10,
      pagination: {
        current: 0,
        total: 0,
      },
      columns: [
        {
          title: '预算组织代码', key: "organizationCode", dataIndex: 'organizationCode'
        },
        {
          title: '预算组织名称', key: "organizationName", dataIndex: 'organizationName',
        },

        {
          title: '账套', key: "setOfBooksId", dataIndex: 'setOfBooksId',
        },
        {
          title: '状态',
          key: 'status',
          dataIndex: 'isEnabled',
          render: (recode) => {
            if (recode) {
              return (
                <div>
                  <Badge status="success"/>
                  启用
                </div>
              );
            } else {
              if (recode === undefined) {
                return
              } else {
                return (
                  <div>
                    <Badge status="error"/>
                    禁用
                  </div>
                );
              }
            }
          }
        }
      ],
      searchForm: [
        {type: 'select', id: 'setOfBooksId', label: '账套',
          options:[
            {label:"账套1", value:'1'},
            {label:"账套2", value:'2'},
            {label:"账套3", value:'3'}
          ]},
        {type: 'input', id: 'organizationCode', label: '预算组织代码'},
        {type: 'input', id: 'organizationName', label: '预算组织名称'},
      ],
    }
  }

  componentWillMount(){

  }

  //处理搜索
  handleSearch = (values) =>{
    console.log(values)
    httpFetch.get(`${config.budgetUrl}/api/budget/organizations/query?setOfBooksId=1&page=${this.state.page}&size=${this.state.pageSize}`,
      this.state.searchParams).then((response)=>{
      console.log(response)
      this.setState({
        data: response.data,
        loading: false,
        pagination: {
          total: Number(response.headers['x-total-count']),
          //onChange: this.onChangePager
        }
      })
    });
  }
  render(){
    const { searchForm, data, pagination, columns} = this.state;
    return(
      <div className="budget-organization">
        <SearchArea searchForm={searchForm} submitHandle={this.handleSearch}/>
        <div className="table-header">
          <div className="table-header-title">共搜索到 {data.length } 条数据</div>
          <div className="table-header-buttons">
            <Button type="primary">新 建</Button>
          </div>
          <Table columns={columns}
             dataSource={data}
             pagination={pagination}
             size="middle"
             bordered/>
        </div>
      </div>
    )
  }
}


function mapStateToProps(state) {
  return {}
}

export default connect(mapStateToProps)(injectIntl(BudgetOrganization));
