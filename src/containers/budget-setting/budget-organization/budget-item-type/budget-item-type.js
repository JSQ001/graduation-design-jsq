import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import config from 'config'
import httpFetch from 'share/httpFetch'
import menuRoute from 'share/menuRoute'
import {Link,Redirect,browserHistory,History} from 'react-router'
import {Button,Table,Badge,Popconfirm,Form,DatePicker,Col,Row,Switch,notification,Icon} from 'antd'


import SlideFrame from 'components/slide-frame'
import SearchArea from 'components/search-area'
import NewBudgetItemType from 'containers/budget-setting/budget-organization/budget-item-type/new-budget-item-type'

import 'styles/budget/buget-item-type/budget-item-type.scss'


class BudgetItemType extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Loading: true,
      Data: [],
      columns: [
        {title: '预算组织名称', dataIndex: 'organizationId', key: 'organizationId',},
        {title: '预算项目类型代码', dataIndex: 'itemTypeCode', key: 'itemTypeCode',},
        {title: '预算项目类型名称', dataIndex: 'itemTypeName', key: 'itemTypeName',},
        {title: '预算项目类型描述', dataIndex: 'description', key: 'description',},
        {title: '状态',dataIndex: 'isEnabled', key: 'isEnabled',
          render: (recode,text) => {
            return (
              <div >
                  <Badge status={ recode?"success":"error"}/>
                  {recode?"启用":"禁用"}
              </div>
            );}
        },

      ],
      form: {
        name: '',
        enabled: true
      },
      searchForm: [
        {type: 'input', id: 'itemTypeCode', label: '预算项目类型代码'},
        {type: 'input', id: 'itemTypeName', label: '预算项目类型名称'},
      ],
      pageSize: 10,
      page:0,
      pagination: {
        total: 0
      },
      searchParams:{
        itemTypeCode:'',
        itemTypeName:'',
      },
      showSlideFrame: false,

    };
  }

  //清空搜索区域
  clear=()=>{
    this.setState({searchParams: {
      itemTypeCode:'',
      itemTypeName:'',
    }})
  }

  search=()=>{

  }

  searchEventHandle=()=>{

  }


  handleCloseSlide = (params) => {
    console.log(params);
    this.setState({
      showSlideFrame: false
    })
  };

  showSlide = (flag) => {
    this.setState({
      showSlideFrame: flag
    })
  };


  render(){
    const {columns,data ,pagination,searchForm,showSlideFrame,Loading} =this.state
    return(
      <div className="versionsDefine">
        <div className="searchFrom">
          <SearchArea
            searchForm={searchForm}
            submitHandle={this.search}
            clearHandle={this.clear}
            eventHandle={this.searchEventHandle}/>
        </div>

        <div className="table-header">
          <div className="table-header-title">{`共${this.state.pagination.total}条数据`}</div>
          <div className="table-header-buttons">
            <Button type="primary" onClick={() => this.showSlide(true)}>新建</Button>
          </div>
        </div>

        <div className="Table_div" style={{  backgroundColor:111  }}>
          <Table
            columns={columns}
            dataSource={data}
            pagination={pagination}
            Loading={Loading}
            bordered
          />
        </div>

        <SlideFrame title="新建预算场景"
                    show={showSlideFrame}
                    content={NewBudgetItemType}
                    afterClose={this.handleCloseSlide}
                    onClose={() => this.showSlide(false)}
                    params={{}}/>

      </div>
    );
  }

}

function mapStateToProps(state) {
  return {
    organization:state.budget.organization
  }
}

export default connect(mapStateToProps)(injectIntl(BudgetItemType));
