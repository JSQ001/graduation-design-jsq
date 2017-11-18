import React from 'react'
import { connect } from 'react-redux'

import httpFetch from 'share/httpFetch'
import menuRoute from 'share/menuRoute'
import config from 'config'
import debounce from 'lodash.debounce'
import { Form, Button, Table, Input, message, Icon } from 'antd'
const Search = Input.Search;

import BasicInfo from 'components/basic-info'
import SlideFrame from 'components/slide-frame'
import NewStrategyControlDetail from 'containers/budget-setting/budget-organization/budget-strategy/new-strategy-control-detail'
import 'styles/budget-setting/budget-organization/budget-strategy/strategy-control-detail.scss'


class StrategyControlDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      strategyControlId: null,
      infoList: [
        {type: 'input', label: '序号：', id: 'detailSequence', isRequired: true, disabled: true},
        {type: 'input', label: '规则代码：', id: 'detailCode', isRequired: true, disabled: true},
        {type: 'value_list', label: '控制策略：', id: 'controlMethod', isRequired: true, options: [], valueListCode: 2005, event: 'controlMethod'},
        {type: 'input', label: '控制规则描述：', id: 'detailName', isRequired: true},
        {type: 'value_list', label: '消息：', id: 'messageCode', options: [], valueListCode: 2022, isRequired: true, disabled: false},
        {type: 'input', label: '事件：', id: 'expWfEvent'},
      ],
      infoData: {},
      updateState: false,
      baseInfoLoading: false,
      columns: [
        {title: '类型', dataIndex: 'controlStrategyCode', key: 'controlStrategyCode', render:()=>{return '公式'}},
        {title: '控制对象', dataIndex: 'object', key: 'object'},
        {title: '比较', dataIndex: 'range', key: 'range'},
        {title: '控制期段', dataIndex: 'periodStrategy', key: 'periodStrategy'},
        {title: '方式', dataIndex: 'manner', key: 'manner'},
        {title: '操作', dataIndex: 'operator', key: 'operator', render:(value, record)=>{return record.manner === '绝对额' ? value : '-'}},
        {title: '值', dataIndex: 'value', key: 'value', render:(value, record)=>{return record.manner === '百分比' ? value+'%' : value}},
      ],
      data: [],
      showSlideFrame: false,
      page: 0,
      pageSize: 10,
      pagination: {
        total: 0
      },
      newParams: {},
      keyWords: '',
      isNew: false, //判断侧滑是新建或编辑
      budgetStrategyDetail:  menuRoute.getRouteItem('budget-strategy-detail','key'),    //预算控制策略详情
    };
    this.handleSearch = debounce(this.handleSearch, 250);
  }

  componentWillMount() {
    this.setState({
      strategyControlId: this.props.params.strategyControlId,
      newParams: {
        strategyControlId: this.props.params.strategyControlId,
      }
    },() => {
      this.getBasicInfo();
      this.getList();
    })
  }

  getBasicInfo() {
    httpFetch.get(`${config.budgetUrl}/api/budget/control/strategy/details/${this.state.strategyControlId}`).then((response) => {
      if(response.status==200) {
        this.setState({ infoData: response.data })
      }
    })
  }

  getList() {
    let url = `${config.budgetUrl}/api/budget/control/strategy/mp/conds/query?page=${this.state.page}&size=${this.state.pageSize}&controlStrategyDetailId=${this.state.strategyControlId}`;
    url += this.state.keyWords ? `&keyWords=${this.state.keyWords}` : '';
    this.setState({ loading: true });
    httpFetch.get(url).then((response)=>{
      this.setState({
        data: response.data,
        loading: false,
        pagination: {
          total: Number(response.headers['x-total-count']),
          onChange: this.onChangePager,
          pageSize: this.state.pageSize
        }
      })
    }).catch((e)=>{

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

  showSlide = (flag) => {
    this.setState({
      showSlideFrame: flag,
      isNew: true,
      newParams: {
        strategyControlId: this.props.params.strategyControlId,
      }
    })
  };

  showUpdateSlide = (flag) => {
    this.setState({
      showSlideFrame: flag,
      isNew: false
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

  //更新基本信息
  handleUpdate = (params) => {
    params.id = this.state.strategyControlId;
    params.versionNumber = this.state.infoData.versionNumber;
    if(!params.controlMethod || !params.messageCode || !params.detailName) return;
    params.controlMethod === 'NO_MESSAGE' && (params.messageCode = null);
    this.setState({ baseInfoLoading: true }, () => {
      httpFetch.put(`${config.budgetUrl}/api/budget/control/strategy/details`, params).then((response)=>{
        if(response.status === 200) {
          message.success('保存成功');
          this.getBasicInfo();
          this.setState({ updateState: true, baseInfoLoading: false }, () => {
            this.setState({ updateState: false })
          })
        }
      }).catch((e)=>{
        this.setState({ updateState: false, baseInfoLoading: false });
        if(e.response){
          message.error(`保存失败, ${e.response.data.validationErrors[0] ? e.response.data.validationErrors[0].message : e.response.data.message}`);
        }
      })
    })
  };

  handleSearch = (value) => {
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

  handleRowClick = (record) => {
    record.strategyControlId = this.props.params.strategyControlId;
    this.setState({
      newParams: record
    }, () => {
      this.showUpdateSlide(true)
    })
  };

  handleBack = () => {
    this.context.router.push(this.state.budgetStrategyDetail.url.replace(':id', this.props.params.id).replace(':strategyId', this.props.params.strategyId));
  };

  //处理修改基本信息
  eventHandle = (e) => {
    console.log(e);
    let infoList = this.state.infoList;
    infoList.map((item) => {
      if (item.id === 'messageCode') {
        item.disabled = e === 'NO_MESSAGE' ? true : false
        item.isRequired = e === 'NO_MESSAGE' ? false : true
      }
    });
    this.setState({ infoList })
  };

  render() {
    const { infoList, infoData, columns, data, loading, pagination, showSlideFrame, updateState, baseInfoLoading, newParams, isNew } = this.state;
    return (
      <div className="strategy-control-detail">
        <BasicInfo infoList={infoList}
                   infoData={infoData}
                   updateHandle={this.handleUpdate}
                   updateState={updateState}
                   eventHandle={this.eventHandle}
                   loading={baseInfoLoading}/>
        <div className="table-header">
          <div className="table-header-title"><h5>触发条件</h5> {`共搜索到 ${pagination.total || 0} 条数据`}</div>
          <div className="table-header-buttons">
            <Button type="primary"  onClick={() => this.showSlide(true)}>新 建</Button>
            <Search
              placeholder="请输入控制对象/控制期段"
              style={{ width:200,position:'absolute',right:0,bottom:0 }}
              onChange={(e) => this.handleSearch(e.target.value)}
            />
          </div>
        </div>
        <Table columns={columns}
               dataSource={data}
               pagination={pagination}
               loading={loading}
               rowKey={record => record.id}
               onRowClick={this.handleRowClick}
               bordered
               size="middle"/>
        <SlideFrame title={(isNew ? '新建' : '编辑') + '触发条件'}
                    show={showSlideFrame}
                    content={NewStrategyControlDetail}
                    afterClose={this.handleCloseSlide}
                    onClose={() => this.showUpdateSlide(false)}
                    params={{newParams, isNew}}/>
        <a style={{fontSize:'14px',paddingBottom:'20px'}} onClick={this.handleBack}><Icon type="rollback" style={{marginRight:'5px'}}/>返回</a>
      </div>
    )
  }
}

StrategyControlDetail.contextTypes={
  router:React.PropTypes.object
};

function mapStateToProps() {
  return {}
}

const WrappedStrategyControlDetail = Form.create()(StrategyControlDetail);

export default connect(mapStateToProps)(WrappedStrategyControlDetail);
