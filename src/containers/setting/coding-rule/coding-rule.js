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
        {title: "备注", dataIndex: "description", width: '30%'},
        {title: "状态", dataIndex: 'isEnabled', width: '15%', render: isEnabled => (
          <Badge status={isEnabled ? 'success' : 'error'} text={isEnabled ? formatMessage({id: "common.status.enable"}) : formatMessage({id: "common.status.disable"})} />)}
      ],
      pagination: {
        total: 0
      },
      updateState: false,
      infoList: [
        {type: 'input', label: '单据类型', id: 'documentCategoryCode', disabled: true},
        {type: 'input', label: '应用公司', id: 'companyName', disabled: true},
        {type: 'switch', label: '状态', id: 'isEnabled'},
      ],
      infoData: {},
      codingRuleValue: menuRoute.getRouteItem('coding-rule-value', 'key'),
      newCodingRule: menuRoute.getRouteItem('new-coding-rule', 'key')
    };
  }

  componentWillMount(){
    this.getList();
    httpFetch.get(`${config.budgetUrl}/api/budget/coding/rule/objects/${this.props.params.id}`).then(res => {
      this.setState({ infoData: res.data })
    })
  }

  //得到列表数据
  getList(){
    this.setState({ loading: true });
    let url = `${config.budgetUrl}/api/budget/coding/rules/query?&page=${this.state.page}&size=${this.state.pageSize}&codingRuleObjectId=${this.props.params.id}`;
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

  updateInfo = () => {
    this.setState({updateState: true})
  };

  handleRowClick = (record) => {
    this.context.router.push(this.state.codingRuleValue.url.replace(':id', this.props.params.id).replace(':ruleId', record.id))
  };

  handleNew = () => {
    this.context.router.push(this.state.newCodingRule.url.replace(':id', this.props.params.id))
  };

  render(){
    const { columns, data, loading,  pagination, infoList, infoData, updateState } = this.state;
    const { formatMessage } = this.props.intl;
    return (
      <div>

        <BasicInfo infoList={infoList}
                   infoData={infoData}
                   updateState={updateState}
                   updateHandle={this.updateInfo}/>
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
