import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { Button, Table, Modal } from 'antd'
import httpFetch from 'share/httpFetch'
import config from 'config'

import SearchArea from 'components/search-area'

import 'styles/budget/budget-scenarios/budget-scenarios.scss'

class BudgetScenarios extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchForm: [
        {type: 'input', id: 'scenariosCode', label: '预算场景代码'},
        {type: 'input', id: 'scenariosDesc', label: '预算场景描述'}
      ],
      searchParams: {
        scenariosCode: "",
        scenariosDesc: ""
      },
      columns: [
        {title: '预算组织', dataIndex: 'organizationId'},
        {title: '预算场景代码', dataIndex: 'scenarioCode'},
        {title: '预算场景描述', dataIndex: 'description'},
        {title: '备注', dataIndex: ''},
        {title: '默认场景', dataIndex: ''},
        {title: '状态', dataIndex: ''}
      ],
      data: [],    //列表值
    }
  }

  componentWillMount(){
    this.getList();
  }

  //得到对应单据列表数据
  // /api/budget/scenarios/query?size=2&page=2&organizationId=898380750196379649
  getList(){
    return httpFetch.get(`${config.budgetUrl}/api/budget/scenarios/query?size=2&page=1&organizationId=898380750196379649`).then((response)=>{
      /*response.data.map((item, index)=>{
        item.index = this.state.page * this.state.pageSize + index + 1;
        item.key = item.index;
      });
      this.setState({
        data: response.data,
        loading: false
      }, ()=>{
        this.refreshRowSelection()
      })*/
      console.log(response);
    })
  }

  //搜索
  search = (result) => {
    let searchParams = {
      scenariosCode: "",
      scenariosDesc: ""
    };
    this.setState({
      searchParams:searchParams,
      loading: true,
      page: 0
    }, ()=>{
      //
    })
  };

  //清空搜索区域
  clear = () => {
    this.setState({searchParams: {
      scenariosCode: "",
      scenariosDesc: ""
    }})
  };

  //新建
  newScenarios = () => {
    Modal.error({
      title: '一个账套下只能有一个生效的预算组织编码',
      content: (
        <div>
          <p style={{whiteSpace:'normal'}}>账套XXXX下已经有启用状态的预算组织代码XXXXXX</p>
        </div>
      )
    })
  };

  render(){
    const { searchForm, columns, data } = this.state;
    return (
      <div className="budget-scenarios">
        <h3 className="header-title">预算场景定义</h3>
        <SearchArea
          searchForm={searchForm}
          submitHandle={this.search}
          clearHandle={this.clear}
          eventHandle={this.searchEventHandle}/>
        <div className="table-header">
          <div className="table-header-title">共搜索到 0 条数据</div>
          <div className="table-header-buttons">
            <Button type="primary" onClick={this.newScenarios}>新 建</Button>
          </div>
        </div>
        <Table columns={columns}
               dataSource={data}
               bordered
               size="middle"/>
      </div>
    )
  }

}

function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps)(injectIntl(BudgetScenarios));
