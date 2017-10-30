import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

import { Table, Button } from 'antd'
import SearchArea from 'components/search-area'
import SlideFrame from 'components/slide-frame'
import NewAccountPeriod from 'containers/finance-setting/account-period-define/new-account-period'
import NewAccountRule from 'containers/finance-setting/account-period-define/new-account-rule'

import httpFetch from 'share/httpFetch'
import menuRoute from 'share/menuRoute'
import config from 'config'

class AccountPeriodDefine extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      searchForm: [
        {type: 'input', id: 'periodSetCode', label: '会计期代码'},
        {type: 'input', id: 'periodSetName', label: '会计期名称'}
      ],
      data: [],
      page: 0,
      pageSize: 10,
      columns: [
        {title: '会计期代码', dataIndex: 'periodSetCode', width: '20%'},
        {title: '会计期名称', dataIndex: 'periodSetName', width: '20%'},
        {title: '期间总数', dataIndex: 'totalPeriodNum', width: '10%'},
        {title: '名称附加', dataIndex: 'periodAdditionalFlag', width: '30%'},
        {
          title: '操作', key: 'operation', width: '20%', render: (text, record) => (
          <span>
            <a href="#" onClick={(e) => this.editItem(e, record)}>查看</a>
            <span className="ant-divider"/>
            <a href="#" onClick={(e) => this.ruleItem(e, record)}>会计期规则</a>
          </span>)
        },
      ],
      pagination: {
        total: 0
      },
      searchParams: {
        periodSetCode: '',
        periodSetName: ''
      },
      slideFrameTitle: '',
      showSlideFrame: false,
      selectedPeriod: null,
      showRuleSlideFrame: false,
    }
  }

  //编辑
  editItem = (e, record) => {
    this.setState({
      showSlideFrame: true,
      slideFrameTitle: '会计期间详情',
      selectedPeriod: record
    })
  };

  //会计期规则
  ruleItem = (e, record) => {
    console.log(record);
    this.setState({
      showRuleSlideFrame: true,
      selectedPeriod: record
    })
  };

  //声成期间
  generateItem = (e, record) => {

  };

  componentWillMount(){
    this.getList();
  }

  //得到列表数据
  getList(){
    let params = this.state.searchParams;
    let url = `${config.baseUrl}/api/periodset?&page=${this.state.page}&size=${this.state.pageSize}`;
    for(let paramsName in params){
      url += params[paramsName] ? `&${paramsName}=${params[paramsName]}` : '';
    }
    return httpFetch.get(url).then((response)=>{
      response.data.map((item)=>{
        item.key = item.periodSetCode;
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
      searchParams: result
    }, ()=>{
      this.getList();
    })
  };

  clear = () => {

  };

  handleNew = () => {
    this.setState({
      showSlideFrame: true,
      slideFrameTitle: '新建会计期间',
      selectedPeriod: null
    })
  };

  render(){
    const { formatMessage } = this.props.intl;
    const { loading, columns, data, pagination, searchForm, slideFrameTitle, showSlideFrame, selectedPeriod, showRuleSlideFrame } = this.state;
    return (
      <div>
        <h3 className="header-title">会计期间定义</h3>
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
               bordered
               size="middle"/>
        <SlideFrame title={slideFrameTitle}
                    content={NewAccountPeriod}
                    show={showSlideFrame}
                    params={{period: selectedPeriod}}
                    onClose={() => {this.setState({ showSlideFrame: false })}}/>
        <SlideFrame title="会计期规则"
                    content={NewAccountRule}
                    show={showRuleSlideFrame}
                    params={{periodDetail: selectedPeriod}}
                    onClose={() => {this.setState({ showRuleSlideFrame: false })}}/>
      </div>
    )
  }

}

function mapStateToProps(state) {
  return {}
}

export default connect(mapStateToProps)(injectIntl(AccountPeriodDefine));
