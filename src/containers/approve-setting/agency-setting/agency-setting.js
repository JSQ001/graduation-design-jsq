import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

import { Button, Table, Badge, Input } from 'antd'
const Search = Input.Search;
import httpFetch from 'share/httpFetch'
import config from 'config'
import menuRoute from 'share/menuRoute'
import debounce from 'lodash.debounce'

class AgencySetting extends React.Component {
  constructor(props) {
    super(props);
    const { formatMessage } = this.props.intl;
    this.state = {
      loading: true,
      columns: [
        {title: formatMessage({id:"agencySetting.serial-number"}), dataIndex: 'serialNumber', width: '10%', render: (text, record, index) => (
          <span>{this.state.pageSize * this.state.page + index + 1}</span>
        )},  //序号
        {title: formatMessage({id:"agencySetting.employeeId"}), dataIndex: 'emplyeeId'},  //工号
        {title: formatMessage({id:"agencySetting.userName"}), dataIndex: 'userName'},  //姓名
        {title: formatMessage({id:"agencySetting.departmentName"}), dataIndex: 'departmentName'},  //部门
        {title: formatMessage({id:"agencySetting.dutyName"}), dataIndex: 'dutyName'},  //职务
        {title: formatMessage({id:"common.column.status"}), dataIndex: 'enabled', width: '10%', render: isEnabled => (
          <Badge status={isEnabled ? 'success' : 'error'}
                 text={isEnabled ? formatMessage({id: "common.status.enable"}) : formatMessage({id: "common.status.disable"})} />
        )},  //状态
      ],
      data: [],
      page: 0,
      pageSize: 10,
      pagination: {
        total: 0
      },
      keyWords: '', //搜索关键字
      newAgency:  menuRoute.getRouteItem('new-agency','key'),    //新建代理
      agencyDetail:  menuRoute.getRouteItem('agency-detail','key'),    //代理详情
    };
    this.handleSearch = debounce(this.handleSearch, 250);
  }

  componentWillMount() {
    this.getList();
  }

  getList = () => {
    let url = `${config.baseUrl}/api/bill/proxy/principals?&page=${this.state.page}&size=${this.state.pageSize}`;
    url += this.state.keyWords ? `&keyword=${this.state.keyWords}` : '';
    return httpFetch.get(url).then((response)=>{
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

  newAgency = () => {
    this.context.router.push(this.state.newAgency.url);
  };

  handleRowClick = (record) => {
    this.context.router.push(this.state.agencyDetail.url.replace(':principalOID', record.principalOID));
  };

  //搜索 姓名／工号
  handleSearch= (value) => {
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

  render(){
    const { formatMessage } = this.props.intl;
    const { loading, columns, data, pagination } = this.state;
    return (
      <div className="agency-setting">
        <h3 className="header-title">{formatMessage({id:'agencySetting.principal'})}</h3>{/*被代理人*/}
        <div className="table-header">
          <div className="table-header-title">{formatMessage({id:"common.total"}, {total: pagination.total})}</div> {/* 共total条数据 */}
          <div className="table-header-buttons">
            <Button type="primary" onClick={this.newAgency}>{formatMessage({id:"agencySetting.create-agency"})}</Button> {/* 新建代理关系 */}
            <Search
              placeholder={formatMessage({id: 'agencySetting.search.hint'})/* 请输入姓名/工号 */}
              style={{ width:200,position:'absolute',right:0,bottom:0 }}
              onChange={(e) => this.handleSearch(e.target.value)}
            />
          </div>
        </div>
        <Table rowKey="principalOID"
               columns={columns}
               dataSource={data}
               pagination={pagination}
               loading={loading}
               onRowClick={this.handleRowClick}
               bordered
               size="middle"/>
      </div>
    )
  }

}

AgencySetting.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps)(injectIntl(AgencySetting));
