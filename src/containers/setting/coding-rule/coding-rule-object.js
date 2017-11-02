import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import config from 'config'
import { Table, Button, Badge } from 'antd';
import httpFetch from 'share/httpFetch'

import SearchArea from 'components/search-area'
import menuRoute from 'share/menuRoute'

class CodingRule extends React.Component {
  constructor(props) {
    super(props);
    const { formatMessage } = this.props.intl;
    this.state = {
      loading: true,
      data: [],
      page: 0,
      pageSize: 10,
      columns: [
        {title: "单据类型", dataIndex: "documentCategoryCode", width: '40%'},
        {title: "应用公司", dataIndex: "companyName", width: '40%'},
        {title: "状态", dataIndex: 'isEnabled', width: '20%', render: isEnabled => (
          <Badge status={isEnabled ? 'success' : 'error'} text={isEnabled ? formatMessage({id: "common.status.enable"}) : formatMessage({id: "common.status.disable"})} />)}
      ],
      pagination: {
        total: 0
      },
      searchForm: [
        {type: 'value_list', id: 'documentCategoryCode', label: "单据类型", valueListCode: 2106, options: []}
      ],
      searchParams: {
        documentCategoryCode: '',
        documentTypeCode: ''
      },
      newCodingRuleObjectPage: menuRoute.getRouteItem('new-coding-rule-object', 'key'),
      codingRule: menuRoute.getRouteItem('coding-rule', 'key')
    };
  }

  componentWillMount(){
    this.getList();
  }

  //得到列表数据
  getList(){
    this.setState({ loading: true });
    let params = this.state.searchParams;
    let url = `${config.budgetUrl}/api/budget/coding/rule/objects/query?&page=${this.state.page}&size=${this.state.pageSize}`;
    for(let paramsName in params){
      url += params[paramsName] ? `&${paramsName}=${params[paramsName]}` : '';
    }
    return httpFetch.get(url).then((response)=>{
      response.data.map((item)=>{
        item.key = item.id;
      });
      this.setState({
        data: response.data,
        loading: false,
        pagination: {
          total: Number(response.headers['x-total-count']),
          onChange: this.onChangePager,
          current: this.state.page + 1
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

  search = (result) => {
    this.setState({
      page: 0,
      searchParams: Object.assign(this.state.searchParams, result)
    }, ()=>{
      this.getList();
    })
  };

  clear = () => {
    this.setState({
      searchParams: {
        documentCategoryCode: '',
        documentTypeCode: ''
      }
    })
  };

  handleNew = () => {
    this.context.router.push(this.state.newCodingRuleObjectPage.url);
  };

  handleRowClick = (record) => {
    this.context.router.push(this.state.codingRule.url.replace(':id', record.id))
  };


  render(){
    const { columns, data, loading,  pagination, searchForm } = this.state;
    const { formatMessage } = this.props.intl;
    return (
      <div>
        <h3 className="header-title">编码规则对象定义</h3>
        <SearchArea
          searchForm={searchForm}
          submitHandle={this.search}
          clearHandle={this.clear}/>

        <div className="table-header">
          <div className="table-header-title">{formatMessage({id:"common.total"}, {total: pagination.total})}</div> {/* 共total条数据 */}
          <div className="table-header-buttons">
            <Button type="primary" onClick={this.handleNew}>{formatMessage({id:"common.create"})}</Button> {/* 新建 */}
          </div>
        </div>
        <Table columns={columns}
               dataSource={data}
               pagination={pagination}
               loading={loading}
               onRowClick={this.handleRowClick}
               rowKey="id"
               bordered
               size="middle"/>

      </div>
    )
  }

}

CodingRule.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps)(injectIntl(CodingRule));
