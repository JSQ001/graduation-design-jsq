import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { Button, Table, Badge } from 'antd'
import httpFetch from 'share/httpFetch'
import config from 'config'

import SearchArea from 'components/search-area'
import SlideFrame from 'components/slide-frame'
import NewBudgetScenarios from 'containers/budget-setting/budget-organization/budget-scenarios/new-budget-scenarios'
import UpdateBudgetScenarios from 'containers/budget-setting/budget-organization/budget-scenarios/update-budget-scenarios'

class BudgetScenarios extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      organizationInfo: {},
      newParams: {},
      updateParams: {},
      searchForm: [
        {type: 'input', id: 'scenariosCode', label: '预算场景代码'},
        {type: 'input', id: 'scenariosDesc', label: '预算场景描述'}
      ],
      searchParams: {
        scenariosCode: "",
        scenariosDesc: ""
      },
      Loading: true,
      columns: [
        {title: '预算组织', dataIndex: 'organizationName', key: 'organizationName', render:()=>{return this.state.organizationInfo.organizationName}},
        {title: '预算场景代码', dataIndex: 'scenarioCode', key: 'scenarioCode'},
        {title: '预算场景描述', dataIndex: 'scenarioName', key: 'scenarioName'},
        {title: '备注', dataIndex: 'description', key: 'description'},
        {title: '默认场景', dataIndex: 'defaultFlag', key: 'defaultFlag', render: isDefault => <span>{isDefault ? 'Y' : ''}</span>},
        {title: '状态', dataIndex: 'isEnabled', key: 'isEnabled', render: isEnabled => <Badge status={isEnabled ? 'success' : 'error'} text={isEnabled ? '启用' : '禁用'} />}
      ],
      pagination: {
        total: 0
      },
      page: 0,
      pageSize: 10,
      data: [],    //列表值
      showSlideFrame: false,
      showUpdateSlideFrame: false,
    }
  }

  componentWillMount(){
    this.setState({
      organizationInfo: this.props.organization,
      newParams: {
        organizationName: this.props.organization.organizationName
      }
    }, () => {
      console.log(this.state.organizationInfo);
      this.getList();
    })
  }

  //得到对应单据列表数据
  getList(){
    return httpFetch.get(`${config.budgetUrl}/api/budget/scenarios/query?size=${this.state.pageSize}&page=${this.state.page+1}&organizationId=${this.state.organizationInfo.id}&scenarioCode=${this.state.searchParams.scenariosCode||''}&scenarioName=${this.state.searchParams.scenariosDesc||''}`).then((response)=>{
      if(response.status==200){
        response.data.map((item, index)=>{
          item.index = this.state.page * this.state.pageSize + index + 1;
          item.key = item.index;
        });
        this.setState({
          data: response.data,
          loading: false,
          pagination: {
            total: Number(response.headers['x-total-count']),
            onChange: this.onChangePager,
            pageSize: this.state.pageSize
          }
        })
      }
    }).catch((e)=>{
      console.log(e);
    })
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

  //搜索
  search = (result) => {
    let searchParams = {
      scenariosCode: result.scenariosCode,
      scenariosDesc: result.scenariosDesc
    };
    this.setState({
      searchParams:searchParams,
      loading: true,
      page: 0
    }, ()=>{
      this.getList();
    })
  };

  //清空搜索区域
  clear = () => {
    this.setState({searchParams: {
      scenariosCode: "",
      scenariosDesc: ""
    }})
  };

  showSlide = (flag) => {
    this.setState({
      showSlideFrame: flag
    })
  };

  showUpdateSlide = (flag) => {
    this.setState({
      showUpdateSlideFrame: flag
    })
  };

  handleCloseSlide = (params) => {
    if(params) {
      this.getList();
    }
    this.setState({
      showSlideFrame: false
    })
  };
  handleCloseUpdateSlide = (params) => {
    if(params) {
      this.getList();
    }
    this.setState({
      showUpdateSlideFrame: false
    })
  };

  handleRowClick = (record) => {
    record.organizationName = this.state.organizationInfo.organizationName;
    console.log(record);
    this.setState({
      updateParams: record
    })
    this.showUpdateSlide(true)
  };

  render(){
    const { searchForm, columns, pagination, Loading, data, showSlideFrame, showUpdateSlideFrame, updateParams, newParams } = this.state;
    return (
      <div className="budget-scenarios">
        <SearchArea
          searchForm={searchForm}
          submitHandle={this.search}
          clearHandle={this.clear}
          eventHandle={this.searchEventHandle}/>
        <div className="table-header">
          <div className="table-header-title">{`共搜索到 ${this.state.pagination.total} 条数据`}</div>
          <div className="table-header-buttons">
            <Button type="primary" onClick={() => this.showSlide(true)}>新 建</Button>
          </div>
        </div>
        <Table columns={columns}
               dataSource={data}
               pagination={pagination}
               Loading={Loading}
               onRowClick={this.handleRowClick}
               bordered
               size="middle"/>

        <SlideFrame title="新建预算场景"
                    show={showSlideFrame}
                    content={NewBudgetScenarios}
                    afterClose={this.handleCloseSlide}
                    onClose={() => this.showSlide(false)}
                    params={newParams}/>
        <SlideFrame title="编辑预算场景"
                    show={showUpdateSlideFrame}
                    content={UpdateBudgetScenarios}
                    afterClose={this.handleCloseUpdateSlide}
                    onClose={() => this.showUpdateSlide(false)}
                    params={updateParams}/>
      </div>
    )
  }

}

function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps)(injectIntl(BudgetScenarios));
