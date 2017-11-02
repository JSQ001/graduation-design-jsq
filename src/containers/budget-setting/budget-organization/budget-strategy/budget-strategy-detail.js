import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'

import menuRoute from 'share/menuRoute'
import httpFetch from 'share/httpFetch'
import debounce from 'lodash.debounce'
import config from 'config'
import { Table, Button, Input, Popover, message, Icon } from 'antd'
const Search = Input.Search;

import BasicInfo from 'components/basic-info'

import 'styles/budget-setting/budget-organization/budget-strategy/budget-strategy-detail.scss'

class BudgetStrategyDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      infoList: [
        {type: 'input', id: 'controlStrategyCode', label: '预算控制策略代码', isRequired: true, disabled: true},
        {type: 'input', id: 'controlStrategyName', label: '预算控制策略描述', isRequired: true},
        {type: 'switch', id: 'isEnabled', label: '状态'}
      ],
      infoData: {},
      updateState: false,
      columns: [
        {title: "序号", dataIndex: "detailSequence", key: "detailSequence", width: '10%'},
        {title: "规则代码", dataIndex: "detailCode", key: "detailCode"},
        {title: "描述", dataIndex: "detailName", key: "detailName", render: desc => <Popover placement="topLeft" content={desc}>{desc}</Popover>},
        {title: "消息", dataIndex: "messageCode", key: "messageCode", render: message => <span>{message ? message : '-'}</span>},
        {title: "事件", dataIndex: "expWfEvent", key: "expWfEvent", render: event => <span>{event ? event : '-'}</span>}
      ],
      data: [],
      pagination: {
        total: 0
      },
      pageSize: 10,
      page: 0,
      keyWords: '',
      newBudgetStrategyDetail:  menuRoute.getRouteItem('new-budget-strategy-detail','key'),    //新建控制策略详情
      strategyControlDetail:  menuRoute.getRouteItem('strategy-control-detail','key'),    //策略明细
      budgetStrategyDetail:  menuRoute.getRouteItem('budget-strategy-detail','key'),    //预算控制策略详情
      budgetOrganizationDetail:  menuRoute.getRouteItem('budget-organization-detail','key'),    //预算组织详情
    };
    this.handleSearch = debounce(this.handleSearch, 250);
  }

  componentWillMount() {
    if(this.props.organization.id && this.props.strategyId){
      this.context.router.replace(this.state.budgetStrategyDetail.url.replace(':id', this.props.organization.id).replace(':strategyId', this.props.strategyId));
      this.getBasicInfo();
      this.getList();
    }
  }

  getBasicInfo() {
    httpFetch.get(`${config.budgetUrl}/api/budget/control/strategies/${this.props.strategyId}`).then((response) => {
      if(response.status==200) {
        this.setState({
          infoData: response.data
        })
      }
    }).catch((e) => {

    })
  }

  getList() {
    let url = `${config.budgetUrl}/api/budget/control/strategy/details/query?size=${this.state.pageSize}&page=${this.state.page}&controlStrategyId=${this.props.strategyId}`;
    url += this.state.keyWords ? `&keyWords=${this.state.keyWords}` : '';
    httpFetch.get(url).then((response) => {
      this.setState({
        data: response.data,
        loading: false,
        pagination: {
          total: Number(response.headers['x-total-count']),
          onChange: this.onChangePager,
          pageSize: this.state.pageSize
        }
      })
    }).catch((e) => {
      this.setState({ loading: false })
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

  handleNew = () => {
    this.context.router.push(this.state.newBudgetStrategyDetail.url.replace(':id', this.props.params.id).replace(':strategyId', this.props.strategyId));
  };

  handleRowClick = (record) => {
    this.context.router.push(this.state.strategyControlDetail.url.replace(':id', this.props.params.id).replace(':strategyId', this.props.strategyId).replace(':strategyControlId', record.id));
  };

  handleSearch= (value) => {
    console.log(value);
    this.setState({
      page: 0,
      keyWords: value,
      pagination: {
        current: 1
      }
    }, () => {
      this.getList();
    })
  };
  handleUpdate = (params) => {
    params.id = this.props.strategyId;
    params.versionNumber = this.state.infoData.versionNumber;
    if(!params.controlStrategyCode || !params.controlStrategyName) return;
    httpFetch.put(`${config.budgetUrl}/api/budget/control/strategies`, params).then((response) => {
      if(response.status == 200) {
        message.success('保存成功');
        this.getBasicInfo();
        this.setState({ updateState: true })
      }
    }).catch((e) => {
      if(e.response){
        message.error(`保存失败, ${e.response.data.validationErrors[0].message}`);
        this.setState({ updateState: false })
      } else {
        console.log(e)
      }
    })
  };

  handleBack = () => {
    this.context.router.push(this.state.budgetOrganizationDetail.url.replace(':id', this.props.params.id) + '?tab=STRATEGY');
  };

  render(){
    const { infoList, infoData, columns, data, loading, pagination, updateState } = this.state;
    return (
      <div className="budget-strategy-detail">
        <BasicInfo infoList={infoList}
                   infoData={infoData}
                   updateHandle={this.handleUpdate}
                   updateState={updateState}/>
        <div className="table-header">
          <div className="table-header-title"><h5>策略明细</h5> {`共搜索到 ${pagination.total || 0} 条数据`}</div>
          <div className="table-header-buttons">
            <Button type="primary" onClick={this.handleNew}>新 建</Button>
            {/*<span className="tip-notice">新建预算控制策略规则之前要先定义【<a>事件</a>】和【<a>消息代码</a>】</span>*/}
            <Search
              placeholder="请输入策略明细描述/代码"
              style={{ width:200,position:'absolute',right:0,bottom:0 }}
              onChange={(e) => this.handleSearch(e.target.value)}
            />
          </div>
        </div>
        <Table columns={columns}
               dataSource={data}
               pagination={pagination}
               rowKey={record => record.id}
               loading={loading}
               onRowClick={this.handleRowClick}
               bordered
               size="middle"/>
        <a style={{fontSize:'14px',paddingBottom:'20px'}} onClick={this.handleBack}><Icon type="rollback" style={{marginRight:'5px'}}/>返回</a>
      </div>
    )
    }
}

BudgetStrategyDetail.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
  return {
    organization: state.budget.organization,
    strategyId: state.budget.strategyId
  }
}

export default connect(mapStateToProps)(injectIntl(BudgetStrategyDetail));
