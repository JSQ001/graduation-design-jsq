import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import config from 'config'
import { Table, Button, Badge } from 'antd';
import httpFetch from 'share/httpFetch'

import menuRoute from 'share/menuRoute'
import BasicInfo from 'components/basic-info'
import NewCodingRuleValue from 'containers/setting/coding-rule/new-coding-rule-value'
import SlideFrame from "components/slide-frame";

class CodingRuleValue extends React.Component {
  constructor(props) {
    super(props);
    const { formatMessage } = this.props.intl;
    this.state = {
      loading: true,
      data: [],
      page: 0,
      pageSize: 10,
      columns: [
        {title: "顺序号", dataIndex: "sequence", width: '15%'},
        {title: "参数名称", dataIndex: "segmentType", width: '15%'},
        {title: "参数值", dataIndex: "segmentValue", width: '55%'},
        {title: "状态", dataIndex: 'isEnabled', width: '15%', render: isEnabled => (
          <Badge status={isEnabled ? 'success' : 'error'} text={isEnabled ? formatMessage({id: "common.status.enable"}) : formatMessage({id: "common.status.disable"})} />)}
      ],
      pagination: {
        total: 0
      },
      updateState: false,
      infoList: [
        {type: 'input', label: '编码规则代码', id: 'codingRuleCode', disabled: true},
        {type: 'input', label: '编码规则名称', id: 'codingRuleName'},
        {type: 'value_list', label: '重置频率', id: 'resetFrequence', options: []},
        {type: 'input', label: '备注', id: 'description'},
        {type: 'switch', label: '状态', id: 'isEnabled'},
      ],
      infoData: {},
      showSlideFrameFlag: false,
      nowCodingRuleValue: null
    };
  }

  componentWillMount(){
    this.getList();
    httpFetch.get(`${config.budgetUrl}/api/budget/coding/rules/${this.props.params.ruleId}`).then(res => {
      this.setState({ infoData: res.data })
    })
  }

  //得到列表数据
  getList(){
    this.setState({ loading: true });
    let url = `${config.budgetUrl}/api/budget/coding/rule/details/query?&page=${this.state.page}&size=${this.state.pageSize}&codingRuleId=${this.props.params.id}`;
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

  handleNew = () => {
    this.setState({
      nowCodingRuleValue: null,
      showSlideFrameFlag: true
    })
  };

  handleRowClick = (record) => {
    this.setState({
      nowCodingRuleValue: record,
      showSlideFrameFlag: true
    })
  };

  render(){
    const { columns, data, loading,  pagination, infoList, infoData, updateState, showSlideFrameFlag, nowCodingRuleValue } = this.state;
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
            <Button type="primary" onClick={this.handleNew}>添加段值</Button>
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

        <SlideFrame content={NewCodingRuleValue}
                    show={showSlideFrameFlag}
                    params={{ codingRuleId: this.props.params.ruleId, nowCodingRuleValue }}
                    onClose={() => {this.setState({ showSlideFrameFlag: false })}}
                    afterClose={() => {this.setState({ showSlideFrameFlag: false })}}
                    title="添加段值"/>

      </div>
    )
  }

}

CodingRuleValue.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps)(injectIntl(CodingRuleValue));
