import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

import SearchArea from 'components/search-area'

class BudgetStrategy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchForm: [
        {type: 'input', id: 'strategyCode', label: '预算控制策略代码'},
        {type: 'input', id: 'strategyDesc', label: '预算控制策略描述'}
      ],
      searchParams: {
        strategyCode: "",
        strategyDesc: ""
      },
      columns: [
        {title: '预算控制策略代码', dataIndex: 'strategyCode', key: 'strategyCode'},
        {title: '预算控制策略描述', dataIndex: 'strategyDesc', key: 'strategyDesc'},
        {title: '状态', dataIndex: 'state', key: 'state'}
      ],
    };
  }

  //搜索
  search = (result) => {
    let searchParams = {
      strategyCode: result.strategyCode,
      strategyDesc: result.strategyDesc
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
      strategyCode: "",
      strategyDesc: ""
    }})
  };

  render(){
    const { searchForm } = this.state;
    return (
      <div className="budget-strategy">
        <SearchArea
          searchForm={searchForm}
          submitHandle={this.search}
          clearHandle={this.clear}
          eventHandle={this.searchEventHandle}/>
      </div>
    )
  }

}

function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps)(injectIntl(BudgetStrategy));
