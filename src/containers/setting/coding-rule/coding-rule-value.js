import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import config from 'config'
import { Table, Button, Badge, message, Popconfirm } from 'antd';
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
      editing: false,
      loading: true,
      data: [],
      page: 0,
      pageSize: 10,
      columns: [
        {title: "顺序号", dataIndex: "sequence", width: '15%'},
        {title: "参数名称", dataIndex: "segmentType", width: '15%'},
        {title: "参数值", dataIndex: "value", width: '50%'},
        {title: "状态", dataIndex: 'isEnabled', width: '10%', render: isEnabled => (
          <Badge status={isEnabled ? 'success' : 'error'} text={isEnabled ? formatMessage({id: "common.status.enable"}) : formatMessage({id: "common.status.disable"})} />)},
        {title: formatMessage({id:"common.operation"}), key: 'operation', width: '10%', render: (text, record) => (
          <span>
            <Popconfirm onConfirm={(e) => this.deleteItem(e, record)} title='你确定要删除吗'>
              <a href="#" onClick={(e) => {e.preventDefault();e.stopPropagation();}}>{formatMessage({id: "common.delete"})}</a>
            </Popconfirm>
          </span>)},  //操作
      ],
      pagination: {
        total: 0
      },
      updateState: false,
      infoList: [
        {type: 'input', label: '编码规则代码', id: 'codingRuleCode', disabled: true},
        {type: 'input', label: '编码规则名称', id: 'codingRuleName'},
        {type: 'value_list', label: '重置频率', id: 'resetFrequence', options: [], valueListCode: 2024},
        {type: 'input', label: '备注', id: 'description'},
        {type: 'switch', label: '状态', id: 'isEnabled'}
      ],
      infoData: {},
      showSlideFrameFlag: false,
      nowCodingRuleValue: null
    };
  }

  deleteItem = (e, record) => {
    this.setState({loading: true});
    httpFetch.delete(`${config.budgetUrl}/api/budget/item/${record.id}`).then(res => {
      this.setState({loading: false});
      message.success(this.props.intl.formatMessage({id: 'common.delete.success'}, {name: ''}));  //删除成功
    })
  };

  componentWillMount(){
    this.getList();
    httpFetch.get(`${config.budgetUrl}/api/budget/coding/rules/${this.props.params.ruleId}`).then(res => {
      this.setState({ infoData: res.data })
    })
  }

  //得到列表数据
  getList(){
    this.setState({ loading: true });
    let url = `${config.budgetUrl}/api/budget/coding/rule/details/query?&page=${this.state.page}&size=${this.state.pageSize}&codingRuleId=${this.props.params.ruleId}`;
    return httpFetch.get(url).then((response)=>{
      response.data.map((item)=>{
        item.key = item.id;
        switch(item.segmentType){
          case '10':
            item.value = item.segmentValue;
            break;
          case '20':
            item.value = item.dateFormat;
            break;
          case '50':
            item.value = `位数：${item.length}、  步长：${item.incremental}、  开始值：${item.startValue}`;
            break;
          default:
            item.value = '-';
        }
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

  updateInfo = (params) => {
    this.setState({editing: true});
    httpFetch.put(`${config.budgetUrl}/api/budget/coding/rules`, Object.assign({}, this.state.infoData, params)).then(res => {
      this.setState({updateState: true, editing: false, infoData: res.data});
      message.success(this.props.intl.formatMessage({id: 'common.save.success'}, {name: ''}));  //保存成功
    }).catch((e)=> {
      if (e.response) {
        message.error(`保存失败, ${e.response.data.message}`);
        this.setState({editing: false});
      }
    })
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

  afterClose = (params) => {
    if(params)
      this.getList();
    this.setState({ showSlideFrameFlag: false });
  };

  render(){
    const { columns, data, loading,  pagination, infoList, infoData, updateState, showSlideFrameFlag, nowCodingRuleValue, editing } = this.state;
    const { formatMessage } = this.props.intl;
    return (
      <div>
        <BasicInfo infoList={infoList}
                   infoData={infoData}
                   updateState={updateState}
                   updateHandle={this.updateInfo}
                   loading={editing}/>
        <div className="table-header">
          <div className="table-header-title">{formatMessage({id:"common.total"}, {total: pagination.total ? pagination.total : '0'})}</div> {/* 共total条数据 */}
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
                    afterClose={this.afterClose}
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
