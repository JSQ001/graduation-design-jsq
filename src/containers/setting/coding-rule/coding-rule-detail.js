import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import config from 'config'
import { Table, Button, Badge } from 'antd';
import httpFetch from 'share/httpFetch'

import menuRoute from 'share/menuRoute'
import BasicInfo from 'components/basic-info'

class CodingRuleDetail extends React.Component {
  constructor(props) {
    super(props);
    const { formatMessage } = this.props.intl;
    this.state = {
      loading: true,
      data: [],
      page: 0,
      pageSize: 10,
      columns: [
        {title: "编码规则代码", dataIndex: "codingRuleCode", width: '15%'},
        {title: "编码规则名称", dataIndex: "codingRuleName", width: '25%'},
        {title: "重置频率", dataIndex: "resetFrequence", width: '15%'},
        {title: "备注", dataIndex: "decription", width: '30%'},
        {title: "状态", dataIndex: 'isEnbaled', width: '15%', render: isEnabled => (
          <Badge status={isEnabled ? 'success' : 'error'} text={isEnabled ? formatMessage({id: "common.status.enable"}) : formatMessage({id: "common.status.disable"})} />)}
      ],
      pagination: {
        total: 0
      },
      updateState: false,
      infoList: [],
      infoData: {}
    };
  }

  componentWillMount(){
    this.getList();
  }

  //得到列表数据
  getList(){
    this.setState({ loading: true });
    let url = `${config.budgetUrl}/api/budget/coding/rules/query?&page=${this.state.page}&size=${this.state.pageSize}`;
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


  render(){
    const { columns, data, loading,  pagination } = this.state;
    const { formatMessage } = this.props.intl;
    return (
      <div>

        <div className="table-header">
          <div className="table-header-title">{formatMessage({id:"common.total"}, {total: pagination.total})}</div> {/* 共total条数据 */}
          <div className="table-header-buttons">
            <Button type="primary" onClick={this.handleNew}>新建规则</Button>
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

CodingRuleDetail.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps)(injectIntl(CodingRuleDetail));
