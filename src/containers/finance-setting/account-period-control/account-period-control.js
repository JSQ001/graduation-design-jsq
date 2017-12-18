import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { Form, Table, Badge, Modal } from 'antd'

import httpFetch from 'share/httpFetch'
import menuRoute from 'share/menuRoute'
import config from 'config'

import SearchArea from 'components/search-area.js';

class AccountPeriodControl extends React.Component {
  constructor(props) {
    super(props);
    const { formatMessage } = this.props.intl;
    this.state = {
      loading: false,
      searchForm: [
        {type: 'input', id: 'sobCode', label: formatMessage({id: 'account.period.control.sobCode'})}, //账套代码
        {type: 'input', id: 'sobName', label: formatMessage({id: 'account.period.control.sobName'})} //账套名称
      ],
      searchParams: {},
      columns: [
        {title: formatMessage({id: 'account.period.control.sobCode'}), key: "setOfBooksCode", dataIndex: "setOfBooksCode"}, //账套代码
        {title: formatMessage({id: 'account.period.control.sobName'}), key: "setOfBooksName", dataIndex: 'setOfBooksName'}, //账套名称
        {title: formatMessage({id: 'account.period.control.periodSetCode'}), key: "periodSetCode", dataIndex: 'periodSetCode'}, //会计期代码
        {title: formatMessage({id: 'account.period.control.currencyCode'}), key: "functionalCurrencyCode", dataIndex: 'functionalCurrencyCode'}, //本位币
        {title: formatMessage({id: 'account.period.control.accountSetCode'}), key: "accountSetCode", dataIndex: 'accountSetCode'}, //科目表
        {title: formatMessage({id: 'common.column.status'}), key: "enabled", dataIndex: 'enabled',width: '10%',  //状态
          render: isEnabled => <Badge status={isEnabled ? 'success' : 'error'}
                                      text={isEnabled ? formatMessage({id: 'common.status.enable'}) : formatMessage({id: 'common.status.disable'})} />},
      ],
      data: [],
      pagination: {
        total: 0
      },
      page: 0,
      pageSize: 10,
      accountPeriodDetail:  menuRoute.getRouteItem('account-period-detail','key'),    //会计期间信息详情
    };
  }

  componentWillMount() {
    this.getList();
  }

  getList = () => {
    let params = this.state.searchParams;
    let url = `${config.baseUrl}/api/setOfBooks/query/dto?page=${this.state.page}&size=${this.state.pageSize}`;
    for(let paramsName in params){
      url += params[paramsName] ? `&${paramsName}=${params[paramsName]}` : '';
    }
    this.setState({ loading: true });
    httpFetch.get(url).then((res)=>{
      if(res.status == 200){
        this.setState({
          data: res.data,
          loading: false,
          pagination: {
            total: Number(res.headers['x-total-count']),
            onChange: this.onChangePager,
            pageSize: this.state.pageSize
          }
        })
      }
    }).catch((e)=>{
      console.log(e);
    })
  };

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
    let searchParams = {
      sobCode: result.sobCode,
      sobName: result.sobName
    };
    this.setState({
      searchParams: searchParams,
      loading: true,
      page: 0,
      pagination: {
        current: 1
      }
    }, ()=>{
      this.getList();
    })
  };

  clear = () => {
    this.setState({
      searchParams: {
        sobCode: '',
        sobName: ''
      }
    })
  };

  handleRowClick = (record) => {
    if (!record.enabled) {
      Modal.info({
        title: this.props.intl.formatMessage({id: 'account.period.control.disabled.info.title'}),  //该账套被禁用
        content: this.props.intl.formatMessage({id: 'account.period.control.disabled.info.content'}),  //禁用的账套无法打开或关闭会计期间
        maskClosable: true
      });
      return
    }
    this.context.router.push(this.state.accountPeriodDetail.url.replace(':periodSetId', record.periodSetId).replace(':setOfBooksId', record.setOfBooksId));
  };

  render(){
    const { formatMessage } = this.props.intl;
    const { loading, searchForm, columns, data, pagination } = this.state;
    return (
      <div className="account-period-control">
        <h3 className="header-title">{formatMessage({id: 'account.period.control.title'})/* 账套级会计期间控制 */}</h3>
        <SearchArea
          searchForm={searchForm}
          submitHandle={this.search}
          clearHandle={this.clear}/>
        <div className="table-header">
          <div className="table-header-title">{formatMessage({id: 'common.total'}, {total: pagination.total || 0})/* 共 total 条数据 */}</div>
        </div>
        <Table columns={columns}
               dataSource={data}
               pagination={pagination}
               loading={loading}
               rowKey={record => record.setOfBooksCode}
               onRow={record => ({
                 onClick: () => this.handleRowClick(record)
               })}
               bordered
               size="middle"/>
      </div>
    )
  }

}

AccountPeriodControl.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
  return {}
}

const WrappedAccountPeriodControl = Form.create()(AccountPeriodControl);

export default connect(mapStateToProps)(injectIntl(WrappedAccountPeriodControl));
