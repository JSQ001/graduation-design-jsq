/**
 * created by jsq on 2017/9/18
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { Button, Table, Badge} from 'antd';
import SearchArea from 'components/search-area.js';
import httpFetch from 'share/httpFetch';
import config from 'config'

import menuRoute from 'share/menuRoute'

import 'styles/budget/budget-organization/budget-structure/budget-structure.scss';

class BudgetStructure extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: [],
      pagination: {
        current:0,
        total:0,
      },
      total:0,
      searchForm: [
        {type: 'input', id: 'structureCode', label: this.props.intl.formatMessage({id: 'budget.structureCode'}) }, /*预算表代码*/
        {type: 'input', id: 'description', label: this.props.intl.formatMessage({id: 'budget.structureDescription'}) }, /*预算表描述*/
      ],
      columns: [
        {
          title: '预算组织', key: "organizationCode", dataIndex: 'organizationCode'
        },
        {
          title: '预算表代码', key: "structureCode", dataIndex: 'structureCode'
        },
        {
          title: '预算表描述', key: "description", dataIndex: 'description'
        },
        {
          title: '编制期段', key: "periodStrategy", dataIndex: 'periodStrategy'
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
    }
  }
  componentWillMount(){
    this.handleSearch();
  }

  //查询预算表
  handleSearch = (values) =>{
    console.log(values)
    httpFetch.get(`${config.budgetUrl}/api/budget/structures/query`).then((response)=>{
      console.log(response)
      response.data.map((item,index)=>{
        console.log(item)
        console.log(index)
        item.key = item.id;
        httpFetch.get(`${config.budgetUrl}/api/budget/organization/`)
      })
      this.setState({
        data: response.data,
        loading: false
      })
    })
  }

  handleCreate = () =>{
    this.context.router.push(menuRoute.getMenuItemByAttr('budget-organization','key').children.newBudgetStructure.url.replace(':id', this.props.id));
  }

  render(){
    const { searchForm, total, loading, data, columns } = this.state;
    return (
      <div className="budget-structure">
        <SearchArea searchForm={searchForm} submitHandle={this.handleSearch}/>
        <div className="table-header">
          <div className="table-header-title">{this.props.intl.formatMessage({id:'search.total'},{total:`${total}`})}</div>
          <div className="table-header-buttons">
            <Button type="primary" onClick={this.handleCreate}>{this.props.intl.formatMessage({id: 'button.create'})}</Button>
          </div>
        </div>
        <Table
            loading={loading}
            dataSource={data}
            columns={columns}/>
      </div>
    )
  }

}

BudgetStructure.contextTypes = {
  router: React.PropTypes.object
}

function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps)(injectIntl(BudgetStructure));
