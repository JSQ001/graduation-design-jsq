import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { Form, Input, Select, Button, InputNumber, message, Table, Badge } from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;

import httpFetch from 'share/httpFetch'
import menuRoute from 'share/menuRoute'
import config from 'config'

import SearchArea from 'components/search-area.js';

class AccountPeriodControl extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      searchForm: [
        {type: 'input', id: 'sobCode', label: "账套代码"},
        {type: 'input', id: 'sobName', label: "账套名称"}
      ],
      searchParams: {},
      columns: [
        {title: "账套代码", key: "setOfBooksCode", dataIndex: "setOfBooksCode"},
        {title: "账套名称", key: "setOfBooksName", dataIndex: 'setOfBooksName'},
        {title: "会计期代码", key: "periodSetCode", dataIndex: 'periodSetCode'},
        {title: "本位币", key: "functionalCurrencyCode", dataIndex: 'functionalCurrencyCode'},
        {title: "科目表", key: "accountSetCode", dataIndex: 'accountSetCode'},
        {title: "状态", key: "enabled", dataIndex: 'enabled',width: '10%',
          render: isEnabled => <Badge status={isEnabled ? 'success' : 'error'} text={isEnabled ? '启用' : '禁用'} />},
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
    url = "http://139.224.220.217:11013/api/setOfBooks/query/dto?roleType=TENANT&page=0&setOfBooksCode=&setOfBooksName=&size=10"; //测试用URL，会删
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
    if (!record.enabled) return;
    this.context.router.push(this.state.accountPeriodDetail.url.replace(':periodSetId', record.periodSetId).replace(':setOfBooksId', record.setOfBooksId));
  };

  render(){
    const { loading, searchForm, columns, data, pagination } = this.state;
    return (
      <div className="account-period-control">
        <h3 className="header-title">账套级会计期间控制</h3>
        <SearchArea
          searchForm={searchForm}
          submitHandle={this.search}
          clearHandle={this.clear}/>
        <div className="table-header">
          <div className="table-header-title">{`共搜索到 ${pagination.total || 0} 条数据`}</div>
        </div>
        <Table columns={columns}
               dataSource={data}
               pagination={pagination}
               loading={loading}
               rowKey={record => record.setOfBooksCode}
               onRowClick={this.handleRowClick}
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
