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
import WrappedNewBudgetItemType from 'containers/budget-setting/budget-organization/budget-item-type/new-budget-item-type'
import WrappedPutBudgetItemType from 'containers/budget-setting/budget-organization/budget-item-type/put-budget-item-type'

import 'styles/budget/buget-item-type/budget-item-type.scss'


class BudgetItemType extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Loading: true,
      data: [
       /* {id:123,organizationId:1,itemTypeCode:"123",itemTypeName:"qq"},
        { id:124,organizationId:1,itemTypeCode:"123",itemTypeName:"qq"}*/
      ],
      columns: [
        {title: '预算组织名称', dataIndex: 'organizationId', key: 'organizationId',},
        {title: '预算项目类型代码', dataIndex: 'itemTypeCode', key: 'itemTypeCode',},
        {title: '预算项目类型名称', dataIndex: 'itemTypeName', key: 'itemTypeName',},
        {title: '状态',dataIndex: 'isEnabled', key: 'isEnabled', render: (recode,text) => {return (<div > <Badge status={ recode?"success":"error"}/>{recode?"启用":"禁用"}</div>);}},
      ],
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
      updateParams: {
        itemTypeCode:'',
        itemTypeName:'',
      },
      showSlideFrameNew:false,
      showSlideFramePut:false,
      loading:true

    };
  }

//获得数据
  getList(){
    let url = `${config.budgetUrl}/api/budget/itemType/query?size=${this.state.pageSize}&page=${this.state.page}&itemTypeCode=${this.state.searchParams.itemTypeCode||''}&itemTypeName=${this.state.searchParams.itemTypeName||''}`;
    return httpFetch.get(url).then((response)=>{
      response.data.map((item)=>{
        item.key = item.id;
      });
      this.setState({
      //  data: response.data,
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



  //清空搜索区域
  clear=()=>{
    this.setState({searchParams: {
      itemTypeCode:'',
      itemTypeName:'',
    }})
  }

  //搜索
  search = (result) => {
    let searchParams = {
      itemTypeCode: result.itemTypeCode,
      itemTypeName: result.itemTypeName
    };
    this.setState({
      searchParams:searchParams,
      loading: true,
      page: 0
    }, ()=>{
      this.getList();
    })
  };

  handleCloseSlide = (params) => {
    console.log(params);
    this.setState({
      showSlideFrame: false
    })
  };

  showSlidePut = (flag) => {
    this.setState({
      showSlideFramePut: flag
    })
  };

  showSlideNew = (flag) => {
    this.setState({
      showSlideFrameNew: flag
    })
  };

  newItemTypeShowSlide=()=>{
    this.setState({
      updateParams:{},
      showSlideFrameNew: true
    })
  }

  putItemTypeShowSlide=(recode)=>{
    this.setState({
      updateParams:recode,
      showSlideFramePut: true
    })
  }


  render(){
    const {columns,data ,pagination,searchForm,showSlideFramePut,showSlideFrameNew,loading,updateParams,isPut} =this.state
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
            <Button type="primary" onClick={this.newItemTypeShowSlide}>新建</Button>
          </div>
        </div>

        <div className="Table_div" style={{  backgroundColor:111  }}>
          <Table
            columns={columns}
            dataSource={data}
            pagination={pagination}
            Loading={loading}
            bordered
            onRowClick={this.putItemTypeShowSlide}
          />
        </div>

        <SlideFrame title="新建预算场景"
                    show={showSlideFrameNew}
                    content={WrappedNewBudgetItemType}
                    afterClose={this.handleCloseSlide}
                    onClose={() => this.showSlideNew(false)}
                    params={{}}/>

        <SlideFrame title="编辑预算场景"
                    show={showSlideFramePut}
                    content={WrappedPutBudgetItemType}
                    afterClose={this.handleCloseSlide}
                    onClose={() => this.showSlidePut(false)}
                    params={updateParams}/>


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